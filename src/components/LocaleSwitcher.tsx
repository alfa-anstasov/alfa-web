'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';

const names: Record<string, string> = { bg: 'Български', en: 'English', ru: 'Русский' };

/** Same page in the other language. All current pages exist in all three languages (spec 6.5). */
export function LocaleSwitcher() {
  const current = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');
  return (
    <nav aria-label={t('language')} className="flex items-center gap-1 text-small">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          hrefLang={l}
          aria-label={names[l]}
          aria-current={l === current ? 'true' : undefined}
          className={`rounded px-2 py-1 uppercase no-underline ${
            l === current ? 'text-text shadow-[inset_0_-2px_0_var(--gold)]' : 'text-dim hover:text-text'
          }`}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
