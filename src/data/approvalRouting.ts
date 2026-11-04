// Who an order is routed to for approval when the route depends on WHO SUBMITTED it. Add or change a persona's manager here only.

/** The job title of the approver a sales manager decision belongs to (the Manager/Approver persona's title in users-agents.json). */
export const SALES_MANAGER_ROLE = 'Sales Manager';

/**
 * The manager queue a submitting persona's orders go to when the order needs its manager (a Passport on New Postpaid): the sales personas and
 * their supervisor go to the Sales Manager. A persona not listed has no manager route, so its order keeps the routing it had before (Credit Control).
 * Keyed by persona id (personas.json).
 */
export const SUBMITTER_MANAGER_ROLE: Readonly<Record<string, string>> = {
  'ROLE-01': SALES_MANAGER_ROLE, // Retail Sales
  'ROLE-02': SALES_MANAGER_ROLE, // Telesales
  'ROLE-03': SALES_MANAGER_ROLE, // Direct Sales
  'ROLE-04': SALES_MANAGER_ROLE, // Field Sales
  'ROLE-05': SALES_MANAGER_ROLE, // Mass Market
  'ROLE-06': SALES_MANAGER_ROLE, // Account Manager
  'ROLE-07': SALES_MANAGER_ROLE, // Key Accounts Manager
  'ROLE-08': SALES_MANAGER_ROLE, // Channel Manager
  'ROLE-22': SALES_MANAGER_ROLE, // Supervisor
};

/** The approval queue (job title) of the submitting persona's manager, or undefined when the persona has none. */
export const managerRoleOfSubmitter = (personaId: string | undefined): string | undefined => (personaId ? SUBMITTER_MANAGER_ROLE[personaId] : undefined);

/**
 * Personas whose Mobile Postpaid orders ALL go to their manager when they need approval, whatever the reason that held them (a line cap, an ID type,
 * a discount's proof, an advance payment ...): the Retail Sales persona's postpaid orders are decided by the Manager/Approver (job title Sales Manager).
 * Keyed by persona id (personas.json); a persona not listed keeps the routing the reason gives it.
 */
export const ALL_POSTPAID_APPROVALS_TO_MANAGER: ReadonlySet<string> = new Set(['ROLE-01']);

/**
 * The queue a Mobile Postpaid order that needs approval is routed to because of WHO raised it (New Postpaid Activation, a postpaid Port-In, a postpaid plan
 * change, a prepaid-to-postpaid migration): the submitting persona's manager, for the personas above; undefined for any other, so the reason's own route stands.
 */
export const postpaidManagerRoute = (personaId: string | undefined): string | undefined =>
  personaId && ALL_POSTPAID_APPROVALS_TO_MANAGER.has(personaId) ? managerRoleOfSubmitter(personaId) : undefined;
