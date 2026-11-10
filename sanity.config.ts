'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { schemaTypes, singletonTypes } from '@/sanity/schemas';

export const languages = [
  { id: 'bg', title: 'Български' },
  { id: 'en', title: 'English' },
  { id: 'ru', title: 'Русский' },
];

export default defineConfig({
  name: 'alfa',
  title: 'АЛФА',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // The siteSettings singleton cannot be created twice.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType as 'siteSettings')),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypes.includes(item.getId() as 'siteSettings')),
          ]),
    }),
    // Field-level translations: bg is created by default, en/ru are added per field.
    // `slug` and the `portableText` alias type become internationalizedArraySlug / ...PortableText.
    internationalizedArray({
      languages,
      defaultLanguages: ['bg'],
      fieldTypes: ['string', 'text', 'slug', 'portableText'],
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
