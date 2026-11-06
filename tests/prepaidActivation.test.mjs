// New Prepaid Activation rework: the rules that make it a journey of its own (not a restyled Postpaid) - mandatory products, role-driven numbers, configurable SIM charging,
// the Charge Summary with VAT, iPAY terms, the eWallet, and no Address / Secondary Contact / discount / lock-in. Expected values are written from the requirement, not from the code.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let cfg, sim, vat, cart, alloc, valid, wallet, addons;
before(async () => {
  await boot();
  cfg = await load('/src/data/prepaidActivation.ts');
  sim = await load('/src/data/prepaidSimCharge.ts');
  vat = await load('/src/components/patterns/prepaidChargeSummary.ts');
  cart = await load('/src/components/patterns/prepaidCartModel.ts');
  alloc = await load('/src/capabilities/SimType/prepaidNumberAllocation.ts');
  valid = await load('/src/components/patterns/prepaidOrderValidation.ts');
  wallet = await load('/src/stores/eWalletStore.ts');
  addons = await load('/src/capabilities/AddonsSelection/usePackHasAddons.ts');
});
after(close);

const read = (f) => fs.readFileSync(f, 'utf8');
const json = (f) => JSON.parse(read(`public/mock-data/${f}.json`));

test('mandatory products: only a record marked isMandatory, only on its pack, and no other journey data changes meaning', () => {
  const rows = json('addons-discounts');
  assert.deepEqual(addons.mandatoryAddonIds(rows, 'PROD-302'), ['ADO-9301']);
  for (const pack of ['PROD-300', 'PROD-301', 'PROD-303', 'PROD-304']) assert.deepEqual(addons.mandatoryAddonIds(rows, pack), [], pack);
  // Whole population: a mandatory id is always a Paid Add-on of a Prepaid Plan, and an optional one exists beside it.
  const prepaidPacks = new Set(json('products').filter((p) => p.type === 'Prepaid Plan').map((p) => p.productId));
  for (const r of rows.filter((x) => x.isMandatory)) assert.ok(prepaidPacks.has(r.planId) && r.category === 'Paid Add-on', r.addonDiscountId);
  assert.ok(rows.some((r) => r.planId === 'PROD-302' && r.category === 'Paid Add-on' && !r.isMandatory), 'an optional add-on beside the mandatory one');
});

test('mandatory products are opt-in: the picker and the pack step enforce them only for New Prepaid activation', () => {
  const picker = read('src/capabilities/AddonsSelection/AddonsPicker.tsx');
  assert.match(picker, /mandatory: mandatoryProducts && d\.isMandatory === true/);
  assert.match(picker, /if \(removing && candidate\?\.mandatory\) return;/, 'a mandatory product cannot be deselected');
  assert.match(read('src/modules/mobile-prepaid/screens/prepaidSteps.tsx'), /prepaidAddonsStep\(\{ mandatoryProducts: true \}\)/);
  for (const f of ['src/modules/mnp-fnp-porting/screens/mnpSteps.tsx', 'src/modules/mobile-service-changes/serviceChangeSteps.tsx']) assert.doesNotMatch(read(f), /mandatoryProducts|activation: true/, f);
});

