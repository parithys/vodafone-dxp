/**
 * Nationalities an agent can record for a NEW customer created at Customer Verification (no MOI/NAS record exists for the ID). Spelled as the
 * customer records spell them (the demonym), so every downstream rule keyed on nationality - Qatari limits, the HRN configuration - reads them
 * the same way. Qatar, the GCC and the main expatriate-source countries; the HRN nationalities are all present.
 */
export const NATIONALITIES: readonly string[] = [
  'Qatari', 'Saudi', 'Emirati', 'Kuwaiti', 'Bahraini', 'Omani',
  'Indian', 'Nepalese', 'Filipino', 'Sri Lankan', 'Egyptian', 'Jordanian', 'Lebanese', 'Syrian', 'Sudanese', 'Yemeni', 'Palestinian', 'Iraqi',
  'Pakistani', 'Bangladeshi', 'Cambodian', 'Myanmar', 'Laotian', 'Kenyan', 'Ugandan', 'Swazi',
  'Indonesian', 'Malaysian', 'Thai', 'Vietnamese', 'Chinese', 'Turkish', 'Iranian', 'Moroccan', 'Tunisian', 'Algerian',
  'Ethiopian', 'Nigerian', 'Ghanaian', 'South African', 'British', 'American', 'Canadian', 'Australian', 'French', 'German', 'Italian', 'Spanish', 'Russian',
];
