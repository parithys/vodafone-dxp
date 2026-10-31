import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';
import { Button } from '../primitives/Button';

const CHECK = 'M20 6L9 17l-5-5';

export interface ConfirmationSummaryLine {
  label: string;
  value: string;
}

export interface ConfirmationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface OrderConfirmationScreenProps {
  heading: string;
  orderId: string;
  /** The activity this journey created automatically, when there is one. */
  activityId?: string;
  summaryLines: ConfirmationSummaryLine[];
  actions: ConfirmationAction[];
  /** The print actions, in their own row under `actions`, in the order given. */
  printActions?: ConfirmationAction[];
  /**
   * Optional block between the summary and "What happens next", for anything
   * the customer has to act on before leaving the counter - currently the
   * eSIM QR panel. A slot rather than an eSIM-shaped prop, because this
   * screen is shared with the prepaid wizard and shouldn't know what a
   * postpaid order happens to need handed over.
   */
  handoverPanel?: ReactNode;
  /** A short line directly under the heading (for example whether the order details were emailed). */
  headerNote?: ReactNode;
}

// Dedicated post-submit confirmation experience - replaces a toast-only
// completion signal for milestone/transaction outcomes. A toast is a
// transient, easily-missed strip; an order confirmation is exactly the kind
// of "important milestone" that needs a persistent screen with the result,
// the details that back it up, what happens next, and clear navigation -
// not something the agent has to catch before it fades.
export function OrderConfirmationScreen({
  heading,
  orderId,
  activityId,
  summaryLines,
  actions,
  printActions,
  headerNote,
  handoverPanel,
}: OrderConfirmationScreenProps) {
  return (
    // The outcome (heading, tick, order and activity numbers) is centred on top; below it the content is left-aligned: the
    // receipt on the left and - when there is something to hand over (the eSIM QR) - that handover on the right, then
    // every action in one row, with the print actions in a second row. Under lg the two columns stack, receipt first, so the page still prints on one A4 sheet.
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[length:var(--fs-h3)] font-bold text-fg mb-6">{heading}</h1>
        <div className="w-16 h-16 rounded-[var(--radius-pill)] bg-success-solid text-on-dark flex items-center justify-center mb-6">
          <Icon path={CHECK} className="w-8 h-8" />
        </div>
        <p className="text-fg-2 mb-2">
          Order: <span className="font-medium text-fg">{orderId}</span>
          {activityId && (
            <>
              <span className="mx-2 text-muted">|</span>
              Activity: <span className="font-medium text-fg">{activityId}</span>
            </>
          )}
        </p>
        {headerNote && <div className="mb-2">{headerNote}</div>}
      </div>

      {/* Two columns only when there is a handover panel to put in the second one: with none (a physical SIM has no QR)
          the receipt stands alone, centred, at a readable width rather than beside an empty column. */}
      <div className={`grid grid-cols-1 gap-8 mt-8 ${handoverPanel ? 'lg:grid-cols-2' : 'max-w-xl mx-auto items-start'}`}>
        <dl className="card p-5">
          {summaryLines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4 py-2 border-b border-border-soft last:border-0">
              <dt className="text-fg">{line.label}</dt>
              <dd className="text-fg font-medium text-right">{line.value}</dd>
            </div>
          ))}
        </dl>

        {handoverPanel && <div className="flex flex-col">{handoverPanel}</div>}
      </div>

      {/* Actions act on the order as a whole, so they span both columns, in one row (wrapping on a narrow screen). */}
      <div className="no-print print:hidden flex flex-wrap items-center justify-center gap-3 mt-8">
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant ?? 'secondary'} onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
      </div>
      {printActions && printActions.length > 0 && (
        <div className="no-print print:hidden flex flex-wrap items-center justify-center gap-3 mt-3">
          {printActions.map((action) => (
            <Button key={action.label} variant={action.variant ?? 'secondary'} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