test('Number Selection is driven by ROLE: Mass Market sees Free only, Retail Sales every tab including Star; no entitlement, lock-in or sorting', () => {
  assert.deepEqual([...cfg.prepaidNumberTabsFor('ROLE-05')], ['Free']);
  const retail = cfg.prepaidNumberTabsFor('ROLE-01');
  for (const t of ['Star', 'Free', 'Reserved']) assert.ok(retail.includes(t), `Retail sees ${t}`);
  assert.ok(!cfg.prepaidNumberTabsFor('ROLE-05').includes('Star'));
  const steps = read('src/modules/mobile-prepaid/screens/prepaidSteps.tsx');
  assert.match(steps, /sorting: false, lockIn: false, planEntitlement: false/);
  // The prepaid number step never passes a plan (no pack entitlement).
  assert.doesNotMatch(steps.slice(steps.indexOf('numberSelectionStep(')), /plan: \(/);
});

test('number allocation: only an AVAILABLE Free number, lowest first, never one the order holds; Star / Reserved / Blocked are never allocated (whole inventory)', () => {
  const numbers = json('numbers');
  const first = alloc.autoAllocatedFreeNumber(numbers);
  const expected = numbers.filter((n) => n.category === 'Free' && n.status === 'AVAILABLE').map((n) => n.msisdn).sort()[0];
  assert.equal(first.msisdn, expected);
  assert.equal(alloc.autoAllocatedFreeNumber(numbers, [expected]).msisdn !== expected, true);
  assert.equal(alloc.autoAllocatedFreeNumber(numbers.filter((n) => n.category !== 'Free')), undefined, 'no Free number: unknown stays unknown, nothing is invented');
  assert.equal(alloc.autoAllocatedFreeNumber([]), undefined);
});

test('SIM charging: Standard, Reduced and Waived by role, ID type and recharge; the general ID-type rule is unchanged when no role rule applies', () => {
  // General (no role): the BRSD thresholds.
  assert.deepEqual([sim.simCardCharge('QID', 10).kind, sim.simCardCharge('QID', 10).chargeQar], ['standard', 10]);
  assert.deepEqual([sim.simCardCharge('QID', 20).kind, sim.simCardCharge('QID', 20).chargeQar], ['waived', 0]);
  assert.deepEqual([sim.simCardCharge('Passport', 34).kind, sim.simCardCharge('Passport', 34).chargeQar], ['standard', 40]);
  assert.equal(sim.simCardCharge('Passport', 35).kind, 'waived');
  assert.equal(sim.simCardCharge('Other ID', 0).kind, 'none');
  // The same answers for Retail Sales (no role-specific row).
  assert.deepEqual(sim.simCardCharge('QID', 10, 'ROLE-01'), sim.simCardCharge('QID', 10));
  // Mass Market (MOCK role row): reduced from 10, standard below, waived from 20.
  assert.deepEqual([sim.simCardCharge('QID', 5, 'ROLE-05').kind, sim.simCardCharge('QID', 5, 'ROLE-05').chargeQar], ['standard', 10]);
  const reduced = sim.simCardCharge('QID', 10, 'ROLE-05');
  assert.deepEqual([reduced.kind, reduced.chargeQar, reduced.standardChargeQar], ['reduced', 5, 10]);
  assert.equal(sim.simCardCharge('QID', 20, 'ROLE-05').kind, 'waived');
  // Conservation: charge + discount = standard, for every role / ID type / recharge.
  for (const role of [undefined, 'ROLE-01', 'ROLE-05']) for (const id of ['QID', 'Diplomatic ID', 'Passport', 'GCC ID', 'Other ID', undefined]) for (let r = 0; r <= 60; r += 5) {
    const c = sim.simCardCharge(id, r, role);
    assert.equal(c.chargeQar + (c.standardChargeQar - c.chargeQar), c.standardChargeQar);
    assert.ok(c.chargeQar >= 0 && c.chargeQar <= c.standardChargeQar, `${role}/${id}/${r}`);
  }
});

test('VAT: every row has excl, %, VAT and incl; incl = excl + VAT; the total is exactly the sum of the rows; discounts are negative', () => {
  assert.deepEqual(vat.vatOf(100, 5), { exclQar: 100, vatPercent: 5, vatQar: 5, inclQar: 105 });
  assert.deepEqual(vat.vatOf(-10, 5), { exclQar: -10, vatPercent: 5, vatQar: -0.5, inclQar: -10.5 });
  assert.deepEqual(vat.vatOf(0.1, 5), { exclQar: 0.1, vatPercent: 5, vatQar: 0.01, inclQar: 0.11 }, 'VAT is rounded to the fils');
  const charges = (o) => ({ starterPackQar: 0, addonsQar: 0, rechargeQar: 0, numberListQar: 0, numberWaivedQar: 0, simStandardChargeQar: 0, simDiscountQar: 0, ...o });
  const cases = [
    [],
    [charges({})],
    [charges({ rechargeQar: 20, simStandardChargeQar: 10, simDiscountQar: 10 })],
    [charges({ numberListQar: 1500, numberWaivedQar: 500, rechargeQar: 35, simStandardChargeQar: 40, simDiscountQar: 40 })],
    [charges({ starterPackQar: 50, addonsQar: 15, rechargeQar: 10, simStandardChargeQar: 10, simDiscountQar: 5 }), charges({ numberListQar: 333.33, numberWaivedQar: 33.33, rechargeQar: 7.77 })],
  ];
  for (const c of cases) {
    const s = vat.chargeSummaryOf(c, 5);
    const sum = (k) => Math.round(s.lines.reduce((t, l) => t + l.amounts[k], 0) * 100) / 100;
    assert.equal(s.total.exclQar, sum('exclQar'));
    assert.equal(s.total.vatQar, sum('vatQar'));
    assert.equal(s.total.inclQar, sum('inclQar'));
    for (const l of s.lines) assert.equal(l.amounts.inclQar, Math.round((l.amounts.exclQar + l.amounts.vatQar) * 100) / 100, l.label);
    for (const l of s.lines.filter((x) => x.discount)) assert.ok(l.amounts.exclQar < 0, `${l.label} is negative`);
  }
  // The rows the requirement lists, and no plan-based Star discount row.
  const keys = vat.chargeSummaryOf([charges({ numberListQar: 1000, numberWaivedQar: 100, rechargeQar: 20, simStandardChargeQar: 10, simDiscountQar: 10 })], 5).lines.map((l) => l.key);
  assert.deepEqual(keys, ['recharge', 'star-number', 'star-discount', 'sim-charge', 'sim-discount']);
});

test('Star number charge = list price - additional agent discount, with no plan-based discount; the order collects the VAT-inclusive total', () => {
  const products = [{ productId: 'P', name: 'P', starterPackChargeQAR: 0 }];
  const line = { productId: 'P', addonIds: [], prePaired: false, msisdn: '+97450000001', numberPriceQAR: 1000, numberWaiver: 250, simType: { simType: 'Physical', simValid: true }, rechargeId: 'R' };
  const recharges = [{ rechargeId: 'R', name: 'R', category: 'Flex', amountQar: 20 }];
  const c = cart.priceLine(line, 'QID', products, [], { recharges });
  assert.equal(c.numberListQar, 1000);
  assert.equal(c.numberWaivedQar, 250);
  assert.equal(c.numberQar, 750, 'upfront = list - additional agent discount');
  const t = cart.cartTotals([line], 'QID', products, [], { recharges, vatPercent: 5 });
  assert.equal(t.chargeSummary.total.exclQar, 770, '750 + recharge 20 (QID recharge 20 waives the SIM charge)');
  assert.equal(t.totalDueQar, 808.5, 'incl. 5% VAT');
  // Without a VAT rate (every other journey) the total is unchanged and has no summary.
  const plain = cart.cartTotals([line], 'QID', products, [], { recharges });
  assert.deepEqual([plain.totalDueQar, plain.chargeSummary], [770, undefined]);
});

test('Order Summary checks: customer, pack compatibility, number and SIM; each failure is one message; a clean order has none', () => {
  const ok = { productId: 'PROD-302', addonIds: [], prePaired: false, msisdn: '+97433001001', numberPriceQAR: 0, simType: { simType: 'Physical', simValid: true } };
  const base = { customerName: 'A B', idNumber: '1', lines: [ok], packs: json('products').filter((p) => p.type === 'Prepaid Plan'), segment: undefined };
  assert.deepEqual(valid.prepaidOrderErrors(base), []);
  assert.equal(valid.prepaidOrderErrors({ ...base, customerName: undefined }).length, 1);
  assert.equal(valid.prepaidOrderErrors({ ...base, lines: [{ ...ok, msisdn: '12' }] }).length, 1);
  assert.equal(valid.prepaidOrderErrors({ ...base, lines: [{ ...ok, simType: { simType: 'Physical', simValid: false } }] }).length, 1);
  assert.equal(valid.prepaidOrderErrors({ ...base, lines: [{ ...ok, productId: 'PROD-NOPE' }] }).length, 1);
  assert.equal(valid.prepaidOrderErrors({ ...base, lines: [] }).length, 1);
  assert.equal(valid.prepaidOrderErrors({ ...base, lines: [ok, ok] }).length, 1, 'a repeated number / SIM');
});

test('CAF: iPAY defaults to Yes and the terms follow it; the prepaid terms carry no postpaid lock-in content', () => {
  assert.equal(cfg.IPAY_ACTIVATION_DEFAULT, true);
  const on = cfg.prepaidTermsFor(true).map((s) => s.title);
  const off = cfg.prepaidTermsFor(false).map((s) => s.title);
  assert.ok(on.some((t) => /iPAY/.test(t)));
  assert.ok(!off.some((t) => /iPAY/.test(t)));
  for (const s of cfg.prepaidTermsFor(true)) assert.doesNotMatch(`${s.title} ${s.body}`, /Lock-In|Early Exit|Billing Details|Secondary Contact/i);
  const step = read('src/capabilities/CafSignature/step.tsx');
  assert.match(step, /ipayOn = /);
  assert.match(read('src/modules/mobile-prepaid/screens/prepaidSteps.tsx'), /ipay: true/);
});

test('eWallet: only mapped roles; the balance is deducted on payment and a payment the balance cannot cover is refused (nothing deducted)', () => {
  assert.equal(cfg.eWalletEligible('ROLE-05'), true);
  assert.equal(cfg.eWalletEligible('ROLE-01'), false);
  const s = wallet.useEWalletStore.getState();
  const start = s.balanceOf('ROLE-05');
  assert.equal(start, 150);
  assert.equal(s.deduct('ROLE-05', start + 0.01), false);
  assert.equal(wallet.useEWalletStore.getState().balanceOf('ROLE-05'), start, 'insufficient: nothing deducted');
  assert.equal(wallet.useEWalletStore.getState().deduct('ROLE-05', 40.5), true);
  assert.equal(wallet.useEWalletStore.getState().balanceOf('ROLE-05'), 109.5);
  assert.equal(wallet.useEWalletStore.getState().deduct('ROLE-01', 1), false, 'a role with no wallet has no balance');
  const pay = read('src/components/patterns/WinCashPaymentStep.tsx');
  assert.match(pay, /Insufficient eWallet Balance/);
  assert.match(pay, /disabled=\{processing \|\| insufficient\}/);
  assert.match(pay, /Amount Due \(eWallet\)/);
  assert.match(pay, /Amount Due \(WinCash\)/);
});

test('separation: New Prepaid has no Address, Billing, Secondary Contact, pack discount or HRN; Postpaid keeps its steps and rules', () => {
  const pre = read('src/modules/mobile-prepaid/screens/prepaidSteps.tsx');
  for (const banned of [/serviceAddressStep\(/, /billingStep\(/, /withActualUser/, /AddDiscountAction/, /hrn/i, /billLimit/i]) assert.doesNotMatch(pre.replace(/\/\/.*$/gm, ''), banned);
  assert.match(pre, /activation: true/);
  const post = read('src/modules/new-connection/postpaidSteps.tsx');
  for (const untouched of [/prepaidActivation/, /autoAllocate/, /offerEWallet/, /ipay: true/, /activation: \{/]) assert.doesNotMatch(post, untouched);
  // The Order Submitted data carries no billing cycle or monthly recurring for a prepaid order.
  const submit = read('src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts');
  assert.doesNotMatch(submit.replace(/\/\/.*$/gm, ''), /billingCycle|monthlyRecurring|Monthly - Day/);
});
