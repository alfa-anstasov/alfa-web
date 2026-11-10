import type { Metadata } from 'next';
import { locales, routing, type AppPathname, type Locale } from '@/i18n/routing';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const indexingAllowed = process.env.ALLOW_INDEXING === 'true';

/** Absolute URL of an internal page in a locale, e.g. ('/calculator','ru') -> https://…/ru/kalkulyator */
export function absoluteUrl(href: AppPathname, locale: Locale): string {
  const entry = routing.pathnames[href] as string | Record<Locale, string>;
  const localized = typeof entry === 'string' ? entry : entry[locale];
  return `${siteUrl}/${locale}${localized === '/' ? '' : localized}`;
}

/** Canonical + hreflang (bg|en|ru|x-default -> /bg) for a page. Spec 9.2. */
export function alternatesFor(href: AppPathname, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(href, l);
  languages['x-default'] = absoluteUrl(href, routing.defaultLocale);
  return { canonical: absoluteUrl(href, locale), languages };
}

export const robotsFor = (): Metadata['robots'] =>
  indexingAllowed ? { index: true, follow: true } : { index: false, follow: false };
