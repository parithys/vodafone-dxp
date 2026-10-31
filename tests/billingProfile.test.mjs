// The Billing Profile is selected or created for the agent, in every journey that has the step; its absence is never shown as a problem.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load, close } from './harness.mjs';

test('the Billing Profile step resolves itself (headless) once the customer is identified, and not before', async () => {
  const { billingAccountStep } = await load('/src/capabilities/BillingAccount/step.tsx');
  const step = billingAccountStep({ profileSuffix: 'Fixed Line' });
  assert.equal(step.autoPass({}), true);
  assert.equal(step.headless({ values: {}, setValue() {} }), null);
  const el = step.headless({ values: { contact: { moiResult: { name: 'Aisha' } }, eligibility: { customerId: 'CUST-3084' } }, setValue() {} });
  assert.equal(el.props.customerId, 'CUST-3084');
  assert.equal(el.props.profileSuffix, 'Fixed Line');
});

test('the wizard mounts each step\'s headless work, and no journey step mounts the resolver by hand any more', () => {
  assert.match(fs.readFileSync('src/capabilities/GuidedActivationWizard/GuidedActivationWizard.tsx', 'utf8'), /s\.headless \? <Fragment key=\{s\.key\}>/);
  assert.doesNotMatch(fs.readFileSync('src/modules/new-connection/steps/ProductSelection.tsx', 'utf8'), /BillingAccountAutoResolver/);
});

test('an existing profile is selected, otherwise a default one is created', async () => {
  const src = fs.readFileSync('src/components/patterns/BillingAccountAutoResolver.tsx', 'utf8');
  assert.match(src, /selectedProfileId: own\[0\]\.billingProfileId/);
  assert.match(src, /creatingNew: true/);
});

test.after(close);

test('editing an existing billing account saves what the agent changed onto that account\'s profile; an unedited one writes nothing', async () => {
  const { persistBillingAccount } = await load('/src/capabilities/BillingAccount/persistBillingAccount.ts');
  const updates = [];
  const ctx = { createRecord: async () => {}, updateRecord: async (...a) => void updates.push(a), kind: 'Consumer Mobile Postpaid' };
  const edit = { selectedProfileId: 'BILL-1', editingProfileId: 'BILL-1', newAccount: { editAddressLine: ' Zone 55, Street 12, Doha ', primaryContactName: 'Fatima Al-Marri', billCycleDay: 7, billingMode: 'Arrears', profileName: 'Fatima - Billing', billMedia: 'Email' } };
  assert.equal(await persistBillingAccount(edit, ctx), 'BILL-1');
  assert.deepEqual(updates, [['billing-profiles', 'billingProfileId', 'BILL-1', { billingContactName: 'Fatima Al-Marri', billingAddress: 'Zone 55, Street 12, Doha', billingCycle: 'Monthly - Day 7', billingType: 'Arrears', name: 'Fatima - Billing', billMedium: 'Email' }]]);
  updates.length = 0;
  await persistBillingAccount({ selectedProfileId: 'BILL-1' }, ctx);
  await persistBillingAccount({ ...edit, editingProfileId: undefined }, ctx);
  await persistBillingAccount({ selectedProfileId: 'BILL-1', editingProfileId: 'BILL-1', newAccount: { editAddressLine: '  ' } }, ctx);
  assert.deepEqual(updates, []);
  await persistBillingAccount(edit, { ...ctx, updateRecord: undefined });
});

