// Connection Eligibility & Approval Rule Engine (src/domain/eligibility): table-driven, one group per rule family.
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load, close } from './harness.mjs';

const engine = await load('/src/domain/eligibility/engine.ts');
const { ruleConfigV1: V1 } = await load('/src/domain/eligibility/config/eligibility.rules.v1.ts');
const { validateRuleConfig } = await load('/src/domain/eligibility/config/schema.ts');
const { evaluateEligibility, evaluateCart } = engine;

const CLOCK = () => new Date('2026-10-19T09:00:00.000Z');
const TYPE = { prepaid: 'MOBILE_PREPAID', postpaid: 'MOBILE_POSTPAID', fixed: 'FIXED_FWA' };

const lines = (prepaid, postpaid, fixed, status = 'ACTIVE') => {
  const out = [];
  const add = (n, type, tag) => { for (let i = 0; i < n; i++) out.push({ lineId: `${tag}${i}`, type, status }); };
  add(prepaid, TYPE.prepaid, 'pre');
  add(postpaid, TYPE.postpaid, 'post');
  add(fixed, TYPE.fixed, 'fix');
  return out;
};
const request = ({ nat = 'IN', id = 'QID', age = 30, counts = [0, 0, 0], ask, kind = 'NEW_ACTIVATION', pending = [], existing, requestId = 'R-1' } = {}) => ({
  requestId,
  customer: { customerId: 'C-1', nationality: nat, idType: id, age },
  requestedType: TYPE[ask],
  requestKind: kind,
  existingLines: existing ?? lines(...counts),
  pendingOrders: pending,
});
const run = (r, config = V1) => evaluateEligibility(r, config, CLOCK);
const types = (d) => d.approvals.map((a) => a.type);

