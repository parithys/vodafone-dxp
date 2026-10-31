import { defaultBillLimitQar } from '../../engines/postpaidPricing';
import { numberWaiverLabel } from '../../engines/numberWaiver';
import { formatQar, VAT_RATE } from '../../engines/postpaidPricing';
import { Button } from '../primitives/Button';
import type { CheckoutSummaryDerived } from './useCheckoutSummary';
import { formatQarAny } from '../../lib/format';
import { toLocalMsisdn } from '../domain/msisdnPickerModel';

interface CheckoutDefaultLayoutProps extends CheckoutSummaryDerived {
  customerName: string | undefined;
  altPhone: string | undefined;
  billingMethod: string | undefined;
  msisdn: string | undefined;
  billLimit: number | undefined;
  onEdit: () => void;
}

const Row = ({ label, value, detail, agentOnly }: { label: string; value: string; detail?: string; agentOnly?: boolean }) => (
  <div className={`flex justify-between gap-4 py-2 border-b border-border-soft last:border-0 ${agentOnly ? 'agent-only' : ''}`}>
    <dt className="text-fg">{label}</dt>
    <dd className="text-fg text-right">
      {value}
      {detail && <span className="block text-[length:var(--fs-caption)] text-muted">{detail}</span>}
    </dd>
  </div>
);

