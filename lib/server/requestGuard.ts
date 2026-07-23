type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const GLOBAL_KEY = "__maya_rate_limit_store__";

function getStore(): Map<string, RateLimitState> {
  const g = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: Map<string, RateLimitState>;
  };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new Map<string, RateLimitState>();
  }
  return g[GLOBAL_KEY];
}

function pruneExpired(store: Map<string, RateLimitState>, now: number) {
  if (store.size < 5000) return;
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    headers.get("x-real-ip") ??
    headers.get("x-vercel-forwarded-for") ??
    "unknown"
  );
}

export function checkRateLimit(
  key: string,
  { windowMs, max }: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const store = getStore();
  pruneExpired(store, now);

  const current = store.get(key);
  const base =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;
  const next = { count: base.count + 1, resetAt: base.resetAt };
  store.set(key, next);

  const remaining = Math.max(0, max - next.count);
  const allowed = next.count <= max;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((next.resetAt - now) / 1000)
  );

  return { allowed, remaining, resetAt: next.resetAt, retryAfterSeconds };
}

export function isLikelyAutomatedRequest(headers: Headers): boolean {
  const ua = (headers.get("user-agent") ?? "").toLowerCase();
  if (!ua) return true;
  return /(bot|spider|crawler|curl|wget|python|httpclient|insomnia|postman|axios)/i.test(
    ua
  );
}
