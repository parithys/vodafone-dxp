import type { TncLegalFacts } from './checkoutSummaryModel';

export interface TncSection {
  sectionId: string;
  title: string;
  body: string;
  /** Set when the section applies to one journey only; absent means every journey. */
  journey?: 'postpaid' | 'prepaid';
}

export interface TncBulletTemplate {
  scenarioKey: string;
  template: string;
}

/**
 * Fills the applicable business-maintained templates (tnc-summary-
 * bullets.json) from THIS order's own figures. Only a scenario the order
 * actually carries produces a bullet - a plan with no commitment does not
 * get a "no lock-in" line invented for it alongside real ones; that filler
 * only appears when NOTHING else applies, so the customer is never shown a
 * blank summary.
 */
export function buildTncBullets(facts: TncLegalFacts | undefined, templates: TncBulletTemplate[]): string[] {
  if (!facts || templates.length === 0) return [];
  const byKey = (key: string) => templates.find((t) => t.scenarioKey === key)?.template;
  const fill = (template: string | undefined, vars: Record<string, string | number>) =>
    template ? Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), template) : undefined;

  const bullets: string[] = [];
  if (facts.planCommitmentMonths) {
    const b = fill(byKey('plan-lockin'), { months: facts.planCommitmentMonths });
    if (b) bullets.push(b);
  }
  if (facts.starLockInMonths) {
    const b = fill(byKey('star-lockin'), { months: facts.starLockInMonths });
    if (b) bullets.push(b);
  }
  if (facts.discountName) {
    const b = facts.discountDurationMonths
      ? fill(byKey('discount-expiry'), { name: facts.discountName, months: facts.discountDurationMonths })
      : fill(byKey('discount-no-expiry'), { name: facts.discountName });
    if (b) bullets.push(b);
  }
  if (facts.hrnAdvanceQar > 0) {
    const b = fill(byKey('hrn-advance'), { amount: facts.hrnAdvanceQar });
    if (b) bullets.push(b);
  }
  if (bullets.length === 0) {
    const b = byKey('no-lockin');
    if (b) bullets.push(b);
  }
  return bullets;
}

/**
 * The signed terms an order carries to its confirmation page, so the agent can print what the customer signed: which journey's
 * Terms & Conditions, and - only when the line has an actual user other than the customer - that user's Supplementary Form.
 */
export interface OrderTerms {
  journey: 'postpaid' | 'prepaid';
  supplementary?: { rows: { label: string; value: string }[]; actualUserName?: string };
}
