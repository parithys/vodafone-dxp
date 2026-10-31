import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

export const planChoiceSummary: SummaryField[] = [
  { key: 'plan', label: 'Plan', type: 'select', labelFrom: { kind: 'products', idField: 'productId', labelField: 'name' }, value: (v) => at(v, 'productId') },
];

export const planExtrasSummary: SummaryField[] = [
  { key: 'addons', label: 'Add-Ons', type: 'multi', optional: true, labelFrom: { kind: 'products', idField: 'productId', labelField: 'name' }, value: (v) => at(v, 'addonIds') },
  { key: 'discount', label: 'Discount', type: 'select', optional: true, labelFrom: { kind: 'addons-discounts', idField: 'addonDiscountId', labelField: 'name' }, value: (v) => at(v, 'discountId') },
  { key: 'billLimit', label: 'Bill Limit', type: 'text', optional: true, value: (v) => at(v, 'billLimit') },
];

export const planSummary: SummaryField[] = [...planChoiceSummary, ...planExtrasSummary];
