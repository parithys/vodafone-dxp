import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

export const crossSalesSummary: SummaryField[] = [
  {
    key: 'decision',
    label: 'Recommended Offer',
    type: 'select',
    options: { accepted: 'Accepted', declined: 'Declined', none: 'No offer available' },
    value: (v) => at(v, 'crossSales', 'decision'),
  },
  { key: 'offer', label: 'Offer', type: 'text', optional: true, value: (v) => at(v, 'crossSales', 'offerName') },
];
