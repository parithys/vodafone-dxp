// The HRN configuration: nationality -> categories, HRN or not, the advance by category and persona, the default credit limit by category.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { load, close } from './harness.mjs';

after(close);
const hrn = await load('/src/engines/hrnConfiguration.ts');
const rules = await load('/src/engines/ruleEngine.ts');

test('every nationality on the business list maps to a configured category, by demonym and by country', () => {
  const expected = ['pakistani', 'pakistan', 'bangladeshi', 'bangladesh', 'cambodian', 'cambodia', 'myanmar', 'myanmarese', 'burmese', 'laotian', 'lao', 'laos', 'kenyan', 'kenya', 'ugandan', 'uganda', 'swazi', 'emaswati', 'eswatini'];
  assert.deepEqual(Object.keys(hrn.NATIONALITY_HRN_CATEGORIES).sort(), [...expected].sort());
  const ids = new Set(hrn.HRN_CATEGORIES.map((c) => c.id));
  for (const [nat, cats] of Object.entries(hrn.NATIONALITY_HRN_CATEGORIES)) {
    assert.ok(cats.length >= 1, nat);
    for (const c of cats) assert.ok(ids.has(c), `${nat} -> ${c} is a configured category`);
  }
});

test('HRN or not follows the nationality (any case or spacing) and, when named, the category', () => {
  for (const n of ['Pakistani', ' KENYAN ', 'Bangladesh', 'Eswatini']) assert.equal(hrn.isHrn(n), true, n);
  for (const n of ['Qatari', 'Indian', 'Nepalese', '', undefined]) assert.equal(hrn.isHrn(n), false, String(n));
  assert.equal(hrn.isHrn('Pakistani', 'STANDARD_HRN'), true);
  assert.equal(hrn.isHrn('Pakistani', 'RESTRICTED_SERVICE'), false, 'not in the category asked about');
  assert.equal(hrn.isHrn('Qatari', 'STANDARD_HRN'), false);
  assert.equal(rules.isHrnNationality('Pakistani'), true, 'the rule engine reads the same configuration');
});

test('the advance payment: the category amount (QAR 100 today), zero for a non-HRN customer, a persona override when one is configured', () => {
  assert.equal(hrn.hrnAdvanceQar({ nationality: 'Pakistani' }), 100);
  assert.equal(hrn.hrnAdvanceQar({ nationality: 'Pakistani', personaId: 'ROLE-01' }), 100, 'no persona pays differently today');
  assert.equal(hrn.hrnAdvanceQar({ nationality: 'Qatari' }), 0);
  assert.equal(hrn.hrnAdvanceQar(), 100, 'with only "HRN" known, the first category\'s amount');
  const cat = { id: 'X', label: 'X', configured: true, advance: { defaultQar: 100, byPersona: { 'ROLE-09': 40 } }, creditLimitQar: 50 };
  assert.equal(hrn.categoryAdvanceQar(cat, 'ROLE-09'), 40);
  assert.equal(hrn.categoryAdvanceQar(cat, 'ROLE-01'), 100);
  assert.equal(hrn.categoryAdvanceQar(cat), 100);
});

test('the default credit limit: HRN 50 (the category\'s), Qatari 4000, Expat 1000', () => {
  assert.equal(hrn.defaultCreditLimit({ nationality: 'Kenyan' }), 50);
  assert.equal(hrn.defaultCreditLimit({ nationality: 'Qatari' }), 4000);
  assert.equal(hrn.defaultCreditLimit({ nationality: 'qatar' }), 4000);
  assert.equal(hrn.defaultCreditLimit({ nationality: 'Indian' }), 1000);
  assert.equal(hrn.defaultCreditLimit({ hrn: true }), 50);
  assert.equal(hrn.defaultCreditLimit({ hrn: false }), 1000, 'nothing says Qatari: the Expat default stands');
  assert.equal(hrn.defaultCreditLimit(), 1000);
  assert.equal(hrn.NON_HRN_CREDIT_LIMIT_QAR, 1000);
  assert.equal(hrn.QATARI_CREDIT_LIMIT_QAR, 4000);
  assert.equal(rules.defaultCreditLimitQar(true), 50, 'BR-076 reads the same configuration');
  assert.equal(rules.defaultCreditLimitQar(false), 1000);
  assert.equal(rules.defaultCreditLimitQar(false, 'Qatari'), 4000);
  assert.equal(rules.defaultCreditLimitQar(true, 'Qatari'), 50, 'HRN wins');
  assert.match(rules.evaluateRule('BR-076', { hrnFlag: false, nationality: 'Qatari' }).message, /QAR 4,000/);
});