describe('overall mobile limit (OE-01..03) and the whole table of the brief', () => {
  const cases = [
    [1, 'expat QID 0/0/0 postpaid', { counts: [0, 0, 0], ask: 'postpaid' }, 'ALLOW', []],
    [2, 'expat QID 0/2/0 postpaid', { counts: [0, 2, 0], ask: 'postpaid' }, 'ALLOW_WITH_APPROVAL', ['CREDIT_CONTROL']],
    [3, 'expat QID 3/1/0 postpaid (total reaches 5)', { counts: [3, 1, 0], ask: 'postpaid' }, 'ALLOW', []],
    [4, 'expat QID 3/2/0 postpaid', { counts: [3, 2, 0], ask: 'postpaid' }, 'BLOCK', [], 'ELIG_MOBILE_TOTAL_CAP_REACHED'],
    [5, 'expat QID 1/3/0 postpaid', { counts: [1, 3, 0], ask: 'postpaid' }, 'ALLOW_WITH_APPROVAL', ['CREDIT_CONTROL']],
    [6, 'expat QID 4/0/0 prepaid', { counts: [4, 0, 0], ask: 'prepaid' }, 'ALLOW', []],
    [7, 'expat QID 0/5/0 prepaid', { counts: [0, 5, 0], ask: 'prepaid' }, 'BLOCK', [], 'ELIG_MOBILE_TOTAL_CAP_REACHED'],
    [8, 'expat QID 3/2/0 fixed (FX-05 independence)', { counts: [3, 2, 0], ask: 'fixed' }, 'ALLOW', []],
    [9, 'expat QID 0/0/1 fixed', { counts: [0, 0, 1], ask: 'fixed' }, 'ALLOW_WITH_APPROVAL', ['CREDIT_CONTROL']],
    [10, 'Qatari QID 0/5/0 postpaid', { nat: 'QA', counts: [0, 5, 0], ask: 'postpaid' }, 'ALLOW_WITH_APPROVAL', ['CREDIT_CONTROL']],
    [11, 'Qatari QID 20/4/0 postpaid (no total cap)', { nat: 'QA', counts: [20, 4, 0], ask: 'postpaid' }, 'ALLOW', []],
    [12, 'Qatari QID 0/0/2 fixed', { nat: 'QA', counts: [0, 0, 2], ask: 'fixed' }, 'ALLOW_WITH_APPROVAL', ['CREDIT_CONTROL']],
    [13, 'Qatari QID 0/0/1 fixed', { nat: 'QA', counts: [0, 0, 1], ask: 'fixed' }, 'ALLOW', []],
    [14, 'expat passport 0/0/0 postpaid', { id: 'PASSPORT', counts: [0, 0, 0], ask: 'postpaid' }, 'ALLOW_WITH_APPROVAL', ['BAU']],
    [15, 'expat passport 0/2/0 postpaid', { id: 'PASSPORT', counts: [0, 2, 0], ask: 'postpaid' }, 'ALLOW_WITH_APPROVAL', ['BAU', 'CREDIT_CONTROL']],
    [16, 'expat passport age 17 0/2/0 postpaid', { id: 'PASSPORT', age: 17, counts: [0, 2, 0], ask: 'postpaid' }, 'ALLOW_WITH_APPROVAL', ['BAU', 'CREDIT_CONTROL', 'EXCEPTION_UNDER_18']],
    [17, 'expat QID 0/1/0 + 1 pending postpaid order', { counts: [0, 1, 0], ask: 'postpaid', pending: [{ orderId: 'O-1', type: TYPE.postpaid }] }, 'ALLOW_WITH_APPROVAL', ['CREDIT_CONTROL']],
    [18, 'expat QID, 5 terminated lines, prepaid', { existing: lines(5, 0, 0, 'TERMINATED'), ask: 'prepaid' }, 'ALLOW', []],
  ];
  for (const [n, name, input, outcome, approvals, reason] of cases) {
    test(`#${n} ${name} -> ${outcome}${approvals.length ? ` [${approvals.join(', ')}]` : ''}${reason ? ` ${reason}` : ''}`, () => {
      const d = run(request(input));
      assert.equal(d.outcome, outcome);
      assert.deepEqual(types(d), approvals);
      assert.equal(d.block?.reasonCode, reason);
      assert.equal(d.countsAfter === null, outcome === 'BLOCK');
      assert.equal(d.ruleSetVersion, '1.0.0');
      assert.equal(d.evaluatedAt, '2026-10-19T09:00:00.000Z');
    });
  }

  test('the block message names the counts and the limit', () => {
    const d = run(request({ counts: [3, 2, 0], ask: 'postpaid' }));
    assert.equal(d.block.message, 'Customer holds 5 of 5 mobile lines (3 prepaid, 2 postpaid). New mobile activation not permitted.');
    assert.equal(d.block.ruleId, 'OE-01');
  });
  test('no approval can override OE-01, and a blocked request returns no approvals (XC-03)', () => {
    const d = run(request({ id: 'PASSPORT', age: 17, counts: [0, 5, 0], ask: 'postpaid' }));
    assert.equal(d.outcome, 'BLOCK');
    assert.deepEqual(d.approvals, []);
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'XC-03').result, 'BLOCKED');
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'PB-01').result, 'SKIPPED', 'approvals are not derived after a block');
  });
  test('the overall limit also applies to a passport (PB-03)', () => {
    const d = run(request({ id: 'PASSPORT', counts: [3, 2, 0], ask: 'prepaid' }));
    assert.equal(d.block.reasonCode, 'ELIG_MOBILE_TOTAL_CAP_REACHED');
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'PB-03').result, 'PASS');
  });
});

