import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at, qar } from '../summaryKit';
import { toLocalMsisdn } from '../../components/domain/msisdnPickerModel';

/** The chosen number and, when the journey records one, its price (stored under `priceField`). */
export const numberSummary = (priceField: string | undefined = 'numberPriceQAR'): SummaryField[] => [
  { key: 'msisdn', label: 'Mobile Number', type: 'text', // The number without the country code (+974), as the number cards show it.
    value: (v) => { const n = at(v, 'msisdn'); return typeof n === 'string' ? toLocalMsisdn(n) : (at(v, 'prePaired') === true ? 'Pre-Paired SIM' : undefined); } },
  { key: 'waiver', label: 'Additional Discount', type: 'text', optional: true, value: (v) => { const w = at(v, 'numberWaiver'); return typeof w === 'number' && w > 0 ? qar(w) : undefined; } },
  ...(priceField ? [{ key: 'price', label: 'Number Price', type: 'text' as const, optional: true, value: (v: Record<string, unknown>) => qar(at(v, priceField)) }] : []),
];