test('several categories for one nationality: the most cautious applies unless one is named (supported, not configured)', () => {
  // Exercised with a temporary configuration: the shipped one puts every nationality in the one category.
  const high = { id: 'RESTRICTED_SERVICE', label: 'Restricted Service', configured: true, advance: { defaultQar: 250 }, creditLimitQar: 20 };
  const original = hrn.HRN_CATEGORIES.indexOf(hrn.HRN_CATEGORIES.find((c) => c.id === 'RESTRICTED_SERVICE'));
  const saved = hrn.HRN_CATEGORIES[original];
  hrn.HRN_CATEGORIES[original] = high;
  hrn.NATIONALITY_HRN_CATEGORIES.testland = ['STANDARD_HRN', 'RESTRICTED_SERVICE'];
  try {
    assert.equal(hrn.hrnCategoriesOf('Testland').length, 2);
    assert.equal(hrn.hrnAdvanceQar({ nationality: 'Testland' }), 250, 'the highest advance');
    assert.equal(hrn.defaultCreditLimit({ nationality: 'Testland' }), 20, 'the lowest limit');
    assert.equal(hrn.hrnAdvanceQar({ nationality: 'Testland', categoryId: 'STANDARD_HRN' }), 100, 'a named category narrows it');
    assert.equal(hrn.defaultCreditLimit({ nationality: 'Testland', categoryId: 'STANDARD_HRN' }), 50);
  } finally {
    hrn.HRN_CATEGORIES[original] = saved;
    delete hrn.NATIONALITY_HRN_CATEGORIES.testland;
  }
});

test('the four categories are declared, but only Standard HRN is configured - with the confirmed QAR 100 advance and QAR 50 credit limit', () => {
  assert.deepEqual(hrn.HRN_CATEGORIES.map((c) => c.id), ['STANDARD_HRN', 'ENHANCED_FINANCIAL_CONTROLS', 'ENHANCED_VERIFICATION', 'RESTRICTED_SERVICE']);
  assert.deepEqual(hrn.HRN_CATEGORIES.filter((c) => c.configured).map((c) => c.id), ['STANDARD_HRN']);
  const standard = hrn.HRN_CATEGORIES[0];
  assert.deepEqual([standard.advance.defaultQar, standard.creditLimitQar, hrn.NON_HRN_CREDIT_LIMIT_QAR], [100, 50, 1000]);
  assert.equal(standard.advance.byPersona, undefined, 'persona-specific advance: not configured');
  for (const c of hrn.HRN_CATEGORIES.filter((x) => !x.configured)) assert.deepEqual([c.advance, c.creditLimitQar], [undefined, undefined], `${c.id} has no values`);
  // Multiple HRN categories: not configured - every nationality is in exactly Standard HRN.
  for (const [nat, cats] of Object.entries(hrn.NATIONALITY_HRN_CATEGORIES)) assert.deepEqual([...cats], ['STANDARD_HRN'], nat);
  // A nationality tagged with an unconfigured category is not HRN through it, and has no advance or limit from it.
  hrn.NATIONALITY_HRN_CATEGORIES.paperland = ['RESTRICTED_SERVICE'];
  try {
    assert.equal(hrn.isHrn('Paperland'), false);
    assert.equal(hrn.hrnAdvanceQar({ nationality: 'Paperland' }), 0);
    assert.equal(hrn.defaultCreditLimit({ nationality: 'Paperland' }), 1000);
  } finally {
    delete hrn.NATIONALITY_HRN_CATEGORIES.paperland;
  }
});

test('the six risk indicators are defined, none is configured, and nothing reads them yet', () => {
  assert.deepEqual(hrn.HRN_RISK_INDICATORS.map((i) => i.label), ['Fraud', 'Identity Fraud', 'Phishing', 'Financial Scam', 'Cybercrime', 'AML Review']);
  assert.ok(hrn.HRN_RISK_INDICATORS.every((i) => i.configured === false));
});

test('nothing else restates the HRN list or the HRN figures: they live in hrnConfiguration.ts only', async () => {
  const fsm = await import('node:fs');
  const pathm = await import('node:path');
  const walk = (d) => fsm.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(pathm.join(d, e.name)) : [pathm.join(d, e.name)]));
  for (const f of walk('src').filter((x) => /\.(ts|tsx)$/.test(x) && !x.endsWith('hrnConfiguration.ts'))) {
    const src = fsm.readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /'pakistani'|HRN_NATIONALITIES|HRN_ADVANCE_QAR/, `${f} restates the HRN list or advance`);
  }
});