describe('postpaid (PP-01..05)', () => {
  const byOrdinal = (nat, upTo) => Array.from({ length: upTo }, (_, i) => run(request({ nat, counts: [0, i, 0], ask: 'postpaid' })));
  test('expatriate: 1-2 free (PP-01), 3-5 Credit Control (PP-02)', () => {
    const ds = byOrdinal('IN', 5);
    assert.deepEqual(ds.map((d) => d.outcome), ['ALLOW', 'ALLOW', 'ALLOW_WITH_APPROVAL', 'ALLOW_WITH_APPROVAL', 'ALLOW_WITH_APPROVAL']);
    assert.equal(ds[2].approvals[0].ruleId, 'PP-02');
    assert.equal(ds[2].approvals[0].reasonCode, 'APPR_CC_POSTPAID_THRESHOLD');
    assert.equal(ds[0].rulesEvaluated.find((r) => r.ruleId === 'PP-01').result, 'PASS');
  });
  test('expatriate 6th is blocked defensively (PP-03) once the overall limit does not apply (migration)', () => {
    const d = run(request({ counts: [1, 5, 0], ask: 'postpaid', kind: 'PREPAID_TO_POSTPAID_MIGRATION' }));
    assert.equal(d.block.ruleId, 'PP-03');
    assert.equal(d.block.reasonCode, 'ELIG_POSTPAID_CAP_REACHED');
  });
  test('Qatari: 1-5 free (PP-04), 6 and beyond Credit Control with no upper limit (PP-05)', () => {
    const free = run(request({ nat: 'QA', counts: [0, 4, 0], ask: 'postpaid' }));
    assert.equal(free.outcome, 'ALLOW');
    const many = run(request({ nat: 'QA', counts: [0, 60, 0], ask: 'postpaid' }));
    assert.deepEqual(types(many), ['CREDIT_CONTROL']);
    assert.equal(many.approvals[0].ruleId, 'PP-05');
  });
  test('a Qatari postpaid maximum, when configured, blocks', () => {
    const cfg = { ...V1, qatari: { ...V1.qatari, postpaid: { freeUpTo: 5, max: 8 } } };
    const d = run(request({ nat: 'QA', counts: [0, 8, 0], ask: 'postpaid' }), cfg);
    assert.equal(d.block.reasonCode, 'ELIG_POSTPAID_CAP_REACHED');
  });
});

describe('prepaid (PR-01..02)', () => {
  test('expatriate prepaid is capped by the overall limit and, separately, by its own maximum', () => {
    assert.equal(run(request({ counts: [4, 0, 0], ask: 'prepaid' })).outcome, 'ALLOW');
    const cfg = { ...V1, expatriate: { ...V1.expatriate, mobileTotalMax: null } };
    const d = run(request({ counts: [5, 0, 0], ask: 'prepaid' }), cfg);
    assert.equal(d.block.reasonCode, 'ELIG_PREPAID_CAP_REACHED');
    assert.equal(d.block.ruleId, 'PR-01');
  });
  test('Qatari prepaid is unlimited with the default configuration (PR-02); the TBC key is reported only where its other reading would decide', () => {
    const few = run(request({ nat: 'QA', counts: [5, 0, 0], ask: 'prepaid' }));
    assert.equal(few.outcome, 'ALLOW');
    assert.ok(!few.pendingConfirmations.includes('qatari.prepaid.max'), 'a maximum of 10 would not have blocked the 6th line');
    const many = run(request({ nat: 'QA', counts: [40, 0, 0], ask: 'prepaid' }));
    assert.equal(many.outcome, 'ALLOW');
    assert.ok(many.pendingConfirmations.includes('qatari.prepaid.max'), 'a maximum of 10 would have blocked the 41st');
  });
  test('#20 Qatari prepaid with qatari.prepaid.max = 10 blocks at 10 and reports the TBC key', () => {
    const cfg = { ...V1, qatari: { ...V1.qatari, prepaid: { max: 10 } } };
    const d = run(request({ nat: 'QA', counts: [10, 0, 0], ask: 'prepaid' }), cfg);
    assert.equal(d.outcome, 'BLOCK');
    assert.equal(d.block.reasonCode, 'ELIG_PREPAID_CAP_REACHED');
    assert.ok(d.pendingConfirmations.includes('qatari.prepaid.max'));
  });
});

