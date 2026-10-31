// Phase 13 screenshot capture — happy path (CUST-1001 Ahmed Al-Sulaiti)
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
  } catch (e) {
    console.error(`STEP FAILED: ${label}:`, e.message.split('\n')[0]);
  }
}

async function clickContinue(page) {
  const btn = page.locator('button', { hasText: 'Continue' }).first();
  await btn.waitFor({ state: 'visible', timeout: 10000 });
  await btn.click({ timeout: 10000 });
}

(async () => {
  // Sandbox cannot spawn/kill Chrome subprocesses via Playwright's own
  // launch(); a manually-started chrome-headless-shell daemon (single-process,
  // no-zygote) is attached to instead via CDP - see _data/chrome-daemon.sh.
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await safe('login', async () => {
    await page.goto(BASE);
    await page.waitForSelector('#staff-id', { timeout: 15000 });
    await page.fill('#staff-id', 'VFQ12341');
    await page.fill('#login-password', 'Vodafone@123');
    await page.locator('button', { hasText: 'Sign in with SSO' }).click();
    await page.waitForSelector('text=Welcome back', { timeout: 15000 });
  });

  await safe('navigate to journey', async () => {
    const quickAction = page.locator('button', { hasText: 'New Postpaid Connection' });
    await quickAction.first().click();
    await page.waitForSelector('text=Step 1 of 9', { timeout: 15000 });
    await page.waitForTimeout(500);
  });

  await shot(page, 'MPA-SCR-01-ST01', 'default contact step');

  await safe('scan QID + retake loop', async () => {
    await page.locator('button', { hasText: 'Qatar ID (QID)' }).click();
    await page.waitForTimeout(1200);
    await shot(page, 'MPA-SCR-01-ST02', 'scan blurred / mid-scan');
    for (let i = 0; i < 8; i++) {
      const moiBadge = page.locator('text=MOI validated successfully');
      if (await moiBadge.count()) break;
      const retake = page.locator('button', { hasText: 'Retake scan' });
      if (await retake.count()) {
        await retake.first().click();
        await page.waitForTimeout(1600);
      } else {
        await page.waitForTimeout(1000);
      }
    }
    // Give the MOI lookup itself room to resolve once scanning succeeds -
    // the badge appearing and the email/phone fields mounting are two
    // separate renders, not the same one.
    await page.getByPlaceholder('customer@example.qa').waitFor({ state: 'visible', timeout: 15000 });
  });
  await page.waitForTimeout(500);
  await shot(page, 'MPA-SCR-01-ST04', 'clean pass, MOI resolved');

  await safe('fill email + phone', async () => {
    const emailInput = page.getByPlaceholder('customer@example.qa');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('ahmed.alsulaiti@example.qa');
    const altPhoneInput = page.getByPlaceholder('5566 7766');
    await altPhoneInput.fill('55667766');
  });
  await page.waitForTimeout(600);
  await shot(page, 'MPA-SCR-01-ST04c', 'clean pass with contact fields filled');

  await safe('eligibility checks drawer', async () => {
    const viewLink = page.getByText('View eligibility checks', { exact: false });
    await viewLink.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await shot(page, 'MPA-SCR-12-ST01', 'eligibility checks drawer, clean pass');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  });

  await safe('continue to billing (address auto-skipped)', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1200);
  });
  await shot(page, 'MPA-SCR-03-ST01', 'billing profile step (address auto-skipped)');

  await safe('open address via rail', async () => {
    const addressRail = page.locator('li', { hasText: 'Communication Address' }).first();
    await addressRail.click();
    await page.waitForTimeout(1800);
  });
  await shot(page, 'MPA-SCR-02-ST03', 'communication address opened manually (prefilled if Qatari)');

  await safe('back to billing, select existing account, continue', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1000);
    await shot(page, 'MPA-SCR-03-ST02', 'billing profile - existing account list');
    const existingCard = page.getByText('Account ending', { exact: false }).first();
    if (await existingCard.count()) {
      await existingCard.click();
      await page.waitForTimeout(400);
      await shot(page, 'MPA-SCR-03-ST13', 'billing profile - existing account selected');
    }
    await clickContinue(page);
    await page.waitForTimeout(1000);
  });
  await shot(page, 'MPA-SCR-04-ST01', 'plan & add-ons default');

  await safe('select plan + details drawer', async () => {
    const planCard = page.getByText('Postpaid Red 350', { exact: false }).first();
    await planCard.click({ timeout: 5000 });
    await page.waitForTimeout(800);
    await shot(page, 'MPA-SCR-04-ST05', 'plan selected, monthly summary shown');
  });

  await safe('continue to number selection', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1200);
  });
  await shot(page, 'MPA-SCR-05-ST01', 'number selection default');

  await safe('select a number', async () => {
    const numberCard = page.getByText('+974', { exact: false }).first();
    await numberCard.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await shot(page, 'MPA-SCR-05-ST05', 'number selected confirmation');
  });

  await safe('continue to sim type, choose esim', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1000);
    await shot(page, 'MPA-SCR-06-ST01', 'sim type default');
    const esimBtn = page.locator('button', { hasText: 'Select eSIM' });
    if (await esimBtn.count()) {
      await esimBtn.click();
      await page.waitForTimeout(1400);
      await shot(page, 'MPA-SCR-06-ST06', 'esim issued');
    }
  });

  await safe('continue to checkout', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1400);
  });
  await shot(page, 'MPA-SCR-07-ST01', 'checkout summary');

  await safe('continue to CAF, sign', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1400);
    await shot(page, 'MPA-SCR-08-ST02', 'caf customer-facing awaiting signature');
    const signBtn = page.locator('button', { hasText: 'Please Sign' });
    if (await signBtn.count()) {
      await signBtn.click();
      await page.waitForTimeout(500);
      await shot(page, 'MPA-SCR-14-ST01', 'signature pad drawer open');
      const canvas = page.locator('canvas').first();
      if (await canvas.count()) {
        const box = await canvas.boundingBox();
        if (box) {
          await page.mouse.move(box.x + 20, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2 - 20, { steps: 10 });
          await page.mouse.up();
          await page.waitForTimeout(300);
          await shot(page, 'MPA-SCR-14-ST03', 'signature drawn');
        }
      }
      const doneBtn = page.locator('button', { hasText: 'Done' });
      if (await doneBtn.count()) {
        await doneBtn.click();
        await page.waitForTimeout(1000);
        await shot(page, 'MPA-SCR-08-ST04', 'caf signed, locked, agent view returned');
      }
    }
  });

  await safe('continue to payment, complete WinCash', async () => {
    await clickContinue(page);
    await page.waitForTimeout(1200);
    await shot(page, 'MPA-SCR-09-ST01', 'payment idle');
    const winCashBtn = page.locator('button', { hasText: 'Continue in WinCash' });
    if (await winCashBtn.count()) {
      await winCashBtn.click();
      await page.waitForTimeout(600);
      await shot(page, 'MPA-SCR-09-ST02', 'payment handoff state');
      const paidBtn = page.locator('button', { hasText: 'Payment completed in WinCash' });
      if (await paidBtn.count()) {
        await paidBtn.click();
        await page.waitForTimeout(2500);
        await shot(page, 'MPA-SCR-10-ST01', 'order confirmation, esim handover panel');
      }
    }
  });

  // Do NOT browser.close() OR page.close() here - it's a shared CDP-attached
  // chrome-headless-shell daemon another script (capture-scenarios.mjs) may
  // still need, and that binary exits the instant its last open tab closes.
  // Leaving this page open keeps the daemon alive. The open CDP websocket
  // otherwise keeps Node's event loop alive forever too, so exit explicitly.
  console.log('DONE happy path');
  process.exit(0);
})().catch((e) => { console.error('SCRIPT ERROR', e); process.exit(1); });
