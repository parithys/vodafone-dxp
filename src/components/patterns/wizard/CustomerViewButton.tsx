import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Tooltip } from '../../primitives/Tooltip';

const EYE_ICON = 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';

/** The "Customer view" toggle (and its "Visible to customer" tag while sharing): the one button every journey screen and the completion page use. */
export function CustomerViewButton({ viewOpen, onToggle }: { viewOpen: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Says which content the customer can see; the container's outline says where it ends. */}
      {viewOpen && (
        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-surface-warm px-2.5 py-0.5 text-accent text-[length:var(--fs-tag)] font-medium">
          <Icon path={EYE_ICON} className="w-3.5 h-3.5" />
          Visible to customer
        </span>
      )}
      <Tooltip
        content={viewOpen ? 'The customer can see this section. Click to stop sharing.' : 'Show this section to the customer'}
        placement="bottom"
      >
        <Button
          variant={viewOpen ? 'primary' : 'secondary'}
          compact
          onClick={onToggle}
          aria-pressed={viewOpen}
          className={viewOpen ? '' : '!border-transparent !shadow-none !bg-[var(--customer-view-bg)] !text-[var(--customer-view-fg)] enabled:hover:!bg-[var(--customer-view-bg-hover)]'}
        >
          {viewOpen && (
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-[var(--radius-pill)] bg-accent-on opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-[var(--radius-pill)] bg-accent-on" />
            </span>
          )}
          <Icon path={EYE_ICON} className="w-4 h-4" />
          {viewOpen ? 'Showing to customer' : 'Customer view'}
        </Button>
      </Tooltip>
    </>
  );
}
