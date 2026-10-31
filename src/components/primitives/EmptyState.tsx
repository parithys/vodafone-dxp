import type { ReactNode } from 'react';
import { Icon } from './Icon';

/** A tray: the default picture of "nothing here". Callers may pass a path that fits their scenario. */
export const EMPTY_STATE_ICON = 'M3 13l3-8h12l3 8 M3 13v6h18v-6 M3 13h5a4 4 0 0 0 8 0h5';

/**
 * The one empty state: what a list, tab, table or panel shows when it has nothing to show. The picture, the spacing, the type and the
 * layout are fixed here; the words and the action are the scenario's own - say what is missing and, where there is something to do about it,
 * offer it.
 *
 *   <EmptyState title="No Numbers Reserved" message="No numbers have been reserved for this customer." />
 *   <EmptyState message="No orders match your search." action={<Button variant="secondary" onClick={clear}>Clear Filters</Button>} />
 *
 * `compact` for a state inside a card, a table or a narrow panel; the default for a state that fills a page or a tab.
 * Part of the Empty State capability (capabilities/EmptyState).
 */
export function EmptyState({
  title,
  message,
  icon = EMPTY_STATE_ICON,
  action,
  compact = false,
  className = '',
  role = 'status',
}: {
  /** What is missing, in a few words (Title Case). Optional: a short message alone is enough. */
  title?: string;
  /** The scenario's own sentence: why it is empty, or what happens next. */
  message?: ReactNode;
  /** SVG path (24px grid) for the picture. */
  icon?: string;
  /** The next step, when there is one: a Button, a link. */
  action?: ReactNode;
  compact?: boolean;
  className?: string;
  role?: 'status' | 'alert' | 'none';
}) {
  return (
    <div
      role={role === 'none' ? undefined : role}
      className={`flex flex-col items-center justify-center text-center ${compact ? 'gap-2 px-4 py-6' : 'gap-3 px-6 py-12'} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)] ${compact ? 'h-10 w-10' : 'h-14 w-14'}`}
      >
        <Icon path={icon} className={compact ? 'w-5 h-5' : 'w-7 h-7'} />
      </span>
      {title && <p className="text-fg font-semibold text-[length:var(--fs-body)]">{title}</p>}
      {message && <p className="max-w-md text-muted text-[length:var(--fs-body)]">{message}</p>}
      {action && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
