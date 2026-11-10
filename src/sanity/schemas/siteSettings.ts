import { defineField, defineType } from 'sanity';
import { L } from './shared';

/** Singleton: one document (see the structure in sanity.config.ts). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: L.string }),
    defineField({ name: 'siteTagline', type: L.string }),
    defineField({ name: 'mainPhone', type: 'string', description: 'The 24/7 number' }),
    defineField({ name: 'viberNumber', type: 'string' }),
    defineField({ name: 'whatsappNumber', type: 'string' }),
    defineField({ name: 'mainEmail', type: 'string' }),
    defineField({ name: 'googlePlaceId', type: 'string', description: 'For the Google Reviews API and review-link generation' }),
    defineField({ name: 'googleAnalyticsId', type: 'string' }),
    defineField({ name: 'googleTagManagerId', type: 'string' }),
    defineField({ name: 'callRailAccountId', type: 'string' }),
    defineField({
      name: 'socialLinks',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', type: 'url' }),
        defineField({ name: 'instagram', type: 'url' }),
        defineField({ name: 'youtube', type: 'url' }),
        defineField({ name: 'linkedin', type: 'url' }),
      ],
    }),
    defineField({ name: 'footerText', type: L.portableText }),
    defineField({ name: 'defaultSeoTitle', type: L.string }),
    defineField({ name: 'defaultSeoDescription', type: L.text }),
    defineField({ name: 'defaultOgImage', type: 'image' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
