// The one name of each capability's wizard step, used by every journey that runs it. Journeys import the
// constant instead of typing a label, so the same step is never called two things.

/** Select an ID type, scan the document, validate with MOI, show the validated Identity Details. */
export const CUSTOMER_IDENTIFICATION_LABEL = 'Contact';
/** The same step for the special-discounts journeys. */
export const SPECIAL_DISCOUNTS_IDENTIFICATION_LABEL = 'Special Discounts Identification';
/** Who will use the line when it is not the customer who owns it. */
export const ACTUAL_USER_LABEL = 'Actual User';
/** Choose a number (free or star), reserve it. */
export const NUMBER_SELECTION_LABEL = 'Number Selection';
/** Pick, create or configure the billing profile the order bills to. */
export const BILLING_PROFILE_LABEL = 'Billing';
/** The address a service is activated at. */
export const SERVICE_ADDRESS_LABEL = 'Address';
/** The page after the plan: the plan's add-ons (by category, Free or Paid), the bill limit and the eligible discounts. */
export const ADDONS_DISCOUNTS_LABEL = 'Addons';
/** Choose the plan the order is for. */
export const PLAN_SELECTION_LABEL = 'Offers & Plans';
/** The Customer Agreement Form and the customer's signature. */
export const CAF_SIGNATURE_LABEL = 'CAF & Signature';
/** The order read-back before signing and payment. */
export const CHECKOUT_LABEL = 'Order Summary';
export const SUBSCRIPTIONS_LABEL = 'Subscriptions';
/** Take the amount due. */
export const PAYMENT_LABEL = 'Payment';
/** Book the installation visit. */
export const APPOINTMENT_LABEL = 'Book Appointment';
/** The closing note on the actions performed. */
export const ACTIVITY_LABEL = 'Activity';
/** Choose and validate the SIM. */
export const SIM_TYPE_LABEL = 'SIM Selection';
/** Scan and validate the SIM's serial number. */
export const SIM_SERIAL_LABEL = 'SIM Serial';
/** Choose which of the identified customer's existing lines the order changes. */
export const LINE_SELECTION_LABEL = 'Select Line';
