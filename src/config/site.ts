/**
 * Company facts. Every value below comes from the owner's prototype (prototypes/v2/index.html)
 * or from the spec. Anything unknown is `null`: never invent phones, addresses or prices.
 * Fill the `null`s in (here for now, in the Sanity `location` / `siteSettings` documents later).
 */
export const site = {
  name: 'Траурни услуги АЛФА',
  legalName: '„АЛФА ГРУП“ ООД',
  // Company registry number, as printed in the prototype footer.
  eik: '114130026',
  foundingYear: 1994,
  /** 24/7 main number, taken from the prototype header. */
  phone: { display: '0888 715 021', tel: '+359888715021' },
  email: 'office@funeralalfa.com',
  /** TODO(owner): Viber number. Until it is set no Viber button is rendered. */
  viber: null as string | null,
  /** TODO(owner): social profile URLs. Not rendered while null. */
  social: { facebook: null, instagram: null, youtube: null } as Record<string, string | null>,
} as const;

export type OfficeId = 'pleven' | 'levski' | 'sevlievo';

export interface Office {
  id: OfficeId;
  /** City name per locale. */
  city: { bg: string; en: string; ru: string };
  openedYear: number;
  /** TODO(owner): all `null` below are unknown today. */
  streetAddress: string | null;
  postalCode: string | null;
  /** Office-specific number. null = only the company 24/7 number is known. */
  phone: string | null;
  email: string | null;
  geo: { lat: number; lng: number } | null;
  googlePlaceId: string | null;
}

export const offices: readonly Office[] = [
  {
    id: 'pleven',
    city: { bg: 'Плевен', en: 'Pleven', ru: 'Плевен' },
    openedYear: 1994,
    // The prototype lists „Борис Шивачев“ № 5 but marks it "address to be confirmed", so it is not used.
    streetAddress: null,
    postalCode: null,
    phone: null,
    email: null,
    geo: null,
    googlePlaceId: null,
  },
  {
    id: 'levski',
    city: { bg: 'Левски', en: 'Levski', ru: 'Левски' },
    openedYear: 2005,
    streetAddress: null,
    postalCode: null,
    phone: null,
    email: null,
    geo: null,
    googlePlaceId: null,
  },
  {
    id: 'sevlievo',
    city: { bg: 'Севлиево', en: 'Sevlievo', ru: 'Севлиево' },
    openedYear: 2015,
    streetAddress: null,
    postalCode: null,
    phone: null,
    email: null,
    geo: null,
    googlePlaceId: null,
  },
];
