import { useState } from 'react';
import { DataTable } from '../../../components/primitives/DataTable';
import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import { Drawer } from '../../../capabilities';
import { Input } from '../../../components/primitives/Input';
import { Select } from '../../../components/primitives/Select';
import { ContactPhoneInput } from '../../../components/domain/ContactPhoneInput';
import { Tooltip } from '../../../components/primitives/Tooltip';
import { useEntityStore } from '../../../stores/entityStore';
import { usePersonaStore } from '../../../stores/personaStore';
import { canEditCustomerRecords } from '../../../engines/agentPrivilegeEngine';
import { useProfileChangeTicket } from '../../../engines/profileChangeTicket';
import { useVerificationGate } from '../../../components/patterns/VerificationGate';
import type { Customer360Data } from '../../../engines/customer360Engine';
import { useSubmit } from '../../../hooks/useSubmit';

interface ContactRecord {
  contactRecordId: string;
  customerId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  idType: string;
  idNumber: string;
  idExpirationDate?: string;
  nationality?: string;
  dob?: string;
  gender?: string;
  preferredLanguage?: string;
  cellNumber?: string;
  workPhone?: string;
  employerEmail?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Arabic', label: 'Arabic' },
];
const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Not Specified', label: 'Not Specified' },
];

// CUS-001-CAM-12/13: view all customer contacts + detail; CUS-001-CAM-14/15:
// edit + auto-ticket. BR-03: ID Type/ID Number render read-only in the edit
// drawer - any correction must go through the dedicated KYC identity-
// correction wizard (Passport-to-QID), not this screen.
export function ContactSection({
  data,
  onTicketCreated,
}: {
  data: Customer360Data;
  /** Bubbles the BR-04 ticket up to Customer360Layout so it's immediately
   * visible in the Tickets tab / Open Tickets count, not just persisted. */
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  // Seeded once from the data prop, then patched locally on save - data.contacts
  // is Customer360Layout's one-time fetch snapshot, not reactive to entityStore
  // mutations, so without this the table would show stale values until the
  // agent navigated away and back despite the edit having actually persisted.
  const [contacts, setContacts] = useState<ContactRecord[]>(() => data.contacts as unknown as ContactRecord[]);
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const canEdit = canEditCustomerRecords(activePersonaId);
  const { requireVerification, gate } = useVerificationGate(data.customer.customerId, data.customer.name);
  const [editing, setEditing] = useState<ContactRecord | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
          Customer Contacts
        </h3>
      </div>
      <DataTable
        rows={contacts}
        rowKey={(r) => r.contactRecordId}
        emptyMessage="No contacts on file for this customer."
        onRowClick={(r) => (canEdit ? requireVerification(() => setEditing(r)) : setEditing(r))}
        columns={[
          { key: 'firstName', header: 'First Name' },
          { key: 'middleName', header: 'Middle Name' },
          { key: 'lastName', header: 'Last Name' },
          { key: 'idType', header: 'ID Type' },
          { key: 'cellNumber', header: 'Cell Number' },
          { key: 'preferredLanguage', header: 'Preferred Language' },
        ]}
      />
      {gate}
      {editing && (
        <ContactEditDrawer
          contact={editing}
          customerId={data.customer.customerId}
          readOnly={!canEdit}
          onClose={() => setEditing(null)}
          onSaved={(patch) =>
            setContacts((prev) => prev.map((c) => (c.contactRecordId === editing.contactRecordId ? { ...c, ...patch } : c)))
          }
          onTicketCreated={onTicketCreated}
        />
      )}
    </div>
  );
}

function ContactEditDrawer({
  contact,
  customerId,
  readOnly,
  onClose,
  onSaved,
  onTicketCreated,
}: {
  contact: ContactRecord;
  customerId: string;
  readOnly: boolean;
  onClose: () => void;
  onSaved: (patch: Partial<ContactRecord>) => void;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createChangeTicket = useProfileChangeTicket();
  const [firstName, setFirstName] = useState(contact.firstName);
  const [middleName, setMiddleName] = useState(contact.middleName ?? '');
  const [lastName, setLastName] = useState(contact.lastName);
  const [nationality, setNationality] = useState(contact.nationality ?? '');
  const [dob, setDob] = useState(contact.dob ?? '');
  const [gender, setGender] = useState(contact.gender ?? 'Not Specified');
  const [preferredLanguage, setPreferredLanguage] = useState(contact.preferredLanguage ?? 'English');
  const [cellNumber, setCellNumber] = useState(contact.cellNumber ?? '');
  const [workPhone, setWorkPhone] = useState(contact.workPhone ?? '');
  const [employerEmail, setEmployerEmail] = useState(contact.employerEmail ?? '');

  const { run: save, pending: saving } = useSubmit(async () => {
    const patch = { firstName, middleName, lastName, nationality, dob, gender, preferredLanguage, cellNumber, workPhone, employerEmail };
    const changed = (Object.keys(patch) as (keyof typeof patch)[]).filter((k) => patch[k] !== (contact as unknown as Record<string, unknown>)[k]);
    await updateRecord('customer-contacts', 'contactRecordId', contact.contactRecordId, patch);
    if (changed.length > 0) {
      const { record } = await createChangeTicket(customerId, 'Contact', changed);
      onTicketCreated(record);
    }
    onSaved(patch);
    onClose();
  }, 'Could not save the contact details. Please try again.');

  return (
    <Drawer
      open
      onClose={onClose}
      title={readOnly ? 'Contact Details' : 'Edit Contact Details'}
      footer={
        !readOnly ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={saving} onClick={save}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} readOnly={readOnly} disabled={readOnly} />
          <Input label="Middle Name(s)" value={middleName} onChange={(e) => setMiddleName(e.target.value)} readOnly={readOnly} disabled={readOnly} />
          <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Tooltip content="ID Type cannot be changed here. Use the KYC identity-correction wizard." placement="top">
            <Input label="ID Type" value={contact.idType} disabled readOnly />
          </Tooltip>
          <Tooltip content="ID Number cannot be changed here. Use the KYC identity-correction wizard." placement="top">
            <Input label="ID Number" value={contact.idNumber} disabled readOnly />
          </Tooltip>
        </div>
        <Badge variant="filled-neutral">ID Type / ID Number are protected fields</Badge>
        <Input label="ID Expiration Date" type="date" value={contact.idExpirationDate ?? ''} disabled readOnly />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} readOnly={readOnly} disabled={readOnly} />
          <Input label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} options={GENDER_OPTIONS} disabled={readOnly} />
          <Select
            label="Preferred Language"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            options={LANGUAGE_OPTIONS}
            disabled={readOnly}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ContactPhoneInput
            label="Cell Number"
            value={cellNumber}
            onChange={setCellNumber}
            customerId={customerId}
            disabled={readOnly}
            helperText={readOnly ? undefined : "Pick from this customer's other numbers on file, or type a new one."}
          />
          <Input label="Work Phone" value={workPhone} onChange={(e) => setWorkPhone(e.target.value)} readOnly={readOnly} disabled={readOnly} />
        </div>
        <Input label="Employer Email" value={employerEmail} onChange={(e) => setEmployerEmail(e.target.value)} readOnly={readOnly} disabled={readOnly} />
      </div>
    </Drawer>
  );
}
