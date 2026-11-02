import { BOLT, BOX, CALENDAR, CARD, CART, CASH, CHAT, CHECKLIST, FILE, FORM, LAYERS_ICON, PERCENT, PERSON, PHONE_ALT, PIN, PLUS, SIM, TAG } from './index';
// One stroke icon (24px grid, Icon primitive) per kind of wizard step, shown in the collapsed Journey Summary rail where the icon is
// the only label a row has. Listed by step key; a step with no entry gets the generic form icon, never a guess from its label.


const ICONS: Record<string, string> = {
  // Who the customer is
  contact: PERSON,
  'contact-verification': PERSON,
  identity: PERSON,
  customerType: PERSON,
  'qid-entry': PERSON,
  'qid-images': PERSON,
  'msisdn-passport': PERSON,
  'donor-details': PERSON,
  // Where, and the account it bills to
  address: PIN,
  billingAccount: CARD,
  account: CARD,
  // What they buy
  product: BOX,
  productSelection: BOX,
  homeKind: BOX,
  mnp: BOX,
  mnpType: BOX,
  'offer-summary': BOX,
  plan: TAG,
  planExtras: PLUS,
  addons: PLUS,
  'addons-prepaid': PLUS,
  review: CHECKLIST,
  decision: CHECKLIST,
  discount: PERCENT,
  crossSales: PERCENT,
  // The line
  line: PHONE_ALT,
  number: PHONE_ALT,
  reserve: PHONE_ALT,
  subscriptions: PHONE_ALT,
  // Prepaid: a recharge is a top-up; the subscriptions cart is a stack of lines, so neither shares an icon with another row.
  recharge: BOLT,
  cart: LAYERS_ICON,
  sim: SIM,
  simType: SIM,
  serial: SIM,
  'sim-serial-reason': SIM,
  'sim-swap-form': SIM,
  // Paperwork and payment
  checkout: CART,
  'order-details': CART,
  due: CART,
  caf: FILE,
  documents: FILE,
  attachments: FILE,
  'donor-attachment': FILE,
  'change-form': FILE,
  payment: CASH,
  appointment: CALENDAR,
  activity: CHAT,
  activities: CHAT,
  communication: CHAT,
};

/** The step's icon, or the generic form icon when its key has none. */
export function stepIcon(stepKey: string): string {
  return ICONS[stepKey] ?? FORM;
}
