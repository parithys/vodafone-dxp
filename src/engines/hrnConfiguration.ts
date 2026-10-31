/**
 * HRN Configuration
 * |
 * |- HRN Categories ............ Standard HRN, Enhanced Financial Controls, Enhanced Verification, Restricted Service
 * |- Nationality -> HRN Category mapping
 * |- Advance Payment ........... by HRN category + persona
 * |- Credit Limit .............. by HRN category
 * `- Risk Indicator Definitions . Fraud, Identity Fraud, Phishing, Financial Scam, Cybercrime, AML Review
 *
 * Hard-coded: the business has not asked for an admin screen. Change a figure, add a nationality or configure a category HERE and every journey,
 * checkout, summary and order follows. Only what the business has CONFIRMED is configured; everything else is declared and marked as not configured,
 * so nothing is guessed:
 *
 *   | Rule                                  | Confirmed value |
 *   | HRN advance payment                   | QAR 100         |
 *   | HRN default credit limit              | QAR 50          |
 *   | Non-HRN default credit limit          | QAR 1,000       |
 *   | Persona-specific advance              | Not configured  |
 *   | Multiple HRN categories               | Not configured  |
 *   | Fraud/Cybercrime/Phishing indicators  | Not configured  |
 *
 * Rules the functions apply:
 *   - A customer is HRN when their nationality maps to at least one CONFIGURED category. A category can be named to narrow it (`categoryId`).
 *   - A nationality may sit in several categories (not used today). With no category named, the MOST CAUTIOUS applies: the highest advance, the
 *     lowest credit limit.
 *   - Advance payment: the category's amount for the persona, else the category's default.
 *   - A category that is not configured has no advance or credit limit and is never applied.
 */

export type HrnCategoryId = 'STANDARD_HRN' | 'ENHANCED_FINANCIAL_CONTROLS' | 'ENHANCED_VERIFICATION' | 'RESTRICTED_SERVICE';

export interface HrnCategory {
  id: HrnCategoryId;
  label: string;
  /** False until the business confirms the category's values: an unconfigured category is declared here but never applied. */
  configured: boolean;
  /** Advance payment, in QAR, collected at checkout for a postpaid activation: the default, and any persona (role id) that pays a different amount. */
  advance?: { defaultQar: number; byPersona?: Record<string, number> };
  /** The credit limit, in QAR, a new account starts with (BR-076). */
  creditLimitQar?: number;
}

export const HRN_CATEGORIES: readonly HrnCategory[] = [
  // Confirmed: QAR 100 advance for every persona (no persona-specific advance is configured), QAR 50 default credit limit.
  { id: 'STANDARD_HRN', label: 'Standard HRN', configured: true, advance: { defaultQar: 100 }, creditLimitQar: 50 },
  { id: 'ENHANCED_FINANCIAL_CONTROLS', label: 'Enhanced Financial Controls', configured: false },
  { id: 'ENHANCED_VERIFICATION', label: 'Enhanced Verification', configured: false },
  { id: 'RESTRICTED_SERVICE', label: 'Restricted Service', configured: false },
];

/** The category every HRN nationality is in today. */
export const STANDARD_HRN: HrnCategoryId = 'STANDARD_HRN';

/** The credit limit for a customer who is not HRN (BR-076): QAR 1,000 - an Expat's. */
export const NON_HRN_CREDIT_LIMIT_QAR = 1000;
/** A Qatari's default credit limit (a Qatari is never HRN): QAR 4,000. */
export const QATARI_CREDIT_LIMIT_QAR = 4000;

/** A Qatari national, by the demonym the customer records use or the country name. */
export const isQatariNationality = (nationality: string | undefined): boolean => ['qatari', 'qatar'].includes((nationality ?? '').trim().toLowerCase());

/**
 * Nationality -> HRN categories. Keys are lower-case; both the demonym the customer records use ("Pakistani") and the country name are listed,
 * so either spelling resolves. A nationality absent here is non-HRN. Each is in exactly one category (Standard HRN): several categories per
 * nationality are supported but not configured.
 */
export const NATIONALITY_HRN_CATEGORIES: Readonly<Record<string, readonly HrnCategoryId[]>> = {
  pakistani: [STANDARD_HRN], pakistan: [STANDARD_HRN],
  bangladeshi: [STANDARD_HRN], bangladesh: [STANDARD_HRN],
  cambodian: [STANDARD_HRN], cambodia: [STANDARD_HRN],
  myanmar: [STANDARD_HRN], myanmarese: [STANDARD_HRN], burmese: [STANDARD_HRN],
  laotian: [STANDARD_HRN], lao: [STANDARD_HRN], laos: [STANDARD_HRN],
  kenyan: [STANDARD_HRN], kenya: [STANDARD_HRN],
  ugandan: [STANDARD_HRN], uganda: [STANDARD_HRN],
  swazi: [STANDARD_HRN], emaswati: [STANDARD_HRN], eswatini: [STANDARD_HRN],
};

