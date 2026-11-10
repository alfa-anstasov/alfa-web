import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next 16 renamed `middleware` to `proxy`; next-intl's handler works unchanged.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, the Studio, Next internals and files with an extension.
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
