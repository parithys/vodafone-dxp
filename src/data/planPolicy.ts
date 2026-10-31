// What every Postpaid offer's "Speed and Fair Usage Policy (FUP)" panel shares (the per-plan bullets live on the plan
// record in products.json, as `fup`). Wording is the approved offer sheet's.

export interface PolicyTable {
  title?: string;
  head: [string, string];
  rows: [string, string][];
}

export const INCLUDED_INTERNATIONAL_MINUTES: PolicyTable = {
  head: ['Nationality', 'International Minutes'],
  rows: [
    ['India', '300'],
    ['Philippines', '150'],
    ['Pakistan', '150'],
    ['Bangladesh', '300'],
    ['International', '50'],
  ],
};

export const ADDON_INTERNATIONAL_MINUTES: PolicyTable = {
  title: 'International Minutes with QAR 10 will be as follows,',
  head: ['QAR 10 Add On', 'International Minutes'],
  rows: [
    ['India', '200'],
    ['Philippines', '25'],
    ['Pakistan', '50'],
    ['Nepal', '100'],
    ['Bangladesh', '200'],
    ['International', '20'],
  ],
};

export interface PolicyLink {
  text: string;
  /** The page the sentence points at, shown as a link line under it. */
  label?: string;
}

export const POLICY_LINKS: PolicyLink[] = [
  { text: 'To view Rest of the World countries, click here' },
  { text: 'To calculate & to know more about your 1st bill, click here', label: 'Vodafone Qatar | First Bill Calculator | vodafone.qa' },
  { text: 'To understand how bill limit works, click here', label: 'Vodafone Qatar | Bill Limit | vodafone.qa' },
  { text: 'To know more about star number policy, click here', label: 'Vodafone Qatar | Number Policy| vodafone.qa' },
  { text: 'Speak to one of our experts on WhatsApp to find the best plan for you, click here' },
];
