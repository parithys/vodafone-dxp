import { Button } from '../../primitives/Button';
import { Modal } from '../../primitives/Modal';
import { Textarea } from '../../primitives/Textarea';

/**
 * Abandon confirmation. The comment is required (blank or whitespace-only blocks the button) unless the
 * step started the abandon itself (`noKeep`, e.g. a hard stop), which only dismisses the dialog.
 */
export function AbandonDialog({
  open,
  noKeep,
  comments,
  onCommentsChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  noKeep: boolean;
  comments: string;
  onCommentsChange: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Abandon this order?"
      footer={
        <>
          {!noKeep && (
            <Button variant="secondary" onClick={onClose}>
              Keep Working
            </Button>
          )}
          <Button
            variant="primary"
            // The step-initiated variant (hard stop) only dismisses the modal.
            onClick={() => (noKeep ? onClose() : onConfirm())}
            disabled={!noKeep && !comments.trim()}
          >
            Abandon Order
          </Button>
        </>
      }
    >
      <p className="text-fg-2 text-[length:var(--fs-body)]">
        Everything entered for this customer will be discarded and the saved draft deleted. This cannot be undone.
      </p>
      {!noKeep && (
        <div className="mt-4">
          <Textarea
            label="Comments"
            required
            rows={3}
            value={comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            error={comments.length > 0 && !comments.trim() ? 'Enter a comment to abandon this order.' : undefined}
            helperText="Required. Recorded on the activity that is created automatically."
          />
        </div>
      )}
    </Modal>
  );
}

/** Save as Draft confirmation, with an optional comment recorded on the activity. */
export function SaveExitDialog({
  open,
  comments,
  onCommentsChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  comments: string;
  onCommentsChange: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save as Draft"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Keep Working
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Save as Draft
          </Button>
        </>
      }
    >
      <p className="text-fg-2 text-[length:var(--fs-body)]">This order is saved as a draft and can be resumed from Draft Orders.</p>
      <div className="mt-4">
        <Textarea
          label="Comments"
          rows={3}
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          helperText="Recorded on the activity that is created automatically."
        />
      </div>
    </Modal>
  );
}

/**
 * Shown when the agent tries to leave a journey that has progress (a link, the menu, Back). Navigation is held until they
 * choose: Save as Draft keeps the work as a draft order, Abandon Journey discards it. Closing the dialog (X, Escape or the
 * backdrop) stays on the journey.
 */
export function LeaveJourneyDialog({
  open,
  busy,
  onSave,
  onAbandon,
  onStay,
}: {
  open: boolean;
  busy: boolean;
  onSave: () => void;
  onAbandon: () => void;
  onStay: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onStay}
      title="Leave this journey?"
      footer={
        <>
          <Button variant="secondary" onClick={onAbandon} disabled={busy}>
            Abandon Journey
          </Button>
          <Button variant="primary" onClick={onSave} disabled={busy}>
            {busy ? 'Working…' : 'Save as Draft'}
          </Button>
        </>
      }
    >
      <p className="text-fg-2 text-[length:var(--fs-body)]">
        This journey is not finished. Save as Draft keeps what you have entered as a draft order you can resume from Draft Orders.
        Abandon Journey discards it.
      </p>
    </Modal>
  );
}
