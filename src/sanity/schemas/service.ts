import { defineArrayMember, defineField, defineType } from 'sanity';
import { L } from './shared';

/** Burial, cremation, transport/repatriation, flowers & catering. */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: L.string }),
    defineField({ name: 'slug', type: L.slug }),
    defineField({ name: 'shortDescription', type: L.text, description: 'For service cards' }),
    defineField({ name: 'fullDescription', type: L.portableText, description: 'Full page content' }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', type: 'array', of: [defineArrayMember({ type: 'image' })] }),
    defineField({
      name: 'features',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'feature', type: L.string })] })],
    }),
    defineField({
      name: 'relatedServices',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'seoTitle', type: L.string }),
    defineField({ name: 'seoDescription', type: L.text }),
  ],
  preview: { select: { title: 'name.0.value' } },
});
