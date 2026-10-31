import { useState } from 'react';
import { Drawer } from '../../capabilities';
import { Select } from '../../components/primitives/Select';
import { Button } from '../../components/primitives/Button';
import { useEntityStore } from '../../stores/entityStore';
import { useProfileChangeTicket } from '../../engines/profileChangeTicket';
import { useSubmit } from '../../hooks/useSubmit';
import { contactName } from './primaryContactModel';
import type { ContactLike } from './primaryContactModel';

/** Change the account's Primary Contact (Customer 360 > Account Information > Billing Contact). The caller has already verified the customer. */
export function PrimaryContactDrawer({
  open,
  onClose,
  customerId,
  billingProfileId,
  contacts,
  currentId,
  onSaved,
  onTicketCreated,
}: {
  open: boolean;
  onClose: () => void;
  customerId: string;
  billingProfileId: string | undefined;
  contacts: ContactLike[];
  currentId: string | undefined;
  onSaved: (contact: ContactLike) => void;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createChangeTicket = useProfileChangeTicket();
  const [chosen, setChosen] = useState(currentId ?? '');
  const next = contacts.find((c) => c.contactRecordId === chosen);
  const changed = Boolean(next) && chosen !== currentId;

  const { run: save, pending: saving } = useSubmit(async () => {
    if (!next || !changed) return;
    if (billingProfileId) await updateRecord('billing-profiles', 'billingProfileId', billingProfileId, { primaryContactId: next.contactRecordId, billingContactName: contactName(next) });
    const { record } = await createChangeTicket(customerId, 'Contact', ['Primary Contact']);
    onTicketCreated(record);
    onSaved(next);
    onClose();
  }, 'Could not change the Primary Contact. Please try again.');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Set the Primary Contact"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!changed || saving} onClick={save}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Primary Contact"
          value={chosen}
          onChange={(e) => setChosen(e.target.value)}
          options={contacts.map((c) => ({ value: c.contactRecordId, label: contactName(c) }))}
        />
        <p className="text-[length:var(--fs-caption)] text-muted">The first contact is the default. Saving creates a reference ticket for follow-up.</p>
      </div>
    </Drawer>
  );
}