test('Customer 360 account edit: only Credit Limit, Account Status and Customer Segment change, and bad limits are refused', async () => {
  const { diffAccountEdits, EDITABLE_SEGMENTS } = await load('/src/workspace/customer360/accountEditModel.ts');
  assert.deepEqual([...EDITABLE_SEGMENTS], ['Consumer', 'Consumer (HRN)', 'Safwa', 'Safwa+', 'Royal', 'Small Business', 'Medium Business', 'Large Business', 'Government']);
  const before = { creditLimitQar: 1000, accountStatus: 'Active', segment: 'Consumer' };
  const same = diffAccountEdits(before, { creditLimit: '1000', accountStatus: 'Active', segment: 'Consumer' });
  assert.deepEqual([same.changed, same.edits], [[], {}], 'nothing changed: nothing written');
  const all = diffAccountEdits(before, { creditLimit: '1500', accountStatus: 'Suspended', segment: 'Royal' });
  assert.deepEqual(all.changed, ['Credit Limit', 'Account Status', 'Customer Segment']);
  assert.deepEqual(all.edits, { creditLimitQar: 1500, accountStatus: 'Suspended', segment: 'Royal' });
  assert.deepEqual(diffAccountEdits(before, { creditLimit: '1000', accountStatus: 'Active', segment: 'Safwa' }).changed, ['Customer Segment']);
  for (const bad of ['-5', '12.5', 'abc']) assert.ok(diffAccountEdits(before, { creditLimit: bad, accountStatus: 'Active', segment: 'Consumer' }).error, bad);
  assert.equal(diffAccountEdits({ ...before, creditLimitQar: undefined }, { creditLimit: '', accountStatus: 'Active', segment: 'Consumer' }).changed.length, 0, 'an empty limit with none on file is no change');
});

test('the Primary Contact is the first contact by default, can be chosen on the billing profile, and changes only with more than one contact', async () => {
  const { primaryContactOf, canChangePrimaryContact, contactName } = await load('/src/workspace/customer360/primaryContactModel.ts');
  const a = { contactRecordId: 'C1', firstName: 'Ahmed', lastName: 'Al-Sulaiti' };
  const b = { contactRecordId: 'C2', firstName: 'Sara', middleName: 'K', lastName: 'Al-Sulaiti' };
  assert.equal(primaryContactOf([a, b], undefined), a, 'the first contact is the default');
  assert.equal(primaryContactOf([a, b], 'C2'), b, 'the one chosen on the profile');
  assert.equal(primaryContactOf([a, b], 'GONE'), a, 'a chosen contact that is no longer one of the account\'s falls back to the first');
  assert.equal(primaryContactOf([], 'C1'), undefined);
  assert.deepEqual([canChangePrimaryContact(0), canChangePrimaryContact(1), canChangePrimaryContact(2)], [false, false, true]);
  assert.equal(contactName(b), 'Sara K Al-Sulaiti');
});