export type HrnRiskIndicatorId = 'FRAUD' | 'IDENTITY_FRAUD' | 'PHISHING' | 'FINANCIAL_SCAM' | 'CYBERCRIME' | 'AML_REVIEW';

export interface HrnRiskIndicator {
  id: HrnRiskIndicatorId;
  label: string;
  /** False: the indicator is defined, but the business has not configured how it applies. Nothing reads it yet. */
  configured: boolean;
}

/** The risk indicators an HRN category may carry. Defined only: none is configured, so no nationality or category is tagged with one. */
export const HRN_RISK_INDICATORS: readonly HrnRiskIndicator[] = [
  { id: 'FRAUD', label: 'Fraud', configured: false },
  { id: 'IDENTITY_FRAUD', label: 'Identity Fraud', configured: false },
  { id: 'PHISHING', label: 'Phishing', configured: false },
  { id: 'FINANCIAL_SCAM', label: 'Financial Scam', configured: false },
  { id: 'CYBERCRIME', label: 'Cybercrime', configured: false },
  { id: 'AML_REVIEW', label: 'AML Review', configured: false },
];

const byId = (id: HrnCategoryId) => HRN_CATEGORIES.find((c) => c.id === id && c.configured);

/** The HRN categories a nationality belongs to (empty for a non-HRN nationality or none given). */
export function hrnCategoriesOf(nationality: string | undefined): HrnCategory[] {
  const ids = nationality ? NATIONALITY_HRN_CATEGORIES[nationality.trim().toLowerCase()] : undefined;
  return (ids ?? []).map(byId).filter((c): c is HrnCategory => Boolean(c));
}

/** The categories that apply: the one named (when the nationality is in it), else all of the nationality's. */
function applicable(nationality: string | undefined, categoryId?: HrnCategoryId): HrnCategory[] {
  const all = hrnCategoriesOf(nationality);
  return categoryId ? all.filter((c) => c.id === categoryId) : all;
}

/** HRN or not, from the nationality and, when given, the category asked about. */
export function isHrn(nationality: string | undefined, categoryId?: HrnCategoryId): boolean {
  return applicable(nationality, categoryId).length > 0;
}

/** A category's advance for a persona. */
export function categoryAdvanceQar(category: HrnCategory, personaId?: string): number {
  return (personaId ? category.advance?.byPersona?.[personaId] : undefined) ?? category.advance?.defaultQar ?? 0;
}

/**
 * The advance payment, in QAR, for a customer and persona: 0 when the customer is not HRN. With no nationality (a display that only knows the
 * customer is HRN) the first configured category's amount is given. Several categories: the highest.
 */
export function hrnAdvanceQar({ nationality, categoryId, personaId }: { nationality?: string; categoryId?: HrnCategoryId; personaId?: string } = {}): number {
  const categories = nationality === undefined && !categoryId ? HRN_CATEGORIES.filter((c) => c.configured).slice(0, 1) : applicable(nationality, categoryId);
  return categories.length ? Math.max(...categories.map((c) => categoryAdvanceQar(c, personaId))) : 0;
}

/**
 * The credit limit a new account starts with, in QAR: the category's for an HRN customer, the standard one otherwise. Several categories: the
 * lowest. With no nationality (only the HRN flag is known) pass `hrn`.
 */
export function defaultCreditLimit({ nationality, categoryId, hrn }: { nationality?: string; categoryId?: HrnCategoryId; hrn?: boolean } = {}): number {
  const categories = nationality === undefined && !categoryId ? (hrn ? HRN_CATEGORIES.filter((c) => c.configured).slice(0, 1) : []) : applicable(nationality, categoryId);
  if (categories.length) return Math.min(...categories.map((c) => c.creditLimitQar ?? NON_HRN_CREDIT_LIMIT_QAR));
  // Not HRN: a Qatari's default is QAR 4,000, an Expat's QAR 1,000. With no nationality given, nothing says Qatari, so the Expat default stands.
  return isQatariNationality(nationality) ? QATARI_CREDIT_LIMIT_QAR : NON_HRN_CREDIT_LIMIT_QAR;
}

/**
 * (Superseded for new accounts by defaultCreditLimit's nationality rule: Qatari 4,000, Expat 1,000, HRN 50.)
 * Default credit limit BY CUSTOMER SEGMENT, in QAR, for a segment the business has set one for. Empty: none has been given, so a segment's default
 * is the HRN category's limit when the segment is an HRN one, and the standard QAR 1,000 otherwise.
 */
export const SEGMENT_CREDIT_LIMITS_QAR: Readonly<Record<string, number>> = {};

/** The credit limit a customer in this segment starts with: the segment's own when configured, else QAR 50 for an HRN segment and QAR 1,000 for the rest. */
export function defaultCreditLimitForSegment(segment: string | undefined): number {
  const own = segment ? SEGMENT_CREDIT_LIMITS_QAR[segment] : undefined;
  if (own !== undefined) return own;
  return segment && /\bHRN\b/i.test(segment) ? defaultCreditLimit({ hrn: true }) : NON_HRN_CREDIT_LIMIT_QAR;
}
