import { useState } from 'react';
import { CustomerIdentification } from '../CustomerIdentification';
import { ExceptionRequestModal } from '../EligibilityGate';
import { DemoScanVariantContext } from '../../components/domain/demoScanVariant';
import type { DemoScanVariant } from '../../components/domain/demoScanVariant';
import { requirementForCondition } from '../../engines/journeyDocuments';
import { under18ApproverRole } from '../../data/under18Exception';
import { usePersonaStore } from '../../stores/personaStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Button } from '../../components/primitives/Button';
import { CARD_SELECTED, SelectedTick, CARD_IDLE } from '../../components/primitives/offerCardParts';
import { Icon } from '../../components/primitives/Icon';
import { CARD_SELECTABLE } from '../stepStyles';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { useDemoReaderCustomer, useDemoUnderEighteenCustomer } from './useDemoReaderCustomer';
import { actualUserAgeProblem, actualUserIsMinor, isOtherUser, minorExceptionHolds, sameId, withRecordPhone } from './actualUserModel';
import type { ActualUserValue } from './actualUserModel';
import { PEOPLE, PERSON_ALT } from '../../assets/icons';

/**
 * ACTUAL USER - the line's real user, when it is not the customer who owns it. The agent chooses "Same as primary customer" (the default)
 * or "Add actual user"; adding one identifies them the way the primary customer was identified (ID type, scan or upload, MOI, identity
 * details, email, phone) through Customer Verification, so the two never drift apart. For someone who is already a customer, MOI
 * brings their email and phone from the record; what the agent changes is written back when the order is submitted (the email to their
 * customer record, the phone to their existing contact-level record).
 *
 * Journeys mount THIS component (through actualUserStep) and say what their context needs; none identifies the second person itself.
 */

const OPTIONS: { key: 'primary' | 'other'; label: string; hint: string; icon: string }[] = [
  { key: 'primary', label: 'Same as Primary Customer', hint: 'The customer will use the line themself', icon: PERSON_ALT },
  { key: 'other', label: 'Add Actual User', hint: 'Someone else will use this line (a family member, for example)', icon: PEOPLE },
];

