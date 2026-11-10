import { beforeEach, describe, expect, it, vi } from 'vitest';

const readPrivatePrice = vi.fn();
let configured = true;
vi.mock('@/sanity/server/price', () => ({
  isPriceTokenConfigured: () => configured,
  readPrivatePrice: (...a: unknown[]) => readPrivatePrice(...a),
}));

const { POST, GET } = await import('@/app/api/price-reveal/route');

let n = 0;
const req = (body: unknown, ip = `10.0.0.${++n}`) =>
  new Request('http://localhost/api/price-reveal', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const good = { contact: '0888123456', productSlug: 'granite-black-1', lang: 'bg' };

beforeEach(() => {
  readPrivatePrice.mockReset();
  configured = true;
});

describe('POST /api/price-reveal', () => {
  it('does NOT read the price when the lead is invalid', async () => {
    for (const bad of [{ ...good, contact: 'nope' }, { ...good, website: 'bot' }, {}, 'not json']) {
      const res = await POST(req(bad));
      expect(res.status).toBe(400);
    }
    expect(readPrivatePrice).not.toHaveBeenCalled();
  });

  it('reads the price only after validation and returns the EUR price, uncached', async () => {
    readPrivatePrice.mockResolvedValue({ price: 120.5, productName: 'X' });
    const res = await POST(req(good));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual({ price: 120.5, currency: 'EUR' });
    expect(readPrivatePrice).toHaveBeenCalledWith('monument', 'granite-black-1');
  });

  it('returns 503 without a token and 404 for unknown products', async () => {
    configured = false;
    expect((await POST(req(good))).status).toBe(503);
    configured = true;
    readPrivatePrice.mockResolvedValue(null);
    expect((await POST(req(good))).status).toBe(404);
  });

  it('rate limits per IP (10 per hour)', async () => {
    readPrivatePrice.mockResolvedValue({ price: 1, productName: null });
    const ip = '192.0.2.99';
    for (let i = 0; i < 10; i++) expect((await POST(req(good, ip))).status).toBe(200);
    const blocked = await POST(req(good, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('retry-after')).toBeTruthy();
  });

  it('rejects GET', async () => {
    expect(GET().status).toBe(405);
  });
});
