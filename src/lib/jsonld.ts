import { offices, site, type Office } from '@/config/site';
import type { Locale } from '@/i18n/routing';
import { absoluteUrl, siteUrl } from '@/lib/seo';

type Json = Record<string, unknown>;

/** Drops null / undefined / empty values so unknown data is omitted, never emitted as a fake value. */
function compact<T extends Json>(obj: T): Json {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  );
}

const orgId = `${siteUrl}/#organization`;

export function organizationJsonLd(locale: Locale): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl('/', locale),
    foundingDate: String(site.foundingYear),
    telephone: site.phone.tel,
    email: site.email,
    taxID: site.eik,
    sameAs: Object.values(site.social).filter(Boolean),
  });
}

/**
 * One FuneralHome (schema.org LocalBusiness subtype) per office.
 * Unknown values (street address, hours, geo, office phone, Place ID) are OMITTED until the owner
 * fills them in src/config/site.ts. Telephone falls back to the company-wide 24/7 number.
 */
export function officeJsonLd(office: Office, locale: Locale): Json {
  const city = office.city[locale];
  return compact({
    '@context': 'https://schema.org',
    '@type': 'FuneralHome',
    '@id': `${siteUrl}/#office-${office.id}`,
    name: `${site.name} – ${city}`,
    url: absoluteUrl('/offices', locale),
    parentOrganization: { '@id': orgId },
    foundingDate: String(office.openedYear),
    telephone: office.phone ?? site.phone.tel,
    email: office.email ?? site.email,
    address: compact({
      '@type': 'PostalAddress',
      streetAddress: office.streetAddress,
      postalCode: office.postalCode,
      addressLocality: city,
      addressCountry: 'BG',
    }),
    geo: office.geo
      ? { '@type': 'GeoCoordinates', latitude: office.geo.lat, longitude: office.geo.lng }
      : null,
    hasMap: office.googlePlaceId
      ? `https://www.google.com/maps/place/?q=place_id:${office.googlePlaceId}`
      : null,
  });
}

export function homeJsonLd(locale: Locale): Json[] {
  return [organizationJsonLd(locale), ...offices.map((o) => officeJsonLd(o, locale))];
}

/** JSON for a <script type="application/ld+json">; `<` is escaped so content can never close the tag. */
export function serializeJsonLd(data: Json | Json[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}
