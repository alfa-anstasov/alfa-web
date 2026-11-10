import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FloatingPhone } from '@/components/FloatingPhone';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { routing } from '@/i18n/routing';
import { robotsFor, siteUrl } from '@/lib/seo';
import '../globals.css';

type Props = { children: React.ReactNode; params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t('fallbackTitle'), template: `%s | ${t('siteName')}` },
    description: t('description'),
    robots: robotsFor(),
    openGraph: {
      siteName: t('siteName'),
      locale: { bg: 'bg_BG', en: 'en_GB', ru: 'ru_RU' }[locale],
      type: 'website',
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'a11y' });
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-on-gold"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingPhone />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
