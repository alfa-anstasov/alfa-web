/**
 * Fixed-window, in-memory rate limiter: 10 submissions per IP per hour (spec 11.2).
 *
 * LIMITATION: state lives in one Node process. That is right for a single self-hosted server;
 * on Vercel or with several instances use Upstash Redis / Edge Config instead (spec 11.2).
 */
export interface RateLimiter {
  check(key: string, now?: number): { allowed: boolean; remaining: number; retryAfterSec: number };
}

export function createRateLimiter(limit = 10, windowMs = 60 * 60 * 1000): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    check(key, now = Date.now()) {
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      }
      let entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        entry = { count: 0, resetAt: now + windowMs };
        hits.set(key, entry);
      }
      entry.count += 1;
      const allowed = entry.count <= limit;
      return {
        allowed,
        remaining: Math.max(0, limit - entry.count),
        retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
      };
    },
  };
}
