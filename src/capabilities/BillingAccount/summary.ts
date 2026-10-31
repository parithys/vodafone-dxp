import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

export const billingAccountSummary: SummaryField[] = [
  {
    key: 'account',
    label: 'Billing Account',
    type: 'select',
    labelFrom: { kind: 'billing-profiles', idField: 'billingProfileId', labelField: 'name' },
    value: (v) => at(v, 'billingAccount', 'selectedProfileId'),
    when: (v) => !at(v, 'billingAccount', 'creatingNew'),
  },
  { key: 'profileName', label: 'New Profile Name', type: 'text', value: (v) => at(v, 'billingAccount', 'newAccount', 'profileName'), when: (v) => Boolean(at(v, 'billingAccount', 'creatingNew')) },
  { key: 'billMedia', label: 'Bill Medium', type: 'text', optional: true, value: (v) => at(v, 'billingAccount', 'newAccount', 'billMedia'), when: (v) => Boolean(at(v, 'billingAccount', 'creatingNew')) },
  { key: 'schedule', label: 'Billing Schedule', type: 'text', optional: true, value: (v) => at(v, 'billingAccount', 'newAccount', 'billingSchedule'), when: (v) => Boolean(at(v, 'billingAccount', 'creatingNew')) },
  { key: 'cycleDay', label: 'Bill Cycle Day', type: 'text', optional: true, value: (v) => at(v, 'billingAccount', 'newAccount', 'billCycleDay'), when: (v) => Boolean(at(v, 'billingAccount', 'creatingNew')) },
];
