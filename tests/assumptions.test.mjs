import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Source guards against the recurring defect: code inventing its own reading of a record. Each rule names the existing definition to use instead.
// An allow-list entry is a file that legitimately reads the raw field, with the reason.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []));
const files = walk(SRC).map((f) => ({ rel: path.relative(SRC, f), text: fs.readFileSync(f, 'utf8') }));
const codeLines = (text) => text.split('\n').map((l, i) => ({ n: i + 1, l })).filter(({ l }) => !/^\s*(\/\/|\*|\/\*)/.test(l));
const offenders = (pattern, allow = {}) => {
  const out = [];
  for (const f of files) {
    if (f.rel in allow) continue;
    for (const { n, l } of codeLines(f.text)) if (pattern.test(l)) out.push(`${f.rel}:${n}: ${l.trim().slice(0, 110)}`);
  }
  return out;
};

test('a service is classified as postpaid / prepaid / fibre ... only by customerServicesEngine.classifyProductName', () => {
  // A regex literal on the words postpaid / prepaid, applied with .test(). Use classifyProductName / mobileLineTypeOfName.
  const bad = offenders(/\/[^/\n]*(post|pre)paid[^/\n]*\/[a-z]*\.test\(/i, {
    'engines/customerServicesEngine.ts': 'the one definition',
    'workspace/customer360/sections/C360BillingPayments.tsx': 'reads an ACCOUNT type (Consumer Mobile Prepaid), not a service name',
    'lib/statusTone.ts': 'orderBucket reads the order status "Migrated to Prepaid" (a Transfer of Ownership outcome)',
    'data/synthetic/customer360Demo.ts': 'reads an ACCOUNT type as a fallback to the customer\'s stated line type',
  });
  assert.deepEqual(bad, []);
});

test('nothing classifies by an .includes / .startsWith on the labels "Postpaid" / "Prepaid" (the label "Prepaid to Postpaid" contains both)', () => {
  assert.deepEqual(offenders(/\.(includes|startsWith|endsWith)\(\s*['"](Post|Pre)paid/), []);
});

test('an installed asset\'s promotion code is not read as its plan outside the two engines that check it against the product type', () => {
  assert.deepEqual(offenders(/\.promotion\b/, {
    'engines/customerServicesEngine.ts': 'planOfAsset: takes the code only when the product type fits the service',
    'engines/customer360Engine.ts': 'passes the code to planOfAsset',
  }), []);
});

test('no code is written for one record: a literal customer id compared in source', () => {
  assert.deepEqual(offenders(/(===|!==|==|includes\()\s*['"]CUST-\d+/), []);
  assert.deepEqual(offenders(/['"]CUST-\d+['"]\s*(===|!==|==)/), []);
});

test('the status strings the dashboard, queue and Customer 360 test come from one definition each', () => {
  // SIM swap: isSimSwapAwaitingDecision (approvalAuthority). Tickets: isClosedTicket. Orders: orderBucket (statusTone).
  assert.deepEqual(offenders(/status\s*===\s*'Submitted for Approval'/, {
    'engines/approvalAuthority.ts': 'ORDER_AWAITING_DECISION and isSimSwapAwaitingDecision are defined here',
    'modules/new-connection/submitNewConnectionOrder.ts': 'the order status it writes',
    'modules/order-management/OrderApprovalQueue.tsx': 'order approval queue (orders, not SIM swaps)',
    'modules/order-management/OrderApprovalDetail.tsx': 'order approval (orders, not SIM swaps)',
    'workspace/orders/OrdersWorkspace.tsx': 'orders',
    'modules/dashboard/useZoneMetrics.ts': 'ordersPendingApproval counts ORDERS awaiting approval',
    'modules/order-management/demoContentColumn.tsx': 'orders',
  }), []);
  assert.deepEqual(offenders(/status\s*===\s*'(Open|Reopened)'\s*\|\|/), [], 'a ticket is open unless isClosedTicket says it is closed');
});

test('what a customer owes is billingBalance.outstandingBalance, not a sum over a status string of its own', () => {
  assert.deepEqual(offenders(/status\s*(===|!==)\s*'(billed|Paid|overdue)'/, {
    'engines/billingBalance.ts': 'the one definition',
    'workspace/customer360/sections/BillingSection.tsx': 'a badge tone for a billed row',
    'workspace/customer360/sections/C360BillingPayments.tsx': 'which rows to list as bills',
  }), []);
});
