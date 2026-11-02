import { Tooltip } from './Tooltip';
import { CLEAR_ICON } from '../../assets/icons';


/**
 * The one close (X) control for dialogs, drawers and panels - a 36px hit area with the app's focus ring - so every
 * surface closes the same way. Wrapped in a tooltip naming the action.
 */
export function CloseButton({ onClick, label = 'Close', className = '' }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <Tooltip content={label} placement="left">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`btn-close ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" size-5" aria-hidden="true">
          <path d={CLEAR_ICON} />
        </svg>
      </button>
    </Tooltip>
  );
}