describe('Fixed / FWA (FX-01..05)', () => {
  test('Qatari fixed maximum, when configured, blocks the next line and reports the key', () => {
    const cfg = { ...V1, qatari: { ...V1.qatari, fixedFwa: { freeUpTo: 2, max: 10 } } };
    const d = run(request({ nat: 'QA', counts: [0, 0, 10], ask: 'fixed' }), cfg);
    assert.equal(d.block.reasonCode, 'ELIG_FIXED_FWA_CAP_REACHED');
    assert.equal(d.block.ruleId, 'FX-04');
    assert.ok(d.pendingConfirmations.includes('qatari.fixedFwa.max'));
  });
  test('an expatriate fixed maximum, when configured, blocks (FX-02)', () => {
    const cfg = { ...V1, expatriate: { ...V1.expatriate, fixedFwa: { freeUpTo: 1, max: 3 } } };
    assert.equal(run(request({ counts: [0, 0, 3], ask: 'fixed' }), cfg).block.ruleId, 'FX-02');
  });
  test('fixed lines never count toward mobile, and mobile never toward fixed (FX-05)', () => {
    const d = run(request({ counts: [3, 2, 0], ask: 'fixed' }));
    assert.equal(d.countsAfter.mobileTotal, 5);
    assert.equal(d.countsAfter.fixedFwa, 1);
    assert.equal(run(request({ counts: [0, 0, 9], ask: 'prepaid' })).outcome, 'ALLOW');
  });
});

describe('passport rule (PB-01..03), behind passportBauRule.enabled', () => {
  test('applied: BAU on every postpaid, and Credit Control from the 3rd to the 5th; the key is reported', () => {
    const d = run(request({ id: 'PASSPORT', counts: [0, 3, 0], ask: 'postpaid' }));
    assert.deepEqual(types(d), ['BAU', 'CREDIT_CONTROL']);
    assert.ok(d.pendingConfirmations.includes('passportBauRule.enabled'));
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'PB-01').result, 'TRIGGERED');
  });
  test('Qatari on a passport: the passport band asks for Credit Control where PP-04 would not', () => {
    const d = run(request({ nat: 'QA', id: 'PASSPORT', counts: [0, 2, 0], ask: 'postpaid' }));
    assert.deepEqual(types(d), ['BAU', 'CREDIT_CONTROL']);
    assert.equal(d.approvals[1].ruleId, 'PB-02');
  });
  test('not postpaid -> not applied, and the key is not reported', () => {
    const d = run(request({ id: 'PASSPORT', counts: [0, 0, 0], ask: 'prepaid' }));
    assert.equal(d.outcome, 'ALLOW');
    assert.ok(!d.pendingConfirmations.includes('passportBauRule.enabled'));
  });
  test('disabled by configuration', () => {
    const cfg = { ...V1, passportBauRule: { ...V1.passportBauRule, enabled: false } };
    const d = run(request({ id: 'PASSPORT', counts: [0, 0, 0], ask: 'postpaid' }), cfg);
    assert.equal(d.outcome, 'ALLOW');
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'PB-01').result, 'SKIPPED');
  });
});

