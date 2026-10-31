import { CARD_IDLE, CARD_SELECTED, SelectedTick, SelectedCardTexture } from '../primitives/offerCardParts';

/** One choice in the Eligible Discounts tab, on the shared selectable-card standard. */
export function DiscountCard({ title, description, value, selected, onToggle }: { title: string; description?: string; value: string; selected: boolean; onToggle: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`relative isolate flex flex-col gap-3 rounded-[var(--radius-card)] border p-5 cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
        selected ? CARD_SELECTED : CARD_IDLE
      }`}
    >
      {selected && <SelectedCardTexture />}
      {selected && <SelectedTick />}
      {/* Name on the left, the discount on the right, on one row. */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-fg font-bold text-[length:var(--fs-h5)] leading-snug">{title}</p>
        <p className={`shrink-0 font-bold text-[length:var(--fs-h5)] ${value === '-' ? 'text-muted' : 'text-success'}`}>{value}</p>
      </div>
      {description && <p className="text-fg-2 text-[length:var(--fs-caption)]">{description}</p>}
    </div>
  );
}
