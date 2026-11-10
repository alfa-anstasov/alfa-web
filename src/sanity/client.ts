import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from './env';

/**
 * Client for PUBLIC content queries (src/sanity/queries.ts only).
 *
 * Imported by server components, so the optional read token stays on the server. If the dataset is
 * private (recommended, see README "Private prices") set SANITY_API_READ_TOKEN. That token must be a
 * viewer-role token; it is never the same token as the one used by the price-reveal route.
 */
export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !process.env.SANITY_API_READ_TOKEN, // the CDN only serves public datasets
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
});
