import { defineArrayMember, defineField, defineType } from 'sanity';
import { L } from './shared';

/** One physical office. Adding an office = adding one document. */
export const location = defineType({
  name: 'location',
  title: 'Office',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: L.string, title: 'Office name' }),
    defineField({ name: 'slug', type: L.slug, title: 'URL slug (per language)' }),
    defineField({
      name: 'locationType',
      type: 'string',
      options: { list: ['owned', 'franchise', 'acquired'] },
      initialValue: 'owned',
    }),
    defineField({ name: 'isActive', type: 'boolean', description: 'false = shown as "Coming soon"', initialValue: true }),
    defineField({ name: 'openedYear', type: 'number' }),
    defineField({ name: 'address', type: L.string }),
    defineField({
      name: 'coordinates',
      type: 'object',
      fields: [defineField({ name: 'lat', type: 'number' }), defineField({ name: 'lng', type: 'number' })],
    }),
    defineField({ name: 'googleMapsEmbedUrl', type: 'url' }),
    defineField({ name: 'googlePlaceId', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({
      name: 'hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'day', type: 'string' }),
            defineField({ name: 'open', type: 'string' }),
            defineField({ name: 'close', type: 'string' }),
            defineField({ name: 'isClosed', type: 'boolean' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'photos', type: 'array', of: [defineArrayMember({ type: 'image' })] }),
    defineField({
      name: 'staff',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })],
    }),
    defineField({ name: 'description', type: L.portableText }),
    defineField({ name: 'seoTitle', type: L.string }),
    defineField({ name: 'seoDescription', type: L.text }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'address.0.value' } },
});
