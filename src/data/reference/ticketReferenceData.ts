// Shared reference data for the Trouble Ticket journey (VFQ_Trouble_Ticket_BRSD_v1.0),
// consumed by TicketCreationModal/TicketsDashboard/TicketDetail. Kept as inline
// constants rather than new mock-data JSON files - this mirrors the existing
// convention in this module (ISSUE_TYPES/TEMPLATES/QUEUES already live this
// way in TicketCreationModal.tsx) rather than introducing a new persistence
// shape for reference data the BRSD itself never gives concrete values for
// (Area/Sub-Area, Resolution Code, and Hashtag catalogues are all referenced
// by name in the requirements register but never enumerated).
//
// Documented gaps (Screens 8-13/15 gap-fix pass, 2026-09-30) - deliberately
// NOT built this round, so they stay visible rather than silently absent:
// - Screen 8: no 2MB attachment size check or file-type restriction exists
//   (attach() below only caps attachment *count*).
// - Screen 9: automatic-activity-by-category is entirely unimplemented -
//   activities are only ever added manually or as fixed one-off Auto entries.
// - Screen 10: consent-gate, role-based template editing, and an
//   "Interaction History" view are not built - only keyword search + send
//   against the real (partial) Automatic SMS template set is (see the new
//   Communication tab / TicketCommunicationTab.tsx).
// - Screen 12: "Keep-Pending for external tickets" has no code at all - no
//   status, no flag. The resolve() gate (below, resolve() call site) also
//   does not actually require Actual Issue, only Resolution Code + Hashtag -
//   left as-is since changing the gate itself wasn't in scope this round.
// - Screen 13: the Reopen reason is free text, not a controlled picklist.
// - No flag mechanism exists anywhere in this codebase - every CFL the
//   Phase 1 build plan described as "behind a flag, defaulting to X" is
//   just hard-coded to X across every screen, not only these two waves.
//
// Screen 16 (Approval Queue & Ticket Review, 2026-09-30): the Phase 1 plan's
// "AGN-001-AAV-01 to 06"/"TTJ-S16-*" citations are unattested in
// reference/.knowledge/ - same pattern as every other screen. Built against
// the real, working src/modules/order-management/OrderApprovalDetail.tsx/
// OrderApprovalQueue.tsx pattern instead (modal-state shape, submittingRef
// guard, isVisibleToAgent claim mechanic), with a ticket-appropriate
// eligibility list and reason catalogues in place of the order-specific
// approval-matrix.json/reject-reasons.json (see TICKET_APPROVAL_ELIGIBLE_
// JOB_TITLES/APPROVAL_REJECT_REASONS/APPROVAL_RETURN_REASONS above). No
// per-category approval matrix exists for tickets, unlike orders.
//
// R2 (Retention Request Capture, 2026-09-30): the Phase 1 plan's "COPS_
// TELRET1"/"TTJ-R2-*" citations and its "fully named" claim (Service Type/
// Segment/Language/Channel-source/Request-type splits, a Disconnection
// Reason LOV, multi-MSISDN-per-ticket) are unattested - none of it exists
// in reference/.knowledge/, and there is no existing ticket field, schema,
// or precedent for any of it (multi-MSISDN would be new schema work with
// zero existing extension point, not a gap-fill). R2 was also designed as
// a branch inside a Screens 1-7 ticket-creation wizard that was never built
// - this module has no wizard at all. Scoped down to only what's real:
// RETENTION_RESOLUTION_CODES above (BR-060/FLD-123's mandatory disconnection
// -closure field). Two further real rules are explicitly NOT built this
// round: BR-341 (closing a disconnection ticket should auto-create a
// disconnection order - no order-creation mechanism for this was verified
// to exist) and BR-283 (only the Retention team may cancel a disconnection
// Future-Dated-Order - an orders-module concept, not a ticket-capture one).

