#!/usr/bin/env node
/**
 * Run every IMPLEMENTED journey end to end in the browser, in light mode, and screenshot each screen, step and
 * meaningful state along the way.
 *
 *   # terminal 1 (from vfq-dxp-app)   npm run dev
 *   # terminal 2 (from vfq-dxp-app)   node reference/scripts/crawl_journeys.mjs
 *
 * The journeys are the ones the app itself marks `status: 'available'` in src/navigation/journeyCatalogue.ts (read at
 * run time, so a journey added or retired there is picked up, nothing is hard-coded here). Each is entered at the route
 * the catalogue resolves for it (screenId -> routes.json, or its own path) - the same entry point a card on the Mobile /
 * Fibre & Home pages opens. Planned and partly-built journeys are not touched.
 *
 * Output (OUTPUT_DIR, default reference/journey-screenshots) - one folder per journey, numbered in the order the agent
 * meets the screens:
 *
 *   <journey-id>/01-start.png  02-customer-identification.png  03-identity-fetched.png  04-recommended-offers.png ...
 *   <journey-id>/journey.json        what was captured, and what could not be reached and why
 *   summary.md / summary.json        one row per journey: route, # screenshots, screens captured, anything unreachable
 *
 * A journey folder is wiped at the start of its run, so an earlier, partial run never lingers beside the new files.
 * Light mode only. A state is saved only when the page's TEXT differs from what was already saved in that journey, so
 * a screen is never saved twice (several routes open the same page; animations change pixels but not words).
 *
 * Where a journey has more than one implemented path they are all walked, in order: New Connection for a new customer
 * and for an existing customer opened from Customer 360; MNP Port-In as Postpaid and as Prepaid; Customer search for a
 * consumer and for a business account.
 *
 * Environment (all optional):
 *   BASE_URL http://localhost:5173   STAFF_ID VFQ12341   PASSWORD <the demo password>   VIEWPORT 1440x900
 *   OUTPUT_DIR reference/journey-screenshots     ONLY mob-new-connection,fib-new-home   HEADED 1   DRY 1 (list, no browser)
 *   SAFE_FLAGS 0   launch Chromium with Playwright's defaults instead of the single-process flags a sandboxed shell needs
 *
 * NOT RUN BY ITS AUTHOR: the session that wrote it could not open a browser against the app. The step handlers below are
 * built from the app's source and from the earlier mobile-postpaid capture scripts; where one does not match what the
 * screen does, the journey records the step as unreachable (with the reason) instead of silently stopping.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..', '..');
const env = (k, d) => process.env[k] ?? d;
const BASE = env('BASE_URL', 'http://localhost:5173');
const OUT = path.resolve(env('OUTPUT_DIR', path.join(APP, 'reference', 'journey-screenshots')));
const STAFF = env('STAFF_ID', 'VFQ12341');
const PASSWORD = env('PASSWORD', 'Vodafone@123');
const [VW, VH] = env('VIEWPORT', '1440x900').split('x').map(Number);
const ONLY = env('ONLY', '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_HEIGHT = 20000;
const read = (p) => fs.readFileSync(p, 'utf8');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56) || 'step';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------------------------- discovery
const routes = Object.fromEntries(JSON.parse(read(path.join(APP, 'public/config/routes.json'))).map((r) => [r.screenId, r]));

/** Every `status: 'available'` journey in the catalogue, with the route its card opens. */
function availableJourneys() {
  const src = read(path.join(APP, 'src/navigation/journeyCatalogue.ts'));
  const out = [];
  for (const m of src.matchAll(/\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)'[^}]*?status:\s*'available'([^}]*)\}/g)) {
    const [, id, title, rest] = m;
    const screenId = /screenId:\s*'([^']+)'/.exec(rest)?.[1];
    const direct = /path:\s*'([^']+)'/.exec(rest)?.[1];
    const route = direct ?? (screenId && routes[screenId] ? '/' + routes[screenId].path.replace(/^\//, '') : undefined);
    out.push({ id, title, screenId, route });
  }
  return out;
}

