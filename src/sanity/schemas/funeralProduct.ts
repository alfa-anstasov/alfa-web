import { defineArrayMember, defineField, defineType } from 'sanity';
import { L, hiddenPriceField, priceRangeOptions } from './shared';

/** Coffins, crosses, drapery. Same price-reveal security model as `monument`. */
export const funeralProduct = defineType({
  name: 'funeralProduct',
  title: 'Funeral product',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: L.string }),
    defineField({ name: 'slug', type: L.slug }),
    defineField({ name: 'category', type: 'string', options: { list: ['coffin', 'cross', 'drapery'] } }),
    defineField({ name: 'material', type: L.string }),
    defineField({
      name: 'dimensions',
      type: 'object',
      fields: [
        defineField({ name: 'length', type: 'number' }),
        defineField({ name: 'width', type: 'number' }),
        defineField({ name: 'height', type: 'number' }),
        defineField({ name: 'unit', type: 'string', initialValue: 'cm' }),
      ],
    }),
    defineField({ name: 'photos', type: 'array', of: [defineArrayMember({ type: 'image' })] }),
    defineField({ name: 'description', type: L.portableText }),
    // PRIVATE: server-side access only.
    hiddenPriceField('PRIVATE. Never expose in public queries. Price in EUR.'),
    // PUBLIC
    defineField({ name: 'priceRange', type: 'string', options: priceRangeOptions }),
    defineField({ name: 'isNew', type: 'boolean' }),
    defineField({ name: 'isFeatured', type: 'boolean' }),
    defineField({ name: 'isAvailable', type: 'boolean', initialValue: true }),
    defineField({ name: 'seoTitle', type: L.string }),
    defineField({ name: 'seoDescription', type: L.text }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'category', media: 'photos.0' } },
});
