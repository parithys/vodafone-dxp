import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

export const simTypeSummary: SummaryField[] = [
  { key: 'simType', label: 'SIM Type', type: 'text', value: (v) => at(v, 'simType', 'simType') },
  { key: 'serial', label: 'SIM Serial Number', type: 'text', optional: true, sensitive: true, value: (v) => at(v, 'simType', 'simSerial') },
  { key: 'iccid', label: 'ICCID', type: 'text', optional: true, sensitive: true, value: (v) => at(v, 'simType', 'simIccid') },
];
