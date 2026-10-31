// The customer's pop-up shows no agent-only content, and the order confirmation follows the order: heading, eSIM release, email.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (f) => fs.readFileSync(f, 'utf8');

test('Checkout: the credit limit and bill limit rows are agent-only, the advance is named "Advance Payment" (never HRN), and no agent instruction reads as content', () => {
  const tables = read('src/components/patterns/checkoutDetailedTables.ts');
  assert.match(tables, /label: 'Credit Limit'[\s\S]*?agentOnly: true/);
  assert.match(tables, /label: 'Bill Limit'[\s\S]*?agentOnly: true/);
  assert.match(tables, /label: 'Advance Payment'/);
  const layout = read('src/components/patterns/CheckoutDefaultLayout.tsx');
  assert.match(layout, /<Row agentOnly label="Credit Limit"/);
  assert.match(layout, /agentOnly\s+label="Bill Limit"/);
  assert.match(layout, /<Row label="Advance Payment"/);
  assert.match(layout, /className="agent-only flex items-center justify-between"/);
  assert.match(read('src/components/patterns/CheckoutSummaryTables.tsx'), /row\.agentOnly \? 'agent-only'/);
  for (const f of ['checkoutDetailedTables.ts', 'checkoutSummaryRows.ts', 'CheckoutDefaultLayout.tsx']) assert.doesNotMatch(read(`src/components/patterns/${f}`), /confirm before signature/, f);
  assert.doesNotMatch(read('src/components/patterns/checkoutDetailedTables.ts') + read('src/components/patterns/CheckoutDefaultLayout.tsx'), /HRN Advance/);
});

test('the .agent-only class is hidden in the customer window, and Recommended Offers puts its eligibility outcomes under it', () => {
  assert.match(read('src/index.css'), /\.mirror-window \.agent-only/);
  assert.match(read('src/modules/new-connection/steps/ProductSelection.tsx'), /<div className="agent-only">\s*<ProductEligibility/);
});

test('Order Submitted: the heading follows the order, the eSIM QR and code wait for approval, the pop-up never sends the email', () => {
  const s = read('src/components/patterns/ActivationCompleteScreen.tsx');
  assert.match(s, /order\.pendingApproval \? 'Order submitted successfully' : 'Activation complete'/);
  assert.doesNotMatch(s, /APPROVAL_SUBMITTERS|RETAIL_SUBMITTERS/);
  assert.match(s, /eSIM QR code will be sent only to your verified email address/);
  assert.match(s, /handoverPanel=\{\s*order\.esimActivationCode \?/, 'two columns only while the QR code is shown');
  assert.match(s, /if \(isMirrorWindow\) return;/);
  assert.match(read('src/components/patterns/OrderConfirmationScreen.tsx'), /no-print print:hidden/, 'the action buttons are hidden in the pop-up by no-print');
});

test('a QAR 0 postpaid order gets a zero-value receipt, as the other journeys do, not a cash / WinCash handoff', () => {
  assert.match(read('src/modules/new-connection/postpaidSteps.tsx'), /paymentStep\(\{ zeroValueReceipt: true, submitOnPaid: true \}\)/);
  assert.match(read('src/modules/new-connection/submitNewConnectionOrder.ts'), /payment\?\.zeroValue \? ` \(zero-value receipt/);
});
