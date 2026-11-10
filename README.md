# alfa-web

Website of Траурни услуги АЛФА, funeralalfa.com (private repository). Next.js 16 (App Router) + React 19 + TypeScript + Tailwind + Sanity v3 + next-intl.
The two static prototypes live in [`prototypes/`](prototypes/) and are the design reference (not part of the build).

## Run it

Requires Node 22 (`.nvmrc`; Next 16 needs at least 20.9).

```bash
npm ci
cp .env.example .env.local   # optional: the site builds and runs without any values
npm run dev                  # http://localhost:3000  ->  redirects to /bg
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, `eslint-config-next` 16), zero warnings allowed |
| `npm test` | Vitest unit tests |
| `npm run check:bundle` | after `build`: fails if the private price field is in any client JS of a public page |
| `npm run verify` | all of the above in order |

The Sanity Studio is served by the app at `/studio` (mounted with the `Studio` component from `sanity`; `next-sanity` is not used because its releases for Next 15/16 require Sanity 4+, and the project stays on Sanity v3; needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and a Sanity login).

## Deploying (not set up here)

`next.config.mjs` uses `output: 'standalone'`, so the same build runs on Vercel or on a self-hosted Node server:

```bash
npm run build
node .next/standalone/server.js   # PORT=3000 HOSTNAME=0.0.0.0; copy .next/static and public/ next to it
```

Environment variable names are in `.env.example` (names only). Pages are `noindex` and `robots.txt` disallows everything
until `ALLOW_INDEXING=true` is set at launch.

## Structure

```
messages/{bg,en,ru}.json      all UI copy (hero copy: docs/hero-copy.md)
src/i18n/                     routing (localized slugs, spec 4.3), navigation, request config
src/app/[locale]/             pages; one folder per internal pathname
src/app/api/price-reveal/     the only route that reads private prices
src/proxy.ts                   locale routing (Next 16 `proxy`, formerly `middleware`)
src/components/               Header (УСЛУГИ dropdown), Footer, LocaleSwitcher, Calculator, JsonLd ...
src/config/site.ts            company facts; unknown values are null (never invented)
src/lib/commemoration.ts      9/40-day logic and the counting rule
src/sanity/                   schemas, public queries, server-only price access
sanity.config.ts              Studio config
tailwind.config.ts            design tokens extracted from prototypes/v2
```

Adding a page: create `src/app/[locale]/<key>/page.tsx` and add `<key>` with its three slugs to `src/i18n/routing.ts`.

## Private prices (`hiddenPrice`)

Prices are hidden until the visitor leaves a phone or email. Rules, all enforced by tests/CI:

1. `src/sanity/queries.ts` (all public GROQ) never mentions the field, never uses a spread and never runs a query without
   an explicit projection (`tests/hidden-price.test.ts`).
2. Only `src/sanity/server/price.ts` reads it. It imports `server-only` and uses its own token `SANITY_API_TOKEN`.
3. `POST /api/price-reveal` rate-limits, validates the lead with Zod (honeypot included) and only then reads the price. It answers `{ price, currency: 'EUR' }`.

All prices are in euros. Sanity stores euros, there is no leva field and no dual display (`src/lib/money.ts`).
4. `npm run check:bundle` scans the client JS of every public page after the build.

**Important: this is only safe if the Sanity dataset is private.** In a public dataset anyone who knows the project ID
(it is public by design) can query the Sanity API directly and read `hiddenPrice`, whatever our pages do. Set the dataset to
private (`sanity dataset visibility set <name> private`) and put a viewer token in `SANITY_API_READ_TOKEN` for page queries.
Alternatively store prices in a separate private dataset. Decide before real prices are entered. The repository itself is private; that does not protect data in a public dataset.

## Phase 1 status (spec section 13)

Done in code: Next 16 project, i18n routing, Sanity schemas + Studio, base layout (header, УСЛУГИ dropdown, footer, language
switcher, floating phone), hero, section stubs, 9/40-day calculator, JSON-LD, price-reveal route stub, CI.
Deliberately not done: Vercel project, DNS, redirects at DNS level (www to apex), GA4/GTM/CallRail scripts (consent banner is
Phase 5; the owner is also removing Google dependencies), Resend test email, Viber button (no number).

## Content types

The spec (section 5) defines 12 content types and all 12 are implemented. There is no 13th.

## Open decisions

See the PR description. Short list: public vs private Sanity dataset, flat nav (prototype) vs УСЛУГИ dropdown (spec), the 6-month commemoration rule.
