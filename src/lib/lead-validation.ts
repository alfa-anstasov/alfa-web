import { z } from 'zod';

/** Accepts a Bulgarian or international phone number: optional +, digits, spaces, dashes, dots, parentheses. */
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  if (!/^\+?[\d\s().-]{7,25}$/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  return (trimmed.startsWith('+') ? '+' : '') + digits;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Contact = { kind: 'email'; value: string } | { kind: 'phone'; value: string };

export function parseContact(input: string): Contact | null {
  const v = input.trim();
  if (v.length < 5 || v.length > 120) return null;
  if (v.includes('@')) return EMAIL.test(v) ? { kind: 'email', value: v.toLowerCase() } : null;
  const phone = normalizePhone(v);
  return phone ? { kind: 'phone', value: phone } : null;
}

/** Body of POST /api/price-reveal (spec 6.1: { contact, productSlug, lang }). */
export const priceRevealSchema = z.object({
  contact: z.string().refine((v) => parseContact(v) !== null),
  productSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  kind: z.enum(['monument', 'funeralProduct']).default('monument'),
  lang: z.enum(['bg', 'en', 'ru']),
  // Honeypot: hidden field that real visitors never fill in (spec 11.2).
  website: z.string().max(0).optional(),
});

export type PriceRevealInput = z.infer<typeof priceRevealSchema>;
