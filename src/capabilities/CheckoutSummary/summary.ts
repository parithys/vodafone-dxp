import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at, qar } from '../summaryKit';

export const checkoutSummary: SummaryField[] = [
  { key: 'due', label: 'Total Payable Today', type: 'text', value: (v) => qar(at(v, 'checkoutTotals', 'dueTodayQar')) },
  { key: 'monthly', label: 'Monthly Recurring', type: 'text', value: (v) => qar(at(v, 'checkoutTotals', 'monthlyRecurringQar')) },
];
