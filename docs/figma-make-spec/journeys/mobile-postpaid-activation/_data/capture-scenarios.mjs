// Phase 13 screenshot capture — scenario branches beyond the happy path.
// Dev tooling only, scoped to OUTPUT_DIR. Does not touch app source.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const OUT = '/Users/parithimalsaravanan/claude-projects/vfq/vfq-dxp-app/docs/figma-make-spec/journeys/mobile-postpaid-activation/screenshots';

async function shot(page, id, note = '') {
  await page.screenshot({ path: `${OUT}/${id}_1440x900.png`, fullPage: true });
  console.log(`captured ${id} ${note}`);
}

async function safe(label, fn) {
  try {
    await fn();
    console.log(`ok: ${label}`);
  } catch (e) {
    console.error(`STEP FAILED: ${label}:`, e.message.split('\n')[0]);
  }
}

async function clickContinue(page) {
  const btn = page.locator('button', { hasText: 'Continue' }).first();
  await btn.waitFor({ state: 'visible', timeout: 10000 });
  await btn.click({ timeout: 10000 });
}

async function login(page) {
  await page.goto(BASE);
  await page.waitForSelector('#staff-id', { timeout: 30000 });
  await page.fill('#staff-id', 'VFQ12341');
  await page.fill('#login-password', 'Vodafone@123');
  await page.locator('button', { hasText: 'Sign in with SSO' }).click();
  await page.waitForSelector('text=Welcome back', { timeout: 30000 });
}

async function toJourney(page) {
  // A hard page.goto() straight to the deep route doesn't reliably bring up
  // the wizard in this environment (confirmed by direct debugging - it hangs
  // waiting for "Step 1 of 9"); a real client-side navigation, the same way
  // capture-happy-path.mjs reaches it (clicking the dashboard's quick
  // action from wherever login() left off), does. page.goto() also has no
  // `state` option - React Router's location.state can only be set via
  // client-side navigation anyway, so the startFresh intent from the removed
  // goto call was never actually reaching the app.
  const quickAction = page.locator('button', { hasText: 'New Postpaid Connection' });
  await quickAction.first().click();
  await page.waitForSelector('text=Step 1 of 9', { timeout: 30000 });
  await page.waitForTimeout(500);
}

// Resolves a specific identity-documents record by documentNumber, via
// whichever of the scan simulation's two outcomes actually occurs. Confirmed
// by direct DOM inspection across multiple runs: the simulated scan is NOT
// deterministic - it either (a) "successfully reads" a document and
// auto-fills #qid-number-input as a READ-ONLY resolved value (which one
// depends on which IDs are unexpired for the searched types - with
// autoDetectIdType on, QID and Diplomatic ID are searched together, so a
// success always resolves the same fixed candidate, in practice CUST-1001),
// or (b) reports "CARD COULD NOT BE READ" after exhausting the 2-attempt
// budget, at which point #qid-number-input is a genuinely empty, EDITABLE
// field with a "Fetch" button - this is the real manual-entry path, and
// IdLookupStep.tsx's own lookup matches by documentNumber regardless of
// which ID-type button is selected, so any target document can be reached
// here once this state is hit. Because which outcome occurs is random, this
// retries the whole Contact step (clearing sessionStorage + reloading) up to
// maxRestarts times until either outcome resolves to the target number.
async function resolveIdentity(page, targetIdNumber, { maxRestarts = 5 } = {}) {
  for (let restart = 0; restart < maxRestarts; restart++) {
    await page.locator('button', { hasText: 'Qatar ID (QID)' }).click();
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(1500);
      const manualField = page.locator('#qid-number-input');
      if (await manualField.count()) {
        const isReadonly = await manualField.getAttribute('readonly');
        if (isReadonly === null) {
          // Genuinely empty, editable manual-entry field - type our target.
          await manualField.fill(targetIdNumber);
          await page.locator('button', { hasText: 'Fetch' }).click();
          await page.waitForTimeout(1500);
          return true;
        }
        const resolvedValue = await manualField.inputValue();
        if (resolvedValue === targetIdNumber) return true; // scan happened to match
        break; // locked to the wrong customer this attempt - restart
      }
      const retake = page.locator('button', { hasText: 'Retake scan' });
      if (await retake.count()) await retake.first().click();
    }
    if (restart < maxRestarts - 1) {
      await page.evaluate(() => sessionStorage.clear());
      await page.reload();
      await page.waitForSelector('button:has-text("New Postpaid Connection")', { timeout: 15000 }).catch(() => {});
      await page.locator('button', { hasText: 'New Postpaid Connection' }).first().click().catch(() => {});
      await page.waitForSelector('text=Step 1 of 9', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(500);
    }
  }
  return false;
}

