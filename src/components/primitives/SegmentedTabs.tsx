import type { KeyboardEvent } from 'react';

export interface SegmentedTabItem<K extends string = string> {
  key: K;
  label: string;
  /** A count shown in a small badge after the label. */
  count?: number;
}

/**
 * The pill tab switcher: a pale blue-grey track holding pill tabs, the selected one white and raised with a bold label.
 * It is the Level 2 tab: content-level or nested navigation (tabs inside a tab's content, a filter of the list below).
 * Level 1, page-level navigation, is TabStrip (the horizontal border / underline strip); see TabLevel.tsx. An underline is never used for
 * nested tabs, and TabStrip draws as this when it is found inside a tab panel.
 *
 * Keyboard: arrows / Home / End move between tabs and select them, and only the selected tab is in the Tab order
 * (the WAI-ARIA tabs pattern). The strip scrolls sideways instead of wrapping.
 */
export function SegmentedTabs<K extends string>({
  items,
  active,
  onChange,
  label,
  className = '',
}: {
  items: SegmentedTabItem<K>[];
  active: K | undefined;
  onChange: (key: K) => void;
  /** Accessible name of the strip. */
  label?: string;
  className?: string;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((t) => t.key === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].key);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-[var(--radius-card)] bg-[var(--icon-tile-bg)] p-1 ${className}`}
    >
      {items.map(({ key, label: text, count }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          tabIndex={active === key ? 0 : -1}
          onClick={() => onChange(key)}
          className={`flex shrink-0 items-center gap-2 rounded-[var(--radius-button)] px-5 py-2 text-[length:var(--fs-body)] whitespace-nowrap transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
            active === key ? 'bg-bg text-fg font-bold shadow-[var(--shadow-dash-card)]' : 'text-[var(--icon-tile-fg)] font-medium hover:text-fg'
          }`}
        >
          {text}
          {count !== undefined && (
            <span
              className={`inline-flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-pill)] px-1.5 text-[length:var(--fs-micro)] font-semibold ${
                active === key ? 'bg-accent text-accent-on' : 'bg-bg text-fg-2'
              }`}
            >
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
