import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { CHECK } from '../../assets/icons';

// Pieces shared by the two card grids that present a plan: the Recommended-offers cards (new-connection
// steps) and the Plan & Add-ons plan cards (PostpaidPlanStep). One definition, so the two stay alike.

/** The selectable-card states, one definition for every card grid that uses them (offers, plans, numbers). */
export const CARD_SELECTED = 'card-selected';
export const CARD_IDLE = 'card-idle';
/** A card the app singles out (the Recommended offer, a Popular plan): blue border, flat soft blue wash (red is kept for the selected card). */
export const CARD_HIGHLIGHT = 'card-highlight';

/**
 * The price figure of the plan or pack the agent has chosen ("Monthly plan QAR 145", "Starter pack QAR 50"), on the selected-card highlight
 * (CARD_SELECTED), not on a white card: the same look as the selected plan card it came from. One definition for every step that restates the
 * chosen plan or pack.
 */
export function SelectedPlanFigure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={`card px-4 py-2.5 text-right ${CARD_SELECTED}`}>
      <p className="text-muted text-[length:var(--fs-tag)] caps-strong">{label}</p>
      <p className="text-fg">{children}</p>
    </div>
  );
}

/** The faint concentric circles at the bottom-right of a selected card, behind its content (the card needs `isolate`). Clipped to the card's own rounded corners. */
export function SelectedCardTexture() {
  return (
    <span aria-hidden="true" className="card-art-layer">
      <svg viewBox="0 0 120 120" className="card-art-mark">
        <circle cx="70" cy="70" r="50" fill="var(--accent)" fillOpacity="0.06" />
        <circle cx="90" cy="90" r="34" fill="var(--accent)" fillOpacity="0.06" />
      </svg>
    </span>
  );
}



/**
 * The selected mark: a red circle with a tick on the card's top-right corner. Put it inside a `relative` card, only while it is selected.
 * Styled by `.card-tick` (src/index.css). The one selected mark for every selectable card in the app (with CARD_SELECTED's red border and warm fill); the whole card is the control, so no card has its own Select button.
 */
export function SelectedTick() {
  return (
    <span aria-hidden className="card-tick">
      <Icon path={CHECK} className="size-4 " strokeWidth={3} />
    </span>
  );
}
