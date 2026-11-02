import { BOOK_ICON, CARD_ICON, FILE, GLOBE_ICON_ALT, SHIELD_ICON } from '../assets/icons';
// The one definition of the identity-document types the app understands. Everything that offers, labels,
// validates, scans or routes on an ID type reads it from here; add or change a type in this file only.

export type IdType = 'QID' | 'Passport' | 'GCC ID' | 'Diplomatic ID' | 'Other ID';

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
  /** The app can identify a customer on this document. An unsupported type is offered like the others, but its scan is refused (UNSUPPORTED_ID_TYPE_MESSAGE) and the journey cannot go on with it. */
  supported: boolean;
}


export const ID_TYPES: IdTypeDef[] = [
  { type: 'QID', label: 'Qatar ID (QID)', numberLabel: 'Qatar ID (QID) Number', numericNumber: true, placeholder: 'e.g. 28456701234', icon: CARD_ICON, scannable: true, exceptionRouted: false, prepaidCapped: false, supported: true },
  { type: 'Passport', label: 'Passport', numberLabel: 'Passport Number', numericNumber: false, placeholder: 'e.g. P0998812', icon: BOOK_ICON, scannable: true, exceptionRouted: true, prepaidCapped: true, supported: true },
  { type: 'GCC ID', label: 'GCC ID', numberLabel: 'GCC ID Number', numericNumber: true, placeholder: 'e.g. 784202312345678', icon: GLOBE_ICON_ALT, scannable: true, exceptionRouted: true, prepaidCapped: true, supported: true },
  { type: 'Diplomatic ID', label: 'Diplomatic ID', numberLabel: 'Diplomatic ID Number', numericNumber: true, placeholder: 'e.g. DIP-QA-004521', icon: SHIELD_ICON, scannable: true, exceptionRouted: false, prepaidCapped: false, supported: true },
  { type: 'Other ID', label: 'Others', numberLabel: 'ID Number', numericNumber: false, placeholder: '', icon: FILE, scannable: true, exceptionRouted: true, prepaidCapped: false, supported: false },
];

/** What an agent is told when they try to scan or continue with an unsupported document type. */
export const UNSUPPORTED_ID_TYPE_MESSAGE = 'This ID type is not supported.';

/** Whether the app can identify a customer on this document type (an unknown or unchosen type is not blocked here). */
export const isIdTypeSupported = (type: string | undefined): boolean => (type ? idTypeDef(type as IdType)?.supported !== false : true);

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
  'new-connection': ['QID', 'Passport', 'GCC ID', 'Diplomatic ID', 'Other ID'],
  /** Mobile Prepaid Activation (BRSD MPRA_001_KYC_01): QID, Diplomatic ID, GCC ID and Passport are all permitted outright. */
  prepaid: ['QID', 'Diplomatic ID', 'GCC ID', 'Passport', 'Other ID'],
  /** The donor operator's ID on a port-in (MNP BRSD V1.1, DF-MNP-011): QID, Passport, GCC ID, Diplomatic ID. */
  donor: ['QID', 'Passport', 'GCC ID', 'Diplomatic ID'],
} as const satisfies Record<string, readonly IdType[]>;

export type IdTypePreset = keyof typeof ID_TYPE_PRESETS;

export const idTypesFor = (preset: IdTypePreset): IdType[] => [...ID_TYPE_PRESETS[preset]];

export const SCANNABLE_ID_TYPES: ReadonlySet<IdType> = new Set(ID_TYPES.filter((t) => t.scannable).map((t) => t.type));
/** Also covers 'Other ID', which exists on identity records but is not a selectable type. */
export const EXCEPTION_ROUTED_ID_TYPES: ReadonlySet<string> = new Set([...ID_TYPES.filter((t) => t.exceptionRouted).map((t) => t.type), 'Other ID']);
export const PREPAID_CAPPED_ID_TYPES: ReadonlySet<string> = new Set(ID_TYPES.filter((t) => t.prepaidCapped).map((t) => t.type));
