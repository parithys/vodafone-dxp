import type { KeyboardEvent } from 'react';

export interface OptionToggleItem<K extends string = string> {
  key: K;
  label: string;
}

/**
 * The toggle: a small group of mutually exclusive options in one pill track, the chosen one filled in the accent colour - for choosing HOW something is set (an add-on's billing
 * frequency: Monthly / Weekly / One-Time), where the options are values of the same field. It is not navigation: tabs (TabStrip) switch what is shown below them.
 *
 * Radio-group semantics: one option is checked, only it is in the Tab order, and the arrow keys / Home / End move to an option and choose it.
 */
export function OptionToggle<K extends string>({ items, active, onChange, label, className = '' }: { items: OptionToggleItem<K>[]; active: K | undefined; onChange: (key: K) => void; label: string; className?: string }) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((t) => t.key === active);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].key);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className={`toggle-group ${className}`}>
      {items.map(({ key, label: text }) => {
        const checked = active === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked || (active === undefined && key === items[0].key) ? 0 : -1}
            onClick={() => onChange(key)}
            className={`toggle-option ${checked ? 'toggle-option-active' : ''}`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
