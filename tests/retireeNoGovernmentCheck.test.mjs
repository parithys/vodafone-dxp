// Retiree is not validated with a government system: choosing it triggers no such call, and it needs only the accepted supporting document (like MADA).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { boot, load, close } from './harness.mjs';

let customerType, specialDiscounts;
before(async () => {
  await boot();
  customerType = await load('/src/capabilities/CustomerType/customerTypeModel.ts');
  specialDiscounts = await load('/src/capabilities/SpecialDiscountsIdentification/specialDiscountsModel.ts');
});
after(close);

const accepted = { frontScanned: true, backScanned: true };
for (const [name, getModel] of [['Customer Type', () => customerType], ['Special Discounts Identification', () => specialDiscounts]]) {
  test(`${name}: Retiree is valid with the accepted supporting document alone - no government result is needed or recorded`, () => {
    const m = getModel();
    assert.equal(m.isCustomerTypeValid({ type: 'retired', officeId: accepted, officeAccepted: true }), true);
    assert.equal(m.isCustomerTypeValid({ type: 'retired', officeId: accepted, officeAccepted: false }), false, 'the agent must accept the document');
    assert.equal(m.isCustomerTypeValid({ type: 'retired', officeId: { frontScanned: true }, officeAccepted: true }), false, 'both sides are needed');
    assert.equal(m.isCustomerTypeValid({ type: 'retired' }), false);
    // Same rule as MADA, on the same evidence (both ways: valid and not valid).
    for (const ev of [{ officeId: accepted, officeAccepted: true }, { officeId: accepted, officeAccepted: false }, {}]) {
      assert.equal(m.isCustomerTypeValid({ type: 'retired', ...ev }), m.isCustomerTypeValid({ type: 'mada', ...ev }));
    }
    assert.equal('validateRetiredWithGovernment' in m, false);
  });
}

test('nothing in the app reaches a government system: no service, no registry fetch, no validation state', () => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
  const offenders = walk('src').filter((f) => /govt-retiree|validateRetiredWithGovernment|govValidation|govAttempts|retiree-registry/.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, []);
});
