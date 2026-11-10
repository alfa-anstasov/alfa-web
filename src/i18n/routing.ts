import { defineRouting } from 'next-intl/routing';

export const locales = ['bg', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'bg';

/**
 * Internal pathnames (keys) map to Latin-transliterated public slugs per language,
 * exactly as in spec section 4.3. Add a page = add a folder under src/app/[locale]/
 * named after the key, and an entry here.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  // Spec 4.1: every page carries an explicit language prefix; `/` redirects to `/bg`.
  localePrefix: 'always',
  // Spec 9.5: the bare domain always goes to /bg (no Accept-Language guessing).
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/funeral-services': {
      bg: '/pogrebalni-uslugi',
      en: '/funeral-services',
      ru: '/pokhoronnye-uslugi',
    },
    '/monuments': { bg: '/pametnici', en: '/monuments', ru: '/pamyatniki' },
    '/funeral-products': {
      bg: '/pogrebalni-artikuli',
      en: '/funeral-products',
      ru: '/pokhoronnye-tovary',
    },
    '/cemetery-plots': {
      bg: '/grobni-mesta',
      en: '/cemetery-plots',
      ru: '/kladbishchnye-mesta',
    },
    '/maintenance-subscription': {
      bg: '/abonament-poddryzhka',
      en: '/maintenance-subscription',
      ru: '/abonement-obsluzhivanie',
    },
    '/plan-ahead': { bg: '/planirai-napred', en: '/plan-ahead', ru: '/planirovanie-zaranee' },
    '/offices': { bg: '/ofisi', en: '/offices', ru: '/ofisy' },
    '/about-us': { bg: '/za-nas', en: '/about-us', ru: '/o-nas' },
    '/faq': { bg: '/chzv', en: '/faq', ru: '/chasto-voprosy' },
    '/reviews': { bg: '/otzyvi', en: '/reviews', ru: '/otzyvy' },
    '/contact': { bg: '/kontakti', en: '/contact', ru: '/kontakty' },
    '/calculator': { bg: '/kalkulator', en: '/calculator', ru: '/kalkulyator' },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