test('the segment-based default is unchanged for the old helper; a Credit Control approval sets the Credit Control limit and is audited', async () => {
  const hrn = await load('/src/engines/hrnConfiguration.ts');
  assert.equal(hrn.defaultCreditLimitForSegment('Consumer (HRN)'), 50, 'an HRN segment: the HRN category\'s limit');
  for (const s of ['Consumer', 'Safwa', 'Safwa+', 'Royal', 'Large Business', undefined]) assert.equal(hrn.defaultCreditLimitForSegment(s), 1000, String(s));
  assert.deepEqual(hrn.SEGMENT_CREDIT_LIMITS_QAR, {}, 'no segment-specific amount has been given');
  const { creditLimitChangeOf, applyCreditLimitChange, CREDIT_LIMIT_CHANGE_ORDER_TYPE } = await load('/src/workspace/customer360/creditLimitChange.ts');
  const order = { orderType: CREDIT_LIMIT_CHANGE_ORDER_TYPE, customerId: 'CUST-1', requestedCreditLimitQar: 1500, accountId: 'ACC-1' };
  assert.deepEqual(creditLimitChangeOf(order), { customerId: 'CUST-1', creditLimitQar: 1500, accountId: 'ACC-1' });
  assert.equal(creditLimitChangeOf({ ...order, orderType: 'Plan Change' }), undefined);
  assert.equal(creditLimitChangeOf({ ...order, requestedCreditLimitQar: '1500' }), undefined);
  const calls = [];
  const deps = (rows) => ({ list: async () => rows, updateRecord: async (...a) => void calls.push(['update', ...a]), createRecord: async (...a) => void calls.push(['create', ...a]) });
  await applyCreditLimitChange({ customerId: 'CUST-1', creditLimitQar: 1500 }, deps([{ id: 'CRL-1', customerId: 'CUST-1' }]), '2026-10-20');
  assert.deepEqual(calls[0], ['update', 'credit-limits', 'id', 'CRL-1', { creditLimitQar: 1500, creditControlLimitQar: 1500, lastUpdated: '2026-10-20' }]);
  assert.equal(calls[1][0], 'create');
  assert.equal(calls[1][1], 'audit-trail', 'the approval is written to the audit trail');
  calls.length = 0;
  await applyCreditLimitChange({ customerId: 'CUST-2', creditLimitQar: 800, accountId: 'ACC-2' }, deps([]), '2026-10-20');
  assert.equal(calls[0][0], 'create');
  assert.deepEqual([calls[0][2].customerId, calls[0][2].creditLimitQar, calls[0][2].accountId, calls[0][2].creditControlLimitQar], ['CUST-2', 800, 'ACC-2', 800]);
  const fsm = await import('node:fs');
  const drawer = fsm.readFileSync('src/workspace/customer360/AccountEditDrawer.tsx', 'utf8');
  assert.match(drawer, /status: 'Submitted for Approval'/, 'a limit outside the options is a REQUEST that Credit Control approves');
  assert.match(drawer, /approverRole: COLLECTION_TEAM_ROLE/);
  assert.match(drawer, /applyAgentCreditLimitChange\(/);
  assert.doesNotMatch(drawer, /updateRecord\('credit-limits'/, 'the drawer never writes the limit itself');
  assert.match(fsm.readFileSync('src/modules/order-management/OrderApprovalDetail.tsx', 'utf8'), /applyCreditLimitChange\(\{ \.\.\.limitChange/);
});

test('customer segments: Consumer and Enterprise groups, no Premium, VIP tags and business recognition follow the list', async () => {
  const seg = await load('/src/data/customerSegments.ts');
  const biz = await load('/src/engines/businessSegment.ts');
  assert.deepEqual(seg.SEGMENT_GROUPS.map((g) => [g.group, [...g.segments]]), [
    ['Consumer', ['Consumer', 'Consumer (HRN)', 'Safwa', 'Safwa+', 'Royal']],
    ['Enterprise', ['Small Business', 'Medium Business', 'Large Business', 'Government']],
  ]);
  assert.ok(!seg.ALL_SEGMENTS.includes('Premium'));
  assert.deepEqual(['Safwa', 'Safwa+', 'Royal', 'Consumer', 'Premium'].map(seg.vipTagOf), ['VIP', 'VVIP', 'Royal', undefined, undefined]);
  assert.equal(seg.segmentGroupOf('Government'), 'Enterprise');
  assert.equal(seg.segmentGroupOf('Safwa+'), 'Consumer');
  for (const s of ['Small Business', 'Medium Business', 'Large Business', 'Government']) assert.equal(biz.isBusinessSegment(s), true, s);
  for (const s of ['Consumer', 'Consumer (HRN)', 'Safwa', 'Safwa+', 'Royal']) assert.equal(biz.isBusinessSegment(s), false, s);
  const customers = JSON.parse((await import('node:fs')).readFileSync('public/mock-data/customers.json', 'utf8'));
  assert.ok(customers.every((c) => c.segment !== 'Premium'), 'no customer carries Premium');
});

test('Personal Email ID is mandatory and Work Email ID optional, for every journey that uses the Contact step', async () => {
  const fsm = await import('node:fs');
  const read = (f) => fsm.readFileSync(f, 'utf8');
  const step = read('src/components/patterns/GuidedContactStep.tsx');
  assert.match(step, /label="Email ID"\s+type="email"\s+required/);
  assert.match(step, /label="Work Email ID"\s+type="email"\s+placeholder/);
  assert.doesNotMatch(step.slice(step.indexOf('label="Work Email ID"'), step.indexOf('label="Work Email ID"') + 200), /required/);
  const q = read('src/capabilities/CustomerQualification/step.tsx');
  assert.match(q, /isValidEmail\(c\?\.email\) && \(!c\?\.workEmail \|\| isValidEmail\(c\.workEmail\)\)/, 'personal email gates Continue; a work email is checked only when given');
  for (const f of ['new-connection/submitNewConnectionOrder', 'mobile-prepaid/screens/submitPrepaidOrder', 'mnp-fnp-porting/screens/submitMnpOrder', 'fixed-line-fibre/fixedActivation/submitFixedActivationOrder', 'pre-to-post-migration/screens/submitPreToPostOrder']) {
    assert.match(read(`src/modules/${f}.ts`), /customerWorkEmail: contact\??\.workEmail/, f);
  }
});

test('a salutation the agent enters is saved to the customer profile; none entered writes nothing; it is shown in Customer 360', async () => {
  const { saveCustomerSalutation } = await load('/src/modules/new-connection/saveCustomerSalutation.ts');
  const calls = [];
  const update = async (...a) => void calls.push(a);
  assert.equal(await saveCustomerSalutation('CUST-1', ' Dr ', update), true);
  assert.deepEqual(calls, [['customers', 'customerId', 'CUST-1', { salutation: 'Dr' }]]);
  calls.length = 0;
  for (const [id, sal] of [['CUST-1', undefined], ['CUST-1', '  '], [undefined, 'Mr']]) assert.equal(await saveCustomerSalutation(id, sal, update), false);
  assert.equal(await saveCustomerSalutation('CUST-1', 'Mr', undefined), false);
  assert.deepEqual(calls, []);
  const fsm = await import('node:fs');
  for (const f of ['new-connection/submitNewConnectionOrder', 'mobile-prepaid/screens/submitPrepaidOrder', 'mnp-fnp-porting/screens/submitMnpOrder', 'fixed-line-fibre/fixedActivation/submitFixedActivationOrder', 'pre-to-post-migration/screens/submitPreToPostOrder']) {
    assert.match(fsm.readFileSync(`src/modules/${f}.ts`, 'utf8'), /saveCustomerSalutation\(eligibility\?\.customerId, contact\??\.salutation, updateRecord\)/, f);
  }
  assert.match(fsm.readFileSync('src/workspace/customer360/sections/C360ContactIdentity.tsx', 'utf8'), /label: 'Salutation'/);
});

test('Continue passes over the Billing Profile for every customer, including a new account being created; it stays reachable from the rail', async () => {
  const { billingAccountStep } = await load('/src/capabilities/BillingAccount/step.tsx');
  const step = billingAccountStep();
  assert.equal(step.autoPass({}), true);
  assert.equal(step.autoPass({ billingAccount: { creatingNew: true } }), true, 'a new account no longer stops the journey');
  assert.equal(step.autoPass({ billingAccount: { selectedProfileId: 'BILL-7001' } }), true);
});

test('a new account records the bill type and language (Detailed / English unless changed) and the optional VAT details; the VAT expiry must be a real DD/MM/YYYY date', async () => {
  const model = await load('/src/components/patterns/billingAccountModel.ts');
  const { persistBillingAccount } = await load('/src/capabilities/BillingAccount/persistBillingAccount.ts');
  assert.deepEqual(model.BILL_TYPES.map((o) => o.value), ['Detailed', 'Summary']);
  assert.deepEqual(model.BILL_LANGUAGES.map((o) => o.value), ['English', 'Arabic']);
  assert.equal(model.DEFAULT_BILL_TYPE, 'Detailed');
  assert.equal(model.DEFAULT_BILL_LANGUAGE, 'English');
  const save = async (newAccount) => {
    const created = [];
    await persistBillingAccount({ creatingNew: true, newAccount }, { createRecord: async (kind, rec) => void created.push({ kind, rec }), kind: 'Consumer Mobile Postpaid', customerId: 'C1', creditLimitQar: 1000, nationality: 'Egyptian', agentId: 'USR-1' });
    return created.find((c) => c.kind === 'billing-profiles').rec;
  };
  const plain = await save({});
  assert.equal(plain.billType, 'Detailed');
  assert.equal(plain.billLanguage, 'English');
  assert.ok(!('vatRegistrationNumber' in plain) && !('vatExpiryDate' in plain), 'no VAT details unless entered');
  const chosen = await save({ billType: 'Summary', billLanguage: 'Arabic', vatRegistrationNumber: ' VAT-1 ', vatExpiryDate: '31/12/2030' });
  assert.deepEqual([chosen.billType, chosen.billLanguage, chosen.vatRegistrationNumber, chosen.vatExpiryDate], ['Summary', 'Arabic', 'VAT-1', '31/12/2030']);
  for (const ok of [undefined, '', '29/02/2028']) assert.equal(model.isValidVatExpiry(ok), true, String(ok));
  for (const bad of ['31/02/2030', '2030-12-31', '1/1/2030', 'soon']) assert.equal(model.isValidVatExpiry(bad), false, bad);
  const valid = { creatingNew: true, newAccount: { primaryContactId: 'C', preferredInvoiceRecipient: 'Primary Contact', cardToken: 'T', profileName: 'P' } };
  assert.equal(model.isBillingAccountValid(valid), true);
  assert.equal(model.isBillingAccountValid({ ...valid, newAccount: { ...valid.newAccount, vatExpiryDate: '31/02/2030' } }), false, 'a bad VAT date blocks the step');
});

test('the billing contacts come from the account: the chosen primary contact\'s own record supplies their details, an optional secondary contact is saved by name with theirs, and the customer\'s own details are kept when they are the primary', async () => {
  const { persistBillingAccount } = await load('/src/capabilities/BillingAccount/persistBillingAccount.ts');
  const run = async (newAccount) => {
    const created = [];
    await persistBillingAccount({ creatingNew: true, newAccount }, { createRecord: async (kind, rec) => void created.push({ kind, rec }), kind: 'Consumer Mobile Postpaid', customerId: 'CUST-1', contactName: 'Ahmed Customer', contactEmail: 'ahmed@example.qa', contactPhone: '+97455512001', creditLimitQar: 1000, nationality: 'Egyptian', agentId: 'USR-1' });
    assert.ok(!created.some((c) => c.kind === 'customer-contacts'), 'no contact is created: they are chosen from those on the account');
    return created.find((c) => c.kind === 'billing-profiles').rec;
  };
  const own = await run({ primaryContactId: 'CTC-1', primaryContactName: 'Ahmed Customer' });
  assert.deepEqual([own.billingContactName, own.billingContactEmail, own.billingContactPhone], ['Ahmed Customer', 'ahmed@example.qa', '+97455512001'], 'the customer is the primary: their own verified details');
  assert.ok(!('secondaryContactName' in own), 'a secondary contact is optional');
  const other = await run({ primaryContactId: 'CTC-2', primaryContactName: 'Mariam Al-Sulaiti', primaryContactPhone: '+97455512099', primaryContactEmail: '' });
  assert.deepEqual([other.billingContactName, other.billingContactEmail, other.billingContactPhone], ['Mariam Al-Sulaiti', undefined, '+97455512099'], 'another contact: their record, and never the customer\'s email');
  const both = await run({ primaryContactId: 'CTC-1', primaryContactName: 'Ahmed Customer', secondaryContactId: 'CTC-2', hasSecondaryContact: true, secondaryContactName: 'Mariam Al-Sulaiti', secondaryContactPhone: '+97455512099' });
  assert.deepEqual([both.secondaryContactName, both.secondaryContactPhone, 'secondaryContactEmail' in both], ['Mariam Al-Sulaiti', '+97455512099', false]);
});

test('the Billing step offers a secondary contact only when the account has more than one contact, and picks a lone contact for the agent', () => {
  const src = fs.readFileSync('src/components/patterns/BillingAccountStep.tsx', 'utf8');
  assert.match(src, /contactOptions\.length > 1/, 'secondary contacts are offered from the account\'s other contacts');
  assert.match(src, /needsDefaultPrimary/, 'a lone (or the customer\'s own) contact is selected by default');
  assert.doesNotMatch(src, /label="First Name"/, 'no contact name is typed here');
});

test('plans on the Special Offers tab are named after the Special Discount they are offered under, once', async () => {
  const { specialOfferPlanName } = await load('/src/components/patterns/postpaidPlanModel.ts');
  assert.equal(specialOfferPlanName('Postpaid Plus Essential Promotion', 'retired'), 'Retiree Postpaid Plus Essential Promotion');
  assert.equal(specialOfferPlanName('Postpaid Plus Essential Pakistan Promotion', 'b2b2c'), 'Consumer B2B2C Postpaid Plus Essential Pakistan Promotion');
  assert.equal(specialOfferPlanName('Postpaid Plus Essential Promotion', 'mada'), 'MADA Postpaid Plus Essential Promotion');
  assert.equal(specialOfferPlanName('Retiree Postpaid Plus', 'retired'), 'Retiree Postpaid Plus', 'not repeated');
  assert.equal(specialOfferPlanName('Postpaid Plus', 'none'), 'Postpaid Plus');
  assert.equal(specialOfferPlanName('Postpaid Plus', undefined), 'Postpaid Plus');
});

test('a held Qnomy ticket is closed once - by Finish, Done & Exit or Create Activity - and the next customer can then be called', async () => {
  const { closeHeldQnomyTicket } = await load('/src/engines/qnomyRelease.ts');
  const { useQnomyQueueStore } = await load('/src/stores/qnomyQueueStore.ts');
  const { useEntityStore } = await load('/src/stores/entityStore.ts');
  const writes = [];
  useEntityStore.setState({ updateRecord: async (kind, idField, id, patch) => void writes.push({ kind, id, patch }) });
  assert.equal(await closeHeldQnomyTicket(), false, 'no ticket held: nothing to close');
  useQnomyQueueStore.setState({ assignedQTicketId: 'QTK-1', kioskMobileNumber: '+97455512001', awaitingNext: false, customersServed: 0 });
  assert.equal(await closeHeldQnomyTicket(), true);
  const q = useQnomyQueueStore.getState();
  assert.deepEqual([q.assignedQTicketId, q.kioskMobileNumber, q.awaitingNext, q.customersServed], [null, null, true, 1]);
  assert.deepEqual([writes[0].kind, writes[0].id, writes[0].patch.status, writes[0].patch.agentInDxpSessionId], ['qtickets', 'QTK-1', 'Completed', null]);
  assert.equal(await closeHeldQnomyTicket(), false, 'a second action on the same page does not close or count it again');
  assert.equal(writes.length, 1);
  for (const f of ['src/components/patterns/ActivationCompleteScreen.tsx', 'src/navigation/SessionReferenceNumbers.tsx']) assert.match(fs.readFileSync(f, 'utf8'), /closeHeldQnomyTicket\(\)/, f);
});

test('a new customer\'s NAS mobile is offered as the Personal Mobile, masked like the email (first and last digit, fixed stars); an existing customer\'s is not, and an edit shows as typed', async () => {
  const m = await load('/src/components/patterns/guidedContactModel.ts');
  assert.equal(m.maskMobile('+97455512345'), '5******5');
  assert.equal(m.maskMobile('55512345'), '5******5');
  assert.equal(m.maskMobile(''), '');
  const nas = { isNewCustomer: true, mobile: '+97455512345', name: 'N', dob: '', nationality: '' };
  assert.equal(m.identityFromMoi(nas).personalMobile, '+97455512345');
  assert.equal(m.identityFromMoi({ ...nas, isNewCustomer: false }).personalMobile, undefined);
  assert.equal(m.identityFromMoi({ ...nas, createdByAgent: true }).personalMobile, undefined);
  assert.equal(m.displayedMobile({ personalMobile: '+97455512345', moiResult: nas }), '5******5', 'still the NAS number: masked');
  assert.equal(m.displayedMobile({ personalMobile: '+97466000000', moiResult: nas }), undefined, 'typed over: shown as typed');
  const records = JSON.parse(fs.readFileSync('public/mock-data/nas-records.json', 'utf8'));
  assert.ok(records.every((r) => /^\+974\d{8}$/.test(r.mobile)), 'every NAS record carries a sample Qatar mobile');
});
