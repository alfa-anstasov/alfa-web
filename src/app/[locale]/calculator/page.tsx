import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Calculator } from '@/components/Calculator';
import type { Locale } from '@/i18n/routing';
import { alternatesFor, robotsFor } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'calculator' });
  return { title: t('title'), description: t('intro'), alternates: alternatesFor('/calculator', locale as Locale), robots: robotsFor() };
}

export default async function CalculatorPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'calculator' });
  return (
    <section className="py-section-sm">
      <div className="wrap flex flex-col gap-6">
        <h1>{t('title')}</h1>
        <Calculator />
      </div>
    </section>
  );
}
