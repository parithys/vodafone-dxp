import { getPersonaByStaffId } from '../engines/configEngine';


// Staff ID -> role resolution for automatic role detection at login.
//
// 2026-09-24: the hardcoded 7-entry table that used to live here is gone. Each
// of the 26 operational roles now carries its own `staffId` in
// config/personas.json, so this resolves against that single source instead of
// a duplicate map that had to be edited in lockstep. Safe to read config here:
// App.tsx gates <LoginPage> behind the `ready` flag, so loadConfig() has
// always resolved by the time a sign-in can be attempted.
//
// The old table also carried Channel and Context-card columns describing how
// each role reaches a ticket/queue (Retail: Queue Number + Ticket Number;
// Back-office/Telephonic: CTI Reference only; Field/System: no customer-facing
// context card). Those were comment-only with no consumer; they are now
// `channel` and `contextCard` fields on the persona and actually drive the
// header context chip via agentPrivilegeEngine.
//
// Archived: reference/blueprint/legacy/staff-id-role-map-v1.ts.txt. Note that
// VFQ12342–VFQ12347 CHANGED MEANING in this cut-over - e.g. VFQ12343 was
// "Back Office / Fulfilment" and is now "Direct Sales" - so any older
// demo script or screenshot referring to them is stale.
export interface StaffIdRoleEntry {
  personaId: string;
  roleLabel: string;
}

/** Normalizes "VFQ-12341", "vfq 12341", "VFQ12341" to the same lookup key. */
export function resolveRoleFromStaffId(staffId: string): StaffIdRoleEntry | undefined {
  const normalized = staffId.replace(/[\s-]/g, '').toUpperCase();
  const persona = getPersonaByStaffId(normalized);
  if (!persona) return undefined;
  return { personaId: persona.id, roleLabel: persona.name };
}

// Placeholder demo credential - the Agent 360 BRSD leaves the real password
// policy and IDAM credential source as open items (D-02, OI-AGN-04); this
// exists only so the Login Failed state (Annex_02) is reachable in this mock
// environment. One shared password across all 26 roles is deliberate for
// demo/testing. Swap for real IDAM validation once VFQ Security confirms the
// policy - do not treat this as a real credential scheme.
export const DEMO_LOGIN_PASSWORD = 'Vodafone@123';