// A few records the flows need, taken from the mock data rather than invented.
const mock = (n) => JSON.parse(read(path.join(APP, 'public/mock-data', n + '.json')));
const SAMPLE = {
  qid: '28456701234', // CUST-1001, an existing customer: the demo scanner's number
  customerId: 'CUST-1001',
  businessId: 'ENT-ACC-7701',
  email: 'journey.capture@example.qa',
  altPhone: '55667766',
  serial: (mock('sims').find((s) => /available|in stock/i.test(s.stockStatus ?? '')) ?? mock('sims')[0])?.simSerial ?? '8974412009900000001',
};

// ---------------------------------------------------------------------------------------------- playwright
async function loadPlaywright() {
  const local = path.join(APP, 'docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/.playwright-browsers');
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync(local)) process.env.PLAYWRIGHT_BROWSERS_PATH = local;
  try {
    return await import('playwright');
  } catch {
    const p = path.join(APP, 'docs/figma-make-spec/journeys/mobile-postpaid-activation/_data/node_modules/playwright/index.mjs');
    if (fs.existsSync(p)) return await import(pathToFileURL(p).href);
    throw new Error('playwright not found. Run: npm i -D playwright && npx playwright install chromium');
  }
}

// ---------------------------------------------------------------------------------------------- one journey's recorder
class Recorder {
  constructor(page, journey) {
    this.page = page;
    this.j = journey;
    this.dir = path.join(OUT, journey.id);
    fs.rmSync(this.dir, { recursive: true, force: true });
    fs.mkdirSync(this.dir, { recursive: true });
    this.n = 0;
    this.seen = new Set();
    this.shots = [];
    this.unreachable = [];
  }

  async text() {
    return this.page.evaluate(() => {
      const open = [...document.querySelectorAll('[role=dialog]')].map((d) => d.innerText).join(' ');
      return ((document.querySelector('main')?.innerText ?? document.body.innerText) + ' ' + open).replace(/\s+/g, ' ').trim();
    });
  }

  /** Save the page as it is now, unless its words were already saved in this journey. `force` skips that check. */
  async snap(label, { force = false } = {}) {
    const { page } = this;
    await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
    await sleep(500);
    const text = await this.text();
    const key = crypto.createHash('sha1').update(text || label).digest('hex');
    if (!force && this.seen.has(key)) return false;
    this.seen.add(key);
    const h = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, ...[...document.querySelectorAll('main, [class*="overflow-y-auto"]')].map((e) => e.scrollHeight)));
    await page.setViewportSize({ width: VW, height: Math.min(Math.max(h, VH), MAX_HEIGHT) });
    await sleep(200);
    this.n += 1;
    const file = `${String(this.n).padStart(2, '0')}-${slug(label)}.png`;
    await page.screenshot({ path: path.join(this.dir, file), fullPage: true });
    await page.setViewportSize({ width: VW, height: VH });
    this.shots.push({ file, label, url: new URL(page.url()).pathname });
    console.log(`  ${this.j.id}/${file}`);
    return true;
  }

  miss(step, reason) {
    this.unreachable.push({ step, reason });
    console.log(`  ! ${this.j.id}: ${step} - ${reason}`);
  }
}

// ---------------------------------------------------------------------------------------------- page helpers
async function heading(page) {
  const h = (await page.locator('main h2').first().innerText({ timeout: 1500 }).catch(() => '')) || (await page.locator('main h1').first().innerText({ timeout: 1500 }).catch(() => ''));
  return h.trim();
}
const visible = async (loc) => (await loc.count()) > 0 && (await loc.first().isVisible().catch(() => false));
const click = async (loc, wait = 900) => {
  await loc.first().click({ timeout: 6000 });
  await sleep(wait);
};
async function setValue(page, selector, value) {
  return page.evaluate(
    ([sel, v]) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    },
    [selector, value]
  );
}

