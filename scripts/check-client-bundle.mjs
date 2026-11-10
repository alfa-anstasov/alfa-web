// Fails if the private price field name appears in any JS file shipped to visitors of a public page.
// Run after `next build`. The /studio route is excluded: Sanity Studio needs the schema (field names,
// never values) and is only for authenticated editors. Public pages must never load it.
import fs from 'node:fs';
import path from 'node:path';

const FIELD = 'hiddenPrice';
const nextDir = path.resolve('.next');
const manifestPath = path.join(nextDir, 'app-build-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('check-client-bundle: .next/app-build-manifest.json not found. Run `npm run build` first.');
  process.exit(2);
}
const { pages } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const publicFiles = new Set();
let publicPages = 0;
for (const [page, files] of Object.entries(pages)) {
  if (page.startsWith('/studio')) continue;
  publicPages += 1;
  for (const f of files) if (f.endsWith('.js')) publicFiles.add(f);
}
const offenders = [...publicFiles].filter((f) => fs.readFileSync(path.join(nextDir, f), 'utf8').includes(FIELD));
if (offenders.length) {
  console.error(`check-client-bundle: "${FIELD}" found in client bundles of public pages:\n  ${offenders.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-client-bundle: OK (${publicFiles.size} client files across ${publicPages} public pages contain no "${FIELD}").`);
