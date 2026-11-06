import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

export const planChoiceSummary: SummaryField[] = [
  { key: 'plan', label: 'Plan', type: 'select', labelFrom: { kind: 'products', idField: 'productId', labelField: 'name' }, value: (v) => at(v, 'productId') },
];

/** The fixed-line / fibre plan step: the plan chosen (its add-ons, discount and bill limit are not part of that journey). */
export const planSummary: SummaryField[] = planChoiceSummary;
