import { Button } from '../../../components/primitives/Button';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService } from '../../../engines/customerServicesEngine';
import { ActionButton, DetailRows, IC, IconTile, LinkAction, Panel, Pill, PrimaryTag, TabPage, fmtDate } from './C360Kit';
import type { Tone } from './C360Kit';
import { contactInformationResolvers } from './contactInformationResolvers';
import { Dv } from '../demoValues';
import { str } from '../../../lib/values';

type Rec = Record<string, unknown>;
const dash = (v: ReactNode | undefined | null): ReactNode => (v === undefined || v === null || v === '' ? <span className="text-muted">-</span> : v);

/** Card title: tinted icon + title, with an optional count and a trailing badge. */
function CardTitle({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 min-w-0">
      <Icon path={icon} className="w-5 h-5 shrink-0 text-[var(--signal-blue)]" />
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '-'
  );
}

interface HierarchyContact {
  key: string;
  name: string;
  role: string;
  primary: boolean;
  mobile?: string;
  email?: string;
}

/**
 * The Customer 360 "Contact & Identity" tab: identity, contact details, role and relationship, the contact
 * hierarchy, addresses and additional information, all bound to the customer's own records. A value with no
 * source on file shows "-".
 */
export function C360ContactIdentity({ data, services, goToTab, onEdit }: { data: Customer360Data; services: CustomerService[]; goToTab?: (key: string) => void; onEdit?: () => void }) {
  const [showAuthorised, setShowAuthorised] = useState(false);
  const [allContacts, setAllContacts] = useState(false);
  const ctx = { data, services };
  const f = (key: string): string | undefined => str(contactInformationResolvers[key]?.(ctx) as ReactNode);

  const customer = data.customer;
  const contact = data.contacts[0] as Rec | undefined;
  const meta = (data.overviewDemo[0]?.contactMeta ?? {}) as { tenure?: string; employer?: string; creditScore?: string | number };
  const prefs = data.overviewDemo[0]?.commPrefs as { marketing?: boolean; sms?: boolean; emailNotifications?: boolean } | undefined;
  const activities = (data.overviewDemo[0]?.contactActivities as Rec[] | undefined) ?? [];
  const otherContacts = (data.overviewDemo[0]?.otherContacts as Rec[] | undefined) ?? [];

  const verified = customer.moiValidationStatus;
  const idStatus = verified ?? str(data.identityDocuments[0]?.status);
  const commPref = prefs ? [prefs.sms ? 'SMS' : '', prefs.emailNotifications ? 'Email' : ''].filter(Boolean).join(', ') || 'None' : undefined;
  const lastUpdated = activities[0] ? [fmtDate(activities[0].at), str(activities[0].by)].filter(Boolean).join(' | ') : undefined;
  const qcb = f('QCB Check');
  const offers = data.crossSalesOffers.length > 0 ? 'Yes' : 'No';
  const authorised = data.authorisedContacts;

  const flagTone = (v: string | undefined): Tone => (!v ? 'grey' : /^(yes|clear|passed|verified|allowed|whitelisted)$/i.test(v) ? 'green' : /(fail|block|not|reject|no$)/i.test(v) ? 'red' : 'amber');
  const flag = (v: string | undefined): ReactNode => (v ? <Pill tone={flagTone(v)}>{v}</Pill> : undefined);

  const hierarchy: HierarchyContact[] = [
    ...(contact || customer.name
      ? [
          {
            key: 'primary',
            name: f('First Name & Last Name (Full Name)') ?? customer.name,
            role: 'Primary contact',
            primary: true,
            mobile: str(contact?.cellNumber) ?? customer.phone,
            email: customer.email,
          },
        ]
      : []),
    ...authorised.map((a) => ({
      key: `auth-${String(a.authorisedPersonId)}`,
      name: str(a.name) ?? '-',
      role: Array.isArray(a.roles) && a.roles.length > 0 ? `Authorised - ${(a.roles as string[]).join(', ')}` : 'Authorised person',
      primary: false,
      mobile: str(a.mobile),
      email: str(a.email),
    })),
    ...otherContacts.map((o, i) => ({ key: `other-${i}`, name: str(o.name) ?? '-', role: str(o.relation) ?? 'Contact', primary: false, mobile: str(o.mobile), email: str(o.email) })),
  ];
  const visibleContacts = allContacts ? hierarchy : hierarchy.slice(0, 3);

  const addresses = data.addresses as Rec[];

  return (
    <TabPage
      icon={IC.user}
      title="Contact & Identity"
      subtitle="View customer identity details, contact information and related contacts"
      actions={
        <>
          {onEdit && (
            <ActionButton primary icon={IC.edit} onClick={onEdit}>
              Edit Contact
            </ActionButton>
          )}
        </>
      }
    >
      {/* Masonry: panels flow down three columns by height instead of sharing rows. */}
      <div className="columns-1 @4xl:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
        <Panel id="c360-identity-information" icon={undefined} title={<CardTitle icon={IC.card}>Identity Information</CardTitle>} action={idStatus ? <Pill tone={flagTone(idStatus)}>{idStatus}</Pill> : undefined}>
          <DetailRows
            rows={[
              { label: 'Salutation', value: dash((customer as { salutation?: string }).salutation) },
              { label: 'Full Name', value: dash(f('First Name & Last Name (Full Name)')) },
              { label: 'ID Type', value: dash(f('ID Type')) },
              { label: 'ID Number', value: dash(str(contact?.idNumber) ?? customer.qid) },
              { label: 'Date of Birth', value: dash(fmtDate(contact?.dob ?? customer.dob)) },
              { label: 'Gender', value: dash(str(contact?.gender) ?? customer.gender) },
              { label: 'Nationality', value: dash(str(customer.nationality) ?? str(contact?.nationality)) },
              { label: 'ID Status', value: idStatus ? <Pill tone={flagTone(idStatus)}>{idStatus}</Pill> : dash(undefined) },
              { label: 'Blacklist Status', value: <Pill tone={customer.blacklisted ? 'red' : 'green'}>{customer.blacklisted ? 'Blacklisted' : 'Whitelisted'}</Pill> },
              { label: 'Credit Score', value: str(meta.creditScore) ?? <Dv k="creditScore" /> },
              { label: 'Employer', value: dash(str(meta.employer)) },
              // Captured at identification; shown here and nowhere in a journey.
              { label: 'Sponsor', value: dash(str((customer as { companyName?: string }).companyName)) },
              { label: 'Occupation', value: dash(str((customer as { occupation?: string }).occupation)) },
            ]}
          />
        </Panel>

        <Panel id="c360-contact-information" title={<CardTitle icon={IC.user}>Contact Information</CardTitle>} action={contact ? <Pill tone="green">Primary</Pill> : undefined}>
          <DetailRows
            rows={[
              { label: 'Primary MSISDN', value: dash(customer.phone) },
              { label: 'Secondary MSISDN', value: <Dv k="secondaryMsisdn" /> },
              { label: 'Email', value: dash(customer.email) },
              { label: 'Alternate Email', value: <Dv k="alternateEmail" /> },
              { label: 'Preferred Language', value: dash(f('Preferred Language')) },
              { label: 'Communication Preference', value: dash(commPref) },
              { label: 'Marketing Communication', value: prefs ? <Pill tone={prefs.marketing ? 'green' : 'grey'}>{prefs.marketing ? 'Allowed' : 'Not Allowed'}</Pill> : dash(undefined) },
              { label: 'Email Validation Status', value: <Dv k="emailValidation" /> },
            ]}
          />
        </Panel>

        <Panel id="c360-contact-role-relationship" title={<CardTitle icon={IC.users}>Contact Role & Relationship</CardTitle>}>
          <DetailRows
            rows={[
              { label: 'Customer Type', value: <Dv k="customerType" /> },
              { label: 'Segment', value: dash(customer.segment) },
              { label: 'Account Role', value: <Dv k="accountRole" /> },
              { label: 'Contact Role', value: <Dv k="contactRole" /> },
              {
                label: 'Authorized Person(s)',
                value: (
                  <span className="inline-flex items-center gap-4">
                    {authorised.length}
                    {authorised.length > 0 && (
                      <Button variant="tertiary" compact onClick={() => setShowAuthorised((s) => !s)} aria-expanded={showAuthorised}>
                        {showAuthorised ? 'Hide' : 'View'}
                      </Button>
                    )}
                  </span>
                ),
              },
              { label: 'Contact Since', value: meta.tenure ?? <Dv k="customerSince" /> },
              { label: 'Last Updated', value: dash(lastUpdated) },
            ]}
          />
          {showAuthorised && authorised.length > 0 && (
            <ul className="mt-2 rounded-[var(--radius-button)] bg-surface divide-y divide-border-soft">
              {authorised.map((a) => (
                <li key={String(a.authorisedPersonId)} className="px-3 py-2 text-[length:var(--fs-body)] min-w-0">
                  <div className="text-fg font-medium break-words">{str(a.name) ?? '-'}</div>
                  <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">
                    {[str(a.jobTitle), Array.isArray(a.roles) ? (a.roles as string[]).join(', ') : undefined, str(a.mobile), str(a.email)].filter(Boolean).join(' | ') || '-'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          id="c360-contact-hierarchy"
          title={<CardTitle icon={IC.users}>{`Contact Hierarchy (${hierarchy.length})`}</CardTitle>}
          action={hierarchy.length > 3 ? <LinkAction onClick={() => setAllContacts((s) => !s)}>{allContacts ? 'Show less' : 'View All'}</LinkAction> : undefined}
        >
          {visibleContacts.length === 0 ? (
            <p className="text-muted text-[length:var(--fs-body)] py-2">No contacts on file.</p>
          ) : (
            <ul>
              {visibleContacts.map((c) => (
                <li key={c.key} className="flex items-center gap-3 py-2.5 border-b border-border-soft last:border-0 min-w-0">
                  <span
                    className={`w-11 h-11 rounded-[var(--radius-pill)] flex items-center justify-center shrink-0 font-semibold text-[length:var(--fs-body)] ${
                      c.primary ? 'bg-accent text-accent-on' : 'bg-tone-accent text-accent'
                    }`}
                  >
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-fg font-semibold text-[length:var(--fs-body)] break-words">{c.name}</span>
                      {c.primary && <PrimaryTag />}
                    </div>
                    <div className="text-fg-2 text-[length:var(--fs-caption)] break-words">{c.role}</div>
                    <div className="flex flex-wrap gap-x-4 text-fg-2 text-[length:var(--fs-caption)]">
                      {c.mobile && <span className="break-all">{c.mobile}</span>}
                      {c.email && <span className="break-all">{c.email}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel id="c360-addresses" title={<CardTitle icon={IC.pin}>{`Addresses (${addresses.length})`}</CardTitle>} action={<LinkAction onClick={goToTab ? () => goToTab('address-service') : undefined}>View All</LinkAction>}>
          {addresses.length === 0 ? (
            <p className="text-muted text-[length:var(--fs-body)] py-2">No addresses on file.</p>
          ) : (
            <ul className="space-y-3">
              {addresses.slice(0, 2).map((a, i) => {
                const primary = a.primaryStatus === 'Primary';
                const active = a.activeFlag !== false && !a.effectiveTo;
                const line = [str(a.addressLine1), str(a.addressLine2)].filter(Boolean);
                const place = [str(a.city), str(a.country)].filter(Boolean).join(', ');
                return (
                  <li key={str(a.id) ?? i} className="rounded-[var(--radius-button)] border border-[var(--field-card-border)] p-3 flex items-center gap-3 min-w-0">
                    <IconTile icon={primary ? IC.home : IC.building} tone="grey" size="lg" />
                    <div className="min-w-0 flex-1">
                      <div>
                        <Pill tone={primary ? 'green' : 'grey'}>{primary ? 'Primary Address' : 'Other Address'}</Pill>
                      </div>
                      <div className="text-fg-2 text-[length:var(--fs-caption)] mt-1 break-words">{[...line, place].filter(Boolean).join(', ') || '-'}</div>
                    </div>
                    <Pill tone={active ? 'green' : 'grey'}>{active ? 'Active' : 'Inactive'}</Pill>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel id="c360-additional-information" title={<CardTitle icon={IC.info}>Additional Information</CardTitle>}>
          <DetailRows
            rows={[
              { label: 'Customer Since', value: meta.tenure ?? <Dv k="customerSince" /> },
              { label: 'Total Number of Connections', value: dash(services.length > 0 ? String(services.length) : undefined) },
              { label: 'Sales Enhancement Offers Flag', value: flag(offers) },
              { label: 'Cross Sale Offers Flag', value: flag(offers) },
              { label: 'QCB Check', value: qcb ? flag(qcb) : dash(undefined) },
            ]}
          />
        </Panel>
      </div>
    </TabPage>
  );
}
