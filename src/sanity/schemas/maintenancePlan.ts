import { defineArrayMember, defineField, defineType } from 'sanity';
import { L, hiddenPriceField } from './shared';

/**
 * Cemetery maintenance tiers. basic: one cleaning before a commemoration date;
 * annual: full annual maintenance; premium: annual maintenance + flower arrangements.
 * `hiddenPrice` is private (annual price): same rules as monuments.
 */
export const maintenancePlan = defineType({
  name: 'maintenancePlan',
  title: 'Maintenance plan',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: L.string, description: 'e.g. Основен, Годишен, Премиум' }),
    defineField({ name: 'slug', type: L.slug }),
    defineField({ name: 'tier', type: 'string', options: { list: ['basic', 'annual', 'premium'] } }),
    defineField({ name: 'description', type: L.text }),
    defineField({
      name: 'features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({ name: 'feature', type: L.string }), defineField({ name: 'isIncluded', type: 'boolean' })],
        }),
      ],
    }),
    hiddenPriceField('PRIVATE. Annual price in BGN.'),
    defineField({ name: 'priceNote', type: L.string, description: 'e.g. the price depends on the location' }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'isActive', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'tier' } },
});
