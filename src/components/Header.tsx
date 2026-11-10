'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/config/site';
import { Link, usePathname } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { LocaleSwitcher } from './LocaleSwitcher';

/** Spec 4.4: one УСЛУГИ dropdown with the services, then the company pages. */
const primary: AppPathname[] = [
  '/funeral-services',
  '/monuments',
  '/funeral-products',
  '/cemetery-plots',
  '/maintenance-subscription',
  '/plan-ahead',
];
const secondary: AppPathname[] = ['/faq', '/reviews', '/contact', '/about-us'];

export function Header() {
  const t = useTranslations('header');
  const p = useTranslations('pages');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const item = (href: AppPathname) => (
    <Link
      key={href}
      href={href}
      className="block px-4 py-3 text-[16px] text-text no-underline hover:bg-gold-soft"
      aria-current={pathname === href ? 'page' : undefined}
    >
      {p(href.slice(1) as never)}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="wrap flex min-h-[68px] items-center gap-4">
        <Link href="/" className="flex flex-col leading-none no-underline">
          <b className="font-display text-[27px] font-semibold tracking-brand max-[460px]:text-[23px]">АЛФА</b>
          <small className="mt-[5px] text-[10.5px] uppercase tracking-[0.22em] text-dim max-[460px]:hidden">
            {t('brandSub')}
          </small>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <LocaleSwitcher />
          <div ref={box} className="relative">
            <button
              type="button"
              className="btn !min-h-[40px] !px-4 !py-2 uppercase tracking-[0.08em]"
              aria-expanded={open}
              aria-controls="services-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {t('menu')} <span aria-hidden="true">{open ? '▲' : '▼'}</span>
            </button>
            {open && (
              <div
                id="services-menu"
                className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-32px))] rounded border border-line-2 bg-raised py-2 shadow-xl"
              >
                {primary.map(item)}
                <hr className="my-2 border-line" />
                {secondary.map(item)}
              </div>
            )}
          </div>
          <a href={`tel:${site.phone.tel}`} className="hidden flex-col items-end border-l border-line pl-4 leading-[1.15] no-underline sm:flex">
            <b className="whitespace-nowrap text-[18px] font-medium tabular-nums text-gold-hi">{site.phone.display}</b>
            <small className="text-[11px] uppercase tracking-[0.14em] text-dim">{t('call24')}</small>
          </a>
        </div>
      </div>
    </header>
  );
}
