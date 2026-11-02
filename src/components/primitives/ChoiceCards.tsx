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
  success: { card: 'choice-tone-success', fill: 'bg-[var(--success-solid)] text-on-dark' },
  warn: { card: 'choice-tone-warn', fill: 'bg-[var(--warn)] text-fg' },
  danger: { card: 'choice-tone-danger', fill: 'bg-[var(--danger-solid)] text-on-dark' },
  neutral: { card: 'choice-tone-neutral', fill: 'bg-[var(--muted)] text-on-dark' },
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
              className={`choice-option ${
                selected ? (t.tone ? TONE[t.tone].card : `${CARD_SELECTED} text-[var(--field-card-selected)]`) : `${CARD_IDLE} text-fg`
              }`}
            >
              {selected && <SelectedTick />}
              <span className={`option-glyph ${selected ? (t.tone ? TONE[t.tone].fill : 'glyph-chosen') : 'icon-tint'}`}>
                <Icon path={t.icon} className="size-6 " />
              </span>
              <span className="text-[length:var(--fs-caption)] font-bold text-center">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
