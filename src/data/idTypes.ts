// The one definition of the identity-document types the app understands. Everything that offers, labels,
// validates, scans or routes on an ID type reads it from here; add or change a type in this file only.

export type IdType = 'QID' | 'Passport' | 'GCC ID' | 'Diplomatic ID';

export interface IdTypeDef {
  type: IdType;
  /** Card / option label, e.g. 'Qatar ID (QID)'. */
  label: string;
  numberLabel: string;
  /** The number is digits only, so a touch device opens the numeric keypad for it (a passport number carries letters). */
  numericNumber: boolean;
  placeholder: string;
  /** SVG path data for the selector card. */
  icon: string;
  /** Read at the document reader (the number comes from the scan, not typing). */
  scannable: boolean;
  /** Presented as the customer's ID, the sale does not complete in the normal flow: it routes to approval. */
  exceptionRouted: boolean;
  /** Subject to the prepaid connection cap for non-Qatari customers (see ruleEngine). */
  prepaidCapped: boolean;
}

const CARD_ICON = 'M3 6h18v12H3z M3 10h18 M6 15h3';
const BOOK_ICON = 'M12 6.5c-1.6-1.1-4-1.6-6-1.2v12.8c2-0.4 4.4 0.1 6 1.2 M12 6.5c1.6-1.1 4-1.6 6-1.2v12.8c-2-0.4-4.4 0.1-6 1.2 M12 6.5v12.8';
const GLOBE_ICON = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.4 2.6 2.4 15.4 0 18 M12 3c-2.4 2.6-2.4 15.4 0 18';
const SHIELD_ICON = 'M12 3l7 3v5.5c0 5-3 8.3-7 9.5-4-1.2-7-4.5-7-9.5V6z';

export const ID_TYPES: IdTypeDef[] = [
  { type: 'QID', label: 'Qatar ID (QID)', numberLabel: 'Qatar ID (QID) Number', numericNumber: true, placeholder: 'e.g. 28456701234', icon: CARD_ICON, scannable: true, exceptionRouted: false, prepaidCapped: false },
  { type: 'Passport', label: 'Passport', numberLabel: 'Passport Number', numericNumber: false, placeholder: 'e.g. P0998812', icon: BOOK_ICON, scannable: true, exceptionRouted: true, prepaidCapped: true },
  { type: 'GCC ID', label: 'GCC ID', numberLabel: 'GCC ID Number', numericNumber: true, placeholder: 'e.g. 784202312345678', icon: GLOBE_ICON, scannable: true, exceptionRouted: true, prepaidCapped: true },
  { type: 'Diplomatic ID', label: 'Diplomatic ID', numberLabel: 'Diplomatic ID Number', numericNumber: true, placeholder: 'e.g. DIP-QA-004521', icon: SHIELD_ICON, scannable: true, exceptionRouted: false, prepaidCapped: false },
];

export const idTypeDef = (type: IdType): IdTypeDef | undefined => ID_TYPES.find((t) => t.type === type);

/** Display name for an ID type, e.g. 'Qatar ID (QID)'. */
export const idTypeLabel = (type: IdType): string => idTypeDef(type)?.label ?? type;

/**
 * Which types a journey or screen OFFERS. Journeys name a preset instead of listing types themselves, so the
 * offered set cannot drift from one journey to the next.
 */
export const ID_TYPE_PRESETS = {
  /** Every supported document type - the default wherever a screen identifies a customer by ID. */
  all: ['QID', 'Passport', 'GCC ID', 'Diplomatic ID'],
  /** New Connection: all four are offered; Passport / GCC ID route to approval in eligibility. */
  'new-connection': ['QID', 'Passport', 'GCC ID', 'Diplomatic ID'],
  /** Mobile Prepaid Activation (BRSD MPRA_001_KYC_01): QID, Diplomatic ID, GCC ID and Passport are all permitted outright. */
  prepaid: ['QID', 'Diplomatic ID', 'GCC ID', 'Passport'],
  /** The donor operator's ID on a port-in (MNP BRSD V1.1, DF-MNP-011): QID, Passport, GCC ID, Diplomatic ID. */
  donor: ['QID', 'Passport', 'GCC ID', 'Diplomatic ID'],
} as const satisfies Record<string, readonly IdType[]>;

export type IdTypePreset = keyof typeof ID_TYPE_PRESETS;

export const idTypesFor = (preset: IdTypePreset): IdType[] => [...ID_TYPE_PRESETS[preset]];

export const SCANNABLE_ID_TYPES: ReadonlySet<IdType> = new Set(ID_TYPES.filter((t) => t.scannable).map((t) => t.type));
/** Also covers 'Other ID', which exists on identity records but is not a selectable type. */
export const EXCEPTION_ROUTED_ID_TYPES: ReadonlySet<string> = new Set([...ID_TYPES.filter((t) => t.exceptionRouted).map((t) => t.type), 'Other ID']);
export const PREPAID_CAPPED_ID_TYPES: ReadonlySet<string> = new Set(ID_TYPES.filter((t) => t.prepaidCapped).map((t) => t.type));
