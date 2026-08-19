import { cookies } from "next/headers";

const COOKIE_NAME = "github_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function storeGitHubToken(token: string): void {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function getGitHubToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

export function clearGitHubToken(): void {
  cookies().delete(COOKIE_NAME);
}

export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
