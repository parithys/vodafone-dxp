import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/primitives/EmptyState';
import { useCustomerCreditBreakdown } from './useCreditLimitBreakdown';
import { RestrictedCustomerNotice } from '../../components/patterns/RestrictedCustomerNotice';
import { canViewCustomerSegment } from '../../engines/agentPrivilegeEngine';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { useEntityStore } from '../../stores/entityStore';
import { usePersonaStore } from '../../stores/personaStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { canEditCustomerRecords } from '../../engines/agentPrivilegeEngine';
import { useVerificationGate } from '../../components/patterns/VerificationGate';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Drawer } from '../../capabilities';
import { Input } from '../../components/primitives/Input';
import { Select } from '../../components/primitives/Select';
import { Icon } from '../../components/primitives/Icon';
import { Tooltip } from '../../components/primitives/Tooltip';
import { PageHeader } from '../../components/patterns/PageHeader';
import { useSubmitGuard } from '../../hooks/useSubmit';
import { EntityMissing } from '../../components/patterns/EntityMissing';
import { formatAmountAny } from '../../lib/format';

const BACK_ICON = 'M15 18l-6-6 6-6';

interface BillingProfile {
  billingProfileId: string;
  accountId: string;
  name: string;
  billingCycle: string;
  billingType: string;
  billingAddress: string;
  billMedium: string;
  autoPayStatus: string;
  paymentMethod: string;
  billingLanguage: string;
  collectionStatus: string;
  creditLimitQAR: number;
  billingContactName?: string;
  billingContactPhone?: string;
  billingContactEmail?: string;
}

// BR-02: mirrors the disabled+Tooltip pattern already established in
// Customer360Layout.tsx's "Edit profile" button and InvoiceActions.tsx's
// "Restricted" state - a non-agent persona must never be able to open an
// edit drawer, not even a read-only one, since this page has no read-only
// drawer variant (the cards already show the data as read-only).
function EditButton({ canEdit, onClick }: { canEdit: boolean; onClick: () => void }) {
  if (!canEdit) {
    return (
      <Tooltip content="Not authorised to edit billing records" placement="top">
        <Button variant="secondary" compact className="opacity-40 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
          Edit
        </Button>
      </Tooltip>
    );
  }
  return (
    <Button variant="secondary" compact onClick={onClick}>
      Edit
    </Button>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[length:var(--fs-caption)] text-muted">{label}</div>
      <div className="text-fg text-[length:var(--fs-body)]">{value ?? '-'}</div>
    </div>
  );
}