async function login(page) {
  await page.goto(BASE);
  await page.waitForSelector('#staff-id', { timeout: 20000 });
  await page.fill('#staff-id', STAFF);
  await page.fill('#login-password', PASSWORD);
  await page.getByRole('button', { name: /^Sign In/ }).click();
  await page.waitForSelector('main', { timeout: 20000 });
  const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click(); // light mode only
  if (await page.evaluate(() => document.documentElement.classList.contains('dark'))) throw new Error('could not switch to light mode');
}

// ---------------------------------------------------------------------------------------------- wizard step handlers
// Each handler looks at the CURRENT step and does what an agent does to satisfy it, saving a screenshot of every state
// that matters (identity fetched, plan chosen, signature pad open, payment handed off ...). They are tried in order on
// every step, so one wizard definition covers all of them; a handler that finds nothing to do returns false.
const HANDLERS = [
  // Customer Identification: choose Qatar ID, scan, correct the number to a known customer, fetch from MOI.
  async ({ page, rec, main }) => {
    const qid = main.getByRole('button', { name: /Qatar ID \(QID\)/ });
    if (!(await visible(qid)) || (await visible(main.getByRole('button', { name: /Retake scan|^Fetch/ })))) return false;
    await click(qid, 900);
    await rec.snap('qid selected');
    const scan = main.getByRole('button', { name: /Initiate scan/ });
    if (await visible(scan)) {
      await click(scan, 2800);
      await rec.snap('document scanned');
    }
    const moved = await page.evaluate((v) => {
      const i = [...document.querySelectorAll('main input')].find((x) => /^\d{8,}$/.test(x.value));
      if (!i) return false;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, v);
      i.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }, SAMPLE.qid);
    if (moved) await sleep(400);
    const fetch = main.getByRole('button', { name: /^Fetch/ });
    if (await visible(fetch)) {
      await click(fetch, 4000);
      await rec.snap('identity fetched from moi');
    }
    return true;
  },
  // Contact details that ride with identification.
  async ({ page, rec, main }) => {
    const email = main.getByPlaceholder('customer@example.qa');
    if (!(await visible(email)) || (await email.first().inputValue().catch(() => 'x'))) return false;
    await email.first().fill(SAMPLE.email);
    const alt = main.getByPlaceholder('5566 7766');
    if (await visible(alt)) await alt.first().fill(SAMPLE.altPhone).catch(() => {});
    await sleep(500);
    await rec.snap('contact details entered');
    return true;
  },
  // Eligibility: open the checks report if the step offers it.
  async ({ page, rec }) => {
    const link = page.getByText('View eligibility checks', { exact: false });
    if (!(await visible(link))) return false;
    await click(link, 600);
    await rec.snap('eligibility checks');
    await page.keyboard.press('Escape');
    await sleep(300);
    return true;
  },
  // Plans, offers and discounts: choose the first selectable one.
  async ({ page, rec, main }) => {
    const sel = main.getByRole('button', { name: /^Select plan$|^Select pack$|^Select offer$/i });
    if (!(await visible(sel))) return false;
    await click(sel, 900);
    await rec.snap('plan selected');
    return true;
  },
  // Billing profile: an existing account if one is listed.
  async ({ page, rec, main }) => {
    const acc = main.getByText('Account ending', { exact: false });
    if (!(await visible(acc))) return false;
    await click(acc, 500);
    await rec.snap('billing account selected');
    return true;
  },
  // Saved addresses (FWA): the first address on the account.
  async ({ page, rec, main }) => {
    const card = main.locator('button').filter({ hasText: /Street|Zone|Building/ }).filter({ hasNotText: /Continue|Back|Skip|Add/ });
    if (!(await visible(card)) || !(await visible(main.getByText(/Select an address|addresses on/i)))) return false;
    await click(card, 600);
    await rec.snap('address selected');
    return true;
  },
  // Number selection: the Free tab, then the first number.
  async ({ page, rec, main }) => {
    const tab = main.getByRole('tab', { name: /Free Numbers/ });
    if (!(await visible(tab))) return false;
    await click(tab, 700);
    const card = main.locator('[role=button], button').filter({ hasText: /\d{4}\s?\d{4}/ }).filter({ hasNotText: /Continue|Back|Refresh|Search/ });
    if (await visible(card)) {
      await click(card, 700);
      await rec.snap('number selected');
    }
    return true;
  },
  // SIM: eSIM (needs no inventory), or a serial from the mock data when only a serial field is offered.
  async ({ page, rec, main }) => {
    const esim = main.getByRole('button', { name: /^Select eSIM$/ });
    if (await visible(esim)) {
      await rec.snap('sim type options');
      await click(esim, 1600);
      await rec.snap('esim issued');
      return true;
    }
    const serial = main.locator('input[placeholder*="erial" i]').first();
    if (await serial.count() && !(await serial.inputValue().catch(() => 'x'))) {
      await serial.fill(SAMPLE.serial);
      await serial.press('Enter').catch(() => {});
      await sleep(1500);
      await rec.snap('sim serial entered');
      return true;
    }
    return false;
  },
  // Appointment: first cluster, first date, first time slot.
  async ({ page, rec, main }) => {
    const sel = main.locator('select').first();
    if (!(await sel.count()) || !(await visible(main.getByText(/appointment|cluster/i)))) return false;
    if (!(await sel.inputValue().catch(() => 'x'))) await sel.selectOption({ index: 1 }).catch(() => {});
    await sleep(500);
    for (const re of [/^\d{1,2}$|\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/, /\d{1,2}:\d{2}/]) {
      const b = main.locator('button').filter({ hasText: re }).filter({ hasNotText: /Continue|Back/ });
      if (await visible(b)) await click(b, 400);
    }
    await rec.snap('appointment booked');
    return true;
  },
  // CAF & Signature: tick the terms, open the pad, draw, done.
  async ({ page, rec, main }) => {
    for (const box of await main.locator('input[type=checkbox]').all()) if (!(await box.isChecked().catch(() => true))) await box.check().catch(() => {});
    const sign = page.getByRole('button', { name: /Please Sign|Sign here|^Sign$/i });
    if (!(await visible(sign))) return false;
    await rec.snap('caf awaiting signature');
    await click(sign, 600);
    await rec.snap('signature pad open');
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox().catch(() => null);
    if (box) {
      await page.mouse.move(box.x + 20, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2 - 20, { steps: 10 });
      await page.mouse.up();
      await sleep(300);
      await rec.snap('signature drawn');
    }
    const done = page.getByRole('button', { name: /^Done$/ });
    if (await visible(done)) await click(done, 1000);
    await rec.snap('caf signed');
    return true;
  },
  // Payment: hand off to WinCash, then report it done.
  async ({ page, rec, main }) => {
    const go = main.getByRole('button', { name: /Continue in WinCash/ });
    if (!(await visible(go))) return false;
    await rec.snap('payment due');
    await click(go, 700);
    await rec.snap('handed off to wincash');
    const paid = page.getByRole('button', { name: /Payment completed in WinCash/ });
    if (await visible(paid)) await click(paid, 2800);
    return true;
  },
  // Free-text steps (activity comments, donor details): fill what is empty.
  async ({ page, rec, main }) => {
    let did = false;
    for (const ta of await main.locator('textarea').all()) {
      if (!(await ta.inputValue().catch(() => 'x'))) {
        await ta.fill('Captured by the journey screenshot run.').catch(() => {});
        did = true;
      }
    }
    for (const input of await main.locator('input[required], input[aria-required=true]').all()) {
      if (!(await input.inputValue().catch(() => 'x')) && (await input.isEditable().catch(() => false))) {
        const hint = `${(await input.getAttribute('placeholder')) ?? ''} ${(await input.getAttribute('aria-label')) ?? ''}`.toLowerCase();
        await input.fill(/mail/.test(hint) ? SAMPLE.email : /phone|mobile|msisdn|number/.test(hint) ? SAMPLE.altPhone : 'Sample').catch(() => {});
        did = true;
      }
    }
    if (did) {
      await sleep(400);
      await rec.snap('details entered');
    }
    return did;
  },
];

