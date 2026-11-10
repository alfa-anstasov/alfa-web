import { useTranslations } from 'next-intl';

export function ComingSoon() {
  const t = useTranslations('stub');
  return <p className="text-small text-dim">{t('soon')}</p>;
}
