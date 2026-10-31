// Documents of a journey, in one place: what the order REQUIRES the agent to attach (decided by the scenario the journey is in and by who is
// working it), and every document the journey already holds (the ID scans, the special-discount evidence, the signed CAF, what was uploaded).
// Additional Documents - the end of the journey, after the CAF is signed - is where both are shown. Scenario-specific supporting documents
// are requested there and nowhere earlier.
//
// Pure: reads the draft values and the persona, writes nothing.

export interface DocumentRequirement {
  /** Stable key: an uploaded document records the requirement it satisfies. */
  id: string;
  label: string;
  /** Why it is asked for, shown beside it. */
  reason: string;
}

export interface JourneyDocument {
  id: string;
  label: string;
  /** Where in the journey it came from. */
  source: string;
  fileName?: string;
  /** Content that can be opened and downloaded; absent for a capture the reader did not keep an image of. */
  dataUrl?: string;
  /** For an upload held in the session file store rather than in the values. */
  fileId?: string;
  /** For a scanned document the reader kept no image of: what was drawn on screen at the scan, so the same card can be shown again. */
  scan?: { side: 'front' | 'back'; documentType?: string; variant?: 'b2b2c' | 'retired' | 'mada' };
}

import { getDocumentTypes } from './configEngine';
import type { DocumentTypeConfig } from '../types/config';

export const MINIMUM_APPLICANT_AGE = 18;

/** The applicant's age in whole years from a DD/MM/YYYY date of birth; undefined when it is not on record (unknown stays unknown). */
export function ageFromDob(dob: string | undefined, now: Date = new Date()): number | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob ?? '');
  if (!m) return undefined;
  const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d)) age -= 1;
  return age;
}

type Values = Record<string, unknown>;

/**
 * The named conditions a document type's rules can use, each computed from the journey draft. The vocabulary is code (it says what a draft can
 * answer); which document uses which condition is configuration (public/config/document-types.json).
 */
const CONDITIONS: Record<string, (v: Values) => boolean> = {
  'number-waiver': (v) => typeof v.numberWaiver === 'number' && v.numberWaiver > 0,
  'minor-applicant': (v) => {
    const age = ageFromDob((v.contact as { moiResult?: { dob?: string } } | undefined)?.moiResult?.dob);
    return age !== undefined && age < MINIMUM_APPLICANT_AGE;
  },
  'actual-user-other': (v) => (v.actualUser as { choice?: string } | undefined)?.choice === 'other',
  'manual-caf': (v) => (v.caf as { cafType?: string } | undefined)?.cafType === 'Manual',
  // A VAT registration number was entered on the new billing account: the VAT document must come with it.
  'vat-registration': (v) => {
    const b = v.billingAccount as { creatingNew?: boolean; newAccount?: { vatRegistrationNumber?: string } } | undefined;
    return Boolean(b?.creatingNew && b.newAccount?.vatRegistrationNumber?.trim());
  },
  'upfront-payment': (v) => ((v.checkoutTotals as { dueTodayQar?: number } | undefined)?.dueTodayQar ?? 0) > 0,
};
const specialDiscount = (v: Values, kind: string) => {
  const c = v.customerType as { type?: string; rejected?: boolean } | undefined;
  return c?.type === kind && !c.rejected;
};
/** Whether a named condition holds; an unknown name never holds (unknown stays unknown). */
function holds(name: string, v: Values): boolean {
  if (name.startsWith('special-discount:')) return specialDiscount(v, name.slice('special-discount:'.length));
  return CONDITIONS[name]?.(v) ?? false;
}

export interface DocumentContext {
  values: Values;
  personaId?: string;
  /** The journey family (e.g. 'new-connection'). */
  journey?: string;
}

