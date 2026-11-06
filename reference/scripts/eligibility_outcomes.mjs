// Runs the APP'S OWN eligibility code for every customer and prints what each check says, as JSON on stdout.
//   node reference/scripts/eligibility_outcomes.mjs 2026-10-02
// It builds the engine's inputs the way the Contact / Recommended Offers eligibility gate does (EligibilityGateStep.tsx) for a New Postpaid activation at product scope,
// so build_customer_inventory.py reports what the app does instead of re-deriving the rules in Python. The date is the inventory's AS_OF date, so the ID-expiry and
// age boundary customers land where they were designed to.
import fs from 'node:fs';
import { boot, load, close } from '../../tests/harness.mjs';

globalThis.window ??= globalThis;
globalThis.window.addEventListener ??= () => {};
globalThis.window.removeEventListener ??= () => {};

const NOW = new Date(`${process.argv[2] ?? new Date().toISOString().slice(0, 10)}T12:00:00`);
await boot();
const eng = await load('/src/engines/eligibilityEngine.ts');
const conn = await load('/src/engines/connectionEligibility.ts');
const rules = await load('/src/engines/ruleEngine.ts');
const bal = await load('/src/engines/billingBalance.ts');
const credit = await load('/src/engines/creditLimit.ts');
const hrn = await load('/src/engines/hrnConfiguration.ts');

const rd = (f) => JSON.parse(fs.readFileSync(`public/mock-data/${f}.json`, 'utf8'));
const customers = rd('customers');
const docs = rd('identity-documents');
const deals = rd('commitment-penalties');
const bills = rd('bills');
const pays = rd('payments');
const bigData = rd('big-data-credit-risk');

const out = [];
for (const c of customers) {
  const doc = docs.find((d) => d.customerId === c.customerId);
  if (!doc) continue;
  const decision = await conn.evaluateConnection({
    customerId: c.customerId, nationality: c.nationality, idType: doc.documentType ?? c.idType, dob: c.dob,
    requestedType: 'MOBILE_POSTPAID', requestKind: 'NEW_ACTIVATION', now: NOW,
  });
  const lineCap = rules.evaluateRule('BR-288', { nationality: c.nationality, activePostpaidLines: c.activePostpaidLines ?? 0 });
  const owed = bal.outstandingBalance(bills.filter((b) => b.customerId === c.customerId), pays.filter((p) => p.customerId === c.customerId));
  const checks = eng.evaluateEligibilityChecks(
    {
      customer: c, doc, deals, outstandingQar: owed,
      lineCapReached: decision ? decision.outcome !== 'ALLOW' : !lineCap.pass, lineDecision: decision ?? undefined, lineCapHardStop: Boolean(lineCap.hardStop),
      activeLinesDetail: lineCap.message ?? '', journeyType: 'postpaid', scope: 'product', portIn: false, under18Exception: 'available',
    },
    NOW,
  );
  const risk = credit.resolveCreditRisk(c, bigData);
  out.push({
    customerId: c.customerId,
    idNumber: doc.documentNumber,
    idType: doc.documentType ?? c.idType,
    nationality: c.nationality,
    owedQar: owed,
    checks: checks.map((k) => ({ id: k.id, outcome: k.outcome, message: k.message ?? '' })),
    decision: decision
      ? { outcome: decision.outcome, approvals: (decision.approvals ?? []).map((a) => a.type ?? a), block: decision.block ?? null, countsBefore: decision.countsBefore ?? null, ordinal: decision.requestedOrdinal ?? null }
      : null,
    hrn: { category: hrn.isHrn(c.nationality), feeApplies: hrn.isHrn(c.nationality) && credit.hrnFeeApplies(risk.creditRiskExemption), exemption: risk.creditRiskExemption ?? null },
  });
}
console.log(JSON.stringify(out));
await close();
