import { NextRequest, NextResponse } from "next/server";
import {
  createBranch,
  createPullRequest,
  dispatchWorkflow,
  resolveRepoConfig,
  upsertFile,
} from "@/lib/github/api";
import { sanitizeText } from "@/lib/github/config";
import { getCurrentGitHubSession } from "@/lib/github/session";
import { logGitHubAudit } from "@/lib/github/store";

function approvalError() {
  return new Error(
    "Write actions require approved=true, confirmationText=APPROVE, and an approval note"
  );
}

export async function POST(req: NextRequest) {
  const session = await getCurrentGitHubSession();
  if (!session) {
    return NextResponse.json({ error: "GitHub is not connected" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action : "";
    const approved = body.approved === true;
    const confirmationText =
      typeof body.confirmationText === "string" ? body.confirmationText.trim() : "";
    const approvalNote =
      typeof body.approvalNote === "string" ? body.approvalNote.trim() : "";

    if (!approved || confirmationText !== "APPROVE" || approvalNote.length < 8) {
      throw approvalError();
    }

    const repoConfig = resolveRepoConfig(session, {
      owner: typeof body.owner === "string" ? body.owner : undefined,
      repo: typeof body.repo === "string" ? body.repo : undefined,
      branch: typeof body.branch === "string" ? body.branch : undefined,
    });

    let result: unknown;
    let kind: "write" | "workflow" = "write";

    if (action === "createBranch") {
      result = await createBranch(
        session,
        repoConfig,
        typeof body.sourceBranch === "string" ? body.sourceBranch : repoConfig.branch,
        typeof body.newBranch === "string" ? body.newBranch : ""
      );
    } else if (action === "upsertFile") {
      result = await upsertFile(session, repoConfig, {
        branch: typeof body.branch === "string" ? body.branch : repoConfig.branch,
        path: typeof body.path === "string" ? body.path : "",
        content: typeof body.content === "string" ? body.content : "",
        message: typeof body.message === "string" ? body.message : "",
        sha: typeof body.sha === "string" ? body.sha : undefined,
      });
    } else if (action === "createPullRequest") {
      result = await createPullRequest(session, repoConfig, {
        title: typeof body.title === "string" ? body.title : "",
        body: typeof body.body === "string" ? body.body : "",
        head: typeof body.head === "string" ? body.head : "",
        base: typeof body.base === "string" ? body.base : repoConfig.branch,
      });
    } else if (action === "dispatchWorkflow") {
      kind = "workflow";
      let inputs: Record<string, string> = {};
      if (body.inputs && typeof body.inputs === "object" && !Array.isArray(body.inputs)) {
        inputs = Object.fromEntries(
          Object.entries(body.inputs as Record<string, unknown>).map(([key, value]) => [
            sanitizeText(key, 100),
            sanitizeText(String(value ?? ""), 500),
          ])
        );
      }
      result = await dispatchWorkflow(session, repoConfig, {
        workflowId: typeof body.workflowId === "string" ? body.workflowId : "",
        ref: typeof body.ref === "string" ? body.ref : repoConfig.branch,
        inputs,
      });
    } else {
      throw new Error("Unsupported write action");
    }

    await logGitHubAudit(session.id, {
      kind,
      action,
      target: `${repoConfig.owner}/${repoConfig.repo}`,
      status: "success",
      detail: approvalNote,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    await logGitHubAudit(session.id, {
      kind: "write",
      action: "write.failed",
      target: session.repoConfig ? `${session.repoConfig.owner}/${session.repoConfig.repo}` : "unconfigured",
      status: error instanceof Error && error.message.includes("approved=") ? "denied" : "error",
      detail: error instanceof Error ? error.message : "Write action failed",
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Write action failed" },
      { status: 400 }
    );
  }
}
