import { useState } from 'react';
import { SearchField } from '../primitives/SearchField';
import { Badge } from '../primitives/Badge';
import { EmptyState } from '../primitives/EmptyState';
import { formatQar } from '../../lib/format';
import { FREE_NUMBER_PRICE_CEILING_QAR } from '../../engines/postpaidPricing';
import { blockedNumberInput, completeBlockedLookup, findBlockedNumber, toLocalMsisdn } from './msisdnPickerModel';
import type { MsisdnRecord } from './msisdnPickerModel';
import { StarStat } from './StarStat';

/**
 * The Blocked Numbers tab of Number Selection. Nothing is listed: the agent types the COMPLETE mobile number and the inventory is searched
 * for that exact number. A blocked one is answered with its number, whether it is a Star or Free number (and what that means: price, lock-in),
 * and who blocked it and why, so the agent knows whom to ask. A partial number is never searched, so the blocked inventory cannot be browsed.
 * Only the agent's OWN group's blocked numbers are answered (the signed-in persona's name against the record's blocking group); a number another group
 * blocked looks exactly like a number that is not blocked.
 * A blocked number cannot be chosen: the result is information only.
 */
export function BlockedNumberLookup({
  numbers,
  loaded,
  starTiers,
  viewerGroup,
}: {
  numbers: MsisdnRecord[];
  loaded: boolean;
  starTiers: { valueRangeMin: number; valueRangeMax: number; lockInDurationMonths: number }[];
  /** The signed-in agent's persona (group) name: only a number their own group blocked is answered. */
  viewerGroup: string | undefined;
}) {
  const [typed, setTyped] = useState('');
  const complete = completeBlockedLookup(typed);
  const found = findBlockedNumber(numbers, typed, viewerGroup);
  // The field takes digits only, 8 at most (blockedNumberInput), so the one thing left to say is that the number is not complete yet.
  const hint = typed !== '' && !complete ? 'Enter all 8 digits of the number.' : '';
  const isStar = found ? found.priceQAR >= FREE_NUMBER_PRICE_CEILING_QAR : false;
  const lockIn = found && isStar ? starTiers.find((t) => found.priceQAR >= t.valueRangeMin && found.priceQAR <= t.valueRangeMax)?.lockInDurationMonths : undefined;
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <SearchField
          aria-label="Blocked mobile number"
          aria-describedby="blocked-number-hint"
          placeholder="Enter the full mobile number"
          inputMode="numeric"
          value={typed}
          className="h-[var(--field-height)] py-0!"
          onChange={(e) => setTyped(blockedNumberInput(e.target.value))}
          onClear={() => setTyped('')}
        />
        <p
          id="blocked-number-hint"
          role="status"
          className="empty:hidden caption-muted"
        >
          {hint}
        </p>
      </div>
      {complete && loaded && !found && (
        // The same answer whether the number is not blocked or another group blocked it: nothing about it is revealed.
        <EmptyState compact message="No blocked number matches found." />
      )}
      {found && (
        <section aria-label="Blocked number" className="card pad-card-lg space-y-4">
          <div className="wrap-center justify-between gap-x-3 gap-y-1">
            <p className="title title-xl leading-tight">{toLocalMsisdn(found.msisdn)}</p>
            <Badge variant="danger-solid">Blocked</Badge>
          </div>
          {/* What the number is. */}
          <dl className="detail-grid">
            <StarStat label="Type" value={isStar ? 'Star Number' : 'Free Number'} />
            {isStar && <StarStat label="Price" value={formatQar(found.priceQAR, { nbsp: true })} />}
            {lockIn !== undefined && <StarStat label="Lock-In Period" value={`${lockIn}\u00a0months`} />}
          </dl>
          {/* Who blocked it and why - what the agent came to find out - set apart, on one row, in the same three columns as the facts above, the reason taking two. Said as unknown,
              not guessed, when the record does not name a group or a reason. */}
          <dl className="detail-grid border-t border-[var(--field-card-border)] pt-4">
            <StarStat label="Blocked By" value={found.blockedByTeam ?? 'Not recorded'} />
            <div className="sm:col-span-2">
              <StarStat label="Blocked Reason" value={found.blockedReason ?? 'Not recorded'} />
            </div>
          </dl>
        </section>
      )}
      <span className="sr-only" aria-live="polite">
        {found ? `${toLocalMsisdn(found.msisdn)} is blocked.` : ''}
      </span>
    </div>
  );
}
