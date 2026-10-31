import { type EligibilityCheck, type EligibilityOutcome } from '../../engines/eligibilityEngine';

// Row treatment per outcome, for the divided-list layout adopted 2026-09-25.
//
// Each row is a tinted band in ONE bordered panel rather than its own card:
// the seven checks are a single report, and eight separate cards with gaps
// between them read as eight unrelated results.
export const ROW_TONE: Record<RowTone, string> = {
  pass: 'bg-tone-success-soft',
  'hard-stop': 'bg-tone-danger-soft',
  'soft-stop': 'bg-tone-warn-soft',
  // Orange wash (distinct from the soft-stop amber): a diversion for approval, not a stop.
  'approval-routing': 'bg-tone-approval',
  // The info treatment (the same blue as the info banner and the info toast): the HRN advance is information, not an outcome.
  advisory: 'bg-[var(--info-banner-bg)]',
};

export const ICON_TONE: Record<RowTone, string> = {
  pass: 'text-success',
  'hard-stop': 'text-danger',
  'soft-stop': 'text-[var(--warn-text)]',
  'approval-routing': 'text-[var(--warn-text)]',
  advisory: 'text-[var(--tint-blue-fg)]',
};

// Circled glyphs, so the outcome is legible without relying on colour alone -
// SC 1.4.1. A tick, a cross, a warning triangle and a clock are four distinct
// shapes, not four shades of one.
export const ROW_ICON: Record<RowTone, string> = {
  pass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.4 12.3l2.4 2.4 4.8-5.2',
  'hard-stop': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15 9l-6 6 M9 9l6 6',
  'soft-stop': 'M12 3l9 16H3l9-16z M12 10v4 M12 17h.01',
  'approval-routing': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3.2 2',
  advisory: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 7.5h.01',
};

/**
 * 'advisory' is not an eligibility outcome - it is the HRN classification,
 * which reports a property of the customer rather than passing or failing.
 * It shares the row layout so the panel reads as one list, but it is never
 * counted as a check.
 */
type RowTone = EligibilityOutcome | 'advisory';

/** The title of the HRN advance-payment advisory, here and on the info toast that announces it. */
export const UPFRONT_PAYMENT_TITLE = 'Upfront Payment Required (HRN)';

export interface EligibilityRow {
  id: string;
  title: string;
  detail: string;
  tone: RowTone;
  approvalRuleIds?: string[];
}

/**
 * One list, built from the checks plus the HRN advisory - the same
 * construction the main component's own inline panel uses below, extracted
 * (2026-09-28) so the "View eligibility checks" popup can build the exact
 * same rows from a stored EligibilityResult without duplicating this logic a
 * second time and risking the two drifting apart.
 */
export function buildEligibilityRows(
  checks: EligibilityCheck[],
  hrnFlag: boolean,
  nationality: string | undefined,
  journeyType: 'postpaid' | 'prepaid' = 'postpaid',
  existingCustomer = false,
  /** False at Customer Verification (before a product is chosen): the HRN advance is a postpaid matter, so no HRN row yet. */
  includeHrn = true
): EligibilityRow[] {
  return [
    ...checks.map((check) => {
      // Active Lines has no row heading of its own: the cap message ("Qatari limit of 5 active
      // postpaid lines reached (5 active).") is the title, and any following line is the detail.
      if (check.id === 'active-lines') {
        const [first, ...rest] = check.message.split('\n');
        return { id: check.id, title: first, detail: rest.join('\n'), tone: check.outcome as RowTone, approvalRuleIds: check.approvalRuleIds };
      }
      return { id: check.id, title: check.label, detail: check.message, tone: check.outcome as RowTone };
    }),
    // The upfront requirement is reported as exactly that - an advance payment -
    // and never as the customer's risk classification. The "Non-HRN new account"
    // pass row belongs to NEW accounts only.
    ...(includeHrn && journeyType !== 'prepaid' && (hrnFlag || !existingCustomer)
      ? [
          {
            id: 'hrn',
            title: hrnFlag ? UPFRONT_PAYMENT_TITLE : 'Non-HRN new account',
            detail: hrnFlag
              ? 'An advance payment is required at checkout.'
              : nationality
                ? `${nationality} Citizen - not a high-risk nationality`
                : 'Not a high-risk nationality',
            tone: (hrnFlag ? 'advisory' : 'pass') as RowTone,
          },
        ]
      : []),
  ];
}

// Reference text for the drawer only - the four EligibilityOutcome values
// (RowTone above), named as the checks engine names them, each with a
// plain-language explanation of what it means for the order. Static copy,
// not derived from `rows`: it describes the four possible outcomes in
// general, not which ones this particular customer hit.
/** Whether a row is the HRN advance-payment advisory (the one eligibility row shown as an info toast, not in the list). */
export const isUpfrontPaymentRow = (row: { id: string; tone: string }): boolean => row.id === 'hrn' && row.tone === 'advisory';

export const OUTCOME_LEGEND: { title: string; example: string; detail: string }[] = [
  {
    title: 'Hard Stop',
    example: 'e.g. the customer is on the security blacklist.',
    detail:
      "There's nothing the agent can do here - the order stops. The block has to be resolved somewhere else before trying again.",
  },
  {
    title: 'Soft Stop',
    example: 'e.g. the customer has an unpaid collections balance.',
    detail: "Postpaid isn't available for this customer, but prepaid is. The agent can switch the order to prepaid instead.",
  },
  {
    title: 'Approval Routing',
    example: 'e.g. the customer is under 18.',
    detail: 'Not a failure - the order can go ahead, but a manager has to approve it before it can be completed.',
  },
  {
    title: 'Advisory Only',
    example: 'e.g. the customer is flagged as a High-Risk Nationality (HRN).',
    detail: "Nothing is blocked and the order continues as normal. It's just a note that a different payment or credit rule applies.",
  },
];