/** Whether a document type applies in this context: every dimension it names must match; an empty list matches nothing, an omitted one anything. */
export function documentTypeApplies(t: DocumentTypeConfig, ctx: DocumentContext): boolean {
  const a = t.appliesTo;
  if (!a) return true;
  const v = ctx.values;
  const contact = v.contact as { idType?: string } | undefined;
  const segment = (v.eligibility as { segment?: string } | undefined)?.segment;
  const product = v.product as string | undefined;
  if (a.journeys && !(ctx.journey !== undefined && a.journeys.includes(ctx.journey))) return false;
  if (a.personas && !(ctx.personaId !== undefined && a.personas.includes(ctx.personaId))) return false;
  if (a.products && !(product !== undefined && a.products.includes(product))) return false;
  if (a.idTypes && !(contact?.idType !== undefined && a.idTypes.includes(contact.idType))) return false;
  if (a.segments && !(segment !== undefined && a.segments.some((p) => segment.startsWith(p)))) return false;
  if (a.conditions && !a.conditions.every((c) => holds(c, v))) return false;
  return true;
}

/** The documents this order requires, for the journey it is in, the role working it and the customer: the configured types whose requiredWhen all hold. */
export function requiredDocumentsFor(ctx: DocumentContext): DocumentRequirement[] {
  return getDocumentTypes()
    .filter((t) => t.requiredWhen?.length && documentTypeApplies(t, ctx) && t.requiredWhen.every((c) => holds(c, ctx.values)))
    .map((t) => ({ id: t.id, label: t.label, reason: t.reason ?? 'Required for this order.' }));
}

/** The configured document type a condition makes required (the Additional Discount's supporting document is the one asked for when `number-waiver` holds), or undefined when none is. */
export function requirementForCondition(condition: string): { id: string; label: string } | undefined {
  const t = getDocumentTypes().find((x) => x.requiredWhen?.includes(condition));
  return t ? { id: t.id, label: t.label } : undefined;
}

/** The labels offered in the Document Type list: every configured type that applies here, except those already asked for as a required card. */
export function documentTypeOptionsFor(ctx: DocumentContext): string[] {
  const required = new Set(requiredDocumentsFor(ctx).map((r) => r.id));
  const types = getDocumentTypes().filter((t) => !required.has(t.id) && (t.offerAlways !== undefined || documentTypeApplies(t, ctx)));
  // The always-offered types first, in their set order; then the ones this journey, role and customer make relevant.
  const always = types.filter((t) => t.offerAlways !== undefined).sort((a, b) => a.offerAlways! - b.offerAlways!);
  return [...always, ...types.filter((t) => t.offerAlways === undefined)].map((t) => t.label);
}

interface Scan {
  frontScanned?: boolean;
  backScanned?: boolean;
  frontImage?: string;
  backImage?: string;
  frontFile?: string;
  backFile?: string;
  combined?: boolean;
  source?: 'scan' | 'upload';
}

/** What the Special Discount's supporting document is called: only a B2B2C customer's is an office ID card. */
export function specialDiscountDocumentLabel(type: string | undefined): string {
  return type === 'b2b2c' ? 'Office ID Card' : type === 'retired' ? 'Retiree Supporting Document' : type === 'mada' ? 'MADA Supporting Document' : 'Supporting Document';
}

const digitsOnly = (text: string | undefined): string => (text ?? '').replace(/[^A-Za-z0-9]/g, '');

/**
 * The name a scanned supporting document is stored under: a MADA document is `<QID number>-MADA-Front-2026-10-28.jpg`; any other keeps
 * `Retiree-Supporting-Document_Front_2026-10-28.jpg` (its name, the side, the capture day). An uploaded file keeps its own name.
 */
export function scanFileName(label: string, side: 'Front' | 'Back' | 'Both-Sides', uploaded: string | undefined, at: Date = new Date(), idNumber?: string): string {
  if (uploaded) return uploaded;
  const day = at.toISOString().slice(0, 10);
  const number = digitsOnly(idNumber);
  if (number && /^MADA\b/i.test(label)) return `${number}-MADA-${side}-${day}.jpg`;
  return `${label.replace(/\s+/g, '-')}_${side}_${day}.jpg`;
}

/** The file type of a captured image, from the content held (png, pdf ...); jpg for a capture with none. */
export const extensionOfDataUrl = (dataUrl: string | undefined): string => {
  const mime = /^data:([^;,]+)/.exec(dataUrl ?? '')?.[1]?.toLowerCase();
  return mime === 'image/png' ? 'png' : mime === 'application/pdf' ? 'pdf' : mime === 'image/svg+xml' ? 'svg' : mime === 'image/webp' ? 'webp' : 'jpg';
};

