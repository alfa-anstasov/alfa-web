/** All prices are euros (Bulgaria uses the euro since 1 January 2026). No other currency is stored or shown. */
export const CURRENCY = 'EUR' as const;

/** Locale-aware euro amount, e.g. formatEur(1234.5, 'bg') -> "1234,50 €". */
export function formatEur(amount: number, locale: string): string {
  const intlLocale = { bg: 'bg-BG', en: 'en-GB', ru: 'ru-RU' }[locale] ?? locale;
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
