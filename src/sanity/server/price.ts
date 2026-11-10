import 'server-only';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

/**
 * The ONLY module allowed to read the private price field (see tests/hidden-price.test.ts).
 *   - `server-only` makes the build fail if a client component ever imports it.
 *   - It uses its own server-only token (SANITY_API_TOKEN, viewer role), never exposed to the browser.
 *   - It is called only from src/app/api/price-reveal/route.ts, after the lead input is validated.
 */

export type PriceKind = 'monument' | 'funeralProduct';

export const isPriceTokenConfigured = () =>
  Boolean(process.env.SANITY_API_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

const priceQuery = /* groq */ `*[_type == $kind && $slug in slug[].value.current][0]{
  "price": hiddenPrice,
  "name": coalesce(name[_key == "bg"][0].value, name[0].value)
}`;

export interface PriceLookup {
  /** Price in BGN as entered in Sanity. */
  priceBgn: number;
  productName: string | null;
}

export async function readPrivatePrice(kind: PriceKind, slug: string): Promise<PriceLookup | null> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false, // tokens are never sent to the CDN
    perspective: 'published',
  });
  const row = await client.fetch<{ price: number | null; name: string | null } | null>(
    priceQuery,
    { kind, slug },
    { cache: 'no-store' },
  );
  if (!row || typeof row.price !== 'number') return null;
  return { priceBgn: row.price, productName: row.name };
}