const FORWARD = /^(Continue|Next|Proceed|Submit|Confirm|Finish|Save and Finish|Request Approval|Continue Prepaid)/;
const DONE = /order submitted|submitted for approval|activation complete|order complete|activity logged|thank you/i;

/** Drive a guided wizard from the page it is on to its last screen. */
async function driveWizard(rec, startLabel, { force = false } = {}) {
  const { page } = rec;
  const startPath = new URL(page.url()).pathname;
  await rec.snap(startLabel, { force: force || rec.n === 0 });
  let lastHeading = '';
  let same = 0;
  for (let step = 0; step < 30; step += 1) {
    const h = await heading(page);
    await rec.snap(h || 'step');
    if (DONE.test(await rec.text())) return;
    const main = page.locator('main');
    const ctx = { page, rec, main };
    for (const handler of HANDLERS) {
      try {
        await handler(ctx);
      } catch (e) {
        rec.miss(`${h || 'step'}: a handler failed`, e.message.split('\n')[0]);
      }
    }
    // The step's forward action, inside <main> only.
    // New Connection's Product Selection: a product has to be chosen before Continue opens (the first, New Postpaid, unless
    // the entry point already chose one).
    const productRadios = main.locator('input[name="new-connection-product"]');
    if ((await productRadios.count()) && !(await productRadios.evaluateAll((els) => els.some((e) => e.checked)))) await productRadios.first().check().catch(() => {});
    // New Home Connection's products are icon cards (role=radio buttons) rather than radio inputs.
    const homeCards = main.locator('[role=radiogroup][aria-labelledby="product-choice"] button[role=radio]');
    if (!(await productRadios.count()) && (await homeCards.count()) && !(await homeCards.evaluateAll((els) => els.some((e) => e.getAttribute('aria-checked') === 'true')))) await homeCards.first().click().catch(() => {});
    let next = main.getByRole('button', { name: FORWARD }).last();
    if (!(await next.count())) next = main.getByRole('button', { name: /^New Postpaid$/ });
    if (!(await next.count())) {
      if (!DONE.test(await rec.text())) rec.miss(h || 'step', 'no forward button on this screen');
      return;
    }
    if (!(await next.isEnabled().catch(() => false))) {
      rec.miss(h || 'step', 'the forward button stayed disabled after the automatic fill');
      return;
    }
    await next.click({ timeout: 6000 }).catch((e) => rec.miss(h || 'step', 'forward click failed: ' + e.message.split('\n')[0]));
    await sleep(1800);
    // A blocking dialog (approval routing, validation) is itself a meaningful state; save it, then dismiss it.
    if (await visible(page.locator('[role=dialog]'))) {
      await rec.snap(`${h || 'step'} dialog`);
      const ok = page.locator('[role=dialog]').getByRole('button', { name: /^(Confirm|Continue|Yes|OK|Proceed)/ });
      if (await visible(ok)) await click(ok, 1500);
    }
    if (!new URL(page.url()).pathname.startsWith(startPath)) {
      await rec.snap('after the journey');
      return;
    }
    const now = await heading(page);
    same = now === lastHeading || now === h ? same + 1 : 0;
    lastHeading = h;
    if (same >= 3) {
      rec.miss(h || 'step', 'the step did not change after pressing the forward button');
      return;
    }
  }
}

