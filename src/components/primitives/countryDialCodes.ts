export interface CountryDialCode {
  /** ISO 3166-1 alpha-2, used as the option key. */
  iso: string;
  name: string;
  /** E.164 country calling code, with its leading "+". */
  dial: string;
}

// E.164 calling codes. GCC and the main expatriate-source countries are listed
// first because they are what a Vodafone Qatar counter actually sees; the rest
// follow alphabetically.
//
// Why a hand-held list rather than a library: adding libphonenumber for a
// dial-code dropdown would pull ~150KB of parsing/formatting metadata into a
// bundle already flagged as oversized, and nothing here needs national-format
// validation per country - isValidAltPhone checks a general international
// shape once the code is prepended.
//
// Codes are NOT unique (+1 covers the US, Canada and the Caribbean; +7 Russia
// and Kazakhstan), which is why `iso` and not `dial` is the option key and the
// selected country is held as state rather than parsed back out of the stored
// number.
export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { iso: 'QA', name: 'Qatar', dial: '+974' },
  { iso: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { iso: 'KW', name: 'Kuwait', dial: '+965' },
  { iso: 'BH', name: 'Bahrain', dial: '+973' },
  { iso: 'OM', name: 'Oman', dial: '+968' },
  { iso: 'IN', name: 'India', dial: '+91' },
  { iso: 'PK', name: 'Pakistan', dial: '+92' },
  { iso: 'BD', name: 'Bangladesh', dial: '+880' },
  { iso: 'NP', name: 'Nepal', dial: '+977' },
  { iso: 'LK', name: 'Sri Lanka', dial: '+94' },
  { iso: 'PH', name: 'Philippines', dial: '+63' },
  { iso: 'EG', name: 'Egypt', dial: '+20' },
  { iso: 'JO', name: 'Jordan', dial: '+962' },
  { iso: 'LB', name: 'Lebanon', dial: '+961' },
  { iso: 'SY', name: 'Syria', dial: '+963' },
  { iso: 'IQ', name: 'Iraq', dial: '+964' },
  { iso: 'YE', name: 'Yemen', dial: '+967' },
  { iso: 'SD', name: 'Sudan', dial: '+249' },
  { iso: 'TN', name: 'Tunisia', dial: '+216' },
  { iso: 'MA', name: 'Morocco', dial: '+212' },
  { iso: 'DZ', name: 'Algeria', dial: '+213' },
  { iso: 'TR', name: 'Turkey', dial: '+90' },
  { iso: 'IR', name: 'Iran', dial: '+98' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44' },
  { iso: 'US', name: 'United States', dial: '+1' },
  { iso: 'CA', name: 'Canada', dial: '+1' },
  { iso: 'AU', name: 'Australia', dial: '+61' },
  { iso: 'NZ', name: 'New Zealand', dial: '+64' },
  { iso: 'ZA', name: 'South Africa', dial: '+27' },
  { iso: 'KE', name: 'Kenya', dial: '+254' },
  { iso: 'NG', name: 'Nigeria', dial: '+234' },
  { iso: 'ET', name: 'Ethiopia', dial: '+251' },
  { iso: 'GH', name: 'Ghana', dial: '+233' },
  { iso: 'DE', name: 'Germany', dial: '+49' },
  { iso: 'FR', name: 'France', dial: '+33' },
  { iso: 'IT', name: 'Italy', dial: '+39' },
  { iso: 'ES', name: 'Spain', dial: '+34' },
  { iso: 'PT', name: 'Portugal', dial: '+351' },
  { iso: 'NL', name: 'Netherlands', dial: '+31' },
  { iso: 'BE', name: 'Belgium', dial: '+32' },
  { iso: 'CH', name: 'Switzerland', dial: '+41' },
  { iso: 'AT', name: 'Austria', dial: '+43' },
  { iso: 'SE', name: 'Sweden', dial: '+46' },
  { iso: 'NO', name: 'Norway', dial: '+47' },
  { iso: 'DK', name: 'Denmark', dial: '+45' },
  { iso: 'FI', name: 'Finland', dial: '+358' },
  { iso: 'IE', name: 'Ireland', dial: '+353' },
  { iso: 'PL', name: 'Poland', dial: '+48' },
  { iso: 'RO', name: 'Romania', dial: '+40' },
  { iso: 'GR', name: 'Greece', dial: '+30' },
  { iso: 'RU', name: 'Russia', dial: '+7' },
  { iso: 'UA', name: 'Ukraine', dial: '+380' },
  { iso: 'CN', name: 'China', dial: '+86' },
  { iso: 'JP', name: 'Japan', dial: '+81' },
  { iso: 'KR', name: 'South Korea', dial: '+82' },
  { iso: 'SG', name: 'Singapore', dial: '+65' },
  { iso: 'MY', name: 'Malaysia', dial: '+60' },
  { iso: 'ID', name: 'Indonesia', dial: '+62' },
  { iso: 'TH', name: 'Thailand', dial: '+66' },
  { iso: 'VN', name: 'Vietnam', dial: '+84' },
  { iso: 'HK', name: 'Hong Kong', dial: '+852' },
  { iso: 'BR', name: 'Brazil', dial: '+55' },
  { iso: 'MX', name: 'Mexico', dial: '+52' },
  { iso: 'AR', name: 'Argentina', dial: '+54' },
];

export const DEFAULT_COUNTRY_ISO = 'QA';

/**
 * Qatar's mobile numbering plan: a local (post-+974) number is mobile only
 * when it leads with 3, 5, 6 or 7. Fixed-line/landline numbers lead with 4
 * (e.g. 44xxxxxx) and are the same 8-digit length, so length alone cannot
 * tell the two apart - confirmed against every seeded public/mock-data/
 * numbers.json MSISDN, which are all mobile inventory and all lead with one
 * of these four digits.
 *
 * Shared by isValidAltPhone (GuidedContactStep) and isValidMsisdn
 * (MsisdnPicker) so the two never drift onto different rules for what counts
 * as a Qatar mobile number.
 */
export const QATAR_MOBILE_LOCAL_PATTERN = /^[3567]\d{7}$/;

export function isQatarMobileLocalNumber(local: string): boolean {
  return QATAR_MOBILE_LOCAL_PATTERN.test(local);
}

/** Qatar fixed-line/landline numbers: 8 digits leading with 4. The complement of the mobile rule above. */
export const QATAR_LANDLINE_LOCAL_PATTERN = /^4\d{7}$/;

export function isQatarLandlineLocalNumber(local: string): boolean {
  return QATAR_LANDLINE_LOCAL_PATTERN.test(local);
}

export function countryByIso(iso: string): CountryDialCode {
  return COUNTRY_DIAL_CODES.find((c) => c.iso === iso) ?? COUNTRY_DIAL_CODES[0];
}

// Longest-prefix match, so +974 wins over +9 and +971 over +97. Returns
// undefined when nothing matches, which is how a stored value that predates
// this field (a bare local number) stays editable instead of being coerced.
export function countryFromNumber(stored: string): CountryDialCode | undefined {
  const digits = stored.trim();
  if (!digits.startsWith('+')) return undefined;
  return [...COUNTRY_DIAL_CODES].sort((a, b) => b.dial.length - a.dial.length).find((c) => digits.startsWith(c.dial));
}
