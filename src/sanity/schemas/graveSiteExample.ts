import { defineArrayMember, defineField, defineType } from 'sanity';
import { L } from './shared';

/** Portfolio of complete grave-site projects (monument + cemetery work). */
export const graveSiteExample = defineType({
  name: 'graveSiteExample',
  title: 'Grave-site example',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: L.string }),
    defineField({ name: 'slug', type: L.slug }),
    defineField({ name: 'description', type: L.portableText }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember({ type: 'image' })],
      description: 'Before / during / after if available',
    }),
    defineField({
      name: 'monumentsUsed',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'monument' }] })],
    }),
    defineField({ name: 'location', type: 'reference', to: [{ type: 'location' }], description: 'Optional: which office handled it' }),
    defineField({ name: 'styleTags', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'isFeatured', type: 'boolean' }),
  ],
  preview: { select: { title: 'title.0.value', media: 'photos.0' } },
});