// CUS-001-BAM-01: a genuine navigation target distinct from the Customer 360
// Billing tab, reachable from the Account Hierarchy view's Billing Account
// node. CUS-001-BAM-02/03: view billing profile + billing contact.
// CUS-001-BAM-04/05/06/07: edit billing contact/address/language/payment
// mode, gated behind BR-01 verification and BR-02 role check.
export function BillingAccountPage() {
  const { billingProfileId } = useParams<{ billingProfileId: string }>();
  const navigate = useNavigate();
  const updateRecord = useEntityStore((s) => s.updateRecord);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const { guard } = useSubmitGuard();
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const canEdit = canEditCustomerRecords(activePersonaId);

  const [profile, setProfile] = useState<BillingProfile | null | undefined>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('this customer');
  // The account belongs to a protected-segment customer this role may not see: nothing of the account is kept or drawn, only the restriction.
  const [blocked, setBlocked] = useState(false);
  const limits = useCustomerCreditBreakdown(customerId || undefined);
  const [editField, setEditField] = useState<'contact' | 'address' | 'language' | 'payment' | null>(null);

  const { requireVerification, gate } = useVerificationGate(customerId, customerName);

  useEffect(() => {
    if (!billingProfileId) return;
    setLoadFailed(false);
    setBlocked(false);
    setProfile(null);
    (async () => {
      const profiles = await mockDataEngine.list<BillingProfile>('billing-profiles');
      const found = profiles.find((p) => p.billingProfileId === billingProfileId);
      if (!found) {
        setProfile(undefined);
        return;
      }
      const accounts = await mockDataEngine.list<{ accountId: string; customerId: string }>('accounts');
      const account = accounts.find((a) => a.accountId === found.accountId);
      if (account) {
        const customers = await mockDataEngine.list<{ customerId: string; name: string; segment?: string }>('customers');
        const customer = customers.find((c) => c.customerId === account.customerId);
        // Authorisation BEFORE the account is kept: a protected customer's account never reaches the page.
        if (customer && !canViewCustomerSegment(activePersonaId, customer.segment)) {
          setBlocked(true);
          return;
        }
        setCustomerId(account.customerId);
        if (customer) setCustomerName(customer.name);
      }
      setProfile(found);
    })().catch((err) => {
      console.error('[BillingAccountPage] load failed:', err);
      setLoadFailed(true);
    });
  }, [billingProfileId, reloadKey, activePersonaId]);

  if (blocked) {
    return (
      <div className="p-8 max-w-2xl">
        <RestrictedCustomerNotice backTo="/customer-search" backLabel="Back to Customer Search" />
      </div>
    );
  }
  if (loadFailed) {
    return <EntityMissing what="billing account" loading={false} error onRetry={() => setReloadKey((k) => k + 1)} backTo="/customer-search" backLabel="Back to Customer Search" />;
  }
  if (profile === null) return <div className="p-8 text-fg-2" role="status">Loading billing account…</div>;
  if (profile === undefined) {
    return (
      <EmptyState title="Billing Account Not Found" message={<>No billing account found for “{billingProfileId}”.</>} />
    );
  }

  // BR-02: only reachable via EditButton, which itself only wires onClick to
  // this function when canEdit is true - non-agents never get a click
  // handler that could call openEdit at all.
  const openEdit = (field: typeof editField) => {
    requireVerification(() => setEditField(field));
  };

  // BR-05: billing-profile maintenance requires the customer/billing-account
  // context to already be confirmed - satisfied structurally here, since
  // this drawer only ever opens against the profile this page already
  // resolved and displayed (there's no path to editing an unselected
  // account). BR-04's ticket-on-change applies to demographic/contact/
  // address changes specifically, not billing-profile edits, so this saves
  // directly with a confirmation toast rather than a ticket.
  const save = (patch: Partial<BillingProfile>, kind: string) =>
    guard(async () => {
    await updateRecord('billing-profiles', 'billingProfileId', profile.billingProfileId, patch);
    pushToast('success', `${kind} updated for billing account ${profile.billingProfileId}.`);
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
    setEditField(null);
    });

  return (
    <div className="p-8 w-full">
      <PageHeader
        title={<>{profile.name}</>}
        badges={<Badge variant="filled-neutral">{profile.billingProfileId}</Badge>}
        description={<>
          {customerName} · {customerId} ·{' '}
          <Link to={`/customer/${customerId}`} className="text-link hover:underline">
            View Customer 360
          </Link>
        </>}
      />

      <button type="button"
        onClick={() => navigate(customerId ? `/customer/${customerId}` : -1 as unknown as string)}
        className="flex items-center gap-1.5 text-fg-2 hover:text-fg text-[length:var(--fs-caption)] mb-4"
      >
        <Icon path={BACK_ICON} className="w-3.5 h-3.5" />
        Back to Customer 360
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
              Billing Profile
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Billing Cycle" value={profile.billingCycle} />
            <Field label="Billing Type" value={profile.billingType} />
            <Field label="Bill Medium" value={profile.billMedium} />
            <Field label="Credit Limit" value={`${formatAmountAny(limits?.overall ?? profile.creditLimitQAR)} QAR`} />
            <Field label="Overall" value={limits?.overall !== undefined ? `${formatAmountAny(limits.overall)} QAR` : undefined} />
            <Field label="Default" value={limits ? `${formatAmountAny(limits.default)} QAR` : undefined} />
            <Field label="Credit Control Team" value={limits ? (limits.creditControl === null ? '-' : `${formatAmountAny(limits.creditControl)} QAR`) : undefined} />
            <Field label="Credit Limit Increased Due to Deposit" value={limits ? (limits.depositIncrease ? `${formatAmountAny(limits.depositIncrease)} QAR` : '-') : undefined} />
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
              Billing Contact
            </h3>
            <EditButton canEdit={canEdit} onClick={() => openEdit('contact')} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Name" value={profile.billingContactName} />
            <Field label="Phone" value={profile.billingContactPhone} />
            <Field label="Email" value={profile.billingContactEmail} />
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
              Billing Address
            </h3>
            <EditButton canEdit={canEdit} onClick={() => openEdit('address')} />
          </div>
          <Field label="Address" value={profile.billingAddress} />
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
              Billing Language
            </h3>
            <EditButton canEdit={canEdit} onClick={() => openEdit('language')} />
          </div>
          <Field label="Language" value={profile.billingLanguage} />
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg">
              Payment Mode
            </h3>
            <EditButton canEdit={canEdit} onClick={() => openEdit('payment')} />
          </div>
          <Field label="Payment Method" value={profile.paymentMethod} />
          <div className="mt-2">
            <Field label="AutoPay Status" value={profile.autoPayStatus} />
          </div>
        </section>
      </div>

      {gate}

      {editField === 'contact' && (
        <ContactEditDrawer profile={profile} onClose={() => setEditField(null)} onSave={(p) => save(p, 'Billing Contact')} />
      )}
      {editField === 'address' && (
        <AddressEditDrawer profile={profile} onClose={() => setEditField(null)} onSave={(p) => save(p, 'Billing Address')} />
      )}
      {editField === 'language' && (
        <LanguageEditDrawer profile={profile} onClose={() => setEditField(null)} onSave={(p) => save(p, 'Billing Language')} />
      )}
      {editField === 'payment' && (
        <PaymentEditDrawer profile={profile} onClose={() => setEditField(null)} onSave={(p) => save(p, 'Payment Mode')} />
      )}
    </div>
  );
}

