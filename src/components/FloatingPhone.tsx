import { useTranslations } from 'next-intl';
import { site } from '@/config/site';

/**
 * Spec 4.4 floating sidebar: the 24/7 phone, always reachable. On phones it is a bottom bar.
 * No Viber button until a Viber number is set in src/config/site.ts.
 */
export function FloatingPhone() {
  const t = useTranslations('header');
  return (
    <a
      href={`tel:${site.phone.tel}`}
      className="fixed bottom-3 right-3 z-20 flex items-center gap-2 rounded-full border border-gold bg-gold px-5 py-3 text-[16px] font-medium tabular-nums text-on-gold no-underline shadow-lg sm:hidden"
    >
      <span aria-hidden="true">☎</span>
      {site.phone.display}
      <span className="sr-only"> {t('call24')}</span>
    </a>
  );
}
