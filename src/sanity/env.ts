/**
 * Public Sanity settings only. Tokens are read in server-only modules (src/sanity/server/*).
 * The placeholders let `next build` run in CI without any secrets.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2025-01-01';
export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