describe('cross-cutting (XC-01..03), migration, pending orders, cart, profile', () => {
  test('XC-01 approvals are de-duplicated and returned BAU, CREDIT_CONTROL, EXCEPTION_UNDER_18', () => {
    const d = run(request({ id: 'PASSPORT', age: 17, counts: [0, 2, 0], ask: 'postpaid' }));
    assert.deepEqual(types(d), ['BAU', 'CREDIT_CONTROL', 'EXCEPTION_UNDER_18']);
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'XC-01').result, 'TRIGGERED', 'PP-02 and PB-02 both asked for Credit Control');
    assert.equal(d.approvals.find((a) => a.type === 'CREDIT_CONTROL').ruleId, 'PP-02', 'the first rule to ask is named');
  });
  test('XC-02 the age threshold is configuration, and applies to any connection type', () => {
    assert.deepEqual(types(run(request({ age: 17, counts: [0, 0, 0], ask: 'fixed' }))), ['EXCEPTION_UNDER_18']);
    assert.equal(run(request({ age: 18, counts: [0, 0, 0], ask: 'fixed' })).outcome, 'ALLOW');
    const cfg = { ...V1, exceptions: { under18: { enabled: true, ageThreshold: 21 } } };
    assert.deepEqual(types(run(request({ age: 20, ask: 'prepaid' }), cfg)), ['EXCEPTION_UNDER_18']);
    const off = { ...V1, exceptions: { under18: { enabled: false, ageThreshold: 18 } } };
    assert.equal(run(request({ age: 5, ask: 'prepaid' }), off).outcome, 'ALLOW');
  });
  test('#19 migration skips OE-01, applies the postpaid thresholds to the new ordinal and reports the migration key', () => {
    const d = run(request({ counts: [3, 2, 0], ask: 'postpaid', kind: 'PREPAID_TO_POSTPAID_MIGRATION' }));
    assert.equal(d.outcome, 'ALLOW_WITH_APPROVAL');
    assert.deepEqual(types(d), ['CREDIT_CONTROL']);
    assert.equal(d.rulesEvaluated.find((r) => r.ruleId === 'OE-01').result, 'SKIPPED');
    assert.deepEqual([d.countsAfter.prepaid, d.countsAfter.postpaid, d.countsAfter.mobileTotal], [2, 3, 5]);
    assert.ok(d.pendingConfirmations.includes('migration.approvalThresholdsApply'));
  });
  test('a migration needs a postpaid request and a prepaid line to migrate', () => {
    assert.equal(run(request({ counts: [0, 0, 0], ask: 'postpaid', kind: 'PREPAID_TO_POSTPAID_MIGRATION' })).block.reasonCode, 'INPUT_INVALID');
    assert.equal(run(request({ counts: [1, 0, 0], ask: 'prepaid', kind: 'PREPAID_TO_POSTPAID_MIGRATION' })).block.reasonCode, 'INPUT_INVALID');
  });
  test('#21 a cart is evaluated in order, each line counting toward the next', () => {
    const base = { counts: [0, 2, 0] };
    const ds = evaluateCart([
      request({ ...base, ask: 'postpaid', requestId: 'A' }), request({ ...base, ask: 'postpaid', requestId: 'B' }),
      request({ ...base, ask: 'prepaid', requestId: 'C' }), request({ ...base, ask: 'prepaid', requestId: 'D' }),
    ], V1, CLOCK);
    assert.deepEqual(ds.map((d) => d.outcome), ['ALLOW_WITH_APPROVAL', 'ALLOW_WITH_APPROVAL', 'ALLOW', 'BLOCK']);
    assert.deepEqual(ds.map((d) => types(d)), [['CREDIT_CONTROL'], ['CREDIT_CONTROL'], [], []]);
    assert.deepEqual(ds[1].countsBefore, ds[0].countsAfter, 'the next line starts from the previous line\'s counts');
    assert.deepEqual(ds[3].countsBefore, ds[2].countsAfter);
    assert.equal(ds[3].block.reasonCode, 'ELIG_MOBILE_TOTAL_CAP_REACHED');
  });
  test('a blocked cart line does not count toward the next one', () => {
    const ds = evaluateCart([request({ counts: [3, 2, 0], ask: 'prepaid', requestId: 'A' }), request({ counts: [3, 2, 0], ask: 'fixed', requestId: 'B' })], V1, CLOCK);
    assert.deepEqual(ds.map((d) => d.outcome), ['BLOCK', 'ALLOW']);
    assert.equal(ds[1].countsBefore.fixedFwa, 0);
  });
  test('a migration inside a cart moves one prepaid line to postpaid for the lines after it', () => {
    const base = { counts: [2, 2, 0] };
    const ds = evaluateCart([request({ ...base, ask: 'postpaid', kind: 'PREPAID_TO_POSTPAID_MIGRATION', requestId: 'M' }), request({ ...base, ask: 'postpaid', requestId: 'N' })], V1, CLOCK);
    assert.deepEqual([ds[0].countsAfter.prepaid, ds[0].countsAfter.postpaid], [1, 3]);
    assert.deepEqual(ds[1].countsBefore, ds[0].countsAfter);
    assert.equal(evaluateCart([{ requestId: 'X' }], V1, CLOCK)[0].block.reasonCode, 'INPUT_INVALID');
  });
  test('a pendingConfirmations key with no alternative reading is never reported', () => {
    const cfg = { ...V1, pendingConfirmations: [...V1.pendingConfirmations, 'some.other.key'] };
    assert.ok(!run(request({ ask: 'prepaid' }), cfg).pendingConfirmations.includes('some.other.key'));
  });
  test('#22 a missing or malformed nationality leaves the profile unresolved', () => {
    for (const nat of [undefined, '', 'QAT', 12]) {
      const r = request({ ask: 'prepaid' });
      r.customer.nationality = nat;
      const d = run(r);
      assert.equal(d.block.reasonCode, 'PROFILE_UNRESOLVED');
      assert.equal(d.segment, null);
    }
  });
  test('the segment strategy: ID_TYPE needs a QID as well as QA, and the key is reported where the other reading would decide', () => {
    const idType = { ...V1, segmentResolution: 'ID_TYPE' };
    const input = { nat: 'QA', id: 'PASSPORT', counts: [0, 5, 0], ask: 'prepaid' };
    const byNationality = run(request(input));
    const byIdType = run(request(input), idType);
    assert.equal(byNationality.segment, 'QATARI');
    assert.equal(byNationality.outcome, 'ALLOW', 'no overall limit for a Qatari');
    assert.equal(byIdType.segment, 'EXPATRIATE');
    assert.equal(byIdType.block.reasonCode, 'ELIG_MOBILE_TOTAL_CAP_REACHED');
    assert.ok(byNationality.pendingConfirmations.includes('segmentResolution'));
    assert.ok(byIdType.pendingConfirmations.includes('segmentResolution'));
    assert.ok(!run(request({ nat: 'IN', ask: 'prepaid' })).pendingConfirmations.includes('segmentResolution'), 'the same segment either way');
    assert.equal(run(request({ nat: 'QA', id: 'QID', counts: [0, 5, 0], ask: 'prepaid' }), idType).segment, 'QATARI');
  });
  test('counted statuses: SUSPENDED / BARRED / PENDING_ACTIVATION count, TERMINATED does not, and the key is reported when it decides', () => {
    const suspended = request({ existing: lines(0, 0, 0).concat(lines(5, 0, 0, 'SUSPENDED')), ask: 'prepaid' });
    const d = run(suspended);
    assert.equal(d.block.reasonCode, 'ELIG_MOBILE_TOTAL_CAP_REACHED');
    assert.ok(d.pendingConfirmations.includes('countedStatuses'));
    assert.ok(!run(request({ existing: lines(5, 0, 0, 'TERMINATED'), ask: 'prepaid' })).pendingConfirmations.includes('countedStatuses'));
    const noPending = { ...V1, includePendingOrders: false };
    assert.equal(run(request({ counts: [4, 0, 0], ask: 'prepaid', pending: [{ orderId: 'O', type: TYPE.prepaid }] }), noPending).outcome, 'ALLOW');
  });
  test('invalid input is a BLOCK with INPUT_INVALID, never an exception', () => {
    for (const bad of [null, {}, { ...request({ ask: 'prepaid' }), requestId: '' }, { ...request({ ask: 'prepaid' }), existingLines: 'x' }, { ...request({ ask: 'prepaid' }), requestedType: 'TV' },
      { ...request({ ask: 'prepaid' }), existingLines: [{ lineId: 'x', type: 'MOBILE_PREPAID', status: 'LOST' }] }, { ...request({ ask: 'prepaid' }), pendingOrders: [{ type: 'FIXED_FWA' }] },
      { ...request({ ask: 'prepaid' }), customer: { customerId: 'C', idType: 'QID', age: -1 } }, { ...request({ ask: 'prepaid' }), requestKind: 'X' }]) {
      const d = evaluateEligibility(bad, V1, CLOCK);
      assert.equal(d.outcome, 'BLOCK');
      assert.equal(d.block.reasonCode, 'INPUT_INVALID');
      assert.deepEqual(d.approvals, []);
      assert.deepEqual(d.pendingConfirmations, []);
    }
  });
  test('rulesEvaluated lists every rule, in a fixed order, with its result', () => {
    const d = run(request({ id: 'PASSPORT', age: 17, counts: [0, 2, 0], ask: 'postpaid' }));
    assert.deepEqual(d.rulesEvaluated.map((r) => r.ruleId), ['OE-01', 'OE-02', 'OE-03', 'PP-01', 'PP-02', 'PP-03', 'PP-04', 'PP-05', 'PR-01', 'PR-02', 'FX-01', 'FX-02', 'FX-03', 'FX-04', 'FX-05', 'PB-01', 'PB-02', 'PB-03', 'XC-01', 'XC-02', 'XC-03']);
    const result = (id) => d.rulesEvaluated.find((r) => r.ruleId === id).result;
    assert.deepEqual(['OE-01', 'OE-02', 'PP-02', 'PP-04', 'PB-01', 'PB-02', 'PB-03', 'XC-02', 'XC-03'].map(result), ['PASS', 'SKIPPED', 'TRIGGERED', 'SKIPPED', 'TRIGGERED', 'TRIGGERED', 'PASS', 'TRIGGERED', 'PASS']);
  });
  test('determinism: the same input and clock give the same decision', () => {
    const r = request({ id: 'PASSPORT', age: 17, counts: [1, 2, 1], ask: 'postpaid' });
    assert.deepEqual(run(r), run(structuredClone(r)));
    assert.equal(run(r, structuredClone(V1)).evaluatedAt, '2026-10-19T09:00:00.000Z');
  });
});

