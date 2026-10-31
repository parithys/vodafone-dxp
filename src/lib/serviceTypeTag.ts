// The ONE definition of how a service type is tagged: its wording and its background / text colour, wherever it appears
// (offer cards, line lists, plan cards, Customer 360 service lists). Colours are the ones the Recommended Offers page has always used;
// every surface reads them from here, so a tag can never be two colours. Imports nothing from the app.
//
// Two kinds of key share this table: a JOURNEY the offer sells (new-postpaid ...) and a LINE TYPE the customer holds (postpaid,
// prepaid, fixed-line). A line type takes the colour of the journey that sells it, so "Postpaid" is the same blue as "New Postpaid".

const BLUE = 'bg-[var(--tint-blue-bg)] text-[var(--tint-blue-fg)]';
const GREEN = 'bg-[var(--tint-green-bg)] text-[var(--tint-green-fg)]';
const TEAL = 'bg-[var(--tint-teal-bg)] text-[var(--tint-teal-fg)]';
const AMBER = 'bg-[var(--tint-amber-bg)] text-[var(--tint-amber-fg)]';
const PINK = 'bg-[var(--tint-pink-bg)] text-[var(--tint-pink-fg)]';
const INDIGO = 'bg-[var(--tint-indigo-bg)] text-[var(--tint-indigo-fg)]';

export const SERVICE_TYPE_TAGS = {
  'new-postpaid': { label: 'New Postpaid', colour: BLUE },
  'new-prepaid': { label: 'New Prepaid', colour: GREEN },
  'mnp-postpaid': { label: 'MNP Postpaid', colour: TEAL },
  'mnp-prepaid': { label: 'MNP Prepaid', colour: AMBER },
  'new-fixed-line': { label: 'New Fixed Line', colour: PINK },
  'new-fwa': { label: 'New FWA', colour: INDIGO },
  'pre-to-post': { label: 'Prepaid to Postpaid', colour: GREEN },
  'post-to-post': { label: 'Postpaid to Postpaid Upgrade', colour: INDIGO },
  postpaid: { label: 'Postpaid', colour: BLUE },
  // A postpaid plan's class (planClass in products.json), worded short for the plan cards on Offers & Plans (the Recommended Offers page keeps the plain Postpaid tag).
  'postpaid-voice': { label: 'Voice Plan', colour: BLUE },
  'postpaid-broadband': { label: 'Broadband Plan', colour: TEAL },
  'postpaid-family': { label: 'Family Plan', colour: AMBER },
  prepaid: { label: 'Prepaid', colour: GREEN },
  'fixed-line': { label: 'Fixed Line', colour: PINK },
} as const;

export type ServiceTypeTagKey = keyof typeof SERVICE_TYPE_TAGS;
