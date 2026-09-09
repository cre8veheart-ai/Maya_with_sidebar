import { NextRequest, NextResponse } from "next/server";
import { createPullRequest, githubRequest, resolveRepoConfig } from "@/lib/github/api";
import {
  canUserAuthorizeMainPush,
  getGitHubPermissions,
  getMainPushAuthMaxAgeSeconds,
  sanitizeBranch,
  sanitizeText,
} from "@/lib/github/config";
import { getCurrentGitHubSession } from "@/lib/github/session";
import { logGitHubAudit } from "@/lib/github/store";

type CommitStatusResponse = {
  state?: string;
};

type CheckRunsResponse = {
  check_runs?: Array<{
    status?: string;
    conclusion?: string | null;
    name?: string;
  }>;
};

const CONFIRMATION_PHRASE = "AUTHORIZE MAIN PUSH";
const SAFE_CHECK_CONCLUSIONS = new Set(["success", "neutral", "skipped"]);

export async function POST(req: NextRequest) {
  const session = await getCurrentGitHubSession();
  if (!session) {
    return NextResponse.json({ error: "GitHub is not connected" }, { status: 401 });
  }

  const permissions = getGitHubPermissions(session.scope);
  if (!permissions.write) {
    await logGitHubAudit(session.id, {
      kind: "write",
      action: "mainPush.denied.scope",
      target: session.repoConfig ? `${session.repoConfig.owner}/${session.repoConfig.repo}` : "unconfigured",
      status: "denied",
      detail: "Connected GitHub session does not include repository write scope",
    });
    return NextResponse.json(
      { error: "Reconnect GitHub and authorize repository write access" },
      { status: 403 },
    );
  }

  const login = session.user?.login?.trim() ?? "";
  if (!login || !canUserAuthorizeMainPush(login)) {
    await logGitHubAudit(session.id, {
      kind: "write",
      action: "mainPush.denied.user",
      target: login || "unknown",
      status: "denied",
      detail: "User is not allowed to authorize main pushes",
    });
    return NextResponse.json(
      { error: "This account is not allowed to authorize pushes to main" },
      { status: 403 },
    );
  }

  const ageMs = Date.now() - new Date(session.updatedAt).getTime();
  const maxAgeSeconds = getMainPushAuthMaxAgeSeconds();
  if (!Number.isFinite(ageMs) || ageMs > maxAgeSeconds * 1000) {
    await logGitHubAudit(session.id, {
      kind: "auth",
      action: "mainPush.denied.staleAuth",
      target: login,
      status: "denied",
      detail: `OAuth session is older than ${maxAgeSeconds}s and must be refreshed`,
    });
    return NextResponse.json(
      { error: "Re-authorize GitHub, then retry the main push", staleAuth: true },
      { status: 403 },
    );
  }

  const body = (await req.json()) as Record<string, unknown>;
  const confirmation = sanitizeText(body.confirmation, 80);
  if (confirmation !== CONFIRMATION_PHRASE) {
    return NextResponse.json(
      { error: `Type '${CONFIRMATION_PHRASE}' to confirm` },
      { status: 400 },
    );
  }

  try {
    const sourceBranch = sanitizeBranch(body.sourceBranch);
    const baseBranch = sanitizeBranch(body.baseBranch) || "main";
    if (!sourceBranch) {
      throw new Error("Source branch is required");
    }
    if (sourceBranch === baseBranch) {
      throw new Error("Source branch must be different from base branch");
    }

    const repoConfig = resolveRepoConfig(session, {
      owner: typeof body.owner === "string" ? body.owner : undefined,
      repo: typeof body.repo === "string" ? body.repo : undefined,
      branch: baseBranch,
    });

    const [sourceRef, commitStatus, checkRuns] = await Promise.all([
      githubRequest<{ object?: { sha?: string } }>(
        session.accessToken,
        `/repos/${encodeURIComponent(repoConfig.owner)}/${encodeURIComponent(repoConfig.repo)}/git/ref/heads/${encodeURIComponent(sourceBranch)}`,
      ),
      githubRequest<CommitStatusResponse>(
        session.accessToken,
        `/repos/${encodeURIComponent(repoConfig.owner)}/${encodeURIComponent(repoConfig.repo)}/commits/${encodeURIComponent(sourceBranch)}/status`,
      ),
      githubRequest<CheckRunsResponse>(
        session.accessToken,
        `/repos/${encodeURIComponent(repoConfig.owner)}/${encodeURIComponent(repoConfig.repo)}/commits/${encodeURIComponent(sourceBranch)}/check-runs?per_page=100`,
      ),
    ]);

    const sourceSha = sourceRef.object?.sha ?? "";
    if (!sourceSha) {
      throw new Error("Unable to resolve source branch head");
    }

    const hasFailingChecks = (checkRuns.check_runs ?? []).some(
      (run) =>
        run.status !== "completed" ||
        !SAFE_CHECK_CONCLUSIONS.has((run.conclusion ?? "").toLowerCase()),
    );
    const statusState = (commitStatus.state ?? "").toLowerCase();
    const statusFailed = !["success", "neutral"].includes(statusState);

    if (hasFailingChecks || statusFailed) {
      let pullRequestUrl: string | undefined;
      try {
        const pull = await createPullRequest(session, repoConfig, {
          title: `Promote ${sourceBranch} into ${baseBranch}`,
          body: [
            "Auto-opened because authorized direct main push was blocked by required checks.",
            "",
            `Source: \`${sourceBranch}\``,
            `Base: \`${baseBranch}\``,
          ].join("\n"),
          head: sourceBranch,
          base: baseBranch,
        });
        pullRequestUrl =
          typeof (pull as { html_url?: unknown }).html_url === "string"
            ? ((pull as { html_url: string }).html_url)
            : undefined;
      } catch {
        pullRequestUrl = undefined;
      }

      await logGitHubAudit(session.id, {
        kind: "write",
        action: "mainPush.fallback.pull",
        target: `${repoConfig.owner}/${repoConfig.repo}`,
        status: "denied",
        detail: `Checks did not pass for ${sourceBranch} @ ${sourceSha}`,
      });

      return NextResponse.json(
        {
          error: "Required checks are not green. Opened or re-use a PR instead.",
          fallback: "pull_request",
          pullRequestUrl,
          sourceBranch,
          baseBranch,
          sourceSha,
        },
        { status: 409 },
      );
    }

    const merge = await githubRequest<{
      sha?: string;
      message?: string;
      merged?: boolean;
    }>(
      session.accessToken,
      `/repos/${encodeURIComponent(repoConfig.owner)}/${encodeURIComponent(repoConfig.repo)}/merges`,
      {
        method: "POST",
        body: JSON.stringify({
          base: baseBranch,
          head: sourceBranch,
          commit_message: sanitizeText(
            body.commitMessage,
            200,
          ) || `Authorized main push: merge ${sourceBranch} into ${baseBranch}`,
        }),
      },
    );

    await logGitHubAudit(session.id, {
      kind: "write",
      action: "mainPush.merge.success",
      target: `${repoConfig.owner}/${repoConfig.repo}`,
      status: "success",
      detail: `${login} merged ${sourceBranch} (${sourceSha}) into ${baseBranch}`,
    });

    return NextResponse.json({ ok: true, merge, sourceBranch, baseBranch, sourceSha });
  } catch (error) {
    await logGitHubAudit(session.id, {
      kind: "write",
      action: "mainPush.merge.failed",
      target: session.repoConfig ? `${session.repoConfig.owner}/${session.repoConfig.repo}` : "unconfigured",
      status: "error",
      detail: error instanceof Error ? error.message : "Authorized main push failed",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authorized main push failed" },
      { status: 400 },
    );
  }
}
