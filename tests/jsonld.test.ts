import { describe, expect, it } from 'vitest';
import { offices, site } from '@/config/site';
import { homeJsonLd, officeJsonLd, organizationJsonLd, productJsonLd, serializeJsonLd } from '@/lib/jsonld';

describe('JSON-LD', () => {
  it('emits one FuneralHome per office, with the known facts only', () => {
    const data = homeJsonLd('bg');
    const homes = data.filter((d) => d['@type'] === 'FuneralHome');
    expect(homes).toHaveLength(offices.length);
    const pleven = homes.find((h) => String(h['@id']).endsWith('#office-pleven'))!;
    expect(pleven.name).toBe('Траурни услуги АЛФА – Плевен');
    expect(pleven.foundingDate).toBe('1994');
    expect(pleven.telephone).toBe(site.phone.tel);
    expect(pleven.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Плевен',
      addressCountry: 'BG',
    });
  });

  it('omits unknown fields instead of inventing placeholders', () => {
    const json = serializeJsonLd(homeJsonLd('en'));
    expect(json).not.toMatch(/streetAddress|postalCode|"geo"|hasMap|openingHours/);
    expect(json).not.toMatch(/TODO|null|undefined|\[Адрес|8__/);
  });

  it('fills fields in as soon as they are known', () => {
    const filled = officeJsonLd(
      { ...offices[0]!, streetAddress: 'ul. Test 1', postalCode: '5800', geo: { lat: 1.5, lng: 2.5 } },
      'en',
    );
    expect(filled.address).toMatchObject({ streetAddress: 'ul. Test 1', postalCode: '5800' });
    expect(filled.geo).toEqual({ '@type': 'GeoCoordinates', latitude: 1.5, longitude: 2.5 });
  });

  it('localizes the city and links branches to the organization', () => {
    const levski = officeJsonLd(offices[1]!, 'ru');
    expect(levski.name).toContain('Левски');
    expect(levski.parentOrganization).toEqual({ '@id': (organizationJsonLd('ru') as { '@id': string })['@id'] });
  });

  it('escapes "<" so data cannot close the script tag', () => {
    expect(serializeJsonLd({ name: '</script><script>alert(1)' })).not.toContain('<');
  });

  it('product offers use EUR and never carry a price', () => {
    const p = productJsonLd({ name: 'X', url: 'https://example.test/x', available: true }) as { offers: Record<string, unknown> };
    expect(p.offers.priceCurrency).toBe('EUR');
    expect(p.offers).not.toHaveProperty('price');
    expect(JSON.stringify(p)).not.toMatch(/BGN/);
  });
});
