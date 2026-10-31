import { useState } from 'react';
import { Drawer } from '../../capabilities';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Button } from '../../components/primitives/Button';
import { useEntityStore } from '../../stores/entityStore';
import { useProfileChangeTicket } from '../../engines/profileChangeTicket';
import type { CustomerRecord } from '../../engines/customer360Engine';
import { useSubmit } from '../../hooks/useSubmit';

interface DemographicEditDrawerProps {
  open: boolean;
  onClose: () => void;
  customer: CustomerRecord & { age?: number; gender?: string };
  onSaved: (patch: Partial<CustomerRecord>) => void;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
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

// CUS-001-CAM-09/11, DF-DEMO-001-007: Customer Name/Age/Gender/Nationality/
// Preferred Language are agent-editable; KYC Status and Account Status are
// not (kept out of this form entirely, not just disabled - DF-DEMO-001-007
// marks them Editable=No). Callers are responsible for the BR-01
// verification gate and BR-02 role check before opening this drawer.
export function DemographicEditDrawer({ open, onClose, customer, onSaved, onTicketCreated }: DemographicEditDrawerProps) {
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const createChangeTicket = useProfileChangeTicket();
  const [name, setName] = useState(customer.name);
  const [age, setAge] = useState(String(customer.age ?? ''));
  const [gender, setGender] = useState(customer.gender ?? 'Not Specified');
  const [nationality, setNationality] = useState(customer.nationality);
  const [preferredLanguage, setPreferredLanguage] = useState(customer.preferredLanguage ?? 'English');

  const { run: save, pending: saving } = useSubmit(async () => {
    const changed: string[] = [];
    if (name !== customer.name) changed.push('Customer Name');
    if (Number(age) !== customer.age) changed.push('Age');
    if (gender !== customer.gender) changed.push('Gender');
    if (nationality !== customer.nationality) changed.push('Nationality');
    if (preferredLanguage !== customer.preferredLanguage) changed.push('Preferred Language');

    const patch: Partial<CustomerRecord> & { age?: number; gender?: string } = {
      name,
      age: Number(age) || undefined,
      gender,
      nationality,
      preferredLanguage,
    };
    await updateRecord('customers', 'customerId', customer.customerId, patch);
    if (changed.length > 0) {
      const { record } = await createChangeTicket(customer.customerId, 'Demographic', changed);
      onTicketCreated(record);
    }
    onSaved(patch);
    onClose();
  }, 'Could not save the customer details. Please try again.');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit Demographic Details"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={saving || !name.trim()} onClick={save}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Customer Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Age" type="number" min={0} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
        <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} options={GENDER_OPTIONS} />
        <Input label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
        <Select
          label="Preferred Language"
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value)}
          options={LANGUAGE_OPTIONS}
        />
        <div className="pt-2 border-t border-border-soft">
          <p className="text-[length:var(--fs-caption)] text-muted">
            KYC Status and Account Status are system-derived and not editable here.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
