import { useEffect, useState } from 'react';
import { canViewCustomerSegment } from '../engines/agentPrivilegeEngine';
import { useNavigate } from 'react-router-dom';
import * as mockDataEngine from '../engines/mockDataEngine';
import { useEntityStore } from '../stores/entityStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useCustomerContext } from '../stores/customerContextStore';
import { useQnomyQueueStore } from '../stores/qnomyQueueStore';
import { useAuthStore } from '../stores/authStore';
import { ensureWalkInWaiting } from '../engines/qnomyWalkIns';
import { closeHeldQnomyTicket } from '../engines/qnomyRelease';
import { nextTicketFor, waitingCountFor, queueLabelsForRole, queueScope, mobileMatches } from '../engines/qnomyQueueEngine';
import { usePersonaStore } from '../stores/personaStore';
import { canSeeQnomyTicketNumber, canSeeCtiReferenceNumber } from '../engines/agentPrivilegeEngine';
import { toActiveCustomerSummary, type CustomerRecord } from '../engines/customer360Engine';
import { Badge } from '../components/primitives/Badge';
import { Button } from '../components/primitives/Button';
import { Icon } from '../components/primitives/Icon';
import { Tooltip } from '../components/primitives/Tooltip';
import { factsForKioskNumber, loadServiceSources, ticketToast, mostRecentFor } from './sessionReferenceLookups';
import type { QTicketRecord, TroubleTicketRecord, KioskCustomerFacts } from './sessionReferenceLookups';


