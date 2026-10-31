import { Tooltip } from './Tooltip';

const CLOSE_PATH = 'M18 6L6 18 M6 6l12 12';

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
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-fg-2 hover:bg-[var(--icon-tile-bg)] hover:text-fg focus:outline-none focus-visible:shadow-[var(--focus-ring)] transition-colors ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <path d={CLOSE_PATH} />
        </svg>
      </button>
    </Tooltip>
  );
}
