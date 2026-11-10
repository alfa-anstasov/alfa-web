import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Alias type used by `internationalizedArrayPortableText` (see sanity.config.ts, `fieldTypes`).
 * Not a document type, so it is not counted among the content types.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [defineArrayMember({ type: 'block' }), defineArrayMember({ type: 'image', options: { hotspot: true } })],
});

/** Plugin-generated field types (sanity-plugin-internationalized-array). Language ids: bg | en | ru. */
export const L = {
  string: 'internationalizedArrayString',
  text: 'internationalizedArrayText',
  slug: 'internationalizedArraySlug',
  portableText: 'internationalizedArrayPortableText',
} as const;

export const priceRangeOptions = {
  list: [
    { title: 'Бюджетен / Budget', value: 'budget' },
    { title: 'Среден / Mid', value: 'mid' },
    { title: 'Премиум / Premium', value: 'premium' },
  ],
};

/**
 * hiddenPrice: ONE shared definition so every private price field is identical and greppable.
 * The value must never reach a public GROQ query or the client bundle. See README "hiddenPrice".
 */
export const hiddenPriceField = (description: string) =>
  defineField({
    name: 'hiddenPrice',
    title: 'Hidden price (private)',
    type: 'number',
    description,
    validation: (rule) => rule.min(0),
  });
