// The under-18 exception journey (BRSD V0.3 "Age Verification" and "Age Verification Exception Scenario").
//
// An applicant under 18 is a hard stop. For the journeys and personas listed here the agent may instead choose to proceed with the Exception Journey:
// all details entered manually, the ID copies uploaded, the Court Order document mandatory, and the order sent to the CDM queue for approval after
// submission. The BRSD scopes it to the Retail persona and to a QID only; it sits in the Prepaid BRSD, so New Postpaid keeps its hard stop
// (VFQ, 2026-10-02) until VFQ says otherwise. Everything the rule depends on is in this one place.

export const UNDER_18_EXCEPTION = {
  /** The journeys that offer the exception. */
  journeys: ['prepaid'],
  /** The roles that may use it ("Retail"): ROLE-01, Retail Sales. */
  personaIds: ['ROLE-01'],
  /** The ID types it is allowed with ("Allowed only with a QID"). */
  idTypes: ['QID'],
  /** Who approves the order after submission ("CDM Queue"): the CDM role. */
  approverRole: 'CDM',
} as const;

/** Whether the agent may be offered the exception for this journey, role and ID type. */
export function under18ExceptionOffered(args: { journey: string; personaId: string | undefined; idType: string | undefined }): boolean {
  const c = UNDER_18_EXCEPTION;
  return (c.journeys as readonly string[]).includes(args.journey) && Boolean(args.personaId) && (c.personaIds as readonly string[]).includes(args.personaId!) && Boolean(args.idType) && (c.idTypes as readonly string[]).includes(args.idType!);
}
