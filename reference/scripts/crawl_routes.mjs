#!/usr/bin/env node
/**
 * Screenshot every built route of the app, grouped by journey, plus each step of the guided wizards in flow order.
 *
 *   # terminal 1: the app            npm run dev            (http://localhost:5173)
 *   # terminal 2: from vfq-dxp-app   node reference/scripts/crawl_routes.mjs
 *
 * Output (OUTPUT_DIR, default reference/screenshots), light theme by default:
 *
 *   <journey>/NN-<SCR-id>-<screen-name>.png        a built route, in screen-number order
 *   <journey>/wizard-NN-<step-heading>.png          a wizard step, in the order the agent meets it
 *   workspace/NN-<page>.png                         the non-journey pages (dashboard, customer 360, tasks ...)
 *   manifest.json                                   what was captured, hashes, skipped routes and why
 *
 * <journey> is the src/modules/<folder> that registers the screen (mobile-postpaid, mobile-prepaid, mnp-fnp-porting ...),
 * so "mobile-postpaid" holds the New Connection journey. Several routes can resolve to the SAME page (the nine
 * mobile-postpaid wizard routes all open the New Connection wizard): the first is kept and the rest are listed in the
 * manifest as duplicates rather than saved nine times.
 *
 * Everything is read from the source, nothing is guessed: built screens from the registerScreen() calls in
 * src/modules/*\/screens/index.tsx, their paths and names from public/config/routes.json, the pages from router.tsx.
 *
 * Environment (all optional):
 *   BASE_URL      http://localhost:5173        STAFF_ID   VFQ12341        PASSWORD  Vodafone@123 (the demo password)
 *   OUTPUT_DIR    reference/screenshots        THEMES     light | dark | light,dark
 *   VIEWPORT      1440x900                     MODE       all | routes | wizards
 *   ONLY          comma list of journeys to capture, e.g. ONLY=mobile-postpaid,mobile-prepaid
 *   HEADED        1 to watch the browser     DRY  1 to list what would be captured, without a browser
 *
 * Why this deviates from "navigate by clicking the sidebar": the app keeps its sign-in in localStorage, so a
 * page.goto() after login re-hydrates the session and lands on the screen. Duplicate "loading" frames are caught by the
 * hash check instead (the manifest flags any two captures in a journey with identical pixels).
 *
 * NOT YET RUN: written in a session whose sandbox blocks local sockets (no browser could reach the dev server), so the
 * wizard driver in particular is a best effort - where it stalls it stops and says so in the manifest.
 */
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..', '..');
const env = (k, d) => process.env[k] ?? d;
const BASE = env('BASE_URL', 'http://localhost:5173');
const OUT = path.resolve(env('OUTPUT_DIR', path.join(APP, 'reference', 'screenshots')));
const STAFF = env('STAFF_ID', 'VFQ12341');
const PASSWORD = env('PASSWORD', 'Vodafone@123');
const THEMES = env('THEMES', 'light').split(',').map((s) => s.trim()).filter(Boolean);
const [VW, VH] = env('VIEWPORT', '1440x900').split('x').map(Number);
const MODE = env('MODE', 'all');
const ONLY = env('ONLY', '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_HEIGHT = 20000; // Chromium's PNG limit

// ---------------------------------------------------------------------------------------------- playwright
async function loadPlaywright() {
  // The repo already holds the browsers for its Playwright install (next to the mobile-postpaid capture scripts);
  // use them unless the caller points elsewhere, so no separate `npx playwright install` is needed.
  const local = path.join(APP, 'docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/.playwright-browsers');
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync(local)) process.env.PLAYWRIGHT_BROWSERS_PATH = local;
  try {
    return await import('playwright');
  } catch {
    // The repo already carries an install next to the mobile-postpaid capture scripts.
    const p = path.join(APP, 'docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/node_modules/playwright/index.mjs');
    if (fs.existsSync(p)) return await import(pathToFileURL(p).href);
    throw new Error('playwright not found. Run: npm i -D playwright && npx playwright install chromium');
  }
}

