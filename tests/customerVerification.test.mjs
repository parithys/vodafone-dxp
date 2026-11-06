// Customer Verification (the CustomerIdentification capability) against its source of truth, the New Connection Contact step (/mobile/start-connection):
// the Capability Library preview must mount the capability exactly as that journey does, and the journey's rules for who it identifies must hold.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

let ci, idTypes;
before(async () => {
  await boot();
  ci = await load('/src/capabilities/CustomerQualification/contactIdentity.ts');
  idTypes = await load('/src/data/idTypes.ts');
});
after(close);

const NEW_CONNECTION_IDS = ['QID', 'Passport', 'GCC ID', 'Diplomatic ID', 'Other ID'];
const PREPAID_IDS = ['QID', 'Diplomatic ID', 'GCC ID', 'Passport', 'Other ID'];

test('the ID types each journey offers are the business\'s, written independently of the code', () => {
  assert.deepEqual(idTypes.idTypesFor('new-connection'), NEW_CONNECTION_IDS);
  assert.deepEqual(idTypes.idTypesFor('prepaid'), PREPAID_IDS);
});

// [description, context, expected identity-rule props]. Independent expectation: who the journey treats the scanned ID as.
const CASES = [
  ['walk-in New Connection: a genuine new customer, offered to be created', { flow: 'new' }, { asNewCustomer: true, allowNewCustomer: true, asCustomerId: undefined }],
  ['existing flow (opened from Customer 360): bound to that customer, never new', { flow: 'existing', existingCustomerId: 'CUST-1001' }, { asNewCustomer: false, allowNewCustomer: true, asCustomerId: 'CUST-1001' }],
  ['a new-flow journey launched FOR a customer is bound to them and is not a New Customer journey', { flow: 'new', launchedFor: 'CUST-3201' }, { asNewCustomer: false, allowNewCustomer: true, asCustomerId: 'CUST-3201' }],
  ['a known-customer journey never creates a customer and is bound to the customer it acts for', { flow: 'new', knownCustomer: true, knownCustomerId: 'CUST-1001' }, { asNewCustomer: false, allowNewCustomer: false, asCustomerId: 'CUST-1001' }],
  ['a known-customer journey with no id of its own falls back to the launch customer', { flow: 'new', knownCustomer: true, launchedFor: 'CUST-3202' }, { asNewCustomer: false, allowNewCustomer: false, asCustomerId: 'CUST-3202' }],
  ['a known-customer journey with no customer at all stays unbound: unknown stays unknown', { flow: 'new', knownCustomer: true }, { asNewCustomer: false, allowNewCustomer: false, asCustomerId: undefined }],
  ['existing flow wins over a launch customer for who the customer is', { flow: 'existing', existingCustomerId: 'CUST-1001', launchedFor: 'CUST-9999' }, { asNewCustomer: false, allowNewCustomer: true, asCustomerId: 'CUST-1001' }],
];

test('who the Contact step identifies: new, bound to the opened customer, or known - every combination', () => {
  for (const [what, ctx, want] of CASES) {
    const p = ci.contactIdentificationProps(ctx);
    assert.deepEqual({ asNewCustomer: p.asNewCustomer, allowNewCustomer: p.allowNewCustomer, asCustomerId: p.asCustomerId }, want, what);
  }
});

test('what the Contact step always asks of Customer Verification: contact details with the identity, scan then verify then Fetch, no IPTV toggle, no type held back', () => {
  for (const [what, ctx] of CASES) {
    const p = ci.contactIdentificationProps(ctx);
    assert.equal(p.collectContact, true, what);
    assert.equal(p.verifyThenFetch, true, what);
    assert.equal(p.showIptvToggle, false, what);
    assert.deepEqual(p.unavailableIdTypes, [], what);
    assert.deepEqual(p.allowedIdTypes, NEW_CONNECTION_IDS, what);
  }
  assert.deepEqual(ci.contactIdentificationProps({ flow: 'new', journeyType: 'prepaid' }).allowedIdTypes, PREPAID_IDS, 'prepaid offers the prepaid types');
  assert.equal(ci.contactIdentificationProps({ flow: 'new', manualEntry: true }).manualEntry, true);
  assert.equal(ci.contactIdentificationProps({ flow: 'new' }).manualEntry, undefined);
});