describe('rule configuration', () => {
  test('the shipped configuration is valid', () => assert.deepEqual(validateRuleConfig(V1), []));
  test('negative or non-integer thresholds are rejected', () => {
    const bad = (mut) => validateRuleConfig(mut(structuredClone(V1))).length > 0;
    assert.ok(bad((c) => { c.expatriate.mobileTotalMax = -1; return c; }));
    assert.ok(bad((c) => { c.expatriate.postpaid.freeUpTo = 1.5; return c; }));
    assert.ok(bad((c) => { c.qatari.fixedFwa.max = 'ten'; return c; }));
    assert.ok(bad((c) => { c.exceptions.under18.ageThreshold = -18; return c; }));
    assert.ok(bad((c) => { c.passportBauRule.creditControlFromOrdinal = 0.5; return c; }));
  });
  test('a free allowance above its maximum is rejected', () => {
    const c = structuredClone(V1);
    c.qatari.fixedFwa = { freeUpTo: 5, max: 3 };
    assert.ok(validateRuleConfig(c).some((p) => p.includes('qatari.fixedFwa') && p.includes('freeUpTo')));
    const e = structuredClone(V1);
    e.expatriate.postpaid = { freeUpTo: 6, creditControlUpTo: 5 };
    assert.ok(validateRuleConfig(e).length > 0);
  });
  test('structural mistakes are reported, and the engine refuses an invalid configuration', () => {
    const c = structuredClone(V1);
    c.segmentResolution = 'GUESS';
    c.countedStatuses = ['LOST'];
    c.includePendingOrders = 'yes';
    c.passportBauRule = { enabled: 1, creditControlFromOrdinal: 6, creditControlUpTo: 5 };
    c.version = '';
    c.pendingConfirmations = [1];
    assert.ok(validateRuleConfig(c).length >= 6);
    assert.throws(() => run(request({ ask: 'prepaid' }), c), /Invalid eligibility rule configuration/);
  });
});