/** The name a scanned identity document is stored under: `<ID number>-back-2026-10-28.png`, with the file type of what was captured. An uploaded file keeps its own name; without a number the type stands in for it. */
export function idScanDisplayName(idType: string | undefined, idNumber: string | undefined, side: 'front' | 'back' | 'both-sides', uploaded: string | undefined, at: Date = new Date(), dataUrl?: string): string {
  if (uploaded) return uploaded;
  return `${digitsOnly(idNumber) || (idType ?? 'ID').replace(/\s+/g, '-')}-${side}-${at.toISOString().slice(0, 10)}.${extensionOfDataUrl(dataUrl)}`;
}

function scanDocuments(prefix: string, label: string, source: string, scan: Scan | undefined, name: (side: 'Front' | 'Back' | 'Both-Sides', uploaded: string | undefined, dataUrl: string | undefined) => string, drawn?: { documentType?: string; variant?: 'b2b2c' | 'retired' | 'mada' }): JourneyDocument[] {
  if (!scan) return [];
  const how = scan.source === 'upload' ? 'Uploaded' : 'Scanned';
  const out: JourneyDocument[] = [];
  if (scan.frontScanned) out.push({ id: `${prefix}-front`, label: `${label}${scan.combined ? ' (Both Sides)' : ' (Front)'}`, source: `${source} · ${how}`, fileName: name(scan.combined ? 'Both-Sides' : 'Front', scan.frontFile, scan.frontImage), dataUrl: scan.frontImage, ...(drawn && how === 'Scanned' ? { scan: { side: 'front' as const, ...drawn } } : {}) });
  if (scan.backScanned && !scan.combined) out.push({ id: `${prefix}-back`, label: `${label} (Back)`, source: `${source} · ${how}`, fileName: name('Back', scan.backFile, scan.backImage), dataUrl: scan.backImage, ...(drawn && how === 'Scanned' ? { scan: { side: 'back' as const, ...drawn } } : {}) });
  return out;
}

/** Every document the journey holds so far, in the order the journey collected them. */
export function consolidatedDocuments(values: Record<string, unknown>, uploaded: { id: string; label: string; fileName: string }[] = []): JourneyDocument[] {
  const contact = values.contact as { idType?: string; idNumber?: string; qidScans?: Scan } | undefined;
  const type = values.customerType as { type?: string; officeId?: Scan; rejected?: boolean } | undefined;
  const caf = values.caf as { signatureDataUrl?: string; signedCafDataUrl?: string; secondarySignatureDataUrl?: string } | undefined;
  const officeLabel = specialDiscountDocumentLabel(type?.type);
  return [
    ...scanDocuments('id', contact?.idType ? `${contact.idType} ID Document`.replace('ID ID', 'ID') : 'ID Document', 'Customer Verification', contact?.qidScans, (side, uploaded, dataUrl) => idScanDisplayName(contact?.idType, contact?.idNumber, side.toLowerCase() as 'front' | 'back' | 'both-sides', uploaded, new Date(), dataUrl), { documentType: contact?.idType }),
    ...(type && type.type && type.type !== 'none' && !type.rejected ? scanDocuments('special', officeLabel, 'Special Discounts', type.officeId, (side, uploaded) => scanFileName(officeLabel, side, uploaded, new Date(), contact?.idNumber), { variant: type.type as 'b2b2c' | 'retired' | 'mada' }) : []),
    ...(caf?.signatureDataUrl ? [{ id: 'caf-signature', label: 'Signed CAF', source: 'CAF & Signature', fileName: 'signed-caf.png', dataUrl: caf.signedCafDataUrl ?? caf.signatureDataUrl }] : []),
    ...(caf?.secondarySignatureDataUrl ? [{ id: 'caf-secondary', label: 'Supplementary Form Signature', source: 'CAF & Signature', fileName: 'supplementary-signature.png', dataUrl: caf.secondarySignatureDataUrl }] : []),
    ...uploaded.map((u) => ({ id: `upload-${u.id}`, label: u.label, source: 'Additional Documents · Uploaded', fileName: u.fileName, fileId: u.id })),
  ];
}