// ---------------------------------------------------------------------------------------------- non-wizard flows
/** Save the page, then every tab of it, then each drawer a primary action opens. */
async function explore(rec, label) {
  const { page } = rec;
  await rec.snap(label);
  const tabs = page.locator('main [role=tab]');
  const n = await tabs.count();
  for (let i = 0; i < n; i += 1) {
    const t = tabs.nth(i);
    const name = ((await t.innerText().catch(() => '')) || `tab ${i + 1}`).trim().split('\n')[0];
    await t.click({ timeout: 4000 }).catch(() => {});
    await sleep(900);
    await rec.snap(`${label} ${name}`);
  }
}

async function searchFlow(rec) {
  const { page } = rec;
  const main = page.locator('main');
  for (const [q, what] of [[SAMPLE.customerId, 'customer'], [SAMPLE.businessId, 'business']]) {
    await page.goto(BASE + rec.j.route);
    await sleep(900);
    await rec.snap(what === 'customer' ? 'customer search' : 'customer search again');
    const box = main.locator('input[type=search], input[aria-label*="search" i], input').first();
    await box.fill(q);
    await box.press('Enter');
    await sleep(1800);
    await rec.snap(`search results ${q}`);
    const result = main.locator('button').filter({ hasText: q }).first();
    if (!(await result.count())) {
      rec.miss(`open ${q}`, 'the search returned no result row to open');
      continue;
    }
    await result.click();
    await sleep(2500);
    await explore(rec, what === 'customer' ? 'customer 360' : 'business 360');
  }
}