describe('guards', () => {
  test('no numeric threshold in the rule logic: only 0 and 1 (counting) appear outside the configuration', () => {
    const dir = 'src/domain/eligibility';
    const files = [`${dir}/engine.ts`, ...fs.readdirSync(`${dir}/rules`).map((f) => `${dir}/rules/${f}`), `${dir}/reasonCodes.ts`];
    for (const f of files) {
      const code = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|\/[^/\n]+\/[gimsuy]*\.test/g, "''");
      const numbers = [...code.matchAll(/(?<![\w.])\d+(?:\.\d+)?(?![\w.])/g)].map((m) => m[0]).filter((n) => n !== '0' && n !== '1');
      assert.deepEqual(numbers, [], f);
    }
  });
  test('the domain module imports nothing from the application', () => {
    const dir = 'src/domain/eligibility';
    const all = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? all(path.join(d, e.name)) : [path.join(d, e.name)]));
    for (const f of all(dir).filter((x) => x.endsWith('.ts'))) {
      for (const m of fs.readFileSync(f, 'utf8').matchAll(/from '(\.[^']*)'/g)) {
        assert.ok(path.resolve(path.dirname(f), m[1]).startsWith(path.resolve(dir)), `${f} imports ${m[1]}`);
      }
    }
  });
});

test.after(close);
