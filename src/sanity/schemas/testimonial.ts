import { defineField, defineType } from 'sanity';
import { L } from './shared';

/** Manually entered testimonials and (later) Google reviews (`isGoogleReview`). */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'authorName', type: 'string' }),
    defineField({ name: 'authorCity', type: 'string' }),
    defineField({ name: 'authorPhoto', type: 'image', description: 'Optional, only if the client provided a photo' }),
    defineField({ name: 'text', type: L.text }),
    defineField({ name: 'rating', type: 'number', description: '1-5 stars', validation: (r) => r.min(1).max(5) }),
    defineField({
      name: 'serviceUsed',
      type: 'string',
      options: { list: ['funeral', 'cremation', 'monument', 'cemetery', 'maintenance'] },
    }),
    defineField({ name: 'locationServed', type: 'reference', to: [{ type: 'location' }] }),
    defineField({ name: 'isApproved', type: 'boolean', initialValue: false, description: 'Must be approved before showing publicly' }),
    defineField({ name: 'isGoogleReview', type: 'boolean', initialValue: false }),
    defineField({ name: 'googleReviewId', type: 'string', description: 'Google review ID if sourced from the Places API' }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'source', type: 'string', options: { list: ['website', 'google', 'direct'] } }),
  ],
  preview: { select: { title: 'authorName', subtitle: 'source' } },
});
