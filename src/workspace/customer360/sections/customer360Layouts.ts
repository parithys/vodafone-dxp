// How each Customer 360 tab groups its fields. Pure presentation: WHICH fields a
// persona sees, and whether each is real-time or drill-down, still comes from
// customer360-fields.json via customer360VisibilityEngine. A field is named here
// by its exact `details` string; any visible field a layout does not name falls
// into a trailing "Other" group, so nothing the spec lists can go missing.

export interface FieldGroup {
  title: string;
  fields: string[];
  /** 'kpi': tiles in a grid. 'list': label/value rows in one card. */
  display: 'kpi' | 'list';
  /** 'half' places two groups side by side (e.g. National vs Open UI address). */
  width?: 'full' | 'half';
  /** Collect every field whose source `component` equals this (used where the same `details` repeats under two components, e.g. address Zone). */
  component?: string;
}

const BILLING_EMAIL = 'Billing Email ID (It should show all the email Ids which are marked for Billing Recipient)';
const SERVICE_CONNECTIONS = 'Service Type Number of Connections (Total Per Account + Total Per Plan Type)';
const RECENT_MILESTONES =
  'Recent Milestones or Interactions (including all recent purchases add-on, Plan change, activation, change done to MSISDN, account, ticket or activity)';
const USAGE = 'Usage Behaviour (High Data, High Roaming, High Local Call, High International Calls)';
const BALANCE = 'Current Balance (Data,Voice, Text, Primary Balance)';
const MSISDN_STATUS = 'MSISDN Status (Active, Suspended, Barred)';

export const customer360Layouts: Record<string, FieldGroup[]> = {
  'Account Information': [
    { title: 'Account Health', display: 'kpi', fields: ['Segment', 'Primary MSISDN', SERVICE_CONNECTIONS, 'Credit Limit', 'Current Dunning Stage', 'Overdue TT', 'OG/IC Barring Dates', 'About to OG/IC Bar (Y/N)', 'Special Management'] },
    { title: 'Account Management', display: 'list', fields: ['AM name', 'AM mobile', 'AM Email', 'Manager Email', 'Availability/escalation contact', BILLING_EMAIL] },
    { title: 'Pending Requests', display: 'kpi', fields: ['Pending TON requests', 'Pending Adjustments', 'Pending Sim swap'] },
    { title: 'Activity', display: 'list', fields: [RECENT_MILESTONES, 'Activity (last 5)', 'Last 5 Orders', 'All Orders', 'All Trouble Tickets'] },
    { title: 'Structure & Products', display: 'list', fields: ['Account Hierarchy', 'Contact Hierarchy', 'All Billing Profiles', 'Installed Assets', 'NAS/Address'] },
  ],
  Assets: [
    { title: 'Line Status', display: 'kpi', fields: [MSISDN_STATUS, 'Any Barring Flags', 'MSISDN Activation Date', 'Postpaid Activation Date', 'Plan Activation Date', 'Sim serial', 'Repeat Call Flag (Y/N)'] },
    { title: 'Plan & Offers', display: 'kpi', fields: ['Plan Name', 'Plan and Add-ons Benefits', 'Bill Limit', 'Active Add-on', 'Active Discount', 'Pending Discounts', 'Existing Discounts Expiry Date', 'Star number value', 'Autobase elegibility flag', 'Lifestyle Benifits'] },
    { title: 'Balance & Usage', display: 'kpi', fields: [BALANCE, USAGE, '10 Recent Usages (Data, Calls, Text, OOB)', 'Last Recharge Amount', 'Last Recharge Type'] },
    { title: 'Device Instalment', display: 'kpi', fields: ['DOI Handset Type', 'DOI Price', 'DOI Remaining Amount', 'DOI Tennure'] },
    { title: 'Digital', display: 'kpi', fields: ['App Recent/Last Login (Date & Time)', 'App Active User (Y/N)', 'App Digital Adoption %', 'App Version', 'Phone Version', 'Registered Email ID', 'Notifications & SMS'] },
  ],
  'Contact Information': [
    { title: 'Identity', display: 'kpi', fields: ['First Name & Last Name (Full Name)', 'ID Type', 'ID Number', 'ID Status (Blacklisted/Whitelisted)', 'DOB', 'Tennure', 'Total Number of Connections', 'Credit Score', 'QCB Check'] },
    { title: 'Reach', display: 'list', fields: ['Email', 'Notification MSISDN', 'Preferred Language', 'Employer'] },
    { title: 'Authorised Persons', display: 'list', fields: ['Authorized person(s)', 'Authorized Role', 'Authorized Mobile', 'Authorized email'] },
    { title: 'Offers', display: 'list', fields: ['Cross sale offers flag', 'Sales enhansment offers'] },
  ],
  'Billing & Payments': [
    { title: 'Postpaid', display: 'kpi', fields: ['Outstanding Balance', 'Amount Required to Pay', 'Due Date', 'Latest Bill', 'Unbilled Usage', 'Postpaid - Monthly Recurring Charge', 'Postpaid - Average Bill/Spend'] },
    { title: 'Payments', display: 'kpi', fields: ['Last Payment & Channel', 'PTP Eligible (Y/N)'] },
    { title: 'Prepaid', display: 'kpi', fields: ['Prepaid - Monthly Recharge Amount', 'Prepaid - Top Recharge Type'] },
  ],
  'Account Address': [
    { title: 'National Address', display: 'list', width: 'half', component: 'National Address', fields: [] },
    { title: 'Open UI Address', display: 'list', width: 'half', component: 'Open UI Address', fields: [] },
  ],
  'Blacklist View': [
    { title: 'Blacklist Status', display: 'kpi', fields: ['Blacklisted ID Status', 'Total amount', 'Account Number'] },
    { title: 'Billing Detail', display: 'list', fields: ['Bill Period', 'Bill Number', 'MSISDNs'] },
  ],
  'Account/Contact Lead': [
    { title: 'Lead', display: 'kpi', fields: ['Lead Type', 'Lead Status', 'MSISDN', 'Created By'] },
    { title: 'Notes', display: 'list', fields: ['Comments'] },
  ],
  'Contact/Assets Information': [
    { title: 'Offers', display: 'kpi', fields: ['Next Best Offer', 'CVM/targeted offers', 'Eligible Discount', 'Fixed Line Offer', 'DOI Eligibility'] },
  ],
  'Penalty View': [{ title: 'Penalties', display: 'list', fields: ['Star number Penalty', 'Device Penalty (Fiber & 5G)'] }],
};
