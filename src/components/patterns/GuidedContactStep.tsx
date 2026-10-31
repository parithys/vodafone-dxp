import { getLookupList } from '../../engines/configEngine';
import { formatDateTime } from '../../lib/format';
import { IdLookupStep } from './IdLookupStep';
import { idTypeLabel } from '../domain/QidInput';
import type { QidType } from '../domain/QidInput';
import { IdentityDetailsCard, identityFacts } from '../../capabilities/CustomerIdentification/IdentityDetailsCard';
import { Input } from '../primitives/Input';
import { PhoneNumberInput } from '../primitives/PhoneNumberInput';
import { Select } from '../primitives/Select';
import { isValidAltPhone, isValidEmail, emailVerification, displayedEmail, displayedMobile, identityFromMoi } from './guidedContactModel';
import type { GuidedContactValue } from './guidedContactModel';


interface GuidedContactStepProps {
  value: GuidedContactValue;
  onChange: (value: GuidedContactValue) => void;
  /** Fixed Line evidences a "Get IPTV?" field at Contact; FWA's evidenced Contact
   * fields (FLD-430–450) don't include it - default true for Fixed Line callers. */
  showIptvToggle?: boolean;
  /**
   * Which ID types the journey offers. Forwarded to IdLookupStep; omitted
   * means all four. New Postpaid narrows it to QID and Diplomatic ID.
   */
  allowedIdTypes?: QidType[];
  unavailableIdTypes?: QidType[];
  unavailableIdTypesHint?: string;
  /** Scan-first with automatic type detection - see IdLookupStep. */
  autoDetectIdType?: boolean;
  /** Typed ID entry from the start (a keyboard device) - see IdLookupStep. */
  manualEntry?: boolean;
  /** Offer to create a new customer when no registry knows the ID (see IdLookupStep). */
  allowNewCustomer?: boolean;
  /** Scan -> verify -> Fetch, with mobile number shown - see IdLookupStep. */
  verifyThenFetch?: boolean;
  /** Handle whoever the scanned ID belongs to as a genuine new customer (New Connection - New Customer). */
  asNewCustomer?: boolean;
  /** Identify someone other than the customer on screen (see useIdLookup). */
  unbound?: boolean;
  /** Demo reader: present this customer's own document and card (see useIdLookup). */
  scanAsCustomerId?: string;
  /** Journey started from Customer 360: the customer is this one, whatever ID the scan returned. */
  asCustomerId?: string;
}