export function ActualUser({
  value,
  onChange,
  primaryIdNumber,
  primaryCustomerId,
  primaryNationality,
  hideChoice = false,
  onRemove,
}: {
  value: ActualUserValue;
  onChange: (value: ActualUserValue) => void;
  /** The primary customer's ID number: the actual user must be a different person. */
  primaryIdNumber?: string;
  /** The primary customer's id, so the demo reader presents someone else. */
  primaryCustomerId?: string;
  /** The primary contact's nationality: the demo's "Scan Below 18" presents a person of it. */
  primaryNationality?: string;
  /** The journey has already chosen "someone else" (from its own button): the two choice cards are not shown, and `onRemove` is the way back. */
  hideChoice?: boolean;
  onRemove?: () => void;
}) {
  const readerCustomerId = useDemoReaderCustomer(primaryCustomerId);
  const underEighteenId = useDemoUnderEighteenCustomer(primaryCustomerId, primaryNationality);
  // "Scan Below 18" (demo): the simulated reader presents someone under 18 of the primary contact's nationality, through the same scan as "Initiate scan".
  const [scanBelow18, setScanBelow18] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const variant: DemoScanVariant = {
    label: 'Scan Below 18',
    onSelect: () => {
      if (!underEighteenId) {
        useNotificationStore.getState().pushToast('warning', 'No person under 18 with the primary contact\'s nationality is on file for the demo.');
        return false;
      }
      setScanBelow18(true);
    },
    onStandard: () => setScanBelow18(false),
  };
  const choice = value.choice ?? 'primary';
  const identity = value.identity;
  const ageProblem = isOtherUser(value) ? actualUserAgeProblem(identity) : undefined;
  const samePerson = isOtherUser(value) && sameId(identity?.idNumber, primaryIdNumber);
  const isMinor = isOtherUser(value) && actualUserIsMinor(identity);
  const exceptionStands = minorExceptionHolds(value);
  return (
    <div className="space-y-4">
      {!hideChoice && (
      <div role="radiogroup" aria-label="Actual User" className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))]">
        {OPTIONS.map((o) => {
          const checked = choice === o.key;
          return (
            <div
              key={o.key}
              role="radio"
              aria-checked={checked}
              tabIndex={0}
              onClick={() => onChange({ ...value, choice: o.key })}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onChange({ ...value, choice: o.key });
                }
              }}
              className={`${CARD_SELECTABLE} cursor-pointer transition-colors focus-ring ${checked ? CARD_SELECTED : CARD_IDLE}`}
            >
              {checked && <SelectedTick />}
              <div className="row">
                <span className={`icon-box ${checked ? 'bg-accent text-accent-on' : 'bg-surface-warm text-accent'}`}>
                  <Icon path={o.icon} className="size-5 " />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block value-text">{o.label}</span>
                  <span className="block caption-secondary">{o.hint}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}
      {choice === 'other' && (
        <div className="space-y-4">
          <DemoScanVariantContext.Provider value={variant}>
          <CustomerIdentification
            collectContact
            // Someone other than the customer on screen: not bound to them, and found whether or not they are already a customer.
            unbound
            // The simulated reader presents a different person's card than the primary customer's.
            scanAsCustomerId={scanBelow18 && underEighteenId ? underEighteenId : readerCustomerId}
            allowedIdTypes={['QID', 'Diplomatic ID']}
            verifyThenFetch
            showIptvToggle={false}
            value={identity ?? {}}
            onChange={(v: GuidedContactValue) => onChange({ ...value, choice: 'other', identity: withRecordPhone(identity, v) })}
          />
          </DemoScanVariantContext.Provider>
          {ageProblem && !samePerson && !exceptionStands && (
            <div className="stack gap-3">
              <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
                {ageProblem}
              </p>
              {/* A minor is not added through the standard flow. The one way on is the Exception Request, with the Court Order attached. */}
              {isMinor && (
                <div>
                  <Button variant="secondary" compact onClick={() => setExceptionOpen(true)}>
                    Apply for Exception
                  </Button>
                </div>
              )}
            </div>
          )}
          {exceptionStands && value.exception && (
            <div role="status" className="notice-neutral pad-row stack gap-2">
              <p className="body-text">
                Exception requested for this Secondary Contact: {value.exception.document.label} ({value.exception.document.fileName}) attached. The order is held for {under18ApproverRole(usePersonaStore.getState().activePersonaId)} approval.
              </p>
              <div>
                <Button variant="tertiary" compact onClick={() => onChange({ ...value, exception: undefined })}>
                  Remove Exception
                </Button>
              </div>
            </div>
          )}
          {samePerson && (
            <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
              {hideChoice ? "This is the primary customer's own ID. Identify a different person." : 'This is the primary customer\'s own ID. Choose "Same as primary customer", or identify a different person.'}
            </p>
          )}
          {hideChoice && onRemove && (
            <Button variant="tertiary" compact onClick={onRemove}>
              Remove Secondary Contact
            </Button>
          )}
        </div>
      )}
      <ExceptionRequestModal
        open={exceptionOpen}
        onClose={() => setExceptionOpen(false)}
        requirement={requirementForCondition('minor-applicant')}
        approverRole={under18ApproverRole(usePersonaStore.getState().activePersonaId)}
        document={value.exception?.document}
        onSubmit={(document) => {
          onChange({ ...value, exception: { document, idNumber: identity?.idNumber ?? '', submittedAt: new Date().toISOString() } });
          setExceptionOpen(false);
          useNotificationStore.getState().pushToast('success', 'Exception request submitted for approval.', { detail: `The order will be held for ${under18ApproverRole(usePersonaStore.getState().activePersonaId)} approval.` });
        }}
      />
    </div>
  );
}
