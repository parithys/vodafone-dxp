/**
 * Where a guided journey offers "Customer view" (the pop-up that shows the step to the customer). ONE list for every journey, keyed by the
 * shared step keys - a step that is not named here never shows the button, whichever journey it is in. Exactly six pages:
 *
 *   Recommended Offers   `product` (New Connection's offers page) and `crossSales` (the offers step of the other journeys)
 *   Plans and Offers     `plan`
 *   Number Selection     `number`
 *   Checkout             `checkout`
 *   CAF & Signature      `caf`
 *   Order Submitted      the page after the last step, shown by the Activation Complete capability, under its own key
 *
 * (New Home Connection's Product Selection is a different page - its step key is `productSelection` - and has no button.)
 */
export const ORDER_SUBMITTED_KEY = 'order-submitted';
export const CUSTOMER_VIEW_STEP_KEYS: readonly string[] = ['product', 'crossSales', 'plan', 'number', 'checkout', 'caf', ORDER_SUBMITTED_KEY];

export const hasCustomerView = (stepKey: string | undefined): boolean => stepKey !== undefined && CUSTOMER_VIEW_STEP_KEYS.includes(stepKey);
