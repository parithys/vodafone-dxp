import { getPersona } from './configEngine';
import type { PersonaCapability } from '../types/config';
import { restrictedSegmentOf } from '../data/customerSegments';

// Role-matrix gating for the Agent 360 / Customer 360 BRSD clauses
// (APM-01/05/08, BIN-01, BIN-04, BNT-04, BR-01/02/03, BR-067, ATV-03).
//
// None of those clauses ship with a confirmed privilege matrix - OI-AGN-06/11/13
// all leave "which role" open. Until 2026-09-24 each gate was therefore a
// hand-curated Set of PERSONA-0xx ids, grounded in the 66-persona catalogue's
// own name/type text and carrying a long justification for every inclusion and
// exclusion, because inferring a role from prose was the only option available.
//
// The 26 operational roles removed that constraint: each declares its own
// `capabilities`, so these predicates are lookups rather than inferences.
// Three consequences worth recording, since they were previously documented
// caveats and are now simply resolved:
//
//   1. "Non-agent persona" is no longer a meaningful *set*. Under the 66 it
//      covered customer-side contacts, an external operator, a system account
//      and a channel partner; under the 26 only the Authorized Officer is not
//      VFQ staff. It is expressed as the positive `agent-self-service`
//      capability instead of a negative exclusion list.
//   2. canEditCustomerRecords is NO LONGER an alias of isInternalAgentPersona.
//      It was one, which would now hand customer-record write access to
//      Dispatcher, Field Engineer, System Administrator and View Only - the
//      four roles the new model explicitly separates from customer servicing.
//   3. The retail-vs-back-office manager split the old comment apologised for
//      being unevidenced is now named outright: Supervisor and Manager/Approver
//      both carry `agent-oversight`.
//
// The Qnomy/CTI reference-number gates additionally derive from `contextCard`
// - the Channel / Context-card column that previously existed only as a
// comment table in staffIdRoleMap.ts with no consumer at all.

function has(personaId: string | undefined, capability: PersonaCapability): boolean {
  if (!personaId) return false;
  return getPersona(personaId)?.capabilities.includes(capability) ?? false;
}

/**
 * Whether the signed-in role may see a customer of this segment. Not protected -> yes. Protected (Safwa, Safwa+, Royal) -> only a role holding THAT
 * segment's grant. No role -> no. Call it on the loaded record BEFORE rendering anything about the customer.
 */
export function canViewCustomerSegment(personaId: string | undefined, segment: string | undefined): boolean {
  // One literal `has(...)` per segment (the role-matrix script reads the gating from these); RESTRICTED_SEGMENT_CAPABILITY is the same table.
  switch (restrictedSegmentOf(segment)) {
    case undefined:
      return true;
    case 'Safwa':
      return has(personaId, 'view-safwa-customers');
    case 'Safwa+':
      return has(personaId, 'view-safwa-plus-customers');
    case 'Royal':
      return has(personaId, 'view-royal-customers');
  }
}

/** APM-01/05/08, BR-01/BR-02: a genuine internal VFQ agent who may view and
 * edit their own Agent Profile (password, MFA). */
export function isInternalAgentPersona(personaId: string | undefined): boolean {
  return has(personaId, 'agent-self-service');
}

/** Customer 360 BR-02: "customer, contact, address and billing-profile changes
 * may be performed only by agents authorised under the VFQ-approved role and
 * approval matrix." */
export function canEditCustomerRecords(personaId: string | undefined): boolean {
  return has(personaId, 'edit-customer-records');
}

/** BIN-01, BNT-04, BR-03: "designated Backoffice or privileged staff" who may
 * configure bell notifications and bulk notes. */
export function isBackofficeOrPrivilegedPersona(personaId: string | undefined): boolean {
  return has(personaId, 'backoffice-config');
}

/** Qnomy Ticket Number: in-store queue context, plus oversight roles who need
 * visibility across their agents' tickets. */
export function canSeeQnomyTicketNumber(personaId: string | undefined): boolean {
  const persona = personaId ? getPersona(personaId) : undefined;
  if (!persona) return false;
  return persona.contextCard === 'Queue Number + Ticket Number' || has(personaId, 'agent-oversight');
}

/** CTI Reference Number - the customer's active interaction reference,
 * available throughout the servicing journey. Deliberately NOT a
 * post-completion tracking/order number, which is a separate concept that does
 * not belong in the header (see SessionReferenceNumbers.tsx). Telephonic and
 * back-office channels, plus oversight roles. */
export function canSeeCtiReferenceNumber(personaId: string | undefined): boolean {
  const persona = personaId ? getPersona(personaId) : undefined;
  if (!persona) return false;
  return persona.contextCard === 'CTI Reference only' || has(personaId, 'agent-oversight');
}

/** RBAC-132/144: sets the Resolution Code and closes a complaint. Owned by the
 * Complaints role plus Supervisor/Manager - raising a ticket and
 * resolving it stay separate, which is what the 66-persona model encoded by
 * withholding resolution from frontline agents (PERSONA-059 vs 001/066). */
export function canResolveTicket(personaId: string | undefined): boolean {
  return has(personaId, 'ticket-resolve');
}

/** Queue reassignment - Dispatcher ("work allocation and scheduling") plus
 * oversight roles. */
export function canReassignTicketQueue(personaId: string | undefined): boolean {
  return has(personaId, 'ticket-reassign-queue');
}

/** BR-067: the ticket audit trail is role-restricted. Withheld from the
 * Sales & Acquisition group and the customer-side Authorized Officer. */
export function canSeeTicketAuditTrail(personaId: string | undefined): boolean {
  return has(personaId, 'ticket-audit-trail');
}

/** ATV-03/BR-05: assigning a task to another team member. */
export function canAssignTasks(personaId: string | undefined): boolean {
  return has(personaId, 'task-assign');
}

/** Invoice-level actions on the billing account page. */
export function canUseInvoiceActions(personaId: string | undefined): boolean {
  return has(personaId, 'invoice-actions');
}

/** BIN-04: sees the customer-level bell notification banner. */
export function canViewBellNotifications(personaId: string | undefined): boolean {
  return has(personaId, 'view-bell-notifications');
}
