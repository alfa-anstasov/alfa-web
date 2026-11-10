import { defineArrayMember, defineField, defineType } from 'sanity';
import { L } from './shared';

/** Built in V1 but kept private (noindex, no nav/sitemap) until 12+ posts exist. */
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: L.string }),
    defineField({ name: 'slug', type: L.slug }),
    defineField({ name: 'body', type: L.portableText }),
    defineField({ name: 'excerpt', type: L.text, description: 'For cards and the SEO meta description' }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'updatedAt', type: 'datetime' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'teamMember' }] }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: ['traditions', 'guides', 'monuments', 'preneed', 'grief-support', 'legal-admin', 'company-news'] },
    }),
    defineField({ name: 'tags', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'isPublished', type: 'boolean', initialValue: false }),
    defineField({ name: 'isFeatured', type: 'boolean', initialValue: false }),
    defineField({ name: 'seoTitle', type: L.string }),
    defineField({ name: 'seoDescription', type: L.text }),
  ],
  preview: { select: { title: 'title.0.value', subtitle: 'publishedAt' } },
});