test('the journey and the Capability Library preview take their props from the one function, and neither keeps a copy', () => {
  const step = fs.readFileSync('src/capabilities/CustomerQualification/step.tsx', 'utf8');
  const previews = fs.readFileSync('src/capabilities/previewDemos.tsx', 'utf8');
  assert.match(step, /\.\.\.identity/);
  assert.match(step, /const identity = contactIdentificationProps\(/);
  assert.match(previews, /contactIdentificationProps\(\{ flow: 'new' \}\)/);
  // No second definition of who the scanned ID is, or which types are offered, in the step.
  assert.doesNotMatch(step, /allowedIdTypes=|asNewCustomer = flow|idTypesFor\(/, 'the step holds no copy of the identity rules');
  // The eligibility check below judges the same customer the identification does.
  assert.match(step, /asCustomerId=\{asCustomerId\}/);
});

test('rendered: the Capability Library preview shows what the journey\'s Contact step shows for the capability - same markup, same fields', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const demos = await load('/src/capabilities/previewDemos.tsx');
  const qual = await load('/src/capabilities/CustomerQualification/step.tsx');
  const { CustomerIdentification } = await load('/src/capabilities/CustomerIdentification/CustomerIdentification.tsx');

  const preview = renderToStaticMarkup(React.createElement(demos.Identification));
  const step = qual.customerQualificationStep({ flow: 'new', existingCustomerId: undefined, guardedContactChange: (v, set) => set('contact', v) });
  const journey = renderToStaticMarkup(step.render({ values: {}, setValue: () => {} }));
  // The journey's step is the capability followed by its own eligibility panel; the capability's markup comes first and is identical.
  assert.ok(journey.startsWith(preview), 'the journey renders exactly the preview\'s markup before its own eligibility panel');

  // And it is the contact-collecting mode: the identify-only mount (what the preview used to be) is a different, shorter form.
  const identifyOnly = renderToStaticMarkup(React.createElement(CustomerIdentification, { value: {}, onChange: () => {}, verifyThenFetch: true }));
  assert.notEqual(preview, identifyOnly);
  for (const id of ['Qatar ID (QID)', 'Passport', 'GCC ID', 'Diplomatic ID', 'Others']) assert.match(preview, new RegExp(id.replace(/[()]/g, '\\$&')), `${id} is offered`);
});

// ---- One implementation, one experience; the rules stay in the journeys -------------------------------------------------------------------------------
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
const SRC = walk('src').filter((f) => /\.(ts|tsx)$/.test(f) && !/componentCatalogue|\.generated\./.test(f));
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const code = (f) => stripComments(fs.readFileSync(f, 'utf8'));

// The parts that make up the experience. Only these files may render one another; nothing else composes them.
const CAPABILITY_DIR = 'src/capabilities/CustomerIdentification/';
const INTERNAL = new Set([
  'src/components/patterns/IdLookupStep.tsx', // the lookup: ID type, number, scanner, MOI result
  'src/components/patterns/GuidedContactStep.tsx', // the lookup plus the contact details
  'src/components/patterns/IdScannerPanel.tsx',
]);

test('nothing composes the identification experience itself: its parts are rendered only by the capability\'s own files', () => {
  const PARTS = ['IdLookupStep', 'GuidedContactStep', 'IdScannerPanel', 'MoiResultPanel', 'QidTypeSelector', 'QidNumberField'];
  const offenders = [];
  for (const f of SRC) {
    if (f.startsWith(CAPABILITY_DIR) || INTERNAL.has(f)) continue;
    const c = code(f);
    for (const p of PARTS) if (new RegExp(`<${p}\\b`).test(c)) offenders.push(`${f} renders <${p}>`);
  }
  assert.deepEqual(offenders, [], 'mount <CustomerIdentification> (or idLookupStep) instead, and pass the journey\'s rules as props');
});

test('every screen that identifies a customer by ID mounts the capability - the complete list, so a new one is a conscious addition', () => {
  // The capability's own files (including its idLookupStep builder) are the implementation, not consumers of it.
  const mounts = SRC.filter((f) => /<CustomerIdentification\b|\bidLookupStep\(/.test(code(f)) && !f.startsWith(CAPABILITY_DIR) && !f.includes('previewDemos')).sort();
  assert.deepEqual(mounts, [
    'src/capabilities/ActualUser/ActualUser.tsx', // the actual user of a line (Contact details, not bound to the customer on screen)
    'src/capabilities/CustomerQualification/step.tsx', // the Contact step of New Connection, its products, Prepaid to Postpaid and the service changes
    'src/components/patterns/VerificationGate.tsx', // Customer 360 maintenance verification
    'src/modules/identity-customer-management/screens/PassportToQidWizard.tsx',
    'src/modules/pre-to-post-migration/screens/BaseManagementWizard.tsx',
    'src/modules/sim-number-management/screens/NewSimSwapWizard.tsx', // via idLookupStep
    'src/modules/sim-number-management/screens/ReserveNumberWizard.tsx', // via idLookupStep
  ].sort());
});

test('the shared experience holds no journey rule: no approval route, role, product, eligibility outcome or journey state inside it', () => {
  const SHARED = [
    'src/components/patterns/IdLookupStep.tsx', 'src/components/patterns/GuidedContactStep.tsx', 'src/components/patterns/IdScannerPanel.tsx', 'src/components/patterns/MoiResultPanel.tsx',
    'src/components/patterns/IdLookupStatus.tsx', 'src/components/patterns/useIdLookup.ts', 'src/components/patterns/idLookupModel.ts', 'src/components/patterns/guidedContactModel.ts',
    'src/capabilities/CustomerIdentification/CustomerIdentification.tsx', 'src/capabilities/CustomerIdentification/IdentityDetailsCard.tsx', 'src/capabilities/CustomerIdentification/identityFacts.ts',
    'src/components/domain/QidInput.tsx', 'src/components/domain/QidImageUpload.tsx', 'src/components/domain/PassportScanSections.tsx',
  ];
  // Independent list of what is a journey's business: who approves, which role, what the eligibility said, what product/journey it is, the journey's draft.
  const JOURNEY_RULE = /Store Manager|Credit Control|Back Office|ROLE-\d+|journeyType|hardStop|softStop|requiresHrn|under18|EligibilityResult|useWorkflowStore|wizardId|LAUNCH_CUSTOMER_KEY|routesToApproval/;
  for (const f of SHARED) {
    const hits = code(f).split('\n').filter((l) => JOURNEY_RULE.test(l)).map((l) => l.trim().slice(0, 90));
    assert.deepEqual(hits, [], `${f} states or applies a journey rule`);
  }
  // The one role-aware thing in it is application-wide access control (which customer segments this role may see), not a journey's rule.
  const roleAware = code('src/components/patterns/useIdLookup.ts').match(/usePersonaStore/g)?.length ?? 0;
  assert.ok(roleAware > 0);
  assert.ok(!/usePersonaStore/.test(code('src/components/patterns/IdLookupStep.tsx')) && !/usePersonaStore/.test(code('src/components/patterns/GuidedContactStep.tsx')), 'the layout files are role-blind');
});

test('what typing the ID by hand means is the JOURNEY\'s to say: the shared panel is silent by default, and only the journeys that enforce it supply the sentence', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { IdScannerPanel } = await load('/src/components/patterns/IdScannerPanel.tsx');
  const noop = () => {};
  const panel = (extra) =>
    renderToStaticMarkup(React.createElement(IdScannerPanel, {
      value: {}, onChange: noop, latest: { current: {} }, idType: 'QID', verifyThenFetch: true, autoDetectIdType: false, contextNoDocument: undefined, contextHeldTypes: [], contextIdentity: undefined,
      scanComplete: false, setNotFound: noop, clearReconciliation: noop, demoType: null, handleScanAttempt: () => true, handleRetakeDone: noop, handleDemoScan: noop, scanBudgetSpent: true, ...extra,
    }));
  const silent = panel({});
  assert.match(silent, /Select the ID type and enter the number manually to continue/, 'the shared UX line is there');
  assert.doesNotMatch(silent, /Store Manager|approval/, 'no journey rule by default');
  assert.match(panel({ manualEntryNotice: 'My journey rule.' }), /My journey rule\./, 'a journey\'s sentence is shown');

  // The journeys that hold a hand-entered identity for approval at submit say so; those with no such rule do not.
  const ci = await load('/src/capabilities/CustomerQualification/contactIdentity.ts');
  assert.equal(ci.contactIdentificationProps({ flow: 'new' }).manualEntryNotice, "Manual entry requires Store Manager's approval for activation.");
  for (const f of ['src/capabilities/ActualUser/ActualUser.tsx', 'src/capabilities/CustomerIdentification/step.tsx', 'src/components/patterns/VerificationGate.tsx', 'src/modules/identity-customer-management/screens/PassportToQidWizard.tsx', 'src/modules/pre-to-post-migration/screens/BaseManagementWizard.tsx'])
    assert.doesNotMatch(code(f), /manualEntryNotice/, `${f} has no hand-entry approval rule to state`);
  for (const f of ['src/modules/new-connection/submitNewConnectionOrder.ts', 'src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts', 'src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts'])
    assert.match(code(f), /manualIdEntry/, `${f} enforces it, so its journey states it`);
});

test('same layout and experience in every mount: whatever a journey passes, the shared markup is the same - only the options it offers differ', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { CustomerIdentification } = await load('/src/capabilities/CustomerIdentification/CustomerIdentification.tsx');
  const render = (props) => renderToStaticMarkup(React.createElement(CustomerIdentification, { value: {}, onChange: () => {}, ...props }));
  const cardOf = (html, label) => html.match(new RegExp(`<button[^>]*>(?:(?!</button>).)*${label.replace(/[()]/g, '\\$&')}</span></button>`))?.[0];

  // Every journey's mount, as it passes props today.
  const MOUNTS = {
    'New Connection (Contact)': ci.contactIdentificationProps({ flow: 'new' }),
    'Prepaid (Contact)': ci.contactIdentificationProps({ flow: 'new', journeyType: 'prepaid' }),
    'service change (known customer)': ci.contactIdentificationProps({ flow: 'new', knownCustomer: true, knownCustomerId: 'CUST-1001' }),
    'Actual User': { collectContact: true, unbound: true, allowedIdTypes: ['QID', 'Diplomatic ID'], verifyThenFetch: true, showIptvToggle: false },
    'Verification Gate': { asCustomerId: 'CUST-1001', allowNewCustomer: false },
    'Passport to QID / Base Management': { allowNewCustomer: false },
    'SIM swap / Reserve Number (idLookupStep)': {},
  };
  const html = Object.fromEntries(Object.entries(MOUNTS).map(([k, p]) => [k, render(p)]));

  // The Qatar ID card is byte-for-byte the same element in every journey: one layout, one look.
  const qid = Object.entries(html).map(([k, h]) => [k, cardOf(h, 'Qatar ID (QID)')]);
  for (const [k, c] of qid) assert.ok(c, `${k} offers the QID card`);
  assert.equal(new Set(qid.map(([, c]) => c)).size, 1, 'one QID card markup across all mounts');
  // So is every other type's card that the mounts share.
  for (const label of ['Passport', 'GCC ID', 'Diplomatic ID']) {
    const cards = Object.values(html).map((h) => cardOf(h, label)).filter(Boolean);
    assert.ok(cards.length >= 2);
    assert.equal(new Set(cards).size, 1, `one ${label} card markup`);
  }
  // Contact-collecting and identify-only are one scaffold: the identify-only form sits verbatim inside the contact-collecting one.
  for (const allowed of [undefined, ['QID', 'Diplomatic ID'], ['QID', 'Passport', 'GCC ID', 'Diplomatic ID', 'Other ID']]) {
    const lookup = render({ allowedIdTypes: allowed });
    const contact = render({ allowedIdTypes: allowed, collectContact: true });
    assert.ok(contact.includes(lookup), `the lookup is one block of the contact form (${allowed?.join(',') ?? 'all types'})`);
  }
  // A journey's rule narrows what is OFFERED, never how it looks: Actual User offers two types in the same cards.
  assert.equal(cardOf(html['Actual User'], 'Diplomatic ID'), cardOf(html['New Connection (Contact)'], 'Diplomatic ID'));
  assert.doesNotMatch(html['Actual User'], /GCC ID/);
});
