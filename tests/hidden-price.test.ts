import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as queries from '@/sanity/queries';

const root = path.resolve(__dirname, '..');
const read = (rel: string) => fs.readFileSync(path.join(root, rel), 'utf8');

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

describe('hiddenPrice never appears in public queries', () => {
  it('the public queries module does not mention it (any case, even in comments it is spelled out indirectly)', () => {
    // The module explains the rule without spelling the field name.
    expect(read('src/sanity/queries.ts')).not.toMatch(/hidden\s*price/i);
  });

  it('no exported query or fragment contains it', () => {
    for (const [name, value] of Object.entries(queries)) {
      expect(typeof value, name).toBe('string');
      expect(value as string, name).not.toMatch(/hiddenprice/i);
    }
  });

  it('no spread and no query without an explicit projection (both would leak every field)', () => {
    expect(read('src/sanity/queries.ts')).not.toContain('...');
    for (const [name, value] of Object.entries(queries)) {
      if (!name.endsWith('Query')) continue;
      expect(value as string, name).toMatch(/\{[\s\S]*\}\s*$/);
    }
  });

  it('only allow-listed server/schema/test files mention it anywhere in the repo source', () => {
    const allowed = [
      'src/sanity/schemas/',
      'src/sanity/server/price.ts',
      'tests/',
    ];
    const offenders = walk(path.join(root, 'src'))
      .map((f) => path.relative(root, f).split(path.sep).join('/'))
      .filter((f) => /\.(ts|tsx|json|css)$/.test(f))
      .filter((f) => /hiddenprice/i.test(read(f)))
      .filter((f) => !allowed.some((a) => f.startsWith(a)));
    expect(offenders).toEqual([]);
  });

  it('client code never imports the server price module', () => {
    const offenders = walk(path.join(root, 'src'))
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .map((f) => path.relative(root, f).split(path.sep).join('/'))
      .filter((f) => f !== 'src/app/api/price-reveal/route.ts')
      .filter((f) => /from\s+['"][^'"]*sanity\/server\//.test(read(f)));
    expect(offenders).toEqual([]);
  });

  it('the server price module is guarded by server-only', () => {
    expect(read('src/sanity/server/price.ts')).toMatch(/^import 'server-only';/m);
  });
});
