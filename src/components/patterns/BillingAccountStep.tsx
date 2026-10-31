import { SupportingDocumentField } from '../domain/SupportingDocumentField';
import type { AdditionalDocument } from '../domain/AdditionalDocumentsUpload';
import { isBusinessSegment } from '../../engines/businessSegment';
import { CARD_SELECTED, SelectedTick, CARD_IDLE } from '../primitives/offerCardParts';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Input } from '../primitives/Input';
import { Select } from '../primitives/Select';
import { BILL_LANGUAGES, BILL_TYPES, DEFAULT_BILL_LANGUAGE, DEFAULT_BILL_TYPE, computeBillCycleDay, isValidVatExpiry, ordinal } from './billingAccountModel';
import { toLocalMsisdn } from '../domain/msisdnPickerModel';
import type { AccountRecord, BillingProfileRecord, ContactRecord, CustomerRecord, NewBillingAccountValue, BillingAccountValue } from './billingAccountModel';


const CHEVRON_DOWN = 'M6 9l6 6 6-6';
const PERSON_ICON = 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z';
const CHEVRON_UP = 'M18 15l-6-6-6 6';
// Form sections inside the Create New form: a bold heading, space below it, and space - no divider line - between sections.
const SECTION = 'space-y-3';
const SECTION_RULE = 'mt-8';
const SECTION_TITLE = 'text-fg font-semibold text-[length:var(--fs-body-lg)]';

interface BillingAccountStepProps {
  customerId: string | undefined;
  /** The Communication Address step's own address, offered as "use the same
   * address" default rather than asking the agent to retype it. */
  defaultAddressLine: string | undefined;
  value: BillingAccountValue;
  onChange: (value: BillingAccountValue) => void;
  /**
   * The customer's email as captured on Customer Verification (masked for a new customer).
   * It is the single source of truth for the journey: when given, it is shown in place of the
   * address stored on each billing profile, never a second lookup.
   */
  customerEmail?: string;
  /** The identified customer's name: the primary contact to offer when no contact records are on file (a new customer). */
  customerName?: string;
  /** The customer's primary contact mobile number as captured on Customer Verification: the Billing Mobile Number, read-only. */
  customerMobile?: string;
  /** The credit-limit rows (CreditLimitCard, embedded) listed straight after the billing details, for a new account. */
  creditLimit?: ReactNode;
  /** The VAT supporting document, attached when a VAT registration number is entered (the journey keeps it with its additional documents and gates Continue on it). */
  vatDocument?: AdditionalDocument;
  vatDocumentRequirement?: { id: string; label: string };
  onVatDocumentChange?: (document: AdditionalDocument | undefined) => void;
}

// "Billing Profile" (2026-09-28 request) - Step 3 of New Postpaid Activation,
// immediately after Communication Address. Two mutually exclusive paths: pick
// one of the customer's existing billing accounts (business-rules.json's
// "Consumer Billing Profile Cap" - at most two for a Consumer, unlimited for
// Enterprise - gates whether "Create New" is offered at all), or create one.
// What this step loaded for a customer, kept for the session: coming back to the step (Edit in the summary, or Back) shows
// it at once instead of waiting through the data loads again. It is still refreshed in the background every time.
interface BillingData {
  profiles: (BillingProfileRecord & { accountType: string })[];
  contacts: ContactRecord[];
  segment: string | undefined;
}
// The primary-contact value for the identified customer when there are no contact records to pick from.
const NEW_CUSTOMER_CONTACT = 'CUSTOMER';
const billingDataCache = new Map<string, BillingData>();

