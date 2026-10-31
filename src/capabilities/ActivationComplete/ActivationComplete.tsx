import { ActivationCompleteScreen } from '../../components/patterns/ActivationCompleteScreen';
import type { ActivationCompleteOrder } from '../../components/patterns/ActivationCompleteScreen';
import { CustomerViewButton } from '../../components/patterns/wizard/CustomerViewButton';
import { ORDER_SUBMITTED_KEY } from '../../components/patterns/wizard/customerViewPolicy';
import { useCustomerViewShare } from '../../components/patterns/wizard/useCustomerViewShare';

/**
 * ACTIVATION COMPLETE - the one application-wide capability for the page that confirms a submitted activation:
 * the order's facts, its status (complete, or submitted for approval), and the follow-on actions (view the order,
 * print, done and exit, create a lead, continue with fibre), plus the eSIM handover and the confirmation email.
 *
 * Journeys mount THIS component with the facts of their order and the kind of service they activated; none of
 * them mounts ActivationCompleteScreen or restates its labels.
 *
 *   service   'mobile' (default): a SIM number, with a SIM type row.
 *             'fixed': a fixed-line number, no SIM row.
 *   showActivityId  false in the customer-view pop-up, which shows the order and never the internal activity ID.
 *   allowCustomerView  the agent's window offers "Customer view" on this page too (it is one of the screens that can be shown to the customer).
 */
export interface ActivationCompleteProps {
  order: ActivationCompleteOrder;
  service?: 'mobile' | 'fixed';
  showActivityId?: boolean;
  allowCustomerView?: boolean;
}

export function ActivationComplete({ order, service = 'mobile', showActivityId = true, allowCustomerView = false }: ActivationCompleteProps) {
  const { popupBlocked, viewOpen, shareAnnouncement, toggleCustomerView } = useCustomerViewShare(ORDER_SUBMITTED_KEY);
  return (
    <>
      {allowCustomerView && showActivityId && (
        <div className="pointer-events-none sticky top-6 z-[var(--z-raised)] flex h-0 items-start justify-end">
          <div className="pointer-events-auto mr-8 mt-8 flex items-center gap-3">
            <CustomerViewButton viewOpen={viewOpen} onToggle={toggleCustomerView} />
          </div>
        </div>
      )}
      {popupBlocked && (
        <p role="alert" className="mx-8 mt-4 text-fg-2 text-[length:var(--fs-caption)]">The browser blocked the customer view pop-up. Allow pop-ups for this site and try again.</p>
      )}
      <p className="sr-only" role="status" aria-live="polite">{shareAnnouncement}</p>
    <ActivationCompleteScreen
      order={showActivityId ? order : { ...order, activityId: undefined }}
      numberLabel={service === 'fixed' ? 'Fixed Line Number' : undefined}
      // A journey with no SIM of its own (Fixed Activation; a change to an existing line) has no SIM row to show.
      hideSimType={service === 'fixed' || order.simType === undefined}
    />
    </>
  );
}
