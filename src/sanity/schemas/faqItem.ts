import { defineField, defineType } from 'sanity';
import { L } from './shared';

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: L.string }),
    defineField({ name: 'answer', type: L.portableText }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: ['funeral', 'cremation', 'transport', 'monuments', 'products', 'cemetery', 'maintenance', 'preneed', 'general'],
      },
    }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'isPublished', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'question.0.value', subtitle: 'category' } },
});
