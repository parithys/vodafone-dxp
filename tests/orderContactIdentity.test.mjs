// The Sponsor (employer) and Occupation shown on Identity Details are recorded against the contact on every journey's order.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { boot, load, close } from './harness.mjs';

let fields, nc;
before(async () => {
  await boot();
  globalThis.addEventListener ??= () => {};
  globalThis.removeEventListener ??= () => {};
  fields = await load('/src/modules/new-connection/contactIdentityOrderFields.ts');
  nc = await load('/src/modules/new-connection/submitNewConnectionOrder.ts');
});
after(close);

test('sponsor and occupation are recorded as shown; a blank or missing value is absent, never a default', () => {
  assert.deepEqual(fields.contactIdentityOrderFields({ companyName: ' Qatar Gas ', occupation: 'Engineer' }), { customerSponsor: 'Qatar Gas', customerOccupation: 'Engineer' });
  assert.deepEqual(fields.contactIdentityOrderFields({ occupation: 'Teacher' }), { customerOccupation: 'Teacher' });
  assert.deepEqual(fields.contactIdentityOrderFields({ companyName: 'Qatar Gas' }), { customerSponsor: 'Qatar Gas' });
  assert.deepEqual(fields.contactIdentityOrderFields({ companyName: '  ', occupation: '' }), {});
  assert.deepEqual(fields.contactIdentityOrderFields(undefined), {});
});

test('a submitted order carries the contact\'s sponsor and occupation, apart from the B2B2C company', async () => {
  const submit = async (contactExtra) => {
    const created = [];
    await nc.submitNewConnectionOrder(
      {
        contact: { idNumber: '28456701234', idType: 'QID', email: 'a@example.qa', moiResult: { name: 'A', nationality: 'Qatari', dob: '1985-03-12', customerId: 'CUST-1001' }, ...contactExtra },
        eligibility: { customerId: 'CUST-1001', checks: [], nationality: 'Qatari' },
        productId: 'PROD-104',
      },
      { flow: 'existing', createRecord: async (kind, rec) => void created.push({ kind, rec }), updateRecord: async () => {} }
    );
    return created.find((c) => c.kind === 'orders').rec;
  };
  const withBoth = await submit({ companyName: 'Qatar Gas', occupation: 'Engineer' });
  assert.equal(withBoth.customerSponsor, 'Qatar Gas');
  assert.equal(withBoth.customerOccupation, 'Engineer');
  assert.equal(withBoth.companyName, undefined, 'the B2B2C company field is not overloaded');
  const none = await submit({});
  assert.ok(!('customerSponsor' in none) && !('customerOccupation' in none), 'nothing on the record, nothing on the order');
});

test('every journey\'s order records them the same way, through the shared helper', () => {
  for (const f of [
    'src/modules/new-connection/submitNewConnectionOrder.ts',
    'src/modules/mobile-prepaid/screens/submitPrepaidOrder.ts',
    'src/modules/mnp-fnp-porting/screens/submitMnpOrder.ts',
    'src/modules/pre-to-post-migration/screens/submitPreToPostOrder.ts',
    'src/modules/fixed-line-fibre/fixedActivation/submitFixedActivationOrder.ts',
  ]) assert.match(fs.readFileSync(f, 'utf8'), /\.\.\.contactIdentityOrderFields\(contact\)/, `${f} must record sponsor and occupation`);
});

test('Sponsor and Occupation are captured but not shown in a journey: the Identity Details card lists neither, Customer 360 does', async () => {
  const { identityFacts } = await load('/src/capabilities/CustomerIdentification/IdentityDetailsCard.tsx');
  const labels = identityFacts({ firstName: 'A', companyName: 'Qatar Gas', occupation: 'Engineer' }).map((f) => f.label);
  assert.ok(!labels.includes('Sponsor') && !labels.includes('Occupation'));
  const c360 = fs.readFileSync('src/workspace/customer360/sections/C360ContactIdentity.tsx', 'utf8');
  assert.match(c360, /label: 'Sponsor'/);
  assert.match(c360, /label: 'Occupation'/);
});
