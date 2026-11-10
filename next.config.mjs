import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployable both on Vercel and as a self-hosted Node server (Hetzner):
  // `next build` emits .next/standalone/server.js, started with `npm run start:standalone`.
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  // The Sanity Studio is bundled in the app (/studio) and needs its own transpilation.
  transpilePackages: ['sanity'],
  async redirects() {
    return [
      // Spec 9.5: the bare domain redirects to the default language.
      { source: '/', destination: '/bg', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