// Seeds the editable identity fields from an MOI result - or clears them when
// there isn't one, so re-typing an ID doesn't leave the previous person's
// details behind.
//
// MOI returns one `name` string; the form wants First and Last separately, so
// the first whitespace-delimited token becomes First and the remainder Last
// ("Ahmed Al-Sulaiti" -> "Ahmed" / "Al-Sulaiti"). That is a guess about name
// order, which is why both fields stay editable and the MOI panel above tells
// the agent to review them: for a multi-part given name this split will be
// wrong, and the agent is the one who can see the document.
//
// `gender` IS seeded as of 2026-09-24. It has to be: the identity fields are
// read-only now, so a mandatory Gender with no registry source and no way to
// type into it would block Continue permanently. customers.json has always
// carried the field; only MoiResult was failing to pass it through.
// Filled-badge style (2026-09-28), replacing the plain outline tick: a solid
// success-coloured circle with a white check, rather than a currentColor
// stroke path. That two-tone look doesn't fit the shared Icon primitive
// (single-colour stroke on a 24x24 viewBox), so this is a small dedicated
// SVG local to this one call site instead of a change to Icon itself, which
// renders every stroke icon in the app.
function VerifiedBadge({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={label} className="w-4 h-4 shrink-0">
      <circle cx="12" cy="12" r="12" className="text-success" fill="currentColor" />
      <path
        d="M7.5 12.5l3 3 6-6.5"
        fill="none"
        className="stroke-accent-on"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Contact step shared across New Fixed Line (SCR-043, FLD-340–352) and New FWA
// (SCR-078, FLD-430–450) - Pattern 1 describes the contact step as "near-identical
// across every connection/activation journey regardless of product," and the two
// evidenced field sets overlap almost entirely (ID Expiry/Nationality/Gender/
// Name/DOB auto-populate from the ID scan; Email/Alt Phone/Language/Digital
// Lead-Sale/B2B2C are agent-entered in both).
//
// Two of those evidenced fields are no longer rendered as agent input, per
// explicit product direction on 2026-09-26:
//
// - Digital Lead / Sale is REMOVED. It appears in 26 corpus documents, every
//   one a guided-journey screenshot, and in all of them it reads No - never
//   once Yes. No BRSD, business rule, workshop or CAF defines it, so nothing
//   says what ticking it would mean, and nothing in this app read the value it
//   wrote. A control that captures a flag no one consumes, for a decision no
//   one can describe, is worse than its absence: it implies a choice that
//   matters. Logged as an open question rather than quietly reproduced.
// - B2B2C is DERIVED, not ticked. See GuidedContactValue.isB2B2C.
// Per explicit product direction, the ID Type/Number fields must never
// auto-populate with a real value - even when Customer 360's product
// actions launch this step for a customer already on screen - so the
// agent always performs (or at least sees) an explicit Fetch rather than
// silently trusting cached active-customer state. The number field shows
// a format-example placeholder instead (see QidInput.tsx).
export function GuidedContactStep({ value, onChange, showIptvToggle = true, allowedIdTypes, unavailableIdTypes, unavailableIdTypesHint, autoDetectIdType, manualEntry, verifyThenFetch, asNewCustomer, asCustomerId, unbound, scanAsCustomerId, allowNewCustomer }: GuidedContactStepProps) {
  // The configured salutations (public/config/lookup-lists.json); one already on the record stays selectable even if it has since been taken off the list.
  const configured = getLookupList('salutations');
  const salutationOptions = (value.salutation && !configured.includes(value.salutation) ? [...configured, value.salutation] : configured).map((x) => ({ value: x, label: x }));
  return (
    <div className="space-y-4">
      <IdLookupStep
        value={{ idType: value.idType, idNumber: value.idNumber, moiResult: value.moiResult, qidScans: value.qidScans, scannedExpiry: value.scannedExpiry, idReconciliation: value.idReconciliation }}
        // The identity read-out is suppressed here because this step renders
        // those three as editable fields below - see the prop's own note.
        showMoiDetails={false}
        hideMoiBadge
        allowedIdTypes={allowedIdTypes}
        unavailableIdTypes={unavailableIdTypes}
        unavailableIdTypesHint={unavailableIdTypesHint}
        autoDetectIdType={autoDetectIdType}
        manualEntry={manualEntry}
        allowNewCustomer={allowNewCustomer}
        verifyThenFetch={verifyThenFetch}
        asNewCustomer={asNewCustomer}
        asCustomerId={asCustomerId}
        unbound={unbound}
        scanAsCustomerId={scanAsCustomerId}
        // Every MOI-derived field is re-seeded from the result whenever it
        // changes, and cleared with it when the ID is edited/re-typed. A new
        // ID is a new person, so carrying over the previous one's name or
        // email would be worse than clearing. Agent edits survive anything
        // that is not an ID/MOI change, since this only fires for those.
        onChange={(v) =>
          onChange({
            ...value,
            ...v,
            ...identityFromMoi(v.moiResult),
            // verifyThenFetch only: the record's mobile number arrives with the
            // MOI result. The communication language is NOT seeded from the
            // record - it defaults to English and the agent chooses.
            ...(verifyThenFetch
              ? {
                  mobileNumber: v.moiResult?.phone,
                }
              : {}),
            // A person identified apart from the customer (a Secondary Contact): the registry's mobile is their Mobile Number, shown masked and read-only like the email.
            ...(unbound && v.moiResult && !v.moiResult.isNewCustomer && isValidAltPhone(v.moiResult.phone) ? { personalMobile: v.moiResult.phone } : {}),
          })
        }
      />

      {value.moiResult && (
        <div className="space-y-6 pt-6 border-t border-border-soft">
          {/* Two labelled groups (2026-09-30 regroup) - the registry-owned
              identity facts together, the two agent-editable contact fields
              (plus the notification/service preferences that ride with them)
              in their own group below. Heading style matches
              BillingAccountStep's "Existing Billing Accounts" - the
              established in-step sub-heading in this same design system,
              reused rather than inventing a new one. */}
          {/* Identity Details: registry-owned, so read-only CONTENT (label + value), not disabled inputs. Every fact
              that was a field before is still here; the first name, last name, date of birth, expiry, nationality
              and gender still gate Continue through the form's own required rules, which read the same values.
              Document Type is omitted under verifyThenFetch (the agent already chose it). Sponsor and Occupation
              are captured but not shown here: they are visible in Customer 360 only. */}
          <IdentityDetailsCard
            lastRowExtra={
              <Select
                label="Salutation"
                placeholder="Select salutation"
                value={value.salutation ?? ''}
                onChange={(e) => onChange({ ...value, salutation: e.target.value || undefined })}
                options={salutationOptions}
              />
            }
            status={
              verifyThenFetch && value.moiResult.moiUpdateTime
                ? `MOI validated at ${formatDateTime(value.moiResult.moiUpdateTime)}`
                : 'MOI validated'
            }
            facts={identityFacts(
              { ...value, idTypeLabel: value.idType ? idTypeLabel(value.idType) : '', companyName: value.companyName },
              { showDocumentType: !verifyThenFetch, idType: verifyThenFetch ? value.idType : undefined }
            )}
          />

          <div>
            <h3 className="text-fg font-semibold text-[length:var(--fs-body-lg)] mb-3">Contact &amp; Notification</h3>
            {/* The two fields the agent can actually change (Email, Alt
                phone) share a row with the one preference field evidenced
                alongside them - see isValidEmail's header note: "Email/Alt
                Phone/Language ... are agent-entered". */}
            <div className="grid grid-cols-2 gap-4">
              {/* Verification state rides INSIDE the field as a tick on its
                  right edge (2026-09-27), replacing the badge that sat
                  underneath. The badge was as wide as the input and read as a
                  second control; the status belongs to the value, so it now
                  sits with it. Only the VERIFIED state gets a mark - see
                  emailVerification. */}
              <Input
                label="Email ID"
                type="email"
                required
                // New customer: the address comes from NAS and is shown masked. The field is editable: focusing it selects the masked text,
                // so typing replaces it, and what the agent types is shown as typed (the stored value stays the real address until then).
                value={displayedEmail(value, { registry: unbound })}
                onFocus={(e) => {
                  if (displayedEmail(value, { registry: unbound }) !== (value.email ?? '')) e.currentTarget.select();
                }}
                // The email from the NAS is shown masked but the agent may replace it: focusing selects the masked text, so typing overwrites it.
                error={value.email && !isValidEmail(value.email) ? 'Please enter a valid email address.' : undefined}
                helperText={emailVerification(value.email, value.moiResult?.email).hint}
                trailingAddon={
                  !verifyThenFetch && emailVerification(value.email, value.moiResult?.email).verified ? (
                    <VerifiedBadge label="Email Address Verified" />
                  ) : undefined
                }
                onChange={(e) => onChange({ ...value, email: e.target.value })}
              />
              {/* Personal Mobile: optional, a Qatar mobile; validated when entered. */}
              <PhoneNumberInput
                label="Mobile Number"
                noAutoFocus
                fixedIso="QA"
                maxNationalDigits={8}
                value={value.personalMobile ?? ''}
                maskedDisplay={displayedMobile(value, { registry: unbound })}
                placeholder="55667766"
                error={value.personalMobile && !isValidAltPhone(value.personalMobile) ? 'Enter a valid Qatar mobile number.' : undefined}
                onChange={(e) => onChange({ ...value, personalMobile: e.target.value || undefined })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Work Email ID: optional for every customer (existing, new, B2B2C); validated when entered. */}
              <Input
                label="Work Email ID"
                type="email"
                placeholder="name@company.qa"
                value={value.workEmail ?? ''}
                error={value.workEmail && !isValidEmail(value.workEmail) ? 'Please enter a valid email address.' : undefined}
                onChange={(e) => onChange({ ...value, workEmail: e.target.value || undefined })}
              />
              <PhoneNumberInput
                label="Work Number"
                // Optional in verifyThenFetch (New Connection); still validated when entered.
                required={!verifyThenFetch}
                // Optional in verifyThenFetch, so it must not pull the cursor on arrival.
                noAutoFocus={verifyThenFetch}
                // Dial code pinned to Qatar: the rule names one country, so a
                // picker offering 200 others would present a choice in which
                // every alternative fails validation.
                fixedIso="QA"
                // Qatar numbers are 8 digits after the dial code. Without this
                // the cap is E.164's 15-minus-dial-code, i.e. 12, so the field
                // happily took "777777777777" and only the validator
                // underneath objected. The 9th keystroke now simply does not
                // land.
                maxNationalDigits={8}
                value={value.altPhone ?? ''}
                placeholder="55667766"
                error={
                  value.altPhone && !isValidAltPhone(value.altPhone)
                    ? 'Enter a valid Qatar mobile number.'
                    : undefined
                }
                onChange={(e) => onChange({ ...value, altPhone: e.target.value })}
              />
            </div>
            {/* Language: its own row. */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Evidenced agent-entered field - `language` has held a slot on
                  GuidedContactValue since this step's interface was written,
                  but nothing rendered it until 2026-09-28. Defaults to
                  English, matching every other Language control in the app
                  (Base Management's Contact step).

                  Options expanded 2026-09-28 from English/Arabic to also
                  offer Hindi, Malayalam and Filipino, matching Qatar's expat
                  customer base. English/Arabic/Hindi/Malayalam are the four
                  languages the CRM's actual SMS notification templates are
                  evidenced in (sms-templates - Locale codes
                  ENU/ARA/HIN/MAL); Filipino has no such template evidence but
                  was requested explicitly for this field, so it is included
                  as a demo-catalogue addition rather than an evidenced one. */}
              <Select
                label={verifyThenFetch ? 'Preferred Communication Language' : 'Notification Language'}
                value={value.language ?? 'English'}
                onChange={(e) => onChange({ ...value, language: e.target.value })}
                options={[
                  { value: 'English', label: 'English' },
                  { value: 'Arabic', label: 'Arabic' },
                  { value: 'Hindi', label: 'Hindi' },
                  { value: 'Malayalam', label: 'Malayalam' },
                  { value: 'Filipino', label: 'Filipino' },
                ]}
              />
              {/* Fixed Line evidences a "Get IPTV?" field at Contact; FWA's
                  evidenced set does not, hence the prop. Restored here after a
                  field reorder briefly dropped it - postpaid passes
                  showIptvToggle={false} so it never appeared in that journey,
                  which is exactly why losing it would not have shown up in
                  postpaid testing. */}
              {showIptvToggle && (
                <Select
                  label="Get IPTV?"
                  value={value.getIptv ?? 'No'}
                  onChange={(e) => onChange({ ...value, getIptv: e.target.value as 'Yes' | 'No' })}
                  options={[
                    { value: 'No', label: 'No' },
                    { value: 'Yes', label: 'Yes' },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
