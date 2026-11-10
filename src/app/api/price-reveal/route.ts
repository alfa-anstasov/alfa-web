import { NextResponse } from 'next/server';
import { bgnToEur } from '@/lib/currency';
import { parseContact, priceRevealSchema } from '@/lib/lead-validation';
import { createRateLimiter } from '@/lib/rate-limit';
import { isPriceTokenConfigured, readPrivatePrice } from '@/sanity/server/price';

// Always dynamic and never cached: the response contains the private price.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const limiter = createRateLimiter(10, 60 * 60 * 1000);

const NO_STORE = { 'Cache-Control': 'no-store' };
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });

/**
 * POST /api/price-reveal   body: { contact, productSlug, kind?, lang, website? }
 *
 * Order matters: (1) rate limit, (2) validate the lead server-side, (3) only then read the private
 * price with the server-only token. Nothing about the visitor is logged.
 *
 * STUB: Phase 3 adds, between steps 2 and 3, the `formSubmission` document (formType "price-reveal")
 * and the Resend notification (spec 6.1).
 */
export async function POST(request: Request) {
  // Behind a reverse proxy, make sure it overwrites x-forwarded-for; otherwise clients can spoof it.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const limit = limiter.check(ip);
  if (!limit.allowed) {
    return json({ error: 'rate_limited' }, 429, { 'Retry-After': String(limit.retryAfterSec) });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  const parsed = priceRevealSchema.safeParse(raw);
  const contact = parsed.success ? parseContact(parsed.data.contact) : null;
  if (!parsed.success || !contact) {
    // Generic on purpose: do not tell bots which check failed (honeypot included).
    return json({ error: 'invalid_request' }, 400);
  }

  if (!isPriceTokenConfigured()) {
    return json({ error: 'not_configured' }, 503);
  }

  // TODO(phase-3): store the lead (Sanity formSubmission) + notify the team (Resend) BEFORE revealing.

  let lookup;
  try {
    lookup = await readPrivatePrice(parsed.data.kind, parsed.data.productSlug);
  } catch {
    return json({ error: 'upstream_error' }, 502);
  }
  if (!lookup) return json({ error: 'not_found' }, 404);

  // BGN is what Sanity stores; the euro value is returned too (euro adoption, 1 Jan 2026).
  return json({ priceBgn: lookup.priceBgn, priceEur: bgnToEur(lookup.priceBgn) });
}

// Everything else is not allowed.
export function GET() {
  return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
}