// ---------------------------------------------------------------------------------------------- discovery
const read = (p) => fs.readFileSync(p, 'utf8');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const routes = Object.fromEntries(JSON.parse(read(path.join(APP, 'public/config/routes.json'))).map((r) => [r.screenId, r]));

/** [{ journey, screenId, path, name }] for every screen a module registers (i.e. every BUILT screen), in screen order. */
function builtRoutes() {
  const out = [];
  const modulesDir = path.join(APP, 'src/modules');
  for (const journey of fs.readdirSync(modulesDir)) {
    const idx = path.join(modulesDir, journey, 'screens', 'index.tsx');
    if (!fs.existsSync(idx)) continue;
    const ids = [...new Set([...read(idx).matchAll(/'(SCR-\d+)'/g)].map((m) => m[1]))].sort();
    for (const id of ids) if (routes[id]) out.push({ journey, screenId: id, path: '/' + routes[id].path.replace(/^\//, ''), name: routes[id].screenName });
  }
  return out;
}

// Route params the pages need, with a record that exists in the mock data.
const SAMPLE = { customerId: 'CUST-1001', taskId: 'TASK-70007', billingProfileId: 'BILL-7001', moduleSlug: null, screenSlug: null, category: null };

/** The non-journey pages from router.tsx: static paths, and param paths filled from SAMPLE (skipped when no sample). */
function workspacePages() {
  const src = read(path.join(APP, 'src/router.tsx'));
  const pages = [];
  const skipped = [];
  for (const m of src.matchAll(/<Route path="([^"]+)"/g)) {
    let p = m[1];
    if (p === '*' || p === '/' || p.startsWith('/:moduleSlug')) continue;
    const params = [...p.matchAll(/:(\w+)/g)].map((x) => x[1]);
    if (params.some((k) => !SAMPLE[k])) {
      skipped.push({ path: p, reason: `needs a ${params.filter((k) => !SAMPLE[k]).join(', ')} that is not a fixed record` });
      continue;
    }
    for (const k of params) p = p.replace(':' + k, SAMPLE[k]);
    pages.push({ journey: 'workspace', screenId: '', path: p, name: p });
  }
  return { pages: [{ journey: 'workspace', screenId: '', path: '/', name: 'dashboard' }, ...pages], skipped };
}

// The guided wizards, each opened at its first step. Journey = the module folder; flow = how the screen id maps.
const WIZARDS = [
  { journey: 'mobile-postpaid', screenId: 'SCR-154', query: '' },
  { journey: 'mobile-prepaid', screenId: 'SCR-190', query: '' },
  { journey: 'mnp-fnp-porting', screenId: 'SCR-121', query: '?type=postpaid', tag: 'postpaid' },
  { journey: 'mnp-fnp-porting', screenId: 'SCR-121', query: '?type=prepaid', tag: 'prepaid' },
  { journey: 'fwa-5g-home', screenId: 'SCR-077', query: '' },
  { journey: 'fixed-line-fibre', screenId: 'SCR-043', query: '' },
  { journey: 'pre-to-post-migration', screenId: 'SCR-177', query: '' },
  { journey: 'identity-customer-management', screenId: 'SCR-151', query: '' },
];

// ---------------------------------------------------------------------------------------------- page helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const manifest = { generatedAt: new Date().toISOString(), base: BASE, themes: THEMES, shots: [], skipped: [], duplicates: [], stalled: [] };
const seen = new Map(); // `${theme}/${journey}` -> Map(hash -> file)

async function ready(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForSelector('main, h1, h2', { timeout: 15000 }).catch(() => {});
  await sleep(600);
}

async function setTheme(page, theme) {
  const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if ((theme === 'dark') !== dark) {
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await sleep(300);
  }
  const now = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if ((theme === 'dark') !== now) throw new Error(`theme ${theme} did not apply`);
}

async function login(page) {
  await page.goto(BASE);
  await page.waitForSelector('#staff-id', { timeout: 15000 });
  await page.fill('#staff-id', STAFF);
  await page.fill('#login-password', PASSWORD);
  await page.getByRole('button', { name: /^Sign In/ }).click();
  await page.waitForSelector('main', { timeout: 15000 });
}

const cleaned = new Set();

async function shot(page, theme, journey, file, meta) {
  const dir = path.join(OUT, theme === THEMES[0] && THEMES.length === 1 ? '' : theme, journey);
  // A run replaces its journeys' folders, so an earlier run's files never linger beside the new ones.
  if (!cleaned.has(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    cleaned.add(dir);
  }
  fs.mkdirSync(dir, { recursive: true });
  // Grow the viewport to the page's scroll height so a fixed-height shell with an inner scroller is captured whole.
  const h = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, ...[...document.querySelectorAll('main, [class*="overflow-y-auto"]')].map((e) => e.scrollHeight)));
  await page.setViewportSize({ width: VW, height: Math.min(Math.max(h, VH), MAX_HEIGHT) });
  await sleep(250);
  const buf = await page.screenshot({ fullPage: true });
  const text = await page.evaluate(() => (document.querySelector('main')?.innerText ?? '').replace(/\s+/g, ' ').trim());
  await page.setViewportSize({ width: VW, height: VH });
  const pixels = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  // Duplicates are judged on what the page SAYS (several routes open the same wizard step; animations and timers make the
  // pixels differ by a few values each time), falling back to the pixels when a page has no text.
  const hash = text ? crypto.createHash('sha1').update(text).digest('hex').slice(0, 12) : pixels;
  const key = `${theme}/${journey}`;
  const bucket = seen.get(key) ?? new Map();
  seen.set(key, bucket);
  if (bucket.has(hash)) {
    manifest.duplicates.push({ ...meta, theme, sameAs: bucket.get(hash) });
    return null;
  }
  const full = path.join(dir, file);
  fs.writeFileSync(full, buf);
  bucket.set(hash, path.relative(OUT, full));
  manifest.shots.push({ ...meta, theme, file: path.relative(OUT, full), hash, pixels });
  console.log('captured', path.relative(OUT, full));
  return full;
}

// ---------------------------------------------------------------------------------------------- routes
async function captureRoutes(page, theme, list) {
  const per = new Map();
  for (const r of list) {
    if (ONLY.length && !ONLY.includes(r.journey)) continue;
    const n = (per.get(r.journey) ?? 0) + 1;
    per.set(r.journey, n);
    try {
      await page.goto(BASE + r.path);
      await ready(page);
      const text = (await page.locator('main').first().innerText().catch(() => '')).trim();
      if (/Module not found|not yet built/i.test(text)) {
        manifest.skipped.push({ ...r, reason: 'screen not built / not found' });
        continue;
      }
      await shot(page, theme, r.journey, `${String(n).padStart(2, '0')}-${r.screenId ? r.screenId + '-' : ''}${slug(r.name)}.png`, r);
    } catch (e) {
      manifest.skipped.push({ ...r, reason: e.message.split('\n')[0] });
    }
  }
}

// ---------------------------------------------------------------------------------------------- wizards
async function heading(page) {
  return ((await page.locator('main h2').first().innerText().catch(() => '')) || (await page.locator('main h1').first().innerText().catch(() => ''))).trim();
}

/** One best-effort attempt to satisfy the current wizard step so Continue enables. Returns what it did. */
async function satisfy(page) {
  const did = [];
  // Identification: pick QID, scan, correct the number to a known customer, fetch from MOI.
  const main = page.locator('main');
  const qid = main.getByRole('button', { name: /Qatar ID \(QID\)/ });
  if (await qid.count()) {
    if (!(await main.getByRole('button', { name: /Retake scan|Fetch/ }).count())) {
      await qid.first().click();
      did.push('qid');
      await sleep(800);
    }
    const scan = main.getByRole('button', { name: /Initiate scan/ });
    if (await scan.count()) {
      await scan.first().click();
      did.push('scan');
      await sleep(2500);
    }
    const sample = '28456701234';
    // The scanned number sits in a read-only field a normal fill() refuses; set it the way the app's own scan does.
    const set = await page.evaluate((v) => {
      const i = [...document.querySelectorAll('main input')].find((x) => /^\d{8,}$/.test(x.value));
      if (!i) return false;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, v);
      i.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }, sample);
    if (set) {
      did.push('number');
      await sleep(400);
    }
    const fetch = main.getByRole('button', { name: /^Fetch/ });
    if (await fetch.count()) {
      await fetch.first().click();
      did.push('fetch');
      await sleep(3500);
    }
  }
  // Choose the first plan / offer / number card, and the first free option of an empty select.
  for (const label of [/Select plan/i, /^Select$/i]) {
    const b = main.getByRole('button', { name: label });
    if (await b.count()) {
      await b.first().click().catch(() => {});
      did.push('select');
      await sleep(600);
      break;
    }
  }
  const free = main.getByRole('tab', { name: /Free Numbers/ });
  if (await free.count()) {
    await free.first().click().catch(() => {});
    await sleep(600);
    const card = main.locator('[role=button], button').filter({ hasText: /\d{4}\s?\d{4}/ }).filter({ hasNotText: /Continue|Back/ });
    if (await card.count()) {
      await card.first().click().catch(() => {});
      did.push('number-card');
    }
  }
  for (const sel of await page.locator('main select').all()) {
    if (!(await sel.inputValue().catch(() => 'x'))) await sel.selectOption({ index: 1 }).catch(() => {});
  }
  return did;
}

