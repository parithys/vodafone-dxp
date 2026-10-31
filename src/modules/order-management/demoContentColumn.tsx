/**
 * The "Demo Content" column shared by My Orders and the Approval Queue: which scenario an order represents and why.
 *
 * The seeded scenario orders carry it as orders.json `demoTitle` / `demoDetail`. An order created in the app has neither,
 * so the column is derived from what the order itself recorded (its approval reasons, routing and status) - every order
 * explains itself the same way, whether it was seeded or created a minute ago.
 *
 * The column takes a share of the table's width (a percentage, not a fixed minimum), so the explanation wraps with the
 * screen instead of forcing a horizontal scroll.
 */
export interface DemoContentFields {
  demoTitle?: string;
  demoDetail?: string;
  status?: string;
  orderType?: string;
  orderSubType?: string;
  customerType?: string;
  planSource?: string;
  approvalReason?: string;
  approverRole?: string;
  manualIdEntry?: boolean;
  crossSalesOfferId?: string;
}

/** One approval reason (as the order wizards word them) -> a short scenario name and the sentence that explains it. */
const REASON_SCENARIOS: [RegExp, string, string][] = [
  [/line limit/i, 'Line-limit approval', 'Customer has reached the allowed postpaid line limit.'],
  [/manually entered/i, 'Manual ID entry', 'ID scanning failed, so the ID details were entered manually.'],
  [/ID type requires Credit Control approval/i, 'ID type routed to Credit Control', 'This ID type requires Credit Control approval.'],
  [/cannot be sold directly|C[BD]M approval|Back Office Fulfilment approval/i, 'ID type routed to Back Office Fulfilment Agent', 'This ID type cannot be activated directly.'],
  [/expiry date not on file/i, 'ID expiry not on file', 'ID expiry date is unavailable, so ID validity cannot be confirmed.'],
  [/HRN/i, 'HRN advance', 'Customer requires an HRN advance payment.'],
  [/B2B2C/i, 'B2B2C employee', 'Customer has a B2B2C employer, so employer verification is required.'],
  [/MADA/i, 'MADA discount', 'A MADA discount was selected and its supporting document must be verified.'],
  [/Retired/i, 'Retired discount', 'A Retired discount was selected and its supporting document must be verified.'],
];

const PLAIN_STATUS: Record<string, [string, string]> = {
  Complete: ['Standard customer', 'The order can proceed with direct activation without approval.'],
  Draft: ['Saved draft', 'Order was saved part-way through the journey. Eligibility checks will run again when the order is resumed.'],
  Pending: ['Pending order', 'Order was submitted and is waiting on an external step.'],
  Open: ['Open order', 'Order was submitted and is waiting on a follow-up step.'],
  Cancelled: ['Dropped by approver', 'Order was cancelled by the approver or the agent.'],
  'Rejected - Correction': ['Rejected - Correction', 'Order was returned for correction.'],
};

/** "Credit Control" -> "Credit Control": the team named in the sentence, not the job title. */
const teamOf = (role: string): string => role.replace(/ Agent$/, '');

/** The scenario an order represents: its seeded title / detail, else one built from the order's own fields. */
export function describeOrderScenario(r: DemoContentFields): { title?: string; detail?: string } {
  if (r.demoTitle) return { title: r.demoTitle, detail: r.demoDetail };
  const reasons = (r.approvalReason ?? '').split('|').map((x) => x.trim()).filter(Boolean);
  if (reasons.length > 0) {
    const hits = [...new Map(reasons.map((x) => REASON_SCENARIOS.find(([re]) => re.test(x))).filter(Boolean).map((h) => [h![1], h!])).values()];
    const approval = ` The order requires ${r.approverRole ? `${teamOf(r.approverRole)} ` : ''}approval.`;
    if (hits.length === 0) return { title: 'Needs Approval', detail: `${reasons.map((x) => x.replace(/\.$/, '')).join('. ')}.${approval}` };
    return { title: hits.map((h) => h[1]).join(' + '), detail: `${hits.map((h) => h[2]).join(' ')}${approval}` };
  }
  if (r.status === 'Submitted for Approval') {
    return { title: 'Awaiting Approval', detail: `${r.orderType ?? 'Order'} was submitted and requires ${r.approverRole ? `${teamOf(r.approverRole)} ` : ''}approval.` };
  }
  const plain = r.status ? PLAIN_STATUS[r.status] : undefined;
  if (plain) {
    const extra = [r.orderSubType && r.orderSubType !== 'Consumer' ? `${r.orderSubType} order` : '', r.crossSalesOfferId ? 'customer accepted a cross-sales offer' : ''].filter(Boolean).join('; ');
    return { title: plain[0], detail: extra ? `${plain[1]} (${extra}.)` : plain[1] };
  }
  return {};
}

/** Whether an order matches a search: its number, customer, type, status, MSISDN or the scenario text shown in Demo Content. */
export function orderMatchesQuery(r: DemoContentFields & { orderId?: string; customerName?: string; msisdn?: string }, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const { title, detail } = describeOrderScenario(r);
  return [r.orderId, r.customerName, r.orderType, r.status, r.msisdn, title, detail].some((v) => v?.toLowerCase().includes(q));
}

/** The Orders workspace's Order Type / Status filters ('all' = no filter). */
export interface OrderFilters {
  orderType?: string;
  status?: string;
}
export const matchesOrderFilters = (r: { orderType?: string; status?: string }, f?: OrderFilters): boolean =>
  (!f?.orderType || f.orderType === 'all' || r.orderType === f.orderType) && (!f?.status || f.status === 'all' || r.status === f.status);

export const demoContentColumn = {
  key: 'demoTitle',
  header: 'Demo Content',
  cellClassName: 'w-[28%]',
  render: (r: DemoContentFields) => {
    const { title, detail } = describeOrderScenario(r);
    return title ? (
      <span className="block min-w-0 break-words">
        <span className="block text-fg font-medium">{title}</span>
        {detail && <span className="block text-muted text-[length:var(--fs-caption)]">{detail}</span>}
      </span>
    ) : (
      '-'
    );
  },
};
