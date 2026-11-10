import { describe, expect, it } from 'vitest';
import bg from '../messages/bg.json';
import en from '../messages/en.json';
import ru from '../messages/ru.json';

const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

describe('messages', () => {
  it('bg, en and ru have exactly the same keys', () => {
    expect(keys(en).sort()).toEqual(keys(bg).sort());
    expect(keys(ru).sort()).toEqual(keys(bg).sort());
  });
  it('no exclamation marks in the copy', () => {
    for (const m of [bg, en, ru]) expect(JSON.stringify(m)).not.toContain('!');
  });
});