async function driveWizard(page, theme, w) {
  const r = routes[w.screenId];
  if (!r) return manifest.skipped.push({ ...w, reason: 'screen id not in routes.json' });
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(BASE + '/' + r.path.replace(/^\//, '') + w.query);
  await ready(page);
  const startPath = new URL(page.url()).pathname;
  const folder = w.journey;
  const tag = w.tag ? `${w.tag}-` : '';
  let last = '';
  let stuck = 0;
  for (let step = 1; step <= 25; step += 1) {
    const h = await heading(page);
    await shot(page, theme, folder, `wizard-${tag}${String(step).padStart(2, '0')}-${slug(h || 'step')}.png`, { wizard: w.screenId, step, heading: h });
    if (/submitted|activation complete|order submitted/i.test(await page.locator('main').first().innerText().catch(() => ''))) return;
    await satisfy(page);
    // The step's forward action, inside <main> only (the header's "Next Customer" is not a wizard button).
    const main = page.locator('main');
    // New Connection's Product Selection: a product has to be chosen before Continue opens (the first, New Postpaid, unless
    // the entry point already chose one).
    const productRadios = main.locator('input[name="new-connection-product"]');
    if ((await productRadios.count()) && !(await productRadios.evaluateAll((els) => els.some((e) => e.checked)))) await productRadios.first().check().catch(() => {});
    // New Home Connection's products are icon cards (role=radio buttons) rather than radio inputs.
    const homeCards = main.locator('[role=radiogroup][aria-labelledby="product-choice"] button[role=radio]');
    if (!(await productRadios.count()) && (await homeCards.count()) && !(await homeCards.evaluateAll((els) => els.some((e) => e.getAttribute('aria-checked') === 'true')))) await homeCards.first().click().catch(() => {});
    let cont = main.getByRole('button', { name: /^(Continue|Next|Proceed|Submit|Finish|Save and Finish)/ }).last();
    if (!(await cont.count())) cont = main.getByRole('button', { name: /^New Postpaid$/ });
    if (!(await cont.count()) || !(await cont.isEnabled().catch(() => false))) {
      manifest.stalled.push({ wizard: w.screenId, journey: w.journey, step, heading: h, reason: 'no enabled forward button after the automatic fill' });
      return;
    }
    await cont.click();
    await sleep(1800);
    if (!new URL(page.url()).pathname.startsWith(startPath)) {
      manifest.stalled.push({ wizard: w.screenId, journey: w.journey, step, heading: h, reason: `left the wizard (now ${new URL(page.url()).pathname})` });
      return;
    }
    const next = await heading(page);
    stuck = next === last || next === h ? stuck + 1 : 0;
    last = h;
    if (stuck >= 2) {
      manifest.stalled.push({ wizard: w.screenId, journey: w.journey, step, heading: h, reason: 'the step did not change after Continue' });
      return;
    }
  }
}

// ---------------------------------------------------------------------------------------------- main
(async () => {
  if (env('DRY', '')) {
    const built = builtRoutes();
    const ws = workspacePages();
    const per = {};
    for (const r of built) per[r.journey] = (per[r.journey] ?? 0) + 1;
    console.log('built routes per journey:', per);
    console.log('workspace pages:', ws.pages.length, ' skipped (need a record):', ws.skipped.map((s) => s.path));
    console.log('wizards:', WIZARDS.map((w) => `${w.journey}${w.tag ? '/' + w.tag : ''}`));
    return;
  }
  const { chromium } = await loadPlaywright();
  // Inside a sandboxed shell (the Claude Code terminal) Chromium's own helper processes are killed at start-up
  // ("browser has been closed") and Playwright cannot reap it ("kill EPERM"). Single-process, no-zygote, no-GPU is what
  // works there (it is what the mobile-postpaid capture scripts' chrome-daemon.sh uses). It is also fine in a normal
  // terminal; set SAFE_FLAGS=0 to launch with Playwright's defaults instead.
  const sandboxArgs = env('SAFE_FLAGS', '1') === '0' ? [] : ['--no-sandbox', '--single-process', '--no-zygote', '--disable-gpu', '--in-process-gpu', '--disable-software-rasterizer'];
  const browser = await chromium.launch({ headless: !env('HEADED', ''), args: sandboxArgs });
  const page = await (await browser.newContext({ viewport: { width: VW, height: VH } })).newPage();
  await login(page);
  const built = builtRoutes();
  const ws = workspacePages();
  manifest.skipped.push(...ws.skipped.map((s) => ({ journey: 'workspace', ...s })));
  for (const theme of THEMES) {
    await setTheme(page, theme);
    if (MODE === 'all' || MODE === 'routes') {
      await captureRoutes(page, theme, built);
      await captureRoutes(page, theme, ws.pages);
    }
    if (MODE === 'all' || MODE === 'wizards') {
      for (const w of WIZARDS) {
        if (ONLY.length && !ONLY.includes(w.journey)) continue;
        await driveWizard(page, theme, w).catch((e) => manifest.stalled.push({ wizard: w.screenId, journey: w.journey, reason: e.message.split('\n')[0] }));
      }
    }
  }
  // Cross-theme drift: the same capture in light and dark must differ, or the theme did not apply.
  if (THEMES.length > 1) {
    const by = new Map();
    for (const s of manifest.shots) by.set(s.file.replace(/^(light|dark)\//, ''), [...(by.get(s.file.replace(/^(light|dark)\//, '')) ?? []), s]);
    for (const [name, list] of by) if (list.length > 1 && new Set(list.map((s) => s.hash)).size === 1) manifest.stalled.push({ name, reason: 'light and dark are identical - the theme did not apply' });
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close().catch(() => {}); // a sandboxed shell cannot kill the browser (EPERM); the files are already written
  console.log(`\n${manifest.shots.length} captured, ${manifest.duplicates.length} duplicates, ${manifest.skipped.length} skipped, ${manifest.stalled.length} stalled -> ${OUT}`);
})()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