const INFO_ICON_PATH = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 7.5h.01';
const REFRESH_ICON_PATH = 'M3 12a9 9 0 0 1 15.3-6.4L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15.3 6.4L3 16 M3 21v-5h5';
// Header placement, immediately following the search box, read-only display
// (plain text stat / Badge - never an editable input). Both reference
// numbers are scoped to the customer currently loaded into
// customerContextStore. Persistence across every page/screen is structural:
// PersonaSwitcher (this component's parent) is mounted once in App.tsx
// outside <AppRouter/>, so it never unmounts on navigation.
//
//   - Qnomy Ticket Number: the customer's walk-in queue ticket (qtickets.json,
//     status 'Fed to Agent-in-DXP'), exclusively for Retail Agents and their
//     manager. Carries the Finish -> Next Customer servicing workflow below.
//   - CTI Reference Number: the customer's most recent active trouble ticket
//     (trouble-tickets.json), exclusively for Back-Office Agents and their
//     manager.
//
// Deliberately NOT shown here: a post-completion Tracking Record/Reference
// Number (e.g. the confirmation number issued only once a Mobile Postpaid
// Connection has actually been provisioned). That number doesn't exist for
// most of the servicing journey, so unlike the two above it can't function
// as a persistent "which interaction am I in" header reference - it belongs
// on the completed order/journey screen itself, not here.
//
// Next Customer -> Finish: nothing is ever assigned automatically. Clicking
// Next Customer pulls the oldest 'Waiting' ticket from a queue THIS ROLE
// SERVES (qnomyQueueEngine), marks it fed to this agent's session, retains the
// kiosk-entered mobile number for the interaction, and - if that number
// resolves to a customer on file - opens Customer 360 on their record.
// Clicking Finish completes the ticket, releases both the assignment and the
// retained number, and parks the queue in an explicit "awaiting next" state;
// the system does NOT auto-advance.
//
// Opening the record is deliberately NOT behind the identity gate. BR-01
// governs "demographic, contact, address or billing maintenance", and
// Customer360Layout / ContactSection / AddressSection each call
// requireVerification before such an edit. Gating the call itself meant the
// agent had to verify a customer they could not yet see.
export function SessionReferenceNumbers() {
  const navigate = useNavigate();
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const activeCustomer = useCustomerContext((s) => s.customer);
  const setActiveCustomer = useCustomerContext((s) => s.setActiveCustomer);
  const clearActiveCustomer = useCustomerContext((s) => s.clearActiveCustomer);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  // Whose history this release belongs to, for the Ticket History page - the
  // stable per-login identity (users-agents.json's userId), not the active
  // PERSONA: a role can be switched mid-session without the agent behind it
  // changing, and it's the agent, not the role, whose servicing this is.
  const staffUserId = useAuthStore((s) => s.profile?.userId) ?? null;
  const pushToast = useNotificationStore((s) => s.pushToast);
  const awaitingNext = useQnomyQueueStore((s) => s.awaitingNext);
  const setAwaitingNext = useQnomyQueueStore((s) => s.setAwaitingNext);
  const assignedQTicketId = useQnomyQueueStore((s) => s.assignedQTicketId);
  const kioskMobileNumber = useQnomyQueueStore((s) => s.kioskMobileNumber);
  const setKioskMobileNumber = useQnomyQueueStore((s) => s.setKioskMobileNumber);
  const setAssignedQTicketId = useQnomyQueueStore((s) => s.setAssignedQTicketId);

  const [activeQTicket, setActiveQTicket] = useState<QTicketRecord | undefined>();
  const [completedQTicket, setCompletedQTicket] = useState<QTicketRecord | undefined>();
  const [ctiTicket, setCtiTicket] = useState<TroubleTicketRecord | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [abandoning, setAbandoning] = useState(false);
  // Which way the last ticket left the session. `completedQTicket` holds the
  // just-released ticket for either outcome, so without this the post-release
  // chip would report a green "Completed" for a ticket the agent abandoned.
  const [releasedAs, setReleasedAs] = useState<'completed' | 'abandoned'>('completed');
  // Operator mark AND active-line count for the ticket in hand, both
  // resolved from its kiosk number in one pass.
  const [ticketFacts, setTicketFacts] = useState<KioskCustomerFacts | undefined>(undefined);
  const [callingNext, setCallingNext] = useState(false);
  const [waitingCount, setWaitingCount] = useState<number | null>(null);

  const showQnomy = canSeeQnomyTicketNumber(activePersonaId);
  const showCti = canSeeCtiReferenceNumber(activePersonaId);

  useEffect(() => {
    // Driven by the SESSION'S assignment, not by the loaded customer.
    //
    // Two reasons it must not depend on activeCustomer. Matching on ticket
    // status alone would let a pre-fed seed record for whichever customer
    // happened to be open look like an assignment made to this agent. And
    // requiring a matching customer meant a ticket for a walk-in whose kiosk
    // number resolves to NOBODY on file rendered nothing at all - the agent
    // held a ticket and a retained number, and the header showed an idle
    // queue, which is the one case where that number is the whole point.
    if (!showQnomy || !assignedQTicketId) {
      setActiveQTicket(undefined);
      setTicketFacts(undefined);
      return;
    }
    let cancelled = false;
    // Customers alongside the tickets so the operator mark is available to the
    // info-icon reopen, which is a plain click handler with no list of its own.
    // Resolving it here rather than inside that handler keeps the handler
    // synchronous and keeps the mark derived from the SESSION'S ticket, which
    // is what the reopen is meant to re-show.
    Promise.all([
      mockDataEngine.list<QTicketRecord>('qtickets'),
      mockDataEngine.list<CustomerRecord>('customers'),
      loadServiceSources(),
    ]).then(([qTickets, customers, sources]) => {
      if (cancelled) return;
      const ticket = qTickets.find((t) => t.qTicketId === assignedQTicketId);
      setActiveQTicket(ticket);
      setTicketFacts(ticket ? factsForKioskNumber(ticket.kioskMobileNumber, customers, sources, (seg) => canViewCustomerSegment(activePersonaId, seg)) : undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [showQnomy, assignedQTicketId, refreshKey, activePersonaId]);

  useEffect(() => {
    if (!activeCustomer || !showCti) {
      setCtiTicket(undefined);
      return;
    }
    let cancelled = false;
    mockDataEngine.list<TroubleTicketRecord>('trouble-tickets').then((tickets) => {
      if (cancelled) return;
      setCtiTicket(mostRecentFor(tickets, activeCustomer.customerId, 'createdAt'));
    });
    return () => {
      cancelled = true;
    };
  }, [activeCustomer?.customerId, showCti]);

  useEffect(() => {
    if (!showQnomy) return;
    let cancelled = false;
    // The queue is never empty: a kiosk walk-in is issued when the role's queue has been worked down.
    ensureWalkInWaiting(activePersonaId).then(() => Promise.all([mockDataEngine.list<QTicketRecord>('qtickets'), mockDataEngine.list<CustomerRecord>('customers')])).then(([qTickets, customers]) => {
      if (cancelled) return;
      setWaitingCount(waitingCountFor(activePersonaId, qTickets, queueScope(customers)));
    });
    return () => {
      cancelled = true;
    };
  }, [showQnomy, refreshKey, activeQTicket, activePersonaId]);

  // Re-shows the assignment notification for the ticket in hand.
  //
  // The toast is transient and now also clears on any outside click, so the
  // five facts an agent greets a walk-in with could be gone before they have
  // read them. The header shows the ticket id and number but not the customer
  // name, status or purpose, so without this the only way back to them was to
  // open the bell and hunt through history.
  //
  // Rebuilt from current state rather than replaying the original toast: the
  // customer may have been resolved, or cleared, since it was pushed.
  const showTicketDetails = () => {
    if (!activeQTicket) return;
    pushToast(
      ...ticketToast(activeQTicket, activeCustomer?.name ?? null, activeCustomer?.customerId ?? null, kioskMobileNumber, ticketFacts)
    );
  };

  const handleFinish = async () => {
    if (!activeQTicket) return;
    setFinishing(true);
    // The same close as Done & Exit and Create Activity on the order confirmation (closeHeldQnomyTicket): the ticket is Completed, attributed to
    // this agent for Ticket History, and counted as served.
    const held = activeQTicket;
    await closeHeldQnomyTicket();
    setFinishing(false);
    setReleasedAs('completed');
    setCompletedQTicket(held);
    setActiveQTicket(undefined);
  };

  // Same release path as handleFinish - completes the servicing session,
  // clears the assignment and retained number, and parks the queue in
  // "awaiting next" without auto-advancing. The only difference is the
  // outcome written to the ticket: the customer left before servicing
  // finished, so the ticket is not 'Completed'.
  //
  // 'Abandoned' is a NEW status value. The corpus only evidences 'Waiting',
  // and this component writes 'Fed to Agent-in-DXP' and 'Completed'; the
  // qticket `status` field is a free-form string with no enum to validate
  // against, so nothing rejected it. Flagged rather than presented as
  // evidenced - if the real Qnomy vocabulary calls this "No Show" or
  // similar, this is the one string to change.
  const handleAbandon = async () => {
    if (!activeQTicket) return;
    setAbandoning(true);
    // Same attribution as handleFinish, and for the same reason - an
    // abandoned ticket still belongs in the agent's history (it shows as
    // 'Abandoned', not hidden), so it needs the same durable link.
    await updateRecord('qtickets', 'qTicketId', activeQTicket.qTicketId, {
      status: 'Abandoned',
      agentInDxpSessionId: null,
      handledByUserId: staffUserId,
      releasedAt: new Date().toISOString(),
    });
    setAbandoning(false);
    setReleasedAs('abandoned');
    setCompletedQTicket(activeQTicket);
    setActiveQTicket(undefined);
    setAssignedQTicketId(null);
    setKioskMobileNumber(null);
    setAwaitingNext(true);
    pushToast('warning', `Ticket ${activeQTicket.qTicketId} marked abandoned.`);
  };

  const assignTicket = async (waiting: QTicketRecord) => {
    const sessionId = `DXP-SESS-${Date.now().toString().slice(-6)}`;
    await updateRecord('qtickets', 'qTicketId', waiting.qTicketId, {
      status: 'Fed to Agent-in-DXP',
      agentInDxpSessionId: sessionId,
    });
    setAssignedQTicketId(waiting.qTicketId);
    // Retained for the whole interaction, whether or not it resolves to an
    // existing customer - a new walk-in's number is exactly the value the
    // activation journey needs to carry forward.
    setKioskMobileNumber(waiting.kioskMobileNumber ?? null);
    setAwaitingNext(false);
    setCompletedQTicket(undefined);
    setRefreshKey((k) => k + 1);
  };

  const handleNextCustomer = async () => {
    setCallingNext(true);
    const [qTickets, customers, serviceSources] = await Promise.all([
      mockDataEngine.list<QTicketRecord>('qtickets'),
      mockDataEngine.list<CustomerRecord>('customers'),
      loadServiceSources(),
    ]);
    // Only from a queue this role serves (qnomyQueueEngine), oldest first.
    const waiting = nextTicketFor(activePersonaId, qTickets, queueScope(customers));
    setCallingNext(false);
    if (!waiting) {
      pushToast('info', `No customers waiting in your queue (${queueLabelsForRole(activePersonaId)}).`);
      return;
    }

    await assignTicket(waiting);

    // Identify by the KIOSK-ENTERED MOBILE NUMBER, not by the ticket's
    // customerId: the kiosk only knows what the customer typed, so resolving
    // the number is the step that decides whether this is an existing customer
    // at all. Falls back to the ticket's own link when a number is absent.
    const matched =
      customers.find((c) => mobileMatches(waiting.kioskMobileNumber, c.phone))
      ?? customers.find((c) => c.customerId === waiting.customerId);
    const canView = (seg: string | undefined) => canViewCustomerSegment(activePersonaId, seg);
    const facts = factsForKioskNumber(waiting.kioskMobileNumber, customers, serviceSources, canView);

    // A protected-segment customer this role may not see: nobody is made the active customer, the notification names no one, and the journey the
    // ticket asks for is NOT launched - the agent is told, and stays on the dashboard.
    if (matched && !canView(matched.segment)) {
      clearActiveCustomer();
      pushToast(...ticketToast(waiting, null, null, null, facts));
      navigate('/');
      return;
    }

    if (matched) setActiveCustomer(toActiveCustomerSummary(matched));
    else clearActiveCustomer();

    pushToast(...ticketToast(waiting, matched?.name ?? null, matched?.customerId ?? null, waiting.kioskMobileNumber, facts));

    // Per direction (2026-10-27): calling the next customer keeps the agent on
    // the Dashboard with the Assigned Ticket Number notification showing. No
    // journey or Customer 360 is opened for them - they choose where to go
    // from here. Navigating to '/' (rather than staying put) still matters when
    // Next Customer was clicked from another page: Customer360Layout reads the
    // route param, not activeCustomer, so staying would leave the PREVIOUS
    // customer's record on screen while the header announced a new one.
    navigate('/');
  };

  // A Qnomy-eligible agent ALWAYS has something here: a held ticket, a just-
  // finished one, or the idle queue control. Previously this bailed out
  // whenever no ticket was held, which made the idle "Next Customer" control
  // unreachable - a freshly logged-in agent had no way to call anyone.
  const showIdleQueue = showQnomy && !activeQTicket && !(awaitingNext && completedQTicket);
  if (!showQnomy && !(showCti && ctiTicket)) return null;

  return (
    <div className="flex items-center gap-2 shrink-0">
      {showQnomy && activeQTicket && (
        <>
          {/* Before the ticket text, so it reads as "info about this ticket"
              rather than another action alongside Finish and Abandoned. */}
          <Tooltip content="Show ticket details" placement="bottom">
            <button
              type="button"
              onClick={showTicketDetails}
              aria-label={`Show details for ticket ${activeQTicket.qTicketId}`}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-muted hover:text-fg transition-colors"
            >
              <Icon path={INFO_ICON_PATH} className="w-4.5 h-4.5" />
            </button>
          </Tooltip>
          <Tooltip
            content={
              activeCustomer
                ? `Qnomy queue ticket for ${activeCustomer.name} (read-only)`
                : `Qnomy queue ticket - no customer on file for ${kioskMobileNumber ?? 'this number'}; treat as a new customer`
            }
            placement="bottom"
          >
            <div className="flex flex-col leading-tight">
              {/* The TICKET ONLY, as of 2026-09-25. The queue name was the
                  label ("NEW CONNECTIONS") and the kiosk number trailed the
                  id; both are gone and the label is a fixed "Qnomy #".

                  Neither fact is lost - both are rows in the assignment
                  notification, which the info button immediately to the left
                  reopens on demand. That reopen is what made this safe to
                  trim: the number used to be recoverable ONLY from here,
                  which is why it was pinned in the header in the first
                  place, and it matters most for a walk-in with no record on
                  file. The tooltip still names that case. */}
              <span className="text-[length:var(--fs-caption)] uppercase tracking-wide text-muted">Qnomy #</span>
              <span className="text-fg font-semibold text-[length:var(--fs-body)]">{activeQTicket.qTicketId}</span>
            </div>
          </Tooltip>
          <Button variant="primary" compact disabled={finishing || abandoning} onClick={handleFinish}>
            {finishing ? 'Finishing…' : 'Finish'}
          </Button>
          {/* Secondary style (`ghost-rect`) - the same variant the completed
              state's Next Customer already uses in this component, so the
              two outcomes are not competing primaries. Both buttons disable
              during either action: they write to the same ticket, and the
              release is not idempotent. */}
          <Button variant="secondary" compact disabled={finishing || abandoning} onClick={handleAbandon}>
            {abandoning ? 'Abandoning…' : 'Abandoned'}
          </Button>
        </>
      )}
      {/* Idle: no ticket held by this session and nothing just finished. The
          agent is at the front desk with the queue in front of them, so this
          is where Next Customer lives - previously it only appeared after a
          Finish, which left a freshly-logged-in agent with no way to call
          anyone at all. */}
      {showIdleQueue && (
        <>
          <Tooltip content={`Waiting in your queue: ${queueLabelsForRole(activePersonaId)}`} placement="bottom">
            <div className="flex flex-col leading-tight">
              <span className="text-[length:var(--fs-caption)] uppercase tracking-wide text-muted">Queue</span>
              <span className="text-fg font-semibold text-[length:var(--fs-body)]">
                {waitingCount === null ? '-' : `${waitingCount} waiting`}
              </span>
            </div>
          </Tooltip>
          <Button
            variant="primary"
            compact
            disabled={callingNext || waitingCount === 0}
            onClick={handleNextCustomer}
          >
            <Icon path={REFRESH_ICON_PATH} className="w-4 h-4" />
            {callingNext ? 'Calling…' : 'Next Customer'}
          </Button>
        </>
      )}
      {showQnomy && !activeQTicket && awaitingNext && completedQTicket && (
        <>
          <Tooltip
            content={
              releasedAs === 'abandoned'
                ? 'Qnomy queue ticket for the previous customer - abandoned before servicing finished (read-only)'
                : 'Qnomy queue ticket for the previous customer - servicing completed (read-only)'
            }
            placement="bottom"
          >
            {/* The released ticket's OUTCOME is carried by this chip's own
                colour as of 2026-09-25, replacing the "Completed" /
                "Abandoned" badge that sat beside it.

                The abandoned colour is not optional. The badge existed
                because the two outcomes were otherwise identical, and
                colouring every released ticket green would have reported a
                completed handover for a customer the agent gave up on - the
                exact defect `releasedAs` was added to prevent. Green for
                completed, amber for abandoned, and the tooltip still spells
                out which in words for anyone who cannot use the colour.

                opacity-40 is gone with the badge: it dimmed the chip to mark
                it read-only, which would have left the outcome colour washed
                out and unreadable. Read-only is already conveyed by there
                being no control here and by the tooltip saying so. */}
            <div className="flex flex-col leading-tight">
              <span
                className={`text-[length:var(--fs-caption)] uppercase tracking-wide ${
                  releasedAs === 'abandoned' ? 'text-[var(--warn-text)]' : 'text-success'
                }`}
              >
                Qnomy #
              </span>
              <span
                className={`font-semibold text-[length:var(--fs-body)] ${
                  releasedAs === 'abandoned' ? 'text-[var(--warn-text)]' : 'text-success'
                }`}
              >
                {completedQTicket.qTicketId}
              </span>
            </div>
          </Tooltip>
          <Button variant="secondary" compact disabled={callingNext} onClick={handleNextCustomer}>
            <Icon path={REFRESH_ICON_PATH} className="w-4 h-4" />
            {callingNext ? 'Calling…' : 'Next Customer'}
          </Button>
        </>
      )}
      {showCti && ctiTicket && (
        <Tooltip content={`Active ticket (${ctiTicket.category}) for ${activeCustomer?.name ?? 'this customer'} (read-only)`} placement="bottom">
          <Badge variant="filled-neutral">CTI {ctiTicket.ticketId}</Badge>
        </Tooltip>
      )}
    </div>
  );
}
