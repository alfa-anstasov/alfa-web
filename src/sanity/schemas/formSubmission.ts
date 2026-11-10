import { defineField, defineType } from 'sanity';

/**
 * Interim CRM: every website form lands here. Contains visitors' personal data (GDPR):
 * never query it from public code, and write it only from server-side API routes.
 */
export const formSubmission = defineType({
  name: 'formSubmission',
  title: 'Form submission',
  type: 'document',
  fields: [
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      type: 'string',
      options: { list: ['new', 'contacted', 'completed', 'archived'] },
      initialValue: 'new',
    }),
    defineField({
      name: 'formType',
      type: 'string',
      options: {
        list: ['price-reveal', 'full-offer', 'consultation', 'maintenance', 'preneed', 'contact', 'memorial-form'],
      },
    }),
    defineField({ name: 'name', type: 'string', description: 'Optional for price-reveal, required for others' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'contactPreference', type: 'string', options: { list: ['phone', 'email', 'viber'] } }),
    defineField({ name: 'productSlug', type: 'string', description: 'Monument or product slug for price-reveal forms' }),
    defineField({ name: 'productName', type: 'string', description: 'Denormalized product name for Studio display' }),
    defineField({ name: 'locationPreference', type: 'reference', to: [{ type: 'location' }] }),
    defineField({ name: 'language', type: 'string', options: { list: ['bg', 'en', 'ru'] } }),
    defineField({ name: 'utmSource', type: 'string' }),
    defineField({ name: 'utmMedium', type: 'string' }),
    defineField({ name: 'utmCampaign', type: 'string' }),
    defineField({ name: 'notes', type: 'text', description: 'Internal team notes, not visible to the client' }),
    defineField({ name: 'assignedTo', type: 'reference', to: [{ type: 'teamMember' }], description: 'For the V2 CRM handoff' }),
  ],
  preview: { select: { title: 'formType', subtitle: 'status' } },
});
