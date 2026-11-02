import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import { Tooltip } from '../../primitives/Tooltip';
import { EYE_ICON } from '../../../assets/icons';


/** The "Customer view" toggle (and its "Visible to customer" tag while sharing): the one button every journey screen and the completion page use. */
export function CustomerViewButton({ viewOpen, onToggle }: { viewOpen: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Says which content the customer can see; the container's outline says where it ends. */}
      {viewOpen && (
        <span className="tag-warm">
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
              <span className="ping-ring" />
              <span className="relative inline-flex dot bg-accent-on" />
            </span>
          )}
          <Icon path={EYE_ICON} className="w-4 h-4" />
          {viewOpen ? 'Showing to customer' : 'Customer view'}
        </Button>
      </Tooltip>
    </>
  );
}
