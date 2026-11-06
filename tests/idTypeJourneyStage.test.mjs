// The ID Type eligibility check is judged only once the JOURNEY is known. The Contact / Customer Verification page of New Connection is common to Postpaid, Prepaid, Home, Fixed Line
// and MNP, and whether an ID type needs approval depends on the journey (a Passport is approved on postpaid and free on prepaid), so Contact never judges it: the product stage does, after
// the agent chooses a Recommended Offer or one of the journeys at the foot of the page. An offer moves straight on, so the page it lands on carries the notice.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let eng, notice, products;
before(async () => {
  await boot();
  eng = await load('/src/engines/eligibilityEngine.ts');
  notice = await load('/src/modules/new-connection/steps/idTypeNotice.ts');
  products = await load('/src/modules/new-connection/products.ts');
});
after(close);

const read = (f) => fs.readFileSync(f, 'utf8');
const ID_TYPES = ['QID', 'Passport', 'GCC ID', 'Diplomatic ID', 'Other ID'];

// Independent expectation (the business rule, not the code): which ID types need approval, by journey.
const NEEDS_APPROVAL = { postpaid: new Set(['Passport', 'GCC ID', 'Other ID']), prepaid: new Set(['Other ID']) };

const judge = (idType, journeyType, extra = {}) =>
  eng.evaluateEligibilityChecks(
    {
      customer: { customerId: 'C-1', idType, nationality: 'Qatari', dob: '1990-01-01', blacklisted: false },
      doc: { documentNumber: 'X-1', documentType: idType, expiryDate: '2099-01-01', visa: { visaNumber: 'V-1', expiryDate: '2099-01-01' } },
      deals: [], outstandingQar: 0, lineCapReached: false, activeLinesDetail: '', journeyType, scope: 'product', ...extra,
    },
    new Date('2026-11-06'),
  );
const idType = (checks) => checks.find((c) => c.id === 'id-type-routing');

test('once the journey is known the ID type is judged for THAT journey: Passport / GCC ID / Other ID need approval on postpaid, only Other ID on prepaid', () => {
  for (const journey of ['postpaid', 'prepaid']) {
    for (const t of ID_TYPES) {
      const c = idType(judge(t, journey));
      assert.ok(c, `${journey} ${t}: judged`);
      assert.equal(c.outcome, NEEDS_APPROVAL[journey].has(t) ? 'approval-routing' : 'pass', `${journey} ${t}`);
    }
  }
  // A postpaid Passport goes to the submitter's manager; a prepaid Passport needs nothing.
  assert.equal(idType(judge('Passport', 'postpaid', { passportApprover: 'Sales Manager' })).label, 'Sales Manager Approval Required');
  assert.equal(idType(judge('Passport', 'prepaid')).outcome, 'pass');
});

test('before the journey is known (the common Contact page) the ID type is not judged at all, for any ID type - and nothing else about the customer changes', () => {
  for (const journey of ['postpaid', 'prepaid']) {
    for (const t of ID_TYPES) {
      const deferred = judge(t, journey, { deferIdTypeRouting: true });
      const full = judge(t, journey);
      assert.equal(idType(deferred), undefined, `${journey} ${t}: no ID type row at Contact`);
      assert.deepEqual(deferred.map((c) => c.id), full.map((c) => c.id).filter((id) => id !== 'id-type-routing'), `${journey} ${t}: every other check is still there, in order`);
      assert.deepEqual(deferred.map((c) => [c.id, c.outcome]), full.filter((c) => c.id !== 'id-type-routing').map((c) => [c.id, c.outcome]), `${journey} ${t}: unchanged outcomes`);
    }
  }
});

test('wiring: only the New Connection shell tells Contact the journey comes later; the product stage always judges the ID type', () => {
  const shell = read('src/modules/new-connection/connectionSteps.tsx');
  assert.equal((shell.match(/customerQualificationStep\(\{ \.\.\.ctx, productAgnostic: true, journeyChosenLater: true \}\)/g) ?? []).length, 2, 'the mobile and the home shell');
  assert.match(read('src/capabilities/CustomerQualification/step.tsx'), /deferIdTypeRouting=\{journeyChosenLater\}/);
  // No other journey defers it (a plan change has no later product stage, so it still judges the ID type at Contact).
  for (const f of ['src/modules/mobile-service-changes/serviceChangeSteps.tsx', 'src/modules/pre-to-post-migration/screens/preToPostSteps.tsx', 'src/modules/mobile-prepaid/screens/prepaidSteps.tsx', 'src/modules/mnp-fnp-porting/screens/mnpSteps.tsx'])
    assert.doesNotMatch(read(f), /journeyChosenLater/, f);
  const product = read('src/modules/new-connection/steps/ProductEligibility.tsx');
  assert.doesNotMatch(product, /deferIdTypeRouting/);
  assert.match(product, /journeyType=\{eligibilityJourney\(values\)\}/, 'judged for the journey chosen');
  // A result judged without the ID type is never reused as the product's.
  assert.match(read('src/capabilities/EligibilityGate/EligibilityGateStep.tsx'), /Boolean\(result\.idTypeDeferred\) === deferIdTypeRouting/);
});

test('the notice rides to the page after a Recommended Offer: set only when an offer moves on with the ID type needing approval, shown once, dropped with the product', () => {
  const ps = read('src/modules/new-connection/steps/ProductSelection.tsx');
  assert.match(ps, /if \(values\.advanceOnApproval === true && idTypeApprovalOf\(eligibility\)\) setValue\(ID_TYPE_NOTICE, true\);/);
  assert.ok(products.PRODUCT_OWNED_KEYS.includes('idTypeNotice'), 'changing product drops it');
  const shell = read('src/modules/new-connection/connectionSteps.tsx');
  for (const p of ['postpaid', 'prepaid', 'fixed-line', 'mnp']) assert.match(shell, new RegExp(`forProduct\\('${p}', withIdTypeNotice\\(`), `${p} steps can carry it`);
  assert.equal(notice.ID_TYPE_NOTICE, 'idTypeNotice');
});

test('rendered: the notice shows the journey\'s approval message on the first page, not on a later one, and never for a journey with no approval', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { IdTypeApprovalNotice } = await load('/src/modules/new-connection/steps/IdTypeApprovalNotice.tsx');
  const html = (values, stepKey) => renderToStaticMarkup(React.createElement(IdTypeApprovalNotice, { stepKey, values, setValue: () => {} }));
  const postpaidPassport = { checks: judge('Passport', 'postpaid', { passportApprover: 'Sales Manager' }) };
  const prepaidPassport = { checks: judge('Passport', 'prepaid') };

  const first = html({ eligibility: postpaidPassport, idTypeNotice: true }, 'number');
  assert.match(first, /Sales Manager Approval Required/);
  assert.match(first, /Passport requires Sales Manager approval/);
  // Once the first page has claimed it, that page keeps showing it and a later page does not.
  assert.match(html({ eligibility: postpaidPassport, idTypeNotice: 'number' }, 'number'), /Approval Required/);
  assert.equal(html({ eligibility: postpaidPassport, idTypeNotice: 'number' }, 'simType'), '');
  // Not set (a footer-button journey, or an ID type with no approval): nothing.
  assert.equal(html({ eligibility: postpaidPassport }, 'number'), '');
  assert.equal(html({ eligibility: prepaidPassport, idTypeNotice: true }, 'plan'), '', 'a Passport on prepaid needs no approval, so there is nothing to say');
  assert.equal(html({ idTypeNotice: true }, 'plan'), '', 'no result: unknown stays unknown');
});
