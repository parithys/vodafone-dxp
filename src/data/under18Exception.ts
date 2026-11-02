// The under-18 exception journey (BRSD V0.3 "Age Verification" and "Age Verification Exception Scenario", widened 2026-11-01).
//
// An applicant under 18 is a hard stop that no agent can bypass. The agent's only ways on are Abandon Order, or Apply for Exception: an Exception
// Request with the Court Type Order uploaded, after which the journey continues and the ORDER is held for the agent's manager to approve (the age
// rule is not lifted - the order cannot complete until it is approved). Offered in every journey, for every ID type and every persona: the age check
// reads the date of birth from whatever identification was captured or retrieved. Everything the rule depends on is in this one place.

import { managerRoleOfSubmitter } from './approvalRouting';

export const UNDER_18_EXCEPTION = {
  /** Who approves when the submitting persona has no manager route (data/approvalRouting.ts): the CDM queue, as before. */
  fallbackApproverRole: 'CDM',
} as const;

/** The exception is offered whenever an applicant is under 18, whatever the journey, role or ID type. */
export function under18ExceptionOffered(_args?: { journey?: string; personaId?: string | undefined; idType?: string | undefined }): boolean {
  return true;
}

/** The queue an under-18 exception order goes to: the submitting agent's manager, else the fallback. */
export const under18ApproverRole = (personaId: string | undefined): string => managerRoleOfSubmitter(personaId) ?? UNDER_18_EXCEPTION.fallbackApproverRole;
