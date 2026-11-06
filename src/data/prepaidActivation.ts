// New Prepaid Activation - the configuration the journey reads instead of hard-coding it.
//
// Everything in this file is MOCK / DRAFT: the business has not confirmed these rules, and the prototype must not present them as final. Each block names the open item it
// stands for, so the real values replace the mock ones HERE and nowhere else. Nothing in this file is a Mobile Postpaid rule.
import type { NumberTab } from '../components/domain/msisdnPickerModel';

// ------------------------------------------------------------------ roles

/** Retail Sales (ROLE-01) and Mass Market (ROLE-05), by the id personas.json gives them. */
export const RETAIL_SALES_ROLE = 'ROLE-01';
export const MASS_MARKET_ROLE = 'ROLE-05';

// ------------------------------------------------------------------ number selection (by ROLE, never by pack)

/**
 * The number tabs a role may see on Prepaid Number Selection. Retail Sales may choose a Star number of any value (no pack entitlement); Mass Market sees Free numbers only
 * and no Star tab. A role that is not listed sees every tab. MOCK persona simulation: the business owns the final role-to-tab map.
 */
export const PREPAID_NUMBER_TABS_BY_ROLE: Record<string, readonly NumberTab[]> = {
  [MASS_MARKET_ROLE]: ['Free'],
};
export const prepaidNumberTabsFor = (roleId: string): readonly NumberTab[] => PREPAID_NUMBER_TABS_BY_ROLE[roleId] ?? ['Star', 'Free', 'Reserved', 'Blocked'];

// ------------------------------------------------------------------ VAT

/**
 * VAT on the Charge Summary. DRAFT: the rate and which charge items carry it are not confirmed; each item below is one switch, and a rate of 0 shows a 0% VAT column rather
 * than removing it. Prices in the catalogue are read as VAT-exclusive.
 */
export const PREPAID_VAT_PERCENT = 5;
export type ChargeItemKey = 'pack' | 'addons' | 'recharge' | 'star-number' | 'star-discount' | 'sim-charge' | 'sim-discount';
export const VAT_APPLIES_TO: Record<ChargeItemKey, boolean> = {
  pack: true,
  addons: true,
  recharge: true,
  'star-number': true,
  'star-discount': true,
  'sim-charge': true,
  'sim-discount': true,
};

// ------------------------------------------------------------------ eWallet (payment)

/**
 * Roles that may pay from an eWallet, and the balance the prototype shows for each. MOCK: there is no eWallet integration; the balance is held in the front end and is
 * deducted when the payment is confirmed. The final eligible roles and balances come from the business.
 */
export const EWALLET_ROLES: readonly string[] = [MASS_MARKET_ROLE];
export const EWALLET_OPENING_BALANCE_QAR: Record<string, number> = { [MASS_MARKET_ROLE]: 150 };
export const eWalletEligible = (roleId: string): boolean => EWALLET_ROLES.includes(roleId);

// ------------------------------------------------------------------ CAF & Signature

/** iPAY Activation: on by default and editable by the agent. */
export const IPAY_ACTIVATION_DEFAULT = true;

/**
 * The prepaid Terms & Conditions, as sections. PLACEHOLDER: the business owner will supply the final configurable wording, so these sections say so instead of inventing
 * legal text. Replace the array (or load it from configuration) and the CAF follows; nothing else reads the wording.
 */
export interface PrepaidTermsSection {
  sectionId: string;
  title: string;
  body: string;
}
export const PREPAID_TERMS_SECTIONS: readonly PrepaidTermsSection[] = [
  { sectionId: 'PTNC-1', title: 'Prepaid Terms & Conditions', body: 'The Mobile Prepaid Terms & Conditions will be provided by the business owner. [Placeholder: configurable content pending.]' },
];
/** Supplementary terms that apply only with iPAY Activation on. PLACEHOLDER: wording pending from the business owner. */
export const IPAY_TERMS_SECTIONS: readonly PrepaidTermsSection[] = [
  { sectionId: 'IPAY-1', title: 'iPAY Terms & Conditions', body: 'The supplementary iPAY Terms & Conditions will be provided by the business owner. [Placeholder: configurable content pending.]' },
];
/** The Terms & Conditions the customer sees: the prepaid terms, then the iPAY supplement only when iPAY Activation is on. */
export const prepaidTermsFor = (ipayActivation: boolean): PrepaidTermsSection[] => [...PREPAID_TERMS_SECTIONS, ...(ipayActivation ? IPAY_TERMS_SECTIONS : [])];
