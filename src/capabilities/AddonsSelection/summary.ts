import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

/** What the Addons page of a postpaid or prepaid journey adds to the Journey Summary: the add-ons, the discount and the bill limit, each only once chosen. */
export const addonsSummary: SummaryField[] = [
  { key: 'addons', label: 'Add-Ons', type: 'multi', optional: true, labelFrom: { kind: 'products', idField: 'productId', labelField: 'name' }, value: (v) => at(v, 'addonIds') },
  { key: 'discount', label: 'Discount', type: 'select', optional: true, labelFrom: { kind: 'addons-discounts', idField: 'addonDiscountId', labelField: 'name' }, value: (v) => at(v, 'discountId') },
  { key: 'billLimit', label: 'Bill Limit', type: 'text', optional: true, value: (v) => at(v, 'billLimit') },
];
