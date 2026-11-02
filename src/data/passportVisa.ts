// The visa details MOI returns for a Passport holder. Kept against the customer record and shown in Customer 360 only: nothing in a journey
// displays them. A Passport with no valid visa stops the journey (the eligibility check 'visa-validity').

export interface PassportVisa {
  visaNumber: string;
  visaType: string;
  /** ISO date. */
  expiryDate: string;
}

/** A visa is valid when it carries a number and an expiry date that is after the given day (expiry on or before today is not valid, as for an ID). */
export function isVisaValid(visa: Partial<PassportVisa> | undefined, asOf: Date): boolean {
  if (!visa?.visaNumber?.trim() || !visa.expiryDate) return false;
  const expiry = new Date(visa.expiryDate);
  if (Number.isNaN(expiry.getTime())) return false;
  const day = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return day(expiry) > day(asOf);
}

/** The visa to keep from what MOI returned: complete details only, else nothing (an incomplete answer is not stored as if it were a visa). */
export function visaFromMoi(raw: Partial<PassportVisa> | undefined): PassportVisa | undefined {
  const number = raw?.visaNumber?.trim();
  const type = raw?.visaType?.trim();
  const expiry = raw?.expiryDate?.trim();
  return number && type && expiry ? { visaNumber: number, visaType: type, expiryDate: expiry } : undefined;
}