// Convenience wrapper for the happy-path customer, reachable via either
// scan outcome (success resolves straight to it; failure lands on manual
// entry, which we then fill with the same number) - see resolveIdentity.
async function resolveCust1001(page) {
  await resolveIdentity(page, '28456701234');
}

// Run one scenario per process invocation: node capture-scenarios.mjs <A-G|all> [port]
// Each scenario opening then closing its own page against a shared daemon
// reliably breaks the CDP session for the NEXT browser.newPage() call in
// this sandbox (confirmed by direct testing - not zero-tabs, not a
// cross-script issue, just repeated open/close cycles on one connection).
// One scenario per fresh process+daemon, mirroring capture-happy-path.mjs's
// single continuous page for its whole run, is the pattern that's actually
// reliable here.
const SCENARIO = process.argv[2] || 'all';
const PORT = process.argv[3] || '9333';

(async () => {
  // See capture-happy-path.mjs's note: attach to the manually-started
  // chrome-headless-shell daemon over CDP rather than launching our own.
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);

  // --- Scenario A: hard-stop (expired Diplomatic ID + security blacklist), CUST-1006 ---
  if (SCENARIO === 'A' || SCENARIO === 'all') await safe('SCN hard-stop CUST-1006', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    const ok = await resolveIdentity(page, 'DIP-QA-004521');
    if (!ok) throw new Error('could not reach CUST-1006 within retry budget');
    await shot(page, 'MPA-SCR-01-ST05', 'expired ID + security blacklist compound hard-stop');
    await page.close();
  });

  // --- Scenario B: soft-stop (collections blacklist), CUST-1004 / 29011122233 ---
  if (SCENARIO === 'B' || SCENARIO === 'all') await safe('SCN soft-stop CUST-1004', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    const ok = await resolveIdentity(page, '29011122233');
    if (!ok) throw new Error('could not reach CUST-1004 within retry budget');
    await page.waitForTimeout(1000);
    await shot(page, 'MPA-SCR-01-ST06', 'collections soft-stop with Switch to Prepaid button');
    await page.close();
  });

  // --- Scenario C: approval-routing (under-18), CUST-9001 / P1234567 ---
  if (SCENARIO === 'C' || SCENARIO === 'all') await safe('SCN approval-routing CUST-9001', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    const ok = await resolveIdentity(page, 'P1234567');
    if (!ok) throw new Error('could not reach CUST-9001 within retry budget');
    await page.waitForTimeout(1000);
    await shot(page, 'MPA-SCR-01-ST07', 'under-18 approval-routing with Proceed to Approval button');
    await page.close();
  });

  // --- Scenario D: validation errors (malformed email / alt phone) ---
  if (SCENARIO === 'D' || SCENARIO === 'all') await safe('SCN validation errors', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    await resolveCust1001(page);
    await page.waitForTimeout(1000);
    const emailInput = page.getByPlaceholder('customer@example.qa');
    if (await emailInput.count()) {
      await emailInput.fill('not-an-email');
      await emailInput.blur();
    }
    const altPhoneInput = page.getByPlaceholder('5566 7766');
    if (await altPhoneInput.count()) {
      await altPhoneInput.fill('123');
      await altPhoneInput.blur();
    }
    await page.waitForTimeout(500);
    await shot(page, 'MPA-SCR-01-ST08', 'malformed email validation error');
    await shot(page, 'MPA-SCR-01-ST09', 'malformed alt-phone validation error (same screen as ST08)');
    await page.close();
  });

  // --- Scenario E: Abandon confirmation modal ---
  if (SCENARIO === 'E' || SCENARIO === 'all') await safe('SCN abandon modal', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    await page.locator('button', { hasText: 'Abandon Order' }).click({ timeout: 5000 });
    await page.waitForTimeout(400);
    await shot(page, 'MPA-SCR-11-ST01', 'abandon confirmation modal open');
    await page.close();
  });

  // --- Scenario F: Physical SIM path + Plan Details drawer + Billing Setup drawer ---
  if (SCENARIO === 'F' || SCENARIO === 'all') await safe('SCN physical SIM + drawers', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    await resolveCust1001(page);
    const emailInput = page.getByPlaceholder('customer@example.qa');
    if (await emailInput.count()) await emailInput.fill('ahmed.alsulaiti@example.qa');
    const altPhoneInput = page.getByPlaceholder('5566 7766');
    if (await altPhoneInput.count()) await altPhoneInput.fill('55667766');
    // Eligibility clears asynchronously after MOI resolves, gating Continue;
    // give it real margin rather than the earlier fixed 600ms.
    await page.waitForTimeout(3000);
    await clickContinue(page); // -> billing (address auto-skipped)
    await page.waitForTimeout(1000);

    // Billing Setup drawer via Create New
    await safe('billing setup drawer', async () => {
      await page.locator('button', { hasText: 'Create New Billing Account' }).click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await shot(page, 'MPA-SCR-03-ST05', 'billing profile create-new form expanded');
      const addBtn = page.locator('button', { hasText: /\+.*Add|Add.*Profile|New Profile/i }).first();
      if (await addBtn.count()) {
        await addBtn.click();
        await page.waitForTimeout(400);
        await shot(page, 'MPA-SCR-13-ST01', 'billing profile setup drawer open');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    });

    // Fill minimal create-new billing fields then continue if possible; else
    // just move on via rail is not available, so try Continue directly —
    // if isValid blocks it, we still have the drawer/form screenshot above.
    await safe('continue past billing to plan', async () => {
      await clickContinue(page);
      await page.waitForTimeout(1000);
    });

    await shot(page, 'MPA-SCR-04-ST01b', 'plan & add-ons (secondary capture pass)');

    // Plan details drawer
    await safe('plan details drawer', async () => {
      const chevron = page.locator('[aria-label^="View details for"]').first();
      if (await chevron.count()) {
        await chevron.click();
        await page.waitForTimeout(400);
        await shot(page, 'MPA-SCR-15-ST01', 'plan details drawer open');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    });

    // Select a non-pre-bundled plan, add-ons tab, discounts tab
    await safe('addons and discounts tabs', async () => {
      const planCard = page.getByText('Postpaid Red 350', { exact: false }).first();
      if (await planCard.count()) {
        await planCard.click();
        await page.waitForTimeout(600);
      }
      const addonsTab = page.locator('button', { hasText: /Add-ons/ }).first();
      if (await addonsTab.count()) {
        await addonsTab.click();
        await page.waitForTimeout(400);
        await shot(page, 'MPA-SCR-04-ST10', 'add-ons tab');
      }
      const discountsTab = page.locator('button', { hasText: 'Eligible Discounts' }).first();
      if (await discountsTab.count()) {
        await discountsTab.click();
        await page.waitForTimeout(400);
        await shot(page, 'MPA-SCR-04-ST12', 'eligible discounts tab');
      }
    });

    await safe('continue to number, physical SIM path', async () => {
      await clickContinue(page);
      await page.waitForTimeout(1000);
      const numberCard = page.getByText('+974', { exact: false }).first();
      if (await numberCard.count()) {
        await numberCard.click();
        await page.waitForTimeout(500);
      }
      await clickContinue(page);
      await page.waitForTimeout(1000);
      await shot(page, 'MPA-SCR-06-ST01b', 'sim type default (physical scan pass)');
    });

    await page.close();
  });

  // --- Scenario G: Payment declined + session-expired ---
  if (SCENARIO === 'G' || SCENARIO === 'all') await safe('SCN payment declined + session expired', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);
    await toJourney(page);
    await resolveCust1001(page);
    const emailInput = page.getByPlaceholder('customer@example.qa');
    if (await emailInput.count()) await emailInput.fill('ahmed.alsulaiti@example.qa');
    const altPhoneInput = page.getByPlaceholder('5566 7766');
    if (await altPhoneInput.count()) await altPhoneInput.fill('55667766');
    // Eligibility clears asynchronously after MOI resolves, gating Continue;
    // give it real margin rather than the earlier fixed 600ms.
    await page.waitForTimeout(3000);
    await clickContinue(page); // billing
    await page.waitForTimeout(1000);
    await clickContinue(page); // plan (existing acct path skipped if blocked; best-effort)
    await page.waitForTimeout(1000);
    const planCard = page.getByText('Postpaid Red 350', { exact: false }).first();
    if (await planCard.count()) { await planCard.click(); await page.waitForTimeout(600); }
    await clickContinue(page); // number
    await page.waitForTimeout(1000);
    const numberCard = page.getByText('+974', { exact: false }).first();
    if (await numberCard.count()) { await numberCard.click(); await page.waitForTimeout(500); }
    await clickContinue(page); // sim type
    await page.waitForTimeout(1000);
    const esimBtn = page.locator('button', { hasText: 'Select eSIM' });
    if (await esimBtn.count()) { await esimBtn.click(); await page.waitForTimeout(1200); }
    await clickContinue(page); // checkout
    await page.waitForTimeout(1200);
    await clickContinue(page); // caf
    await page.waitForTimeout(1200);
    const signBtn = page.locator('button', { hasText: 'Please Sign' });
    if (await signBtn.count()) {
      await signBtn.click();
      await page.waitForTimeout(500);
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.move(box.x + 20, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2 - 20, { steps: 10 });
        await page.mouse.up();
      }
      const doneBtn = page.locator('button', { hasText: 'Done' });
      if (await doneBtn.count()) { await doneBtn.click(); await page.waitForTimeout(1000); }
    }
    await clickContinue(page); // payment
    await page.waitForTimeout(1000);

    await safe('payment declined', async () => {
      await page.locator('button', { hasText: 'Continue in WinCash' }).click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await shot(page, 'MPA-SCR-09-ST02b', 'payment handoff (pre-decline)');
      await page.locator('button', { hasText: 'Payment declined in WinCash' }).click({ timeout: 5000 });
      await page.waitForTimeout(700);
      await shot(page, 'MPA-SCR-09-ST04', 'payment declined state, Retry in WinCash button');
    });

    await safe('payment session expired', async () => {
      await page.locator('button', { hasText: 'Retry in WinCash' }).click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await page.locator('button', { hasText: 'Simulate session expiry (test)' }).click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await shot(page, 'MPA-SCR-09-ST05', 'session expired recovery state');
    });

    await page.close();
  });

  // Do NOT browser.close() here - shared CDP-attached daemon, closed
  // externally by chrome-daemon.sh's caller once all capture scripts finish.
  // The open CDP websocket otherwise keeps Node's event loop alive forever,
  // so exit explicitly once the work is done.
  console.log('DONE scenarios');
  process.exit(0);
})().catch((e) => { console.error('SCRIPT ERROR', e); process.exit(1); });
