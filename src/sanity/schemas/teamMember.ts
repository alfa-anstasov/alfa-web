import { defineField, defineType } from 'sanity';
import { L } from './shared';

/** Staff tied to one office, or to the national core team (`isNational`). */
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: L.string }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', type: L.text }),
    defineField({ name: 'isNational', type: 'boolean', description: 'true = core company team (no office)', initialValue: false }),
    defineField({
      name: 'location',
      type: 'reference',
      to: [{ type: 'location' }],
      description: 'Leave empty if "isNational" is true',
      hidden: ({ parent }) => Boolean(parent?.isNational),
    }),
    defineField({ name: 'order', type: 'number', description: 'Display sort order' }),
    // Staff personal data: never project this field in a public query.
    defineField({ name: 'email', type: 'string', description: 'Internal only, not shown publicly' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role.0.value', media: 'photo' } },
});
