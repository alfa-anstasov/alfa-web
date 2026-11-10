import { useTranslations } from 'next-intl';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';

const groups: { key: 'before' | 'services' | 'company'; links: AppPathname[] }[] = [
  { key: 'before', links: ['/plan-ahead', '/calculator'] },
  { key: 'services', links: ['/funeral-services', '/monuments', '/funeral-products', '/cemetery-plots', '/maintenance-subscription'] },
  { key: 'company', links: ['/about-us', '/offices', '/reviews', '/faq', '/contact'] },
];

export function Footer() {
  const t = useTranslations('footer');
  const p = useTranslations('pages');
  return (
    <footer className="mt-section border-t border-line bg-surface py-12">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-2.5">
            <b className="font-display text-[27px] font-semibold tracking-brand">АЛФА</b>
            <p className="text-dim">{t('tagline')}</p>
            <p>
              <a href={`tel:${site.phone.tel}`} className="text-[18px] tabular-nums no-underline">
                {site.phone.display}
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="text-dim">
                {site.email}
              </a>
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.key} className="flex flex-col gap-2">
              <h4>{t(g.key)}</h4>
              {g.links.map((href) => (
                <Link key={href} href={href} className="text-dim no-underline hover:text-text">
                  {p(href.slice(1) as never)}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-small text-dim">
          <span>
            © {new Date().getFullYear()} {site.legalName} · ЕИК {site.eik}
          </span>
          <span>{t('privacy')}</span>
          <span>{t('cookies')}</span>
        </div>
      </div>
    </footer>
  );
}
