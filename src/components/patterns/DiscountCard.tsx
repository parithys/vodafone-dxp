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
      className={`option-card isolate gap-3 p-5 ${
        selected ? CARD_SELECTED : CARD_IDLE
      }`}
    >
      {selected && <SelectedCardTexture />}
      {selected && <SelectedTick />}
      {/* Name on the left, the discount on the right, on one row. */}
      <div className="split-top gap-3">
        <p className="title-lg leading-snug">{title}</p>
        <p className={`shrink-0 font-bold text-[length:var(--fs-h5)] ${value === '-' ? 'text-muted' : 'text-success'}`}>{value}</p>
      </div>
      {description && <p className="caption-secondary">{description}</p>}
    </div>
  );
}
