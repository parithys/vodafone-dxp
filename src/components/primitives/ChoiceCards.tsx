import { Icon } from './Icon';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from './offerCardParts';


export interface ChoiceCard<K extends string = string> {
  key: K;
  label: string;
  /** SVG path (24px grid) for the tile. */
  icon: string;
  /** Colours the card when chosen by what it stands for (a status): green, amber, red or grey. Absent: the standard accent. */
  tone?: 'success' | 'warn' | 'danger' | 'neutral';
}

// Chosen-card colours per tone: border + ring, tinted fill, label, check mark and icon tile.
const TONE = {
  success: { card: 'border-[var(--success-solid)] bg-[var(--tone-success-bg)] shadow-[inset_0_0_0_1px_var(--success-solid)] text-[var(--success-solid)]', fill: 'bg-[var(--success-solid)] text-on-dark' },
  warn: { card: 'border-[var(--warn)] bg-[var(--tone-warn-bg)] shadow-[inset_0_0_0_1px_var(--warn)] text-[var(--warn-text)]', fill: 'bg-[var(--warn)] text-fg' },
  danger: { card: 'border-[var(--danger-solid)] bg-[var(--tone-danger-bg)] shadow-[inset_0_0_0_1px_var(--danger-solid)] text-[var(--danger-solid)]', fill: 'bg-[var(--danger-solid)] text-on-dark' },
  neutral: { card: 'border-[var(--muted)] bg-[var(--surface)] shadow-[inset_0_0_0_1px_var(--muted)] text-[var(--fg-2)]', fill: 'bg-[var(--muted)] text-on-dark' },
} as const;

/**
 * A single choice shown as a row of icon cards - the same card as the ID type choice: an icon tile over the label, a red
 * border, pink wash and tick mark on the chosen one. Use it instead of a row of radio buttons. `legend` names the group.
 */
export function ChoiceCards<K extends string>({
  legend,
  name,
  items,
  value,
  onChange,
}: {
  legend: string;
  /** Accessible name of the group (defaults to the legend). */
  name?: string;
  items: ChoiceCard<K>[];
  value: K | undefined;
  onChange: (key: K) => void;
}) {
  return (
    <div>
      <p className="text-fg-2 text-[length:var(--fs-label)] mb-2">{legend}</p>
      <div role="radiogroup" aria-label={name ?? legend} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-3">
        {items.map((t) => {
          const selected = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(t.key)}
              className={`relative flex flex-col items-center gap-2 rounded-[var(--radius-card)] border p-4 transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                selected ? (t.tone ? TONE[t.tone].card : `${CARD_SELECTED} text-[var(--field-card-selected)]`) : `${CARD_IDLE} text-fg`
              }`}
            >
              {selected && <SelectedTick />}
              <span className={`inline-flex p-2 rounded-[var(--radius-card)] ${selected ? (t.tone ? TONE[t.tone].fill : 'bg-[var(--field-card-selected)] text-on-dark') : 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]'}`}>
                <Icon path={t.icon} className="w-6 h-6" />
              </span>
              <span className="text-[length:var(--fs-caption)] font-bold text-center">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
