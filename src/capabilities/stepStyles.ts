export const CARD = 'rounded-[var(--radius-card)] border border-[var(--field-card-border)] bg-bg p-4';

// Selectable cards: geometry only. The colours come from the selected/unselected
// branch, because CARD's own border-border-soft + bg-bg would otherwise compete
// with the selected tokens (equal specificity, so stylesheet order decides).
export const CARD_SELECTABLE = 'relative rounded-[var(--radius-card)] border p-4';

// ---------------------------------------------------------------- Service journeys