export function BillingAccountStep({
  customerId,
  defaultAddressLine,
  value,
  onChange,
  customerEmail,
  customerName,
  customerMobile,
  creditLimit,
  vatDocument,
  vatDocumentRequirement,
  onVatDocumentChange,
}: BillingAccountStepProps) {
  const cached = customerId ? billingDataCache.get(customerId) : undefined;
  const [profiles, setProfiles] = useState<(BillingProfileRecord & { accountType: string })[]>(cached?.profiles ?? []);
  const [contacts, setContacts] = useState<ContactRecord[]>(cached?.contacts ?? []);
  const [customerSegment, setCustomerSegment] = useState<string | undefined>(cached?.segment);
  const [loaded, setLoaded] = useState(Boolean(cached));
  useEffect(() => {
    if (!customerId) return;
    (async () => {
      const [accounts, allProfiles, allContacts, allCustomers] = await Promise.all([
        mockDataEngine.list<AccountRecord>('accounts'),
        mockDataEngine.list<BillingProfileRecord>('billing-profiles'),
        mockDataEngine.list<ContactRecord>('customer-contacts'),
        mockDataEngine.list<CustomerRecord>('customers'),
      ]);
      const ownAccounts = accounts.filter((a) => a.customerId === customerId);
      const ownProfiles = ownAccounts
        .map((a) => {
          const p = allProfiles.find((pr) => pr.billingProfileId === a.billingProfileId);
          return p ? { ...p, accountType: a.accountType } : undefined;
        })
        .filter((p): p is BillingProfileRecord & { accountType: string } => Boolean(p));
      const data: BillingData = {
        profiles: ownProfiles,
        contacts: allContacts.filter((c) => c.customerId === customerId),
        segment: allCustomers.find((c) => c.customerId === customerId)?.segment,
      };
      billingDataCache.set(customerId, data);
      setProfiles(data.profiles);
      setContacts(data.contacts);
      setCustomerSegment(data.segment);
      setLoaded(true);
    })();
  }, [customerId]);

  const newAccount = value.newAccount ?? {};
  const setNewAccount = (patch: Partial<NewBillingAccountValue>) =>
    onChange({ ...value, newAccount: { ...newAccount, ...patch } });

  const asOf = new Date();
  // The bill cycle follows from the activation date (computeBillCycleDay) and is not the agent's to change; an account being edited keeps the cycle it has.
  const defaultBillCycleDay = computeBillCycleDay(customerSegment, asOf);
  const billCycleDay = newAccount.billCycleDay ?? defaultBillCycleDay;

  // "A consumer can have at most two billing profiles (one postpaid, one
  // prepaid); enterprises can have more" (business-rules.json) - this
  // journey only ever creates a postpaid profile, so a Consumer who already
  // holds two of ANY type has nowhere left for a new one to go.
  const atConsumerCap = !isBusinessSegment(customerSegment) && profiles.length >= 2;

  const editing = Boolean(value.editingProfileId);
  const editedProfile = profiles.find((p) => p.billingProfileId === value.editingProfileId);

  // Edit: opens the form with the account on file pre-filled - its contact, address, cycle, mode and name - for the agent to change.
  const startEdit = (p: BillingProfileRecord) => {
    const match = contacts.find((c) => [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ') === p.billingContactName);
    const day = /Day (\d+)/.exec(p.billingCycle ?? '')?.[1];
    const contactId = match?.contactRecordId ?? (contacts.length === 0 && customerName ? NEW_CUSTOMER_CONTACT : contacts[0]?.contactRecordId);
    onChange({
      selectedProfileId: p.billingProfileId,
      creatingNew: false,
      editingProfileId: p.billingProfileId,
      newAccount: {
        primaryContactId: contactId,
        primaryContactName: p.billingContactName,
        preferredInvoiceRecipient: 'Primary Contact',
        editAddressLine: p.billingAddress ?? '',
        billCycleDay: day ? Number(day) : undefined,
        billingMode: (p as { billingType?: string }).billingType,
        profileName: p.name,
        billMedia: p.billMedium,
      },
    });
  };

  // The account's contacts, as cards. A customer with contact records picks from them; a new customer has none yet, so the person identified in
  // this journey is the contact (otherwise the step could not be completed).
  const nameOf = (c: ContactRecord) => [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ');
  const isCustomersOwn = (c: ContactRecord) => Boolean(customerName) && nameOf(c).trim().toLowerCase() === customerName?.trim().toLowerCase();
  const contactOptions: { id: string; name: string; record?: ContactRecord }[] =
    contacts.length > 0 || !customerName
      ? contacts.map((c) => ({ id: c.contactRecordId, name: nameOf(c), record: c }))
      : [{ id: NEW_CUSTOMER_CONTACT, name: customerName }];
  const selectPrimary = (o: (typeof contactOptions)[number]) => {
    // Another contact's details come from their own record; the customer's own come from Customer Verification (undefined: not overridden).
    const other = o.record && !isCustomersOwn(o.record) ? o.record : undefined;
    setNewAccount({
      primaryContactId: o.id,
      primaryContactName: o.name,
      primaryContactPhone: other ? (other.cellNumber ?? '') : undefined,
      primaryContactEmail: other ? (other.employerEmail ?? '') : undefined,
      // The contact now primary cannot also be the secondary.
      ...(newAccount.secondaryContactId === o.id ? { secondaryContactId: undefined, hasSecondaryContact: false, secondaryContactName: undefined, secondaryContactPhone: undefined, secondaryContactEmail: undefined } : {}),
    });
  };
  const selectSecondary = (o: (typeof contactOptions)[number] | undefined) =>
    setNewAccount({
      secondaryContactId: o?.id,
      hasSecondaryContact: Boolean(o),
      secondaryContactName: o?.name,
      secondaryContactPhone: o?.record?.cellNumber ?? undefined,
      secondaryContactEmail: o?.record?.employerEmail ?? undefined,
    });
  // One contact: it is the primary contact without the agent choosing. Several: the customer's own record leads, else the first.
  const defaultPrimary = contactOptions.find((o) => o.record && isCustomersOwn(o.record)) ?? contactOptions[0];
  const needsDefaultPrimary = Boolean(value.creatingNew) && !editing && !newAccount.primaryContactId && Boolean(defaultPrimary);
  useEffect(() => {
    if (needsDefaultPrimary && defaultPrimary) selectPrimary(defaultPrimary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsDefaultPrimary, defaultPrimary?.id]);

  // No customer yet (a new customer, or a journey that has not resolved one): there are no accounts to load, so the step
  // opens on its create form instead of waiting forever.
  if (customerId && !loaded) {
    return <p className="text-muted text-[length:var(--fs-body)]">Loading billing accounts…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Nothing to choose from when the customer has no account: the new-account form below is all there is. */}
      {profiles.length > 0 && (
      <div>
        {profiles.length > 0 && <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)] mb-1">Existing Billing Accounts</h3>}
        {/* The customer's accounts and "Create New Billing Account" sit in one row; the new-account form opens below it. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profiles.map((p, i) => {
            const selected = value.selectedProfileId === p.billingProfileId;
            return (
              <div key={p.billingProfileId} className={`relative rounded-[var(--radius-card)] border p-4 ${selected ? CARD_SELECTED : CARD_IDLE}`}>
                {selected && <SelectedTick />}
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ selectedProfileId: p.billingProfileId, creatingNew: false })}
                  className="block w-full text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-fg font-medium">Account ending …{p.billingProfileId.slice(-4)}</span>
                    {i === 0 && <Badge variant="filled-neutral">Default</Badge>}
                  </div>
                  <p className="text-fg-2 text-[length:var(--fs-caption)]">Primary contact: {p.billingContactName}</p>
                  <p className="text-muted text-[length:var(--fs-caption)]">
                    {(selected && value.editingProfileId === p.billingProfileId ? value.newAccount?.editAddressLine : undefined) ?? (p.billingAddress || 'No billing address on file')} · {customerEmail ?? p.billingContactEmail}
                  </p>
                </button>
                {/* Edit opens the form below with this account's details pre-filled. */}
                <Button
                  variant="tertiary"
                  compact
                  className="mt-2"
                  aria-expanded={value.editingProfileId === p.billingProfileId}
                  aria-label={`Edit the billing account ending ${p.billingProfileId.slice(-4)}`}
                  onClick={() => startEdit(p)}
                >
                  Edit
                </Button>
              </div>
            );
          })}
          {/* "A consumer can have at most two billing profiles" - once a Consumer already holds two, there is nowhere for a new one to go,
              so the option to create one is withheld rather than offered and then rejected at submission. */}
          {!atConsumerCap && profiles.length > 0 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  creatingNew: !value.creatingNew,
                  selectedProfileId: undefined,
                  editingProfileId: undefined,
                  // Opening the form fixes the primary-payment default: ticked only when the customer has no other profile.
                  newAccount: {
                    ...value.newAccount,
                    primaryPaymentProfile: value.newAccount?.primaryPaymentProfile ?? profiles.length === 0,
                    // The profile is set up for the agent: its name, bill medium and schedule, and the cycle the activation date gives.
                    profileName: value.newAccount?.profileName ?? `${customerName ?? 'Customer'} - Postpaid`,
                    preferredInvoiceRecipient: value.newAccount?.preferredInvoiceRecipient ?? 'Primary Contact',
                    billMedia: value.newAccount?.billMedia ?? 'Email',
                    billingSchedule: value.newAccount?.billingSchedule ?? 'Immediate',
                    billCycleDay: value.newAccount?.billCycleDay ?? defaultBillCycleDay,
                  },
                })
              }
              aria-expanded={Boolean(value.creatingNew)}
              className={`flex items-center gap-3 rounded-[var(--radius-card)] border p-4 text-left ${value.creatingNew ? CARD_SELECTED : CARD_IDLE}`}
            >
              <Icon path={value.creatingNew ? CHEVRON_UP : CHEVRON_DOWN} className="w-5 h-5 shrink-0 text-muted" />
              <span className="flex-1">
                <span className="block text-fg font-semibold text-[length:var(--fs-h5)]">Create New Billing Account</span>
                <span className="block text-fg-2 text-[length:var(--fs-body)]">
                  Provide the following details to set up your billing account.
                </span>
              </span>
            </button>
          )}
        </div>
        {atConsumerCap && (
          <p className="text-muted text-[length:var(--fs-caption)] mt-3">
            This customer already holds the maximum of two billing profiles for a Consumer account - select one above.
          </p>
        )}
      </div>
      )}

      {((value.creatingNew && !atConsumerCap) || editing) && (
        <div>
          <div className="pb-6">
              {editing && <p className="pt-6 text-fg font-semibold text-[length:var(--fs-body-lg)]">Edit billing account ending …{editedProfile?.billingProfileId.slice(-4)}</p>}
              {/* Contact */}
              {/* The Primary Contact is not asked for here: the account takes the customer's own contact (the default, see needsDefaultPrimary); it is
                  changed from Customer 360 afterwards. */}
              {!editing && contactOptions.length > 1 && (
              <div className={`${SECTION} pt-6`}>
                {/* With more than one contact on the account, a secondary contact can be picked from the others: nothing is typed, their details come from their record. */}
                {!editing && contactOptions.length > 1 && (
                  <div className="space-y-3 pt-3">
                    <h4 className={SECTION_TITLE}>Secondary Contact</h4>
                    <div role="radiogroup" aria-label="Secondary Contact">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {contactOptions
                          .filter((o) => o.id !== newAccount.primaryContactId)
                          .map((o) => (
                            <ContactCard
                              key={o.id}
                              name={o.name}
                              checked={newAccount.secondaryContactId === o.id}
                              // Choosing the chosen one again clears it: a secondary contact is optional.
                              onChoose={() => selectSecondary(newAccount.secondaryContactId === o.id ? undefined : o)}
                            />
                          ))}
                      </div>
                    </div>
                    {newAccount.secondaryContactId && (
                      <dl className="text-[length:var(--fs-body)]">
                        {[
                          { label: 'Mobile Number', value: newAccount.secondaryContactPhone ? toLocalMsisdn(newAccount.secondaryContactPhone) : '-' },
                          { label: 'Email', value: newAccount.secondaryContactEmail || '-' },
                        ].map((row) => (
                          <div key={row.label} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border-soft">
                            <dt className="text-fg-2">{row.label}</dt>
                            <dd className="text-fg font-medium text-right break-words min-w-0">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                )}
              </div>
              )}

              {/* Account Credit Limit: Account Type, Customer Segment, Customer Category and the limit (CreditLimitCard, embedded), for a new account. */}
              {!editing && creditLimit && (
                <div className={`${SECTION} ${SECTION_RULE}`}>
                  <h4 className={SECTION_TITLE}>Account Credit Limit</h4>
                  <dl className="text-[length:var(--fs-body)]">{creditLimit}</dl>
                </div>
              )}

              {/* Billing Details: filled from the customer's Primary Contact Information and not editable - the bill goes to the customer's own address,
                  email and mobile number. (Editing an existing account still changes its address line.) */}
              <div className={`${SECTION} ${SECTION_RULE}`}>
                <h4 className={SECTION_TITLE}>{editing ? 'Billing Address' : 'Billing Details'}</h4>
                {editing ? (
                  <Input
                    label="Billing Address"
                    value={newAccount.editAddressLine ?? ''}
                    placeholder="Enter the billing address"
                    onChange={(e) => setNewAccount({ editAddressLine: e.target.value })}
                  />
                ) : (
                  // The same rows as the Credit Limit block below (CreditLimitCard): label on the left, value on the right.
                  <dl className="text-[length:var(--fs-body)]">
                    {[
                      { label: 'Billing Address', value: defaultAddressLine || 'No communication address on file yet.' },
                      { label: 'Billing Email', value: (newAccount.primaryContactEmail !== undefined ? newAccount.primaryContactEmail : customerEmail) || '-' },
                      { label: 'Billing Mobile Number', value: (newAccount.primaryContactPhone !== undefined ? (newAccount.primaryContactPhone ? toLocalMsisdn(newAccount.primaryContactPhone) : '') : customerMobile) || '-' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border-soft">
                        <dt className="text-fg-2">{row.label}</dt>
                        <dd className="text-fg font-medium text-right break-words min-w-0">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {/* Bill cycle: the same field as Bill Type and Bill Language, but disabled - it follows from the activation date and is not the agent's to change. */}
                <div className="grid sm:grid-cols-2 gap-3 pt-3">
                  <Select
                    label="Bill Cycle"
                    disabled
                    value={String(billCycleDay)}
                    options={[{ value: String(billCycleDay), label: `${ordinal(billCycleDay)} of every month` }]}
                  />
                  {!editing && (
                    <>
                      <Select
                        label="Bill Type"
                        value={newAccount.billType ?? DEFAULT_BILL_TYPE}
                        onChange={(e) => setNewAccount({ billType: e.target.value })}
                        options={BILL_TYPES}
                      />
                      <Select
                        label="Bill Language"
                        value={newAccount.billLanguage ?? DEFAULT_BILL_LANGUAGE}
                        onChange={(e) => setNewAccount({ billLanguage: e.target.value })}
                        options={BILL_LANGUAGES}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* VAT Details, optional. A registration number makes the VAT document mandatory in Additional Documents (document-types.json: vat-document). */}
              {!editing && (
                <div className={`${SECTION} ${SECTION_RULE}`}>
                  <h4 className={SECTION_TITLE}>VAT Details</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      label="VAT Registration Number"
                      value={newAccount.vatRegistrationNumber ?? ''}
                      onChange={(e) => setNewAccount({ vatRegistrationNumber: e.target.value })}
                      helperText={newAccount.vatRegistrationNumber?.trim() ? 'VAT document upload is required.' : undefined}
                    />
                    <Input
                      label="VAT Expiry Date"
                      placeholder="DD/MM/YYYY"
                      inputMode="numeric"
                      maxLength={10}
                      value={newAccount.vatExpiryDate ?? ''}
                      onChange={(e) => setNewAccount({ vatExpiryDate: e.target.value })}
                      error={isValidVatExpiry(newAccount.vatExpiryDate) ? undefined : 'Enter the date as DD/MM/YYYY.'}
                    />
                  </div>
                  {onVatDocumentChange && newAccount.vatRegistrationNumber?.trim() && (
                    <SupportingDocumentField label="VAT Document" requirement={vatDocumentRequirement} document={vatDocument} onChange={onVatDocumentChange} />
                  )}
                </div>
              )}

            </div>
        </div>
      )}
    </div>
  );
}

/** One contact as a selectable card, in the style of the customer-type cards. */
function ContactCard({ name, checked, onChoose }: { name: string; checked: boolean; onChoose: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChoose}
      className={`relative flex items-center gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${checked ? CARD_SELECTED : CARD_IDLE}`}
    >
      {checked && <SelectedTick />}
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] transition-colors ${checked ? 'bg-accent text-accent-on' : 'bg-surface-warm text-accent'}`}>
        <Icon path={PERSON_ICON} className="w-5 h-5" />
      </span>
      <span className="min-w-0 flex-1 text-fg font-medium text-[length:var(--fs-body)]">{name}</span>
    </button>
  );
}
