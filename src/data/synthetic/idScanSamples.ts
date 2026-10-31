// Synthetic ID-card data for the simulated scanner / barcode reader (there is no real hardware).
// Both are drawn from the same identity-documents.json records the scan-first lookup resolves, so the
// card, the barcode-filled number and the resolved customer agree. The card itself carries a SPECIMEN
// watermark marked with the synthetic class (see components/domain/ScannedIdPreview.tsx).

export interface Specimen {
  name: string;
  idLabel: string;
  idNo: string;
  nationality: string;
  dob: string;
  expiry: string;
  back: { label: string; value: string }[];
  /** Two-line MRZ-shaped filler - not a real checksum-valid MRZ, just laid
   * out to the right character shapes so it reads as one at a glance. */
  mrz: [string, string];
}

/**
 * One specimen per document type, grounded in this corpus's own seeded data
 * rather than invented (2026-09-28 direction: "realistic demo
 * text/information appropriate to that ID type").
 *
 * Deliberately the SAME record `readDocumentFromScan` resolves for each type
 * in the scan-first flow, verified by replicating that function's own
 * selection - NOT just identity-documents.json's first entry of the type:
 * `readDocumentFromScan` skips an expired candidate in favour of a later
 * unexpired one, falling back to the first only if every candidate has
 * expired. QID/Passport/GCC ID each have one unexpired candidate that is
 * also array-first, so those three match their first entry. Diplomatic ID
 * does not: its first entry (Sophie Laurent, DIP-QA-004521) is expired
 * (31/08/2025, before this app's 2026-09-28 "now"), so the function actually
 * resolves the SECOND Diplomatic ID record, Henrik Lindqvist/DIP-QA-004977 -
 * confirmed by running the exact same find() this app's code runs, not
 * assumed from array order. Getting this wrong would show one identity on
 * the card and a different one in the form once the scan resolves.
 */
export const SPECIMENS: Record<string, Specimen> = {
  QID: {
    name: 'Ahmed Abdulla Hassan Al-Sulaiti',
    idLabel: 'QID No.',
    idNo: '28456701234',
    nationality: 'Qatari',
    dob: '12/03/1985',
    expiry: '30/11/2029',
    back: [
      { label: 'Issue Authority', value: 'MOH-Qatar' },
      { label: 'Place of Birth', value: 'Doha' },
      { label: 'Blood Type', value: 'A+' },
    ],
    mrz: ['ID QAT2845670123410<<<<<<<<<<<<', '8503129M2911308QAT<<<<<<<<<<06'],
  },
  Passport: {
    name: 'Bimal Bahadur Thapa',
    idLabel: 'Passport No.',
    idNo: 'P0998812',
    nationality: 'Nepalese',
    dob: '22/07/1990',
    expiry: '30/11/2029',
    back: [
      { label: 'Type', value: 'P' },
      { label: 'Issuing State', value: 'NPL' },
    ],
    mrz: ['P<NPLTHAPA<<BIMAL<BAHADUR<<<<<<<<<<<<<<<<<<', 'P0998812<3NPL9007224M2911308<<<<<<<<<<<<<04'],
  },
  'GCC ID': {
    name: 'Khalid Saeed Rashid Al-Mazrouei',
    idLabel: 'GCC ID No.',
    idNo: '784202312345678',
    nationality: 'Emirati',
    dob: '14/09/1988',
    expiry: '30/11/2029',
    back: [
      { label: 'Issuing State', value: 'UAE' },
      { label: 'Card Type', value: 'National ID' },
    ],
    mrz: ['ID ARE7842023123456781<<<<<<<<', '8809148M2911308ARE<<<<<<<<<<02'],
  },
  'Diplomatic ID': {
    name: 'Henrik Lars Lindqvist',
    idLabel: 'Diplomatic ID No.',
    idNo: 'DIP-QA-004977',
    nationality: 'Swedish',
    dob: '11/02/1981',
    expiry: '30/04/2030',
    back: [
      { label: 'Issuing Ministry', value: 'MOFA Qatar' },
      { label: 'Status', value: 'Accredited' },
    ],
    mrz: ['ID QATLINDQVIST<<HENRIK<<<<<<<<', '8102119M3004308SWE<<<<<<<<<<03'],
  },
};

/** The number the simulated barcode reader fills for each ID type. */
export const BARCODE_DEMO_NUMBERS: Record<'QID' | 'Passport' | 'GCC ID' | 'Diplomatic ID', string> = {
  QID: '28456701234',
  Passport: 'P0998812',
  'GCC ID': '784202312345678',
  'Diplomatic ID': 'DIP-QA-004977',
};
