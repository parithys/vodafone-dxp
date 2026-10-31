import type { SummaryField } from '../../components/patterns/wizard/stepSummary';
import { ID_TYPES } from '../../data/idTypes';
import { at } from '../summaryKit';
import { toLocalMsisdn } from '../../components/domain/msisdnPickerModel';

const idTypeLabels = Object.fromEntries(ID_TYPES.map((t) => [t.type, t.label]));

export const contactSummary: SummaryField[] = [
  { key: 'idType', label: 'ID Type', type: 'select', options: idTypeLabels, value: (v) => at(v, 'contact', 'idType') },
  { key: 'idNumber', label: 'ID Number', type: 'text', sensitive: true, value: (v) => at(v, 'contact', 'idNumber') },
  { key: 'firstName', label: 'First Name', type: 'text', value: (v) => at(v, 'contact', 'firstName') },
  { key: 'middleName', label: 'Middle Name(s)', type: 'text', optional: true, value: (v) => at(v, 'contact', 'middleName') },
  { key: 'lastName', label: 'Last Name', type: 'text', value: (v) => at(v, 'contact', 'lastName') },
  { key: 'dob', label: 'Date of Birth', type: 'text', value: (v) => at(v, 'contact', 'dob') },
  { key: 'nationality', label: 'Nationality', type: 'text', value: (v) => at(v, 'contact', 'nationality') },
  { key: 'gender', label: 'Gender', type: 'text', value: (v) => at(v, 'contact', 'gender') },
  { key: 'mobile', label: 'Mobile Number', type: 'text', optional: true, value: (v) => at(v, 'contact', 'mobileNumber') },
  { key: 'salutation', label: 'Salutation', type: 'text', optional: true, value: (v) => at(v, 'contact', 'salutation') },
  { key: 'altPhone', label: 'Work Number', type: 'text', optional: true, value: (v) => { const n = at(v, 'contact', 'altPhone'); return typeof n === 'string' ? toLocalMsisdn(n) : n; } },
  { key: 'workEmail', label: 'Work Email ID', type: 'text', optional: true, value: (v) => at(v, 'contact', 'workEmail') },
  { key: 'email', label: 'Email ID', type: 'text', optional: true, value: (v) => at(v, 'contact', 'email') },
  // The form shows English when none was chosen (it is not stored until changed), so the summary does too.
  { key: 'language', label: 'Preferred Language', type: 'text', value: (v) => at(v, 'contact', 'language') ?? 'English' },
  {
    key: 'customerType',
    label: 'Customer Type',
    type: 'select',
    options: { none: 'Standard', b2b2c: 'B2B2C (employer sponsored)', retired: 'Retired', mada: 'MADA' },
    optional: true,
    value: (v) => at(v, 'customerType', 'type'),
  },
  { key: 'employer', label: 'Employer', type: 'text', optional: true, value: (v) => at(v, 'contact', 'companyName') },
];
