import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Calculator } from '@/components/Calculator';
import { ComingSoon } from '@/components/ComingSoon';
import { JsonLd } from '@/components/JsonLd';
import { offices, site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import type { AppPathname, Locale } from '@/i18n/routing';
import { homeJsonLd } from '@/lib/jsonld';
import { alternatesFor, robotsFor } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: { absolute: t('fallbackTitle') },
    description: t('description'),
    alternates: alternatesFor('/', locale as Locale),
    robots: robotsFor(),
  };
}

function Hero() {
  const t = useTranslations('hero');
  return (
    <section className="py-16 pb-[72px]">
      <div className="wrap grid items-start gap-12 min-[961px]:grid-cols-[1.12fr_.88fr] min-[961px]:gap-16">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="mt-[18px] [&_em]:block">{t.rich('title', { em: (c) => <em>{c}</em> })}</h1>
          <p className="lede mt-6">{t('body')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-gold" href={`tel:${site.phone.tel}`}>
              {t('ctaCall')}
            </a>
            <Link className="btn" href="/plan-ahead">
              {t('ctaPlan')}
            </Link>
          </div>
        </div>
        <Calculator compact />
      </div>
    </section>
  );
}

const pathCards = [
  { key: 'before', href: '/plan-ahead' },
  { key: 'now', href: '/funeral-services' },
  { key: 'after', href: '/funeral-services' },
] as const satisfies readonly { key: string; href: AppPathname }[];

function Paths() {
  const t = useTranslations('paths');
  return (
    <section className="section">
      <div className="wrap grid gap-6 md:grid-cols-3">
        {pathCards.map(({ key, href }) => (
          <Link key={key} href={href} className="panel flex flex-col gap-3 no-underline hover:border-gold">
            <span className="eyebrow">{t(`${key}.when`)}</span>
            <h3>{t(`${key}.title`)}</h3>
            <p className="text-dim">{t(`${key}.text`)}</p>
            <span className="mt-auto text-gold">{t(`${key}.cta`)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

type StubKey = 'services' | 'monuments' | 'graves' | 'maintenance' | 'reviews' | 'planAhead';

function StubSection({ k }: { k: StubKey }) {
  const t = useTranslations('sections');
  return (
    <section className="section">
      <div className="wrap flex flex-col gap-3">
        <p className="eyebrow">{t(`${k}.eyebrow`)}</p>
        <h2>{t(`${k}.title`)}</h2>
        <ComingSoon />
      </div>
    </section>
  );
}

function Offices() {
  const t = useTranslations('sections.offices');
  const locale = useLocale() as Locale;
  return (
    <section className="section">
      <div className="wrap flex flex-col gap-8">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="mt-3">{t('title')}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {offices.map((o) => (
            <div key={o.id} className="panel flex flex-col gap-2">
              <h3>{o.city[locale]}</h3>
              <p className="text-dim">{t('since', { year: o.openedYear })}</p>
              {/* TODO(owner): address, office phone and hours are unknown; shown as a placeholder. */}
              <p className="text-small text-dim">{o.streetAddress ?? t('pending')}</p>
            </div>
          ))}
        </div>
        <p className="text-dim">
          {t('allDay')}: <a href={`tel:${site.phone.tel}`} className="tabular-nums text-text">{site.phone.display}</a>
        </p>
      </div>
    </section>
  );
}

function History() {
  const t = useTranslations('sections.history');
  const locale = useLocale() as Locale;
  return (
    <section className="section">
      <div className="wrap flex flex-col gap-8">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="mt-3">{t('title')}</h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {offices.map((o) => (
            <li key={o.id} className="border-t border-gold pt-3">
              <div className="font-display text-[38px] leading-none tabular-nums">{o.openedYear}</div>
              <div className="mt-2 text-dim">{o.city[locale]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={homeJsonLd(locale as Locale)} />
      <Hero />
      <Paths />
      <StubSection k="services" />
      <StubSection k="monuments" />
      <StubSection k="graves" />
      <Offices />
      <StubSection k="maintenance" />
      <StubSection k="reviews" />
      <History />
      <StubSection k="planAhead" />
    </>
  );
}
