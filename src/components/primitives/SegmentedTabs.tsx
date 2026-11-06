import type { KeyboardEvent } from 'react';

export interface SegmentedTabItem<K extends string = string> {
  key: K;
  label: string;
  /** A count shown in a small badge after the label. */
  count?: number;
}

/**
 * The tab switcher for content-level navigation or a filter of the list below. It draws exactly as TabStrip does - the one underline tab
 * design (labels on a thin rule, the selected one in the accent colour, bold, with an accent underline) - so every tab in the app looks
 * the same at any depth; the two components differ only in intent (see TabLevel.tsx).
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
      className={`tab-strip ${className}`}
    >
      {items.map(({ key, label: text, count }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          tabIndex={active === key ? 0 : -1}
          onClick={() => onChange(key)}
          className={`tab ${active === key ? 'tab-active' : ''}`}
        >
          {text}
          {count !== undefined && (
            <span className="tab-count">{count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