// The original (non-'detailed') layout: the agent's read-back <dl> plus the
// Due today / first-bill / recurring panel.
export function CheckoutDefaultLayout({
  plan,
  addons,
  discount,
  numberDelta,
  hrnAdvance,
  isStarNumber,
  starTier,
  starEntitlementQar,
  numberChargeQar,
  numberWaiver,
  numberWaivedQar,
  dueTodayQar,
  creditLimitQar,
  charges,
  monthlyRecurringQar,
  firstBill,
  customerName,
  altPhone,
  billingMethod,
  msisdn,
  billLimit,
  onEdit,
}: CheckoutDefaultLayoutProps) {
  // Number's own detail line (2026-09-28): status, Star value, the number's
  // OWN discount and its lock-in all together, rather than scattered across a
  // separate "Order summary" recap box (now retired - see below). "Discount:
  // None" is stated explicitly rather than omitted: no per-number discount
  // concept exists anywhere in the catalogue (numbers.json/star-number-
  // tiers.json carry no discount field), and the plan discount above applies
  // to the recurring MRC, not this one-time figure - so the honest answer is
  // "none", not silence that could read as an unanswered question.
  const numberDetail = msisdn
    ? [
        isStarNumber ? `Star value ${formatQar(numberDelta)} one-time` : null,
        // BR-115 entitlement/overage, stated either way rather than only when
        // it bites - "no extra charge" is as much a fact the agent should be
        // able to read back as "QR X extra" is.
        isStarNumber && starEntitlementQar !== undefined
          ? numberChargeQar > 0
            ? `${formatQar(numberChargeQar)} extra beyond the ${formatQar(starEntitlementQar)} plan entitlement`
            : `Within the ${formatQar(starEntitlementQar)} plan entitlement - no extra charge`
          : null,
        'Discount: None',
        isStarNumber
          ? starTier
            ? `${starTier.lockInDurationMonths}-month lock-in`
            : 'Lock-in to be confirmed'
          : 'No lock-in',
      ]
        .filter(Boolean)
        .join(' · ')
    : undefined;

  return (
    <div className="space-y-4">
      {/* Edit (2026-09-28): returns to Plan & Add-ons via the wizard's
          goToStepKey rather than a bespoke navigation path - the agent then
          walks Continue back through Number/SIM Type as normal, both of
          which keep their prior values, landing back here unchanged. */}
      {/* The agent's prompt and Edit are not part of the customer's pop-up. */}
      <div className="agent-only flex items-center justify-between">
        <p className="text-fg-2 text-[length:var(--fs-caption)]">Review with the customer before generating the CAF.</p>
        <Button variant="secondary" compact onClick={onEdit}>
          Edit
        </Button>
      </div>

      <dl className="card card-surface p-4">
        {/* Row order follows the supplied summary mockup: who they are, how we
            identify and reach them, what they bought, how they pay, then
            hardware. Add-ons always renders, showing "None" rather than
            disappearing: an absent row reads as an unanswered question.

            Customer ID Number, Customer Contact Number and SIM Type are
            deliberately absent (2026-09-28 request) - only Customer Name and
            the Alternate phone # (the service-notification contact, labelled
            to match the Contact step exactly) identify the customer here. */}
        <Row label="Customer Name" value={customerName ?? '-'} />
        <Row label="Work Number" value={altPhone ? toLocalMsisdn(altPhone) : '-'} />
        {/* Plan and Discount are separate line items (2026-09-28), each
            carrying its own validity period as a detail line rather than
            leaving lock-in/duration to a separate recap box. */}
        <Row
          label="Plan"
          value={plan ? `${plan.name} - ${formatQar(plan.mrcQAR)}/mo` : '-'}
          detail={plan ? (plan.commitmentMonths ? `${plan.commitmentMonths}-month lock-in` : 'No lock-in') : undefined}
        />
        {/* Shown so the monthly figure below can be arrived at from the rows
            above it. Without this the total was simply lower than Plan plus
            Add-ons with nothing on screen accounting for the difference. */}
        {discount && (
          <Row
            label="Discount"
            value={`${discount.name} (${Math.round(Math.abs(discount.price) * 100)}%) - ${formatQar(
              charges.discountQar)}/mo`}
            detail={discount.durationMonths ? `Valid ${discount.durationMonths} months` : 'No expiry'}
          />
        )}
        {/* Every activated add-on, its price, AND its data allowance where the
            catalogue carries one (2026-09-28) - none of the seeded Add-on
            products currently do (International 50 is minutes-only), so
            nothing visibly changes today, but an add-on that does carry one
            reads it back here rather than only its price. */}
        <Row
          label="Add-Ons"
          value={
            addons.length
              ? addons
                  .map((a) => `${a.name} (${formatQar(a.mrcQAR)}/mo${a.dataAllowanceGB ? `, ${a.dataAllowanceGB} GB` : ''})`)
                  .join(', ')
              : 'None'
          }
        />
        {/* The number now carries everything about it in one place: status
            (Free/Star), its own value, its own discount, and its own
            lock-in - see numberDetail above. */}
        <Row label="Number" value={msisdn ? `${msisdn} - ${isStarNumber ? 'Star' : 'Free'}` : '-'} detail={numberDetail} />
        {creditLimitQar !== undefined && <Row agentOnly label="Credit Limit" value={`${formatQar(creditLimitQar)}`} />}
        {/* Bill limit (2026-09-28): the agent's own figure from Plan &
            Add-ons' BillLimitEditor once they have set one, falling back to
            the plan's own figure (what Plan & Add-ons shows by default), then the credit-limit cap - never a made-up
            number, and never silently absent. */}
        {creditLimitQar !== undefined && (
          <Row
            agentOnly
            label="Bill Limit"
            value={billLimit !== undefined || plan?.mrcQAR !== undefined ? `${formatQarAny(billLimit ?? (plan ? defaultBillLimitQar(plan.mrcQAR, creditLimitQar) : plan))}` : `Up to ${formatQarAny(creditLimitQar)}`}
            detail={`Capped at the ${formatQar(creditLimitQar)} credit limit`}
          />
        )}
        {/* Conditional: the postpaid journey dropped its Billing step on
            2026-09-25, so there is nothing to report there. Other journeys
            that still collect one are unaffected. */}
        {billingMethod && <Row label="Billing" value={billingMethod} />}
        {/* The tax is on the read-back because the monthly figure below
            includes it - an agent reading out a total they cannot account for
            from the rows above has nothing to answer "why?" with. */}
        <Row label={`VAT (${Math.round(VAT_RATE * 100)}%)`} value={`${formatQar(charges.vatQar)}/mo`} />
        {/* HRN (High Risk Nationality) advance payment - system-derived from
            the customer's nationality, not agent- or customer-entered, and
            surfaced here (rather than a separate customer-input placeholder)
            because there is nothing for either party to fill in: this is the
            consequence of that classification, not a form field. */}
        {hrnAdvance > 0 && <Row label="Advance Payment" value={`${formatQar(hrnAdvance)}`} />}
      </dl>

      <div className="rounded-[var(--radius-card)] border border-accent-border bg-surface-warm p-4 space-y-1">
        {/* Due today itemised (2026-09-28): the bold total, then its two
            possible components broken out underneath, so the figure above is
            never one number the agent cannot account for. Either line is
            absent when it contributes nothing - a QAR 0 row would answer a
            question nobody asked. */}
        <div className="flex justify-between text-fg font-semibold">
          <span>Due Today</span>
          <span>{formatQarAny(dueTodayQar)}</span>
        </div>
        {isStarNumber && (
          <div className="flex justify-between text-fg-2 text-[length:var(--fs-caption)]">
            <span>
              Star Number charge
              {/* BR-115: only shown when there actually IS an overage - a QAR 0
                  caption under a QAR 0 charge answers a question nobody asked,
                  same reasoning as the rest of this itemisation. */}
              {starEntitlementQar !== undefined && numberChargeQar > 0 && (
                <span className="block text-muted">
                  {formatQarAny(numberDelta)} sticker price, {formatQarAny(starEntitlementQar)} entitled on this plan
                </span>
              )}
            </span>
            <span>{formatQarAny(numberChargeQar)}</span>
          </div>
        )}
        {numberWaiver && numberWaivedQar > 0 && (
          <div className="flex justify-between text-fg-2 text-[length:var(--fs-caption)]">
            <span>{numberWaiverLabel(numberWaiver)}</span>
            <span>- {formatQarAny(numberWaivedQar)}</span>
          </div>
        )}
        {hrnAdvance > 0 && (
          <div className="flex justify-between text-fg-2 text-[length:var(--fs-caption)]">
            <span>Upfront / HRN fee</span>
            <span>{formatQarAny(hrnAdvance)}</span>
          </div>
        )}
        {/* First bill and ongoing recurring are two different numbers on a
            postpaid line, and this panel used to show only the second one -
            "Monthly recurring, going forward" was already the ongoing figure,
            but nothing distinguished it from what the FIRST invoice actually
            carries. The CAF disclaimer this journey's own signature step
            shows the customer is explicit that those differ: the first bill
            is a prorated part-month plus one full month billed in advance,
            not the plain recurring charge. */}
        <div className="flex justify-between text-fg-2 text-[length:var(--fs-caption)]">
          <span>
            First month's bill (approximate)
            <span className="block text-muted">
              {firstBill.proratedDays} of {firstBill.cycleDays} days this cycle
            </span>
          </span>
          <span className="shrink-0">{formatQarAny(firstBill.totalQar)}</span>
        </div>
        <div className="flex justify-between text-fg-2 text-[length:var(--fs-caption)]">
          <span>Recurring monthly bill, from month 2</span>
          <span>{formatQarAny(monthlyRecurringQar)}/mo</span>
        </div>
        {/* Reserved space (2026-09-28 request) for a full second-bill
            breakdown - deliberately NOT designed yet. This is a placeholder
            marking where that content will go, not a stand-in figure: no
            itemisation is invented here the way the rows above never invent
            one either. */}
        <div className="rounded-[var(--radius-sm)] border border-dashed border-border-soft p-3 mt-1">
          <p className="text-fg-2 text-[length:var(--fs-caption)] font-medium">Full Second-Bill Breakdown</p>
          <p className="text-muted text-[length:var(--fs-caption)]">Reserved - detailed content not yet designed.</p>
        </div>
      </div>
    </div>
  );
}
