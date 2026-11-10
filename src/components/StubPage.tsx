import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ComingSoon } from '@/components/ComingSoon';
import type { AppPathname, Locale } from '@/i18n/routing';
import { alternatesFor, robotsFor } from '@/lib/seo';

type Props = { params: { locale: string } };

/** Placeholder for a page that is built in a later phase. Keeps routing, nav and hreflang working. */
export function createStubPage(href: AppPathname) {
  const key = href.slice(1);
  return {
    async generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
      const [p, m] = await Promise.all([
        getTranslations({ locale, namespace: 'pages' }),
        getTranslations({ locale, namespace: 'meta' }),
      ]);
      return {
        title: `${p(key as never)} | ${m('siteName')}`,
        alternates: alternatesFor(href, locale as Locale),
        robots: robotsFor(),
      };
    },
    async Page({ params: { locale } }: Props) {
      setRequestLocale(locale);
      const p = await getTranslations({ locale, namespace: 'pages' });
      return (
        <section className="section border-t-0">
          <div className="wrap flex flex-col gap-4">
            <h1>{p(key as never)}</h1>
            <ComingSoon />
          </div>
        </section>
      );
    },
  };
}
