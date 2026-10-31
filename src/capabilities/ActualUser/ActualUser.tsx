import { CustomerIdentification } from '../CustomerIdentification';
import { Button } from '../../components/primitives/Button';
import { CARD_SELECTED, SelectedTick, CARD_IDLE } from '../../components/primitives/offerCardParts';
import { Icon } from '../../components/primitives/Icon';
import { CARD_SELECTABLE } from '../stepStyles';
import type { GuidedContactValue } from '../../components/patterns/guidedContactModel';
import { useDemoReaderCustomer } from './useDemoReaderCustomer';
import { actualUserAgeProblem, isOtherUser, sameId, withRecordPhone } from './actualUserModel';
import type { ActualUserValue } from './actualUserModel';

/**
 * ACTUAL USER - the line's real user, when it is not the customer who owns it. The agent chooses "Same as primary customer" (the default)
 * or "Add actual user"; adding one identifies them the way the primary customer was identified (ID type, scan or upload, MOI, identity
 * details, email, phone) through Customer Verification, so the two never drift apart. For someone who is already a customer, MOI
 * brings their email and phone from the record; what the agent changes is written back when the order is submitted (the email to their
 * customer record, the phone to their existing contact-level record).
 *
 * Journeys mount THIS component (through actualUserStep) and say what their context needs; none identifies the second person itself.
 */
const PERSON = 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z';
const PEOPLE = 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8';

const OPTIONS: { key: 'primary' | 'other'; label: string; hint: string; icon: string }[] = [
  { key: 'primary', label: 'Same as Primary Customer', hint: 'The customer will use the line themself', icon: PERSON },
  { key: 'other', label: 'Add Actual User', hint: 'Someone else will use this line (a family member, for example)', icon: PEOPLE },
];

export function ActualUser({
  value,
  onChange,
  primaryIdNumber,
  primaryCustomerId,
  hideChoice = false,
  onRemove,
}: {
  value: ActualUserValue;
  onChange: (value: ActualUserValue) => void;
  /** The primary customer's ID number: the actual user must be a different person. */
  primaryIdNumber?: string;
  /** The primary customer's id, so the demo reader presents someone else. */
  primaryCustomerId?: string;
  /** The journey has already chosen "someone else" (from its own button): the two choice cards are not shown, and `onRemove` is the way back. */
  hideChoice?: boolean;
  onRemove?: () => void;
}) {
  const readerCustomerId = useDemoReaderCustomer(primaryCustomerId);
  const choice = value.choice ?? 'primary';
  const identity = value.identity;
  const ageProblem = isOtherUser(value) ? actualUserAgeProblem(identity) : undefined;
  const samePerson = isOtherUser(value) && sameId(identity?.idNumber, primaryIdNumber);
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
              className={`${CARD_SELECTABLE} cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${checked ? CARD_SELECTED : CARD_IDLE}`}
            >
              {checked && <SelectedTick />}
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] transition-colors ${checked ? 'bg-accent text-accent-on' : 'bg-surface-warm text-accent'}`}>
                  <Icon path={o.icon} className="w-5 h-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-fg font-medium text-[length:var(--fs-body)]">{o.label}</span>
                  <span className="block text-fg-2 text-[length:var(--fs-caption)]">{o.hint}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}
      {choice === 'other' && (
        <div className="space-y-4">
          <CustomerIdentification
            collectContact
            // Someone other than the customer on screen: not bound to them, and found whether or not they are already a customer.
            unbound
            // The simulated reader presents a different person's card than the primary customer's.
            scanAsCustomerId={readerCustomerId}
            allowedIdTypes={['QID', 'Diplomatic ID']}
            verifyThenFetch
            showIptvToggle={false}
            value={identity ?? {}}
            onChange={(v: GuidedContactValue) => onChange({ ...value, choice: 'other', identity: withRecordPhone(identity, v) })}
          />
          {ageProblem && !samePerson && (
            <p role="alert" className="text-danger text-[length:var(--fs-caption)]">
              {ageProblem}
            </p>
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
    </div>
  );
}
