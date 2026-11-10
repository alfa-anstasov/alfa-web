import { describe, expect, it } from 'vitest';
import {
  DAY_OF_DEATH_IS_DAY_ONE,
  addDays,
  addMonths,
  buildIcs,
  computeCommemorations,
  formatLongDate,
  offsetForDay,
  parseIsoDate,
} from '@/lib/commemoration';

const byId = (iso: string) => Object.fromEntries(computeCommemorations(iso).map((c) => [c.id, c]));

describe('counting rule', () => {
  it('is the documented default: the day of death is day 1', () => {
    expect(DAY_OF_DEATH_IS_DAY_ONE).toBe(true);
    expect(offsetForDay(1)).toBe(0);
    expect(offsetForDay(3)).toBe(2);
    expect(offsetForDay(9)).toBe(8);
    expect(offsetForDay(40)).toBe(39);
  });
});

describe('computeCommemorations (day of death = day 1)', () => {
  it('9th day = death + 8, 40th day = death + 39', () => {
    const r = byId('2026-03-01');
    expect(r.day9!.daysAfterDeath).toBe(8);
    expect(r.day9!.date).toBe('2026-03-09');
    expect(r.day40!.daysAfterDeath).toBe(39);
    expect(r.day40!.date).toBe('2026-04-09');
  });

  it('3rd day = death + 2', () => {
    expect(byId('2026-03-01').day3!.date).toBe('2026-03-03');
  });

  it('1 year = death + 364 days (spec 6.2)', () => {
    const r = byId('2026-03-01');
    expect(r.year1!.daysAfterDeath).toBe(364);
    expect(r.year1!.date).toBe('2027-02-28');
  });

  it('6 months = calendar +6 months minus one day', () => {
    expect(byId('2026-03-01').month6!.date).toBe('2026-08-31');
  });

  it('returns the five dates in order', () => {
    expect(computeCommemorations('2026-01-15').map((c) => c.id)).toEqual([
      'day3',
      'day9',
      'day40',
      'month6',
      'year1',
    ]);
  });

  it('crosses month and year boundaries', () => {
    const r = byId('2026-12-28');
    expect(r.day9!.date).toBe('2027-01-05');
    expect(r.day40!.date).toBe('2027-02-05');
  });

  it('handles leap years: 22 Feb 2028 + 8 days is 1 Mar 2028', () => {
    expect(byId('2028-02-22').day9!.date).toBe('2028-03-01');
    // 2028 is a leap year: 29 Feb exists
    expect(byId('2028-02-20').day9!.date).toBe('2028-02-28');
    expect(byId('2028-02-21').day9!.date).toBe('2028-02-29');
  });

  it('is not affected by daylight-saving changes (Bulgaria: 29 Mar 2026)', () => {
    expect(byId('2026-03-25').day9!.date).toBe('2026-04-02');
    expect(byId('2026-10-20').day9!.date).toBe('2026-10-28');
  });

  it('clamps month-end for the 6-month date (31 Aug)', () => {
    // 31 Aug + 6 months clamps to 28 Feb 2027, minus one day under the counting rule
    expect(byId('2026-08-31').month6!.date).toBe('2027-02-27');
  });

  it('rejects invalid dates', () => {
    expect(() => computeCommemorations('2026-02-31')).toThrow(RangeError);
    expect(() => computeCommemorations('')).toThrow(RangeError);
    expect(() => computeCommemorations('01.03.2026')).toThrow(RangeError);
  });
});

describe('date helpers', () => {
  it('parseIsoDate validates calendar dates', () => {
    expect(parseIsoDate('2026-02-28')).toEqual({ y: 2026, m: 2, d: 28 });
    expect(parseIsoDate('2026-02-29')).toBeNull();
    expect(parseIsoDate('2028-02-29')).not.toBeNull();
    expect(parseIsoDate('2026-13-01')).toBeNull();
  });
  it('addDays / addMonths', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-03-01', 12)).toBe('2027-03-01');
  });
  it('formatLongDate renders the calendar date in each language', () => {
    expect(formatLongDate('2026-03-09', 'en')).toMatch(/^Monday,? 9 March 2026$/);
    expect(formatLongDate('2026-03-09', 'bg')).toContain('9');
    expect(formatLongDate('2026-03-09', 'bg')).toContain('март');
    expect(formatLongDate('2026-03-09', 'ru')).toContain('марта');
  });
});

describe('buildIcs', () => {
  it('builds all-day events with CRLF line endings', () => {
    const ics = buildIcs(
      [{ uid: 'day9', date: '2026-03-09', summary: 'Помен, 9 дни', description: 'a; b, c' }],
      new Date('2026-01-01T10:20:30.000Z'),
    );
    expect(ics).toContain('BEGIN:VCALENDAR\r\n');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260309\r\n');
    expect(ics).toContain('DTEND;VALUE=DATE:20260310\r\n');
    expect(ics).toContain('DTSTAMP:20260101T102030Z\r\n');
    expect(ics).toContain('DESCRIPTION:a\; b\\, c\r\n');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
});