function ContactEditDrawer({ profile, onClose, onSave }: { profile: BillingProfile; onClose: () => void; onSave: (patch: Partial<BillingProfile>) => void }) {
  const [name, setName] = useState(profile.billingContactName ?? '');
  const [phone, setPhone] = useState(profile.billingContactPhone ?? '');
  const [email, setEmail] = useState(profile.billingContactEmail ?? '');
  return (
    <Drawer
      open
      onClose={onClose}
      title="Edit Billing Contact"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave({ billingContactName: name, billingContactPhone: phone, billingContactEmail: email })}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
    </Drawer>
  );
}

function AddressEditDrawer({ profile, onClose, onSave }: { profile: BillingProfile; onClose: () => void; onSave: (patch: Partial<BillingProfile>) => void }) {
  const [address, setAddress] = useState(profile.billingAddress);
  return (
    <Drawer
      open
      onClose={onClose}
      title="Edit Billing Address"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!address.trim()} onClick={() => onSave({ billingAddress: address })}>
            Save Changes
          </Button>
        </>
      }
    >
      <Input label="Billing Address" value={address} onChange={(e) => setAddress(e.target.value)} />
    </Drawer>
  );
}

function LanguageEditDrawer({ profile, onClose, onSave }: { profile: BillingProfile; onClose: () => void; onSave: (patch: Partial<BillingProfile>) => void }) {
  const [language, setLanguage] = useState(profile.billingLanguage);
  return (
    <Drawer
      open
      onClose={onClose}
      title="Edit Billing Language"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave({ billingLanguage: language })}>Save Changes</Button>
        </>
      }
    >
      <Select
        label="Billing Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        options={[
          { value: 'English', label: 'English' },
          { value: 'Arabic', label: 'Arabic' },
        ]}
      />
    </Drawer>
  );
}

function PaymentEditDrawer({ profile, onClose, onSave }: { profile: BillingProfile; onClose: () => void; onSave: (patch: Partial<BillingProfile>) => void }) {
  const [paymentMethod, setPaymentMethod] = useState(profile.paymentMethod);
  return (
    <Drawer
      open
      onClose={onClose}
      title="Edit Payment Mode"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => onSave({ paymentMethod, autoPayStatus: paymentMethod === 'AutoPay' ? 'Enrolled' : 'Not Enrolled' })}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <Select
        label="Payment Method"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        options={[
          { value: 'Invoice', label: 'Invoice' },
          { value: 'AutoPay', label: 'AutoPay' },
        ]}
      />
    </Drawer>
  );
}