async function ticketFlow(rec) {
  const { page } = rec;
  await explore(rec, 'tickets dashboard');
  const create = page.getByRole('button', { name: /Create Ticket|New Ticket/i });
  if (!(await visible(create))) return rec.miss('create ticket', 'no Create Ticket button on the dashboard');
  await click(create, 1200);
  await rec.snap('create ticket');
  const want = /connect|fault|network/i.test(rec.j.title) ? /connect|fault|network/i : /complaint/i.test(rec.j.title) ? /complaint/i : null;
  const dlg = page.locator('[role=dialog]').first();
  const scope = (await dlg.count()) ? dlg : page.locator('main');
  const idBox = scope.locator('input[placeholder*="CUST"]').first();
  if (await idBox.count()) await idBox.fill(SAMPLE.customerId).catch(() => {});
  for (const sel of await scope.locator('select').all()) {
    const opts = await sel.locator('option').allInnerTexts();
    const idx = want ? opts.findIndex((o) => want.test(o)) : -1;
    await sel.selectOption({ index: idx > 0 ? idx : Math.min(1, opts.length - 1) }).catch(() => {});
  }
  for (const ta of await scope.locator('textarea').all()) await ta.fill('Journey screenshot capture').catch(() => {});
  await sleep(600);
  await rec.snap('create ticket filled');
  const submit = scope.getByRole('button', { name: /^(Create|Submit|Save|Raise)/ }).last();
  if (await visible(submit)) {
    if (await submit.isEnabled().catch(() => false)) {
      await click(submit, 2000);
      await rec.snap('ticket created');
    } else rec.miss('submit ticket', 'the submit button stayed disabled after the automatic fill');
  }
}

async function trackFlow(rec) {
  const { page } = rec;
  await explore(rec, 'tickets list');
  const row = page.locator('main tbody tr, main [role=row]').nth(1);
  if (!(await row.count())) return rec.miss('open a ticket', 'no ticket row to open');
  await row.click();
  await sleep(2000);
  await explore(rec, 'ticket detail');
}

async function choiceFlow(rec) {
  // MNP process choice: Postpaid and Prepaid are two implemented paths, each into the port-in wizard.
  const { page } = rec;
  await rec.snap('process choice');
  for (const kind of ['Postpaid', 'Prepaid']) {
    await page.goto(BASE + rec.j.route);
    await sleep(900);
    const pick = page.getByRole('button', { name: new RegExp(`^${kind}`, 'i') }).first();
    if (!(await pick.count())) {
      rec.miss(`${kind} path`, `no ${kind} option on the process-choice screen`);
      continue;
    }
    await click(pick, 600);
    const go = page.getByRole('button', { name: /^(Continue|Proceed|Start)/ }).first();
    if (await visible(go)) await click(go, 1800);
    await driveWizard(rec, `${kind.toLowerCase()} port-in`);
  }
}

