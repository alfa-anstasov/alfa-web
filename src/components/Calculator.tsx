'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  buildIcs,
  computeCommemorations,
  daysBetween,
  formatLongDate,
  localTodayIso,
  parseIsoDate,
  type Commemoration,
} from '@/lib/commemoration';

type ErrorKey = 'errorRequired' | 'errorInvalid' | 'errorFuture';

function download(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 9/40-day commemoration calculator. The counting rule lives in src/lib/commemoration.ts. */
export function Calculator({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const id = useId();
  const [value, setValue] = useState('');
  const [error, setError] = useState<ErrorKey | null>(null);
  const [results, setResults] = useState<Commemoration[] | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) return fail('errorRequired');
    if (!parseIsoDate(value)) return fail('errorInvalid');
    if (value > localTodayIso()) return fail('errorFuture');
    setError(null);
    setResults(computeCommemorations(value));
  }
  function fail(key: ErrorKey) {
    setError(key);
    setResults(null);
  }

  const eventsFor = (list: Commemoration[]) =>
    list.map((c) => ({
      uid: `${value}-${c.id}`,
      date: c.date,
      summary: t(`items.${c.id}`),
      description: t('icsDescription'),
    }));

  const relative = (date: string) => {
    const n = daysBetween(localTodayIso(), date);
    return n === 0 ? t('today') : n < 0 ? t('past') : t('inDays', { days: n });
  };

  return (
    <div className={compact ? 'panel' : 'panel max-w-2xl'}>
      {!compact && <p className="mb-5 text-dim">{t('intro')}</p>}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <label htmlFor={id} className="text-[13.5px] text-dim">
          {t('dateLabel')}
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            id={id}
            type="date"
            className="field min-w-0 flex-1"
            value={value}
            max={localTodayIso()}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
          />
          <button type="submit" className="btn btn-gold">
            {t('submit')}
          </button>
        </div>
        {error && (
          <p id={`${id}-err`} role="alert" className="rounded bg-warn-soft px-3 py-2 text-small">
            {t(error)}
          </p>
        )}
      </form>

      <p className="mt-4 text-small text-dim">{t('rule')}</p>

      {results && (
        <div className="mt-6" aria-live="polite">
          <h3 className="sr-only">{t('resultsLabel')}</h3>
          <ul className="divide-y divide-line border-y border-line">
            {results.map((c) => (
              <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                <div>
                  <div className="font-display text-[21px] font-semibold">{t(`items.${c.id}`)}</div>
                  <div className="text-dim">{formatLongDate(c.date, locale)}</div>
                  <div className="text-tiny text-dim">{relative(c.date)}</div>
                </div>
                <button
                  type="button"
                  className="btn !min-h-[36px] !px-3 !py-1.5 text-small"
                  onClick={() => download(`${c.id}.ics`, buildIcs(eventsFor([c])))}
                >
                  {t('addToCalendar')}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn" onClick={() => download('pomeni.ics', buildIcs(eventsFor(results)))}>
              {t('downloadAll')}
            </button>
            <Link href="/contact" className="btn btn-gold">
              {t('ctaContact')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
