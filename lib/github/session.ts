import type { NextResponse } from "next/server";
import { GITHUB_OAUTH_STATE_COOKIE, GITHUB_SESSION_COOKIE, getCookieOptions } from "./config";
import type { GitHubSession } from "./types";

export async function getCurrentGitHubSession(): Promise<GitHubSession | null> {
  return null;
}

export function setGitHubSessionCookie(response: NextResponse, _sessionId: string): void {
  response.cookies.set(GITHUB_SESSION_COOKIE, "", getCookieOptions(0));
}

export function clearGitHubSessionCookie(response: NextResponse): void {
  response.cookies.set(GITHUB_SESSION_COOKIE, "", getCookieOptions(0));
}

export async function getOAuthState(): Promise<string> {
  return "";
}

export function setOAuthState(response: NextResponse, _state: string): void {
  response.cookies.set(GITHUB_OAUTH_STATE_COOKIE, "", getCookieOptions(0));
}

export function clearOAuthState(response: NextResponse): void {
  response.cookies.set(GITHUB_OAUTH_STATE_COOKIE, "", getCookieOptions(0));
}
