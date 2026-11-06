import type { KeyboardEvent } from 'react';

export interface TabStripItem<K extends string = string> {
  key: K;
  label: string;
  /** A count shown in a small badge after the label (red on the selected tab, grey on the others). */
  count?: number;
}

/**
 * The horizontal tab strip - the app's original underline tab bar: labels in a row on a thin rule, the selected one in the
 * accent colour and bold with an accent underline, the others charcoal and regular. The rule is --tab-line-w and the selected underline --tab-active-w (thicker); the rule is an inset shadow on the strip (not a border), so
 * the scroll container does not clip the selected underline that sits on it. Colours are design-system
 * tokens only (accent, fg, and --tab-line-color for the rule, which is --field-card-border). Use it for
 * NAVIGATION and CONTENT tabs - tabs that switch the section or view shown below. Tabs that only FILTER the same data use
 * SegmentedTabs, which draws the same underline tab.
 *
 * It looks the same at every depth, inside a tab panel included (see TabLevel.tsx).
 *
 * Keyboard and semantics match SegmentedTabs: arrows / Home / End move between tabs and select them, only the selected tab
 * is in the Tab order (WAI-ARIA tabs pattern), and the strip scrolls sideways instead of wrapping.
 */
export function TabStrip<K extends string>({
  items,
  active,
  onChange,
  label,
  className = '',
}: {
  items: TabStripItem<K>[];
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
      {items.map(({ key, label: text, count }) => {
        const selected = active === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(key)}
            className={`tab ${selected ? 'tab-active' : ''}`}
          >
            {text}
            {count !== undefined && (
              <span className="tab-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
