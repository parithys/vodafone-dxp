// Reads the design tokens straight from the CSS and the source, so tests (and a human running
// `node tests/tokenModel.mjs`) can see which tokens exist, which are used, and which have a dark value.
import fs from 'node:fs';
import path from 'node:path';

const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(APP, 'src');

const CSS_FILES = ['tokens.css', 'index.css', 'components/primitives/tooltip-tokens.css'].map((f) => path.join(SRC, f));

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(p)) out.push(p);
  }
  return out;
}

/** Top-level `selector { ... }` rules of a stylesheet, with brace matching (so @media / @layer contents are skipped). */
function rules(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const selector = css.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    out.push({ selector, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}

const decls = (body) => [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]);

export function loadTokens() {
  const light = new Map();
  const dark = new Map();
  const theme = new Map(); // @theme inline:  --color-foo -> var(--foo)
  for (const file of CSS_FILES) {
    for (const r of rules(fs.readFileSync(file, 'utf8'))) {
      if (r.selector === ':root') for (const [k, v] of decls(r.body)) light.set(k, v);
      else if (r.selector === ':root.dark') for (const [k, v] of decls(r.body)) dark.set(k, v);
      else if (r.selector.includes('@theme')) for (const [k, v] of decls(r.body)) theme.set(k, v);
    }
  }
  return { light, dark, theme };
}

export function loadUsage() {
  const files = walk(SRC);
  const text = files.map((f) => fs.readFileSync(f, 'utf8'));
  const blob = text.join('\n');
  const varRefs = new Set([...blob.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]));
  // Tokens read from script (getPropertyValue('--x')) or named in a string.
  const stringRefs = new Set([...blob.matchAll(/['"`](--[\w-]+)['"`]/g)].map((m) => m[1]));
  const classBlob = files.filter((f) => /\.tsx?$/.test(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  return { varRefs, stringRefs, classBlob };
}

/** Does any source file use the Tailwind utility that the @theme name generates (bg-foo, text-foo, rounded-foo...)? */
function utilityUsed(themeName, classBlob) {
  const kind = themeName.slice(2).split('-')[0];
  const short = themeName.slice(2).split('-').slice(1).join('-');
  if (themeName === '--spacing') return true;
  if (kind === 'font' && short.startsWith('weight-')) return new RegExp(`(?<![\\w-])font-${short.slice(7)}(?![\\w-])`).test(classBlob);
  const prefixes = { color: '(?:bg|text|border|ring|fill|stroke|from|to|via|outline|divide|decoration|placeholder|accent|caret|shadow|inset-shadow)', radius: 'rounded(?:-[a-z]{1,2})?', shadow: 'shadow', font: 'font' }[kind];
  if (!prefixes) return true;
  return new RegExp(`(?<![\\w-])(?:[a-z-]+:)*${prefixes}-${short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(classBlob);
}

/** Tokens with no reader. Iterates, because a token only used by another dead token is dead too. */
export function deadTokens() {
  const { light, dark, theme } = loadTokens();
  const { varRefs, stringRefs, classBlob } = loadUsage();
  const used = new Set([...varRefs, ...stringRefs]);
  for (const [themeName, value] of theme) {
    const m = value.match(/var\((--[\w-]+)\)/);
    if (m && utilityUsed(themeName, classBlob)) used.add(m[1]);
  }
  const all = new Set([...light.keys(), ...dark.keys()]);
  let dead = [...all].filter((n) => !used.has(n));
  // Values that reference another token keep that token alive only while the referrer is alive.
  for (let pass = 0; pass < 5; pass++) {
    const deadSet = new Set(dead);
    const stillUsed = new Set(used);
    for (const [name, value] of [...light, ...dark]) {
      if (deadSet.has(name)) continue;
      for (const m of value.matchAll(/var\((--[\w-]+)/g)) stillUsed.add(m[1]);
    }
    const next = [...all].filter((n) => !stillUsed.has(n) && !used.has(n));
    if (next.length === dead.length) break;
    dead = next;
  }
  return dead.sort();
}

const RAW_COLOUR = /^(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i;
/** Light-theme tokens that hold a raw colour value but have no dark value. (Aliases and color-mix() follow their sources.) */
export function colourTokensWithoutDark() {
  const { light, dark } = loadTokens();
  return [...light].filter(([k, v]) => RAW_COLOUR.test(v) && !dark.has(k)).map(([k]) => k).sort();
}

export function undefinedRefs() {
  const { light, dark, theme } = loadTokens();
  const { varRefs } = loadUsage();
  const defined = new Set([...light.keys(), ...dark.keys(), ...theme.keys()]);
  return [...varRefs].filter((n) => !defined.has(n) && !n.startsWith('--tw-') && !n.startsWith('--default-') && !n.startsWith('--tooltip-')).sort();
}

if (process.argv[1] && process.argv[1].endsWith('tokenModel.mjs')) {
  const { light, dark } = loadTokens();
  console.log(`tokens: ${light.size} light, ${dark.size} dark overrides`);
  console.log('dead:', deadTokens().join(' '));
  console.log('raw colour, no dark value:', colourTokensWithoutDark().join(' '));
  console.log('undefined references:', undefinedRefs().join(' ') || 'none');
}
