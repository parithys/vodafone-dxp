import { Button } from '../../../components/primitives/Button';
import { Checkbox } from '../../../components/primitives/Checkbox';
import { Drawer } from '../../../capabilities';
import { Select } from '../../../components/primitives/Select';
import { Textarea } from '../../../components/primitives/Textarea';
import { RESOLUTION_CODES, ESCALATION_REASONS, CANCELLATION_REASONS, TT_HASHTAGS, RETENTION_RESOLUTION_CODES } from '../../../data/reference/ticketReferenceData';
import type { TicketDetailState } from './useTicketDetailState';

interface Props {
  s: TicketDetailState;
  escalate: () => void;
  resolve: () => void;
  cancel: () => void;
  reopen: () => void;
  closeTicket: (retentionCode?: string) => void;
}

export function TicketDrawers({ s, escalate, resolve, cancel, reopen, closeTicket }: Props) {
  const {
    escalateOpen, setEscalateOpen, escalateReason, setEscalateReason,
    resolveOpen, setResolveOpen, resolutionCode, setResolutionCode, resolutionHashtags, setResolutionHashtags,
    cancelOpen, setCancelOpen, cancelReason, setCancelReason,
    reopenOpen, setReopenOpen, reopenReason, setReopenReason,
    retentionCloseOpen, setRetentionCloseOpen, retentionResolutionCode, setRetentionResolutionCode,
  } = s;
  // Flat, real (partial-sample) list - see ticketReferenceData.ts's own
  // comment on TT_HASHTAGS. No category filter, since the source LOV export
  // carries no category grouping to filter by.
  const availableHashtags = TT_HASHTAGS;

  return (
    <>
    <Drawer open={escalateOpen} onClose={() => setEscalateOpen(false)} title="Escalate Ticket">
      <div className="space-y-3">
        <Select label="Escalation Reason (Mandatory)" value={escalateReason} onChange={(e) => setEscalateReason(e.target.value)} placeholder="Select a reason" options={ESCALATION_REASONS.map((r) => ({ value: r, label: r }))} />
        {!escalateReason && <p className="text-[length:var(--fs-caption)] text-danger">An escalation without a selected reason is rejected (ESC-05).</p>}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => setEscalateOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={escalate} disabled={!escalateReason}>Escalate</Button>
      </div>
    </Drawer>

    <Drawer open={resolveOpen} onClose={() => setResolveOpen(false)} title="Resolve Ticket">
      <div className="space-y-3">
        <Select label="Resolution Code (Mandatory, RES-01/02)" value={resolutionCode} onChange={(e) => setResolutionCode(e.target.value)} placeholder="Select one code" options={RESOLUTION_CODES.map((r) => ({ value: r, label: r }))} />
        <div>
          <div className="text-[length:var(--fs-caption)] text-muted mb-1">Hashtags (mandatory, at least one - RES-03)</div>
          <div className="flex flex-wrap gap-2">
            {availableHashtags.map((h) => (
              <label key={h} className="flex items-center gap-1 text-[length:var(--fs-caption)]">
                <Checkbox
                  checked={resolutionHashtags.includes(h)}
                  onChange={(e) => setResolutionHashtags(e.target.checked ? [...resolutionHashtags, h] : resolutionHashtags.filter((x) => x !== h))}
                />
                {h}
              </label>
            ))}
            {availableHashtags.length === 0 && <span className="text-muted text-[length:var(--fs-caption)]">No hashtags configured for this category.</span>}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => setResolveOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={resolve} disabled={!resolutionCode || resolutionHashtags.length === 0}>Mark Solved</Button>
      </div>
    </Drawer>

    <Drawer open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Ticket">
      <Select label="Cancellation Reason (Required)" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Select a reason" options={CANCELLATION_REASONS.map((r) => ({ value: r, label: r }))} />
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => setCancelOpen(false)}>Back</Button>
        <Button variant="destructive" onClick={cancel} disabled={!cancelReason}>Cancel Ticket</Button>
      </div>
    </Drawer>

    <Drawer open={reopenOpen} onClose={() => setReopenOpen(false)} title="Reopen Ticket">
      <Textarea label="Reopen Reason (Required)" value={reopenReason} onChange={(e) => setReopenReason(e.target.value)} placeholder="Why is this ticket being reopened?" />
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => setReopenOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={reopen} disabled={!reopenReason.trim()}>Reopen</Button>
      </div>
    </Drawer>

    <Drawer open={retentionCloseOpen} onClose={() => setRetentionCloseOpen(false)} title="Close Disconnection Ticket">
      <Select
        label="Resolution Code (retention) - mandatory, BR-060"
        value={retentionResolutionCode}
        onChange={(e) => setRetentionResolutionCode(e.target.value)}
        placeholder="Select an outcome"
        options={RETENTION_RESOLUTION_CODES.map((r) => ({ value: r, label: r }))}
      />
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={() => setRetentionCloseOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={() => closeTicket(retentionResolutionCode)} disabled={!retentionResolutionCode}>Close Ticket</Button>
      </div>
    </Drawer>
    </>
  );
}
