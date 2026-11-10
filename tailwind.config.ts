import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Design tokens extracted from prototypes/v2/index.html (the `:root` block and the
 * type/spacing rules of its stylesheet). Dark is the default; the light "cream paper"
 * theme applies through prefers-color-scheme, or explicitly with <html data-theme="light">.
 * This file is the single source of truth: the CSS variables are emitted from here.
 */
export const tokens = {
  dark: {
    bg: '#0d0b09',
    surface: '#15110c',
    raised: '#1c1711',
    line: '#2d251c',
    'line-2': '#3c3226',
    text: '#ece4d5',
    dim: '#a8997f',
    muted: '#7d705e', // decorative / large text only: contrast is below 4.5:1 on bg
    gold: '#c8a769',
    'gold-hi': '#dcc08a',
    'on-gold': '#17120b',
    'gold-soft': 'rgba(200,167,105,.10)',
    warn: '#e3a35a',
    'warn-soft': 'rgba(227,163,90,.12)',
    ok: '#93c3a0',
    'ok-soft': 'rgba(147,195,160,.12)',
    'div-hi': '#d58a6c',
    'div-mid': '#7c7366',
    'div-lo': '#7fa6bd',
    'on-div': '#0d0b09',
    scrim: 'rgba(5,4,3,.66)',
  },
  light: {
    bg: '#f3ede2',
    surface: '#faf6ee',
    raised: '#fffdf8',
    line: '#ddd2bf',
    'line-2': '#cbbda5',
    text: '#1e1912',
    dim: '#5d5244',
    muted: '#857865',
    gold: '#86672a',
    'gold-hi': '#6f5420',
    'on-gold': '#fffaf0',
    'gold-soft': 'rgba(134,103,42,.09)',
    warn: '#a4621c',
    'warn-soft': 'rgba(164,98,28,.10)',
    ok: '#3d7a4f',
    'ok-soft': 'rgba(61,122,79,.10)',
    'div-hi': '#b05f3f',
    'div-mid': '#857a69',
    'div-lo': '#4d7c96',
    'on-div': '#ffffff',
    scrim: 'rgba(30,25,18,.45)',
  },
} as const;

const toVars = (t: Record<string, string>) =>
  Object.fromEntries(Object.entries(t).map(([k, v]) => [`--${k}`, v]));

const colorNames = Object.keys(tokens.dark) as Array<keyof typeof tokens.dark>;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(colorNames.map((n) => [n, `var(--${n})`])),
      fontFamily: {
        // Self-hosted through @fontsource (see src/app/fonts.css); no Google requests.
        display: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['Jost', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      // Type scale from the prototype. Headings: Cormorant 500, line-height 1.1.
      fontSize: {
        h1: ['clamp(42px, 6.2vw, 76px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h2: ['clamp(32px, 4vw, 48px)', { lineHeight: '1.1' }],
        h3: ['27px', { lineHeight: '1.1' }],
        h4: ['21px', { lineHeight: '1.1' }],
        lede: ['19px', { lineHeight: '1.65' }],
        base: ['16.5px', { lineHeight: '1.6' }],
        small: ['14px', { lineHeight: '1.5' }],
        tiny: ['12.5px', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        eyebrow: '0.16em',
        brand: '0.2em',
      },
      maxWidth: {
        wrap: '1180px',
        lede: '60ch',
      },
      spacing: {
        gutter: '24px', // 16px under 560px (see .wrap in globals.css)
        section: '76px', // 52px under 620px
        'section-sm': '52px',
      },
      borderRadius: {
        DEFAULT: '3px',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': { colorScheme: 'dark', ...toVars(tokens.dark) },
        '@media (prefers-color-scheme: light)': {
          ':root:not([data-theme="dark"])': { colorScheme: 'light', ...toVars(tokens.light) },
        },
        ':root[data-theme="light"]': { colorScheme: 'light', ...toVars(tokens.light) },
      });
    }),
  ],
};

export default config;
