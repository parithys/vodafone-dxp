// Staff ID -> role mapping for automatic role detection at login (per user
// spec, not evidenced in the source corpus). Maps each fixed demo Staff ID to
// the closest-matching existing persona in config/personas.json so RBAC,
// greeting, and profile resolution downstream are unaffected — only how the
// role is *selected* changes (auto from Staff ID instead of a manual picker).
//
// 2026-09-11 update: replaced with the user-supplied Staff ID/Role/Channel/
// Context-card table. Channel and Context card describe how each role
// reaches a ticket/queue (Retail: Queue Number + Ticket Number; Back-office/
// Telephonic: CTI Reference only; Field/System: no customer-facing context
// card at all) — recorded here for traceability since no context-card UI
// exists yet to consume them; only Staff ID -> Role -> persona resolution is
// wired up today.
//   VFQ12341  Retail Agent                    Retail / in-store            Queue Number + Ticket Number
//   VFQ12342  Retail Store Manager / Approver  Retail / in-store            Queue Number + Ticket Number
//   VFQ12343  Back Office / Fulfilment         Back-office                  CTI Reference only
//   VFQ12344  Back Office Manager / Approver   Back-office                  CTI Reference only
//   VFQ12345  Enterprise Account Manager       Telephonic / back-office     CTI Reference only
//   VFQ12346  Field Technician                 Field (no queue, no CTI)     Hidden
//   VFQ12347  IT Operations                    System / no customer interaction  Hidden
//
// pickProfileForRole() (agentProfileEngine.ts) resolves the signed-in identity
// by keyword-matching the persona's name/type against the 3 seeded
// users-agents.json records — not by Staff ID. Every "Manager"/"Approver"
// persona below (.342/.344/.345) matches the same "manager" keyword and so
// all three resolve to the same seeded identity (Rachel Thompson, Sales
// Manager) — a real, accepted quirk of that matching logic (the same one
// already documented for the old VFQ12343/VFQ12344 pair), not a mistake here.
export interface StaffIdRoleEntry {
  personaId: string;
  roleLabel: string;
}

export const STAFF_ID_ROLE_MAP: Record<string, StaffIdRoleEntry> = {
  VFQ12341: { personaId: 'PERSONA-001', roleLabel: 'Retail Agent' },
  VFQ12342: { personaId: 'PERSONA-019', roleLabel: 'Retail Store Manager / Approver' },
  VFQ12343: { personaId: 'PERSONA-005', roleLabel: 'Back Office / Fulfilment' },
  VFQ12344: { personaId: 'PERSONA-041', roleLabel: 'Back Office Manager / Approver' },
  VFQ12345: { personaId: 'PERSONA-002', roleLabel: 'Enterprise Account Manager' },
  VFQ12346: { personaId: 'PERSONA-025', roleLabel: 'Field Technician' },
  VFQ12347: { personaId: 'PERSONA-008', roleLabel: 'IT Operations' },
};

/** Normalizes "VFQ-12341", "vfq 12341", "VFQ12341" to the same lookup key. */
export function resolveRoleFromStaffId(staffId: string): StaffIdRoleEntry | undefined {
  const normalized = staffId.replace(/[\s-]/g, '').toUpperCase();
  return STAFF_ID_ROLE_MAP[normalized];
}

// Placeholder demo credential — the Agent 360 BRSD leaves the real password
// policy and IDAM credential source as open items (D-02, OI-AGN-04); this
// exists only so the Login Failed state (Annex_02) is reachable in this
// mock environment. Swap for real IDAM validation once VFQ Security
// confirms the policy — do not treat this as a real credential scheme.
export const DEMO_LOGIN_PASSWORD = 'Vodafone@123';
