// Fails if the private price field name appears in any JS file shipped to visitors of a public page.
// Run after `next build`. The /studio route is excluded: Sanity Studio needs the schema (field names,
// never values) and is only for authenticated editors. Public pages must never load it.
//
// Which files count: every client chunk listed in the client-reference manifest of each non-studio
// page, plus the chunks every page loads (build-manifest.json).
import fs from 'node:fs';
import path from 'node:path';

const FIELD = 'hiddenPrice';
const nextDir = path.resolve('.next');
const appDir = path.join(nextDir, 'server', 'app');
if (!fs.existsSync(appDir)) {
  console.error('check-client-bundle: .next/server/app not found. Run `npm run build` first.');
  process.exit(2);
}

const manifests = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('_client-reference-manifest.js')) manifests.push(p);
  }
})(appDir);

const publicManifests = manifests.filter((m) => !path.relative(appDir, m).split(path.sep).includes('studio'));
const files = new Set();
for (const m of publicManifests) {
  for (const hit of fs.readFileSync(m, 'utf8').matchAll(/static\/chunks\/[^"'\\\s]+?\.js/g)) files.add(hit[0]);
}
const buildManifest = path.join(nextDir, 'build-manifest.json');
if (fs.existsSync(buildManifest)) {
  const b = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
  for (const f of [...(b.rootMainFiles ?? []), ...(b.polyfillFiles ?? [])]) if (f.endsWith('.js')) files.add(f);
}
if (publicManifests.length === 0 || files.size === 0) {
  console.error('check-client-bundle: found no public page manifests or chunks; the check would be meaningless.');
  process.exit(2);
}

const offenders = [...files].filter((f) => {
  const full = path.join(nextDir, f);
  return fs.existsSync(full) && fs.readFileSync(full, 'utf8').includes(FIELD);
});
if (offenders.length) {
  console.error(`check-client-bundle: "${FIELD}" found in client bundles of public pages:\n  ${offenders.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-client-bundle: OK (${files.size} client files across ${publicManifests.length} public page manifests contain no "${FIELD}").`);
