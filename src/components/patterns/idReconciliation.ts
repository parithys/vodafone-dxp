// ID reconciliation: each identity attribute captured from the scanned ID is compared with the one MOI returned, and the result is kept
// per attribute. Progress is allowed only when no attribute that was captured disagrees with MOI.
//
// What counts as captured: the ID number and expiry (read off the card, or typed in the manual passes) and, for a scan, the name, date of
// birth and nationality printed on it. An upload reads nothing, so those three are "not captured" - recorded as such, not as a mismatch.
// What MOI cannot answer (no expiry on file, for instance) is "moi-missing": nothing to compare against, so it does not block either.

export type ReconAttribute = 'idNumber' | 'expiry' | 'name' | 'dob' | 'nationality';
export type ReconResult = 'match' | 'mismatch' | 'not-captured' | 'moi-missing';

export const RECON_LABEL: Record<ReconAttribute, string> = {
  idNumber: 'ID number',
  expiry: 'ID expiry date',
  name: 'Name',
  dob: 'Date of birth',
  nationality: 'Nationality',
};
const ORDER: ReconAttribute[] = ['idNumber', 'expiry', 'name', 'dob', 'nationality'];

/** Dates are DD/MM/YYYY (the card, the typed field) or ISO (MOI); both are accepted on either side. */
export interface IdentityAttributes {
  idNumber?: string;
  expiry?: string;
  name?: string;
  dob?: string;
  nationality?: string;
}

export interface AttributeMatch {
  attribute: ReconAttribute;
  label: string;
  captured?: string;
  moi?: string;
  result: ReconResult;
}

const isoOf = (d: string | undefined): string | undefined => {
  const t = d?.trim();
  if (!t) return undefined;
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(t);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  return /^\d{4}-\d{2}-\d{2}/.test(t) ? t.slice(0, 10) : undefined;
};
const words = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ')
    .trim();

const NORMALISE: Record<ReconAttribute, (v: string) => string | undefined> = {
  idNumber: (v) => v.replace(/[\s-]/g, '').toUpperCase() || undefined,
  expiry: (v) => isoOf(v),
  dob: (v) => isoOf(v),
  name: (v) => words(v) || undefined,
  nationality: (v) => words(v) || undefined,
};

/** One entry per attribute, in a fixed order. */
export function reconcileIdentity(captured: IdentityAttributes, moi: IdentityAttributes): AttributeMatch[] {
  return ORDER.map((attribute) => {
    const c = captured[attribute]?.trim() || undefined;
    const m = moi[attribute]?.trim() || undefined;
    const base = { attribute, label: RECON_LABEL[attribute], captured: c, moi: m };
    if (!c) return { ...base, result: 'not-captured' as const };
    if (!m) return { ...base, result: 'moi-missing' as const };
    const cn = NORMALISE[attribute](c);
    const mn = NORMALISE[attribute](m);
    // A value that cannot be read in its attribute's form (an unparseable date) is a difference, not a pass.
    return { ...base, result: cn !== undefined && cn === mn ? ('match' as const) : ('mismatch' as const) };
  });
}

/** Journey progression: no captured attribute may disagree with MOI. */
export const reconciliationPasses = (result: AttributeMatch[]): boolean => !result.some((a) => a.result === 'mismatch');

export const mismatchedLabels = (result: AttributeMatch[]): string[] => result.filter((a) => a.result === 'mismatch').map((a) => a.label);

/** The agent-facing sentence for a failed reconciliation, naming each attribute that differs. */
export function mismatchMessage(result: AttributeMatch[]): string | undefined {
  const bad = mismatchedLabels(result);
  return bad.length ? `The scanned ID does not match the MOI record: ${bad.join(', ')}. Check the card and try again.` : undefined;
}
