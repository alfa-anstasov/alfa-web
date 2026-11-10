/**
 * Orthodox commemoration dates (3rd, 9th and 40th day, 6 months, 1 year).
 *
 * All arithmetic is done on plain calendar dates in UTC ("YYYY-MM-DD" strings), so the
 * result never depends on the server/browser time zone or on daylight-saving changes.
 */

/**
 * THE COUNTING RULE (owner to confirm against how the ALFA offices count).
 *
 * `true`  : the day of death is day 1.  3rd day = death + 2, 9th day = death + 8,
 *           40th day = death + 39, 1 year (365th day) = death + 364.
 * `false` : the day after death is day 1. 9th day = death + 9, 40th day = death + 40.
 *
 * This is the only place the rule lives. Everything below derives from it.
 */
export const DAY_OF_DEATH_IS_DAY_ONE = true;

export type CommemorationId = 'day3' | 'day9' | 'day40' | 'month6' | 'year1';

export interface Commemoration {
  id: CommemorationId;
  /** Calendar date, "YYYY-MM-DD". */
  date: string;
  /** Days after the date of death. */
  daysAfterDeath: number;
}

/** Days to add to the date of death for "the Nth day". */
export const offsetForDay = (nthDay: number): number =>
  DAY_OF_DEATH_IS_DAY_ONE ? nthDay - 1 : nthDay;

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  const match = ISO.exec(iso);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  // Reject 2025-02-31 and the like (Date would silently roll over).
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) {
    return null;
  }
  return { y, m, d };
}

const toIso = (t: number): string => new Date(t).toISOString().slice(0, 10);

export function addDays(iso: string, days: number): string {
  const p = parseIsoDate(iso);
  if (!p) throw new RangeError(`Invalid ISO date: ${iso}`);
  return toIso(Date.UTC(p.y, p.m - 1, p.d + days));
}

/** Calendar month arithmetic that clamps to the end of a shorter month (31 Aug + 6 months = 28/29 Feb). */
export function addMonths(iso: string, months: number): string {
  const p = parseIsoDate(iso);
  if (!p) throw new RangeError(`Invalid ISO date: ${iso}`);
  const lastDay = new Date(Date.UTC(p.y, p.m - 1 + months + 1, 0)).getUTCDate();
  return toIso(Date.UTC(p.y, p.m - 1 + months, Math.min(p.d, lastDay)));
}

export function daysBetween(fromIso: string, toIsoDate: string): number {
  const a = parseIsoDate(fromIso);
  const b = parseIsoDate(toIsoDate);
  if (!a || !b) throw new RangeError('Invalid ISO date');
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000);
}

/**
 * @param deathIso date of death, "YYYY-MM-DD"
 * @throws RangeError for an invalid date
 */
export function computeCommemorations(deathIso: string): Commemoration[] {
  if (!parseIsoDate(deathIso)) throw new RangeError(`Invalid ISO date: ${deathIso}`);

  const byDays = (id: CommemorationId, nthDay: number): Commemoration => {
    const daysAfterDeath = offsetForDay(nthDay);
    return { id, date: addDays(deathIso, daysAfterDeath), daysAfterDeath };
  };

  // 6 months: the calendar date six months on, shifted by one day under the same
  // "day of death is day 1" rule. TODO(owner): confirm; the spec only defines 9, 40 and 1 year.
  const sixMonthsDate = addDays(addMonths(deathIso, 6), DAY_OF_DEATH_IS_DAY_ONE ? -1 : 0);

  return [
    byDays('day3', 3),
    byDays('day9', 9),
    byDays('day40', 40),
    {
      id: 'month6',
      date: sixMonthsDate,
      daysAfterDeath: daysBetween(deathIso, sixMonthsDate),
    },
    // Spec 6.2: 1 year = death + 364 days (the 365th day when the day of death is day 1).
    byDays('year1', 365),
  ];
}

/** Today's date in the visitor's local calendar as "YYYY-MM-DD". */
export function localTodayIso(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Locale-aware long date, always rendered from the calendar date (UTC), never shifted by time zone. */
export function formatLongDate(iso: string, locale: string): string {
  const p = parseIsoDate(iso);
  if (!p) return iso;
  const intlLocale = { bg: 'bg-BG', en: 'en-GB', ru: 'ru-RU' }[locale] ?? locale;
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(p.y, p.m - 1, p.d)));
}

/** Minimal RFC 5545 all-day event, one VEVENT per commemoration. */
export function buildIcs(
  events: { uid: string; date: string; summary: string; description?: string }[],
  stamp: Date = new Date(),
): string {
  const compact = (iso: string) => iso.replaceAll('-', '');
  const esc = (s: string) =>
    s.replaceAll('\\', '\\\\').replaceAll(';', '\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');
  const dtstamp = stamp.toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ALFA//funeralalfa.com//BG', 'CALSCALE:GREGORIAN'];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}@funeralalfa.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(e.date)}`,
      `DTEND;VALUE=DATE:${compact(addDays(e.date, 1))}`,
      `SUMMARY:${esc(e.summary)}`,
    );
    if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
