import type { MetadataRoute } from 'next';
import { indexingAllowed, siteUrl } from '@/lib/seo';

/** Closed to crawlers until ALLOW_INDEXING=true (set at launch). Spec 9.4 rules apply once open. */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio/', '/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
