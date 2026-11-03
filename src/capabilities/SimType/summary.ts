import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

/** The Multi-SIMs provisioned, one line each (no number is listed: it is assigned by the system at submission). */
export const multiSimSummary: SummaryField[] = [
  {
    key: 'multiSims',
    label: 'Multi-SIMs',
    type: 'text',
    optional: true,
    sensitive: true,
    value: (v) => {
      const held = (v.multiSims as { simType?: string; simSerial?: string }[] | undefined) ?? [];
      const lines = held.filter((s) => s.simType).map((s, i) => `Multi-SIM ${i + 1}: ${s.simType}${s.simSerial ? ` ${s.simSerial}` : ''}`);
      return lines.length > 0 ? lines.join('; ') : undefined;
    },
  },
];

export const simTypeSummary: SummaryField[] = [
  { key: 'simType', label: 'SIM Type', type: 'text', value: (v) => at(v, 'simType', 'simType') },
  { key: 'serial', label: 'SIM Serial Number', type: 'text', optional: true, sensitive: true, value: (v) => at(v, 'simType', 'simSerial') },
  { key: 'iccid', label: 'ICCID', type: 'text', optional: true, sensitive: true, value: (v) => at(v, 'simType', 'simIccid') },
];
