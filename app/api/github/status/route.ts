import { NextResponse } from "next/server";
import { fetchGitHubViewer } from "@/lib/github/api";
import {
  canUserAuthorizeMainPush,
  getAllowedRepos,
  getDefaultRepoConfig,
  getGitHubPermissions,
  getMainPushAuthMaxAgeSeconds,
  getMainPushAllowedUsers,
  getRequestedScopes,
} from "@/lib/github/config";
import { clearGitHubSessionCookie, getCurrentGitHubSession } from "@/lib/github/session";
import { deleteGitHubSession, listGitHubAudit, saveGitHubSession } from "@/lib/github/store";

export async function GET() {
  const session = await getCurrentGitHubSession();

  if (!session) {
    return NextResponse.json({
      configured: Boolean(
        process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim()
      ),
      connected: false,
      requestedScopes: getRequestedScopes(),
      allowedRepos: getAllowedRepos(),
      repoConfig: getDefaultRepoConfig(),
      permissions: getGitHubPermissions([]),
      mainPush: {
        enabled: false,
        canAuthorize: false,
        authMaxAgeSeconds: getMainPushAuthMaxAgeSeconds(),
        allowedUsers: getMainPushAllowedUsers(),
      },
      audit: [],
    });
  }

  try {
    const user = await fetchGitHubViewer(session.accessToken);
    if (user.login !== session.user?.login) {
      await saveGitHubSession({ ...session, user });
    }

    return NextResponse.json({
      configured: true,
      connected: true,
      requestedScopes: getRequestedScopes(),
      allowedRepos: getAllowedRepos(),
      repoConfig: session.repoConfig,
      permissions: getGitHubPermissions(session.scope),
      mainPush: {
        enabled: true,
        canAuthorize: canUserAuthorizeMainPush(user.login),
        authMaxAgeSeconds: getMainPushAuthMaxAgeSeconds(),
        allowedUsers: getMainPushAllowedUsers(),
      },
      user,
      audit: await listGitHubAudit(session.id),
      scopes: session.scope,
    });
  } catch (error) {
    await deleteGitHubSession(session.id);
    const response = NextResponse.json({
      configured: true,
      connected: false,
      requestedScopes: getRequestedScopes(),
      allowedRepos: getAllowedRepos(),
      repoConfig: getDefaultRepoConfig(),
      permissions: getGitHubPermissions([]),
      mainPush: {
        enabled: false,
        canAuthorize: false,
        authMaxAgeSeconds: getMainPushAuthMaxAgeSeconds(),
        allowedUsers: getMainPushAllowedUsers(),
      },
      audit: [],
      connectionError:
        error instanceof Error ? error.message : "GitHub connection expired",
    });
    clearGitHubSessionCookie(response);
    return response;
  }
}
