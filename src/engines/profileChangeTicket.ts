import { currentAgentId } from '../stores/authStore';
import { useEntityStore } from '../stores/entityStore';
import { useNotificationStore } from '../stores/notificationStore';
import { buildNewTicketRecord } from '../data/reference/ticketReferenceData';

export type ProfileChangeKind = 'Demographic' | 'Contact' | 'Address' | 'Account';

const AREA_BY_KIND: Record<ProfileChangeKind, string> = {
  Demographic: 'Profile Update',
  Contact: 'Profile Update',
  Address: 'Profile Update',
  Account: 'Profile Update',
};

/** CUS-001-CAM-10/15/18, BR-04: fires exactly once per save call - callers
 * invoke this a single time per edit-drawer submit, so a demographic save
 * never also fires a contact/address ticket and vice versa (no shared
 * "on customer save" handler exists to over- or under-generate). Returns the
 * full created record (not just the ID) so callers can bubble it into
 * Customer360Layout's local ticket list - without this, the new ticket would
 * persist correctly but not actually be visible in the Tickets tab or the
 * header's Open Tickets count until the agent navigated away and back,
 * defeating BR-04's point of making it an immediately usable reference. */
export function useProfileChangeTicket() {
  const createRecord = useEntityStore((s) => s.createRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);

  return async (customerId: string, kind: ProfileChangeKind, changedFields: string[], createdBy = currentAgentId()) => {
    const ticketId = `TT-${Date.now().toString().slice(-6)}`;
    const record = buildNewTicketRecord({
      ticketId,
      customerId,
      issueType: 'Human Error Complaints',
      area: AREA_BY_KIND[kind],
      template: `${kind} details updated`,
      templateContent: `${kind} fields updated: ${changedFields.join(', ')}.`,
      queue: 'Back Office',
      priority: '3-Medium',
      slaTargetHours: 24,
      createdBy,
    });
    await createRecord('trouble-tickets', record);
    pushToast('success', `${kind} details saved - reference ticket ${ticketId} created for follow-up.`);
    return { ticketId, record };
  };
}