// ---------------------------------------------------------------------------------------------- per journey
async function runJourney(page, j) {
  const rec = new Recorder(page, j);
  console.log(`\n${j.id}  ${j.title}  ->  ${j.route}`);
  if (!j.route) {
    rec.miss('entry', 'the catalogue gives this journey no route');
    return rec;
  }
  try {
    await page.evaluate(() => sessionStorage.clear());
    await page.goto(BASE + j.route);
    await page.waitForSelector('main', { timeout: 15000 });
    await sleep(1200);
    if (j.route === '/customer-search') await searchFlow(rec);
    else if (j.screenId === 'SCR-211') await ticketFlow(rec);
    else if (j.screenId === 'SCR-029') await trackFlow(rec);
    else if (j.screenId === 'SCR-120') await choiceFlow(rec);
    else if (j.screenId === 'SCR-093') await explore(rec, 'serial number check');
    else if (j.screenId === 'SCR-121') {
      // The port-in wizard has two implemented paths, chosen by ?type= (the process-choice screen sets it).
      for (const kind of ['postpaid', 'prepaid']) {
        await page.evaluate(() => sessionStorage.clear());
        await page.goto(BASE + j.route + `?type=${kind}`);
        await sleep(1500);
        await driveWizard(rec, `${kind} port-in start`, { force: true });
      }
    }
    else {
      await driveWizard(rec, 'start');
      // New Connection has a second implemented path: the existing customer, opened from Customer 360.
      if (j.id === 'mob-new-connection') {
        await page.evaluate(() => sessionStorage.clear());
        await page.goto(BASE + `/mobile/start-connection/existing/${SAMPLE.customerId}`);
        await sleep(1500);
        await driveWizard(rec, 'existing customer start');
      }
    }
  } catch (e) {
    rec.miss('journey', e.message.split('\n')[0]);
  }
  if (rec.n === 0) rec.miss('journey', 'nothing could be captured');
  fs.writeFileSync(path.join(rec.dir, 'journey.json'), JSON.stringify({ journey: j, shots: rec.shots, unreachable: rec.unreachable }, null, 2));
  return rec;
}

// ---------------------------------------------------------------------------------------------- main
(async () => {
  const all = availableJourneys();
  const todo = all.filter((j) => !ONLY.length || ONLY.includes(j.id));
  if (env('DRY', '')) {
    console.log(`${all.length} available journeys in the catalogue:`);
    for (const j of all) console.log(`  ${j.id.padEnd(26)} ${j.title.padEnd(28)} ${j.route ?? '(no route)'}`);
    return;
  }
  const { chromium } = await loadPlaywright();
  // Inside a sandboxed shell (the Claude Code terminal) Chromium's helper processes are killed at start-up; the
  // single-process, no-zygote, no-GPU flags are what work there, and they are fine in a normal terminal too.
  const args = env('SAFE_FLAGS', '1') === '0' ? [] : ['--no-sandbox', '--single-process', '--no-zygote', '--disable-gpu', '--in-process-gpu', '--disable-software-rasterizer'];
  const browser = await chromium.launch({ headless: !env('HEADED', ''), args });
  const page = await (await browser.newContext({ viewport: { width: VW, height: VH } })).newPage();
  page.setDefaultTimeout(8000);
  await login(page);
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];
  for (const j of todo) {
    const rec = await runJourney(page, j);
    rows.push({ id: j.id, title: j.title, route: j.route ?? '-', count: rec.n, screens: rec.shots.map((s) => s.file.replace(/^\d+-|\.png$/g, '')), unreachable: rec.unreachable });
  }
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(rows, null, 2));
  const md = [
    '# Journey screenshots (light mode)',
    '',
    `${rows.length} journeys, ${rows.reduce((a, r) => a + r.count, 0)} screenshots, generated ${new Date().toISOString()}.`,
    '',
    '| Journey | Route | Screenshots | Screens / steps captured | Not reached (reason) |',
    '|---|---|---|---|---|',
    ...rows.map((r) => `| ${r.title} (\`${r.id}\`) | \`${r.route}\` | ${r.count} | ${r.screens.join(', ') || '-'} | ${r.unreachable.map((u) => `${u.step}: ${u.reason}`).join('; ') || '-'} |`),
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'summary.md'), md + '\n');
  console.log('\n' + md.split('\n').slice(0, 4).join('\n'));
  console.log(`\nWrote ${OUT}/summary.md`);
  await browser.close().catch(() => {}); // a sandboxed shell cannot kill the browser (EPERM); the files are already written
})()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
