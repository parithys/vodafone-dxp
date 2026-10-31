import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';
import type { ActualUserValue } from './actualUserModel';
import { actualUserIdentity } from './actualUserModel';
import { toLocalMsisdn } from '../../components/domain/msisdnPickerModel';

const identityOf = (v: Record<string, unknown>) => actualUserIdentity(v.actualUser as ActualUserValue | undefined);

export const actualUserSummary: SummaryField[] = [
  { key: 'user', label: 'Line Used By', type: 'text', value: (v) => (identityOf(v) ? 'Actual user' : 'Primary customer') },
  { key: 'name', label: 'Actual User', type: 'text', optional: true, value: (v) => identityOf(v)?.moiResult?.name },
  { key: 'id', label: 'ID Number', type: 'text', optional: true, sensitive: true, value: (v) => identityOf(v)?.idNumber },
  { key: 'email', label: 'Email', type: 'text', optional: true, value: (v) => identityOf(v)?.email },
  { key: 'phone', label: 'Work Number', type: 'text', optional: true, value: (v) => { const n = identityOf(v)?.altPhone ?? at(v, 'actualUser', 'identity', 'altPhone'); return typeof n === 'string' ? toLocalMsisdn(n) : n; } },
];