// MPRA-style status vocabulary correction (BRSD gap-analysis G-11): the
// BRSD's own ticket lifecycle uses these terms in the Requirements register
// (RES-01/08/09/10/11, ESC-01) - "Open"/"Reopened" appear nowhere in the
// source. Reopen returns a ticket to "Not Solved", it does not introduce a
// new state.
//
// 'Pending Approval' added (Screen 16 - Approval Queue & Ticket Review,
// 2026-09-30): unlike every other status here, this one has zero source
// evidence either way (see TICKET_APPROVAL_ELIGIBLE_JOB_TITLES below) - it
// exists purely so the screen is reachable at all, via the "Simulate -> send
// to approval" test action on TicketDetail.tsx (same convention as
// WinCashPaymentStep.tsx's "Simulate session expiry").
export const TICKET_STATUSES = ['Not Solved', 'Assigned', 'Escalate', 'Pending Approval', 'Solved', 'Completed', 'Closed', 'Cancelled'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

// P-03 (Priority LOV, Confirmed) - 1-ASAP/2-High/3-Medium/4-Low, not a plain
// Low/Medium/High scale.
/** Queues a ticket can be routed to when no routing rule picks one. */
export const TICKET_QUEUES = ['FL Agents', 'Complaints Team'] as const;

/** Where a ticket goes when no routing rule names a team: tickets are auto-assigned, never picked by the agent. */
export const DEFAULT_QUEUE: (typeof TICKET_QUEUES)[number] = 'Complaints Team';

export const PRIORITY_OPTIONS = ['1-ASAP', '2-High', '3-Medium', '4-Low'] as const;

// MPRA_001_CRE-16: priority is derived from Customer Type, not freely chosen.
// The BRSD names this as a requirement ("per the matrix") without ever
// enumerating the matrix's actual values, so this mapping is a reasonable,
// clearly-flagged placeholder against customers.json's real `segment` field,
// not a fabricated "real" VFQ policy.
export function derivePriorityFromSegment(segment: string | undefined): (typeof PRIORITY_OPTIONS)[number] {
  if (!segment) return '3-Medium';
  if (segment.startsWith('Enterprise')) return '1-ASAP';
  if (segment.includes('HRN')) return '2-High';
  return '3-Medium';
}

// P-10/P-11 (Confirmed, AS-IS baseline): SLA target 24h non-Expatriate / 48h
// Expatriate. customers.json has no literal "Expatriate" segment value, so
// this reuses the same nationality-based expat detection already evidenced
// and applied for BR-347 (Prepaid line cap) - non-Qatari nationality is
// treated as the Expatriate branch of the SLA matrix.
export function slaTargetHours(nationality: string | undefined): number {
  return nationality === 'Qatari' ? 24 : 48;
}

export const TT_AREAS: Record<string, string[]> = {
  Disconnection: ['Voluntary', 'Non-Payment'],
  'Migration (Pre-to-Post)': ['Eligibility', 'Billing Setup'],
  'Plan Downgrade': ['Eligibility', 'Billing'],
  'Language Change': ['Profile Update'],
  'End Data Session': ['Roaming', 'Domestic'],
  'Mobile Complaints': ['Voice', 'Data', 'Billing', 'SIM/Number'],
  'Fixed/5G Complaints': ['Fibre', 'IPTV', 'Router/CPE', 'Billing'],
  SOC: ['Provisioning', 'Billing'],
  'Human Error Complaints': ['Agent Error', 'System Error'],
};

// Corrected 2026-09-30 (Trouble Ticket CBU journey, Screens 8-13/15 gap-fix
// pass): replaces the fabricated 9-category HASHTAGS_BY_CATEGORY map (invented
// tags like #SlowData/#CallDrop with no source) with a real, verbatim sample
// from reference/.knowledge/docs/tt-hashtags-and-actual-issue-8d8ccaa5.md - a
// genuine Siebel VFQA_TT_HASHTAGS LOV export. That doc only has 454 rows total
// and this repo doesn't have the source .xlsx, so only the ~44 sample values
// the doc itself quotes verbatim survive here - this is a partial sample of
// the real list, not the complete 454-row export. The source is also a FLAT
// list with no category/Parent-LIC grouping at all, so (unlike the map this
// replaces) hashtags are no longer filtered by ticket category - that
// filtering was itself unevidenced.
export const TT_HASHTAGS = [
  '5G Complaint _RFS location', '5G Outdoor login issue', '5G Site Lock', '5G to Fiber/Fibre Migration',
  '5G_Technical_Issue', 'BRM Sync Issue', 'Adjustment Posted Manually', 'Advance-Credit Logs Shared',
  'Bill limit discrepancy', 'Bill Limit Issue_Reimbursement', 'Bill Limit Cannot be Blank',
  'Auto-Pay Bulk Failure', 'AutoPay', 'AutoPayIssue', 'Blacklisted account', 'Balance Reserved',
  'AirpodsPro3', 'AppleWatchSE3', 'Series11', 'Ultra3', 'AppleiPhone17', '17Air', '17Pro', '17ProMax',
  'Apple_Store_Purchase', 'Apple_eSIMTransfer', 'Apple Launch_2025',
  'CCT-Agent Accessibility', 'CCT-Customer Misunderstanding', 'CCT-Customer Perception',
  'CCT-In-BAU Ticket Required', 'CCT-In-Duplicate', 'CCT-In-Incomplete Info', 'CCT-In-No Validation Done',
  'CCT-In-Wrong Channel Selected', 'CCT-System Error (Adj)', 'CCT-VA-Adjustment Missed',
  'CCT-VA-Benefits Added', 'CCT-VA-Disconnected', 'CCT-VA-Discount Added', 'CCT-VA-Human Error',
  'CCT-VA-Mig Corrected & Adj', 'eShop Order Delivered - SIM', 'eShop Order ID Shared',
  'eShop Order Refund - Device/SIM',
];

// Same source doc, VFQA_TT_ACTUAL_ISSUE sheet (355 rows, also flat, same
// partial-sample caveat as TT_HASHTAGS above).
export const TT_ACTUAL_ISSUES = [
  'Activate Internet Settings', 'Adjust Wrong Credit Recharged', 'Adjustment Fail/Not Reflecting',
  'Advance Credit Issues', 'Auto-Pay Unposted Payment', 'Bill Delivery Issues', 'Billing Profile Issues',
  'Billing and Renewal Mismatch', 'CCT-Adjustment Request', 'CCT-Billing Dispute',
  'CCT-Contact Details Issue', 'CCT-Disconnection Request', 'CCT-Discount Not Given',
  'CCT-Fraud Activation', 'CCT-Incomplete Info shared', 'CCT-Lock-in Period Not Inform',
  'CCT-MNP Request', 'CCT-No Issue Mentioned', 'CCT-Number Not Activated', 'CCT-PYN Request',
  'CCT-Plan Change with Consent', 'CCT-Post/Pre migration with Consent', 'CCT-Promised benefit not added',
  'CCT-Rude Behavior', 'CCT-TON Request',
  // Added with the Customer 360 query flow: values the Query Issues map to, verbatim from the real Siebel
  // VFQA_TT_ACTUAL_ISSUE export (Business Documents/TT Hashtags and Actual Issue.xlsx).
  'Dropped Calls', 'Make Calls International', 'Make Calls Local All', 'Make Calls Local/Int', 'Make Calls Other Operator',
  'Receive Calls International', 'Receive Calls Local All', 'Receive Calls Local/Int', 'Receive Calls Other Operator', 'Roaming Calls',
];

export const RESOLUTION_CODES = [
  'Resolved - Network Fix',
  'Resolved - Customer Education',
  'Resolved - Billing Adjustment',
  'Resolved - Device Replacement',
  'No Fault Found',
];

// ESC-05: mandatory reason from a controlled list.
export const ESCALATION_REASONS = [
  'SLA Breach Imminent',
  'Customer VIP / High Sensitivity',
  'Repeat / Recurring Issue',
  'Requires L3 Specialist',
  'Regulatory Sensitivity',
];

// RES-11: mandatory reason code.
export const CANCELLATION_REASONS = ['Raised in Error', 'Customer Withdrew Complaint', 'Duplicate of Another Ticket'];

// R2 (Retention Request Capture) - added 2026-09-30. BR-060/FLD-123 (real,
// checked against reference/.knowledge/): a disconnection ticket "must be
// closed with a specific resolution code ('retained' or not) before the
// disconnection order can be submitted" - a real, named, mandatory field
// ("Resolution Code (retention)"), but the source paraphrase only ever
// names the two outcomes quoted here, not a fuller enumerated list. Kept
// to exactly those two rather than padding it out with invented values.
export const RETENTION_RESOLUTION_CODES = ['Retained', 'Not Retained'];

// Screen 16 (Approval Queue & Ticket Review) - added 2026-09-30. Zero source
// evidence exists for a ticket approval matrix at all (checked against
// reference/.knowledge/ - see the plan note for this change), not even the
// kind of per-category placeholder public/config/approval-matrix.json
// already carries for orders. This is a flat, category-agnostic
// eligibility list rather than a fabricated per-category matrix, and it's
// kept deliberately separate from approval-matrix.json/configEngine.ts's
// getRequiredApproverRole (order-specific shared infrastructure this change
// doesn't touch). Values are the real jobTitles already bound to ROLE-22/
// ROLE-23 in users-agents.json, so the feature is actually claimable rather
// than silently dead.
export const TICKET_APPROVAL_ELIGIBLE_JOB_TITLES = ['Supervisor', 'Sales Manager'];

// Same "no source, honestly labeled" placeholder pattern as
// ESCALATION_REASONS/CANCELLATION_REASONS above - invented, not sourced.
export const APPROVAL_REJECT_REASONS = ['Insufficient Justification', 'Policy Violation', 'Duplicate of Existing Ticket'];
export const APPROVAL_RETURN_REASONS = ['Missing Information', 'Incorrect Classification', 'Needs Further Investigation'];

// P-12 is explicitly "To be confirmed" in the source (the only reopen-window
// parameter given) - 7 days is a placeholder pending VFQ confirmation, not a
// sourced value.
export const REOPEN_WINDOW_DAYS = 7;

export interface NewTicketRecordInput {
  ticketId: string;
  customerId: string;
  issueType: string;
  area: string;
  template: string;
  templateContent: string;
  /** Optional real value from TT_ACTUAL_ISSUES - see buildNewTicketRecord's
   * own comment on why this takes priority over the template-derived fallback. */
  actualIssue?: string;
  queue: string;
  priority: string;
  slaTargetHours: number;
  /** Primary severity from the Ticket Type Categorization workbook, when the ticket came from a Customer 360 query. */
  severity?: string;
  createdBy: string;
}

// Shared by TicketsDashboard.tsx and Customer 360's TicketsSection.tsx - both
// create the same entity shape from the same TicketCreationModal payload;
// centralising it here means the ASG-15/RES-01/ESC-01 fields this schema now
// carries only need to be listed once.
export function buildNewTicketRecord(input: NewTicketRecordInput): Record<string, unknown> {
  const createdAt = new Date().toISOString();
  const slaDueAt = new Date(Date.now() + input.slaTargetHours * 60 * 60 * 1000).toISOString();
  return {
    ticketId: input.ticketId,
    customerId: input.customerId,
    status: 'Not Solved',
    category: input.issueType,
    area: input.area,
    // Prefers a real TT_ACTUAL_ISSUES pick over the old template-name/
    // truncated-description fallback, which was standing in for "Actual
    // Issue" with no sourced backing at all.
    actualIssue: input.actualIssue || input.template || input.templateContent.slice(0, 40),
    queue: input.queue,
    priority: input.priority,
    createdAt,
    createdBy: input.createdBy,
    assignedTo: null,
    assignedAt: null,
    slaTargetHours: input.slaTargetHours,
    slaDueAt,
    resolutionCode: null,
    l3Reference: null,
    escalations: [],
    activities: [],
    attachments: [],
    reopenCount: 0,
    closedAt: null,
    cancelReason: null,
    excludedFromReporting: false,
    ...(input.severity ? { severity: input.severity } : {}),
    hashtags: [],
    publicNotes: [],
    retentionResolutionCode: null,
  };
}
