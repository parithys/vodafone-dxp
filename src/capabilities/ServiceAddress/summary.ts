import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { at } from '../summaryKit';

export const addressSummary: SummaryField[] = [
  { key: 'zone', label: 'Zone', type: 'text', optional: true, value: (v) => at(v, 'address', 'zone') },
  { key: 'street', label: 'Street No.', type: 'text', optional: true, value: (v) => at(v, 'address', 'streetNo') },
  { key: 'building', label: 'Building No.', type: 'text', optional: true, value: (v) => at(v, 'address', 'buildingNo') },
  { key: 'unit', label: 'Flat / Unit', type: 'text', optional: true, value: (v) => at(v, 'address', 'aptFlatUnit') },
  { key: 'floor', label: 'Floor', type: 'text', optional: true, value: (v) => at(v, 'address', 'floor') },
  { key: 'poBox', label: 'PO Number', type: 'text', optional: true, value: (v) => at(v, 'address', 'poBox') },
  { key: 'area', label: 'City', type: 'text', optional: true, value: (v) => at(v, 'address', 'area') },
  { key: 'country', label: 'Country', type: 'text', optional: true, value: (v) => at(v, 'address', 'country') },
  { key: 'line', label: 'Address Description', type: 'text', optional: true, value: (v) => at(v, 'address', 'addressLine') },
  { key: 'kahramaa', label: 'Kahramaa ID', type: 'text', optional: true, sensitive: true, value: (v) => at(v, 'address', 'kahramaaId') },
];
