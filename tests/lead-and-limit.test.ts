import { describe, expect, it } from 'vitest';
import { parseContact, priceRevealSchema } from '@/lib/lead-validation';
import { createRateLimiter } from '@/lib/rate-limit';
import { bgnToEur } from '@/lib/currency';

describe('parseContact', () => {
  it('accepts emails and phones', () => {
    expect(parseContact(' Ana@Example.com ')).toEqual({ kind: 'email', value: 'ana@example.com' });
    expect(parseContact('0888 123 456')).toEqual({ kind: 'phone', value: '0888123456' });
    expect(parseContact('+359 888 123 456')).toEqual({ kind: 'phone', value: '+359888123456' });
  });
  it('rejects junk', () => {
    for (const bad of ['', 'abc', '12', 'a@b', '<script>', '0888-abc-123', '1'.repeat(30)]) {
      expect(parseContact(bad), bad).toBeNull();
    }
  });
});

describe('priceRevealSchema', () => {
  const ok = { contact: '0888123456', productSlug: 'granite-black-1', lang: 'bg' };
  it('accepts the spec body and defaults kind', () => {
    expect(priceRevealSchema.parse(ok).kind).toBe('monument');
  });
  it('rejects a filled honeypot, bad slugs and bad languages', () => {
    expect(priceRevealSchema.safeParse({ ...ok, website: 'x' }).success).toBe(false);
    expect(priceRevealSchema.safeParse({ ...ok, productSlug: '../etc' }).success).toBe(false);
    expect(priceRevealSchema.safeParse({ ...ok, lang: 'de' }).success).toBe(false);
  });
});

describe('rate limiter', () => {
  it('allows 10 per window then blocks, then resets', () => {
    const l = createRateLimiter(10, 1000);
    for (let i = 0; i < 10; i++) expect(l.check('ip', 0).allowed).toBe(true);
    expect(l.check('ip', 10).allowed).toBe(false);
    expect(l.check('other', 10).allowed).toBe(true);
    expect(l.check('ip', 1001).allowed).toBe(true);
  });
});

describe('currency', () => {
  it('converts at the fixed rate', () => {
    expect(bgnToEur(195.583)).toBe(100);
  });
});
