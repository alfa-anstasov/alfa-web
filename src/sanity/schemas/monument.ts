import { defineArrayMember, defineField, defineType } from 'sanity';
import { L, hiddenPriceField, priceRangeOptions } from './shared';

/**
 * SECURITY: `hiddenPrice` must NEVER be projected by a public GROQ query or reach the client.
 * Only src/sanity/server/price.ts (behind /api/price-reveal) may read it.
 */
export const monument = defineType({
  name: 'monument',
  title: 'Monument',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: L.string }),
    defineField({ name: 'slug', type: L.slug }),
    defineField({ name: 'category', type: 'string', options: { list: ['triplex', 'granite', 'marble'] } }),
    defineField({
      name: 'subcategory',
      type: 'string',
      description: 'Granite: black/gray/red/other. Marble: mura/sivets/other. Triplex: leave empty.',
      options: { list: ['black', 'gray', 'red', 'mura', 'sivets', 'other'] },
    }),
    defineField({ name: 'material', type: L.string, description: 'Descriptive material text' }),
    defineField({
      name: 'dimensions',
      type: 'object',
      fields: [
        defineField({ name: 'width', type: 'number' }),
        defineField({ name: 'height', type: 'number' }),
        defineField({ name: 'depth', type: 'number' }),
        defineField({ name: 'unit', type: 'string', initialValue: 'cm' }),
      ],
    }),
    defineField({ name: 'dimensionsNote', type: L.string, description: 'e.g. custom sizes available' }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember({ type: 'image' })],
      description: 'Minimum 3 photos required',
      validation: (r) => r.min(3),
    }),
    defineField({
      name: 'styleTags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: ['classic', 'modern', 'religious', 'family', 'minimalist'] },
    }),
    defineField({ name: 'description', type: L.portableText }),
    // PRIVATE: server-side access only, after lead capture.
    hiddenPriceField('PRIVATE. Never expose in public queries. Price in EUR.'),
    // PUBLIC: for filtering only.
    defineField({ name: 'priceRange', type: 'string', options: priceRangeOptions }),
    defineField({ name: 'isNew', type: 'boolean', description: 'Shows the НОВО badge' }),
    defineField({ name: 'isFeatured', type: 'boolean', description: 'Shown on the homepage and category landing' }),
    defineField({ name: 'isAvailable', type: 'boolean', initialValue: true }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'seoTitle', type: L.string }),
    defineField({ name: 'seoDescription', type: L.text }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'category', media: 'photos.0' } },
});
