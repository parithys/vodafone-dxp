import type { ReactNode } from 'react';
import { Icon } from './Icon';

// Pieces shared by the two card grids that present a plan: the Recommended-offers cards (new-connection
// steps) and the Plan & Add-ons plan cards (PostpaidPlanAddonsStep). One definition, so the two stay alike.

/** The selectable-card states, one definition for every card grid that uses them (offers, plans, numbers). */
export const CARD_SELECTED = 'border-[var(--field-card-selected)] bg-[linear-gradient(135deg,var(--surface-warm),var(--bg)_90%)] shadow-[var(--shadow-selected-ring)]';
export const CARD_IDLE =
  'border-[var(--field-card-border)] bg-bg hover:border-[var(--field-card-hover-border)] hover:ring-1 hover:ring-inset hover:ring-[var(--field-card-hover-border)] hover:bg-[var(--field-card-hover-bg)]';
/** A card the app singles out (the Recommended offer, a Popular plan): blue border, flat soft blue wash (red is kept for the selected card). */
export const CARD_HIGHLIGHT = 'border-[var(--signal-blue)] bg-[var(--tone-blue-bg-soft)] hover:shadow-[inset_0_0_0_1px_var(--signal-blue)]';

/**
 * The price figure of the plan or pack the agent has chosen ("Monthly plan QAR 145", "Starter pack QAR 50"), on the selected-card highlight
 * (CARD_SELECTED), not on a white card: the same look as the selected plan card it came from. One definition for every step that restates the
 * chosen plan or pack.
 */
export function SelectedPlanFigure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={`card px-4 py-2.5 text-right ${CARD_SELECTED}`}>
      <p className="text-muted text-[length:var(--fs-tag)] font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-fg">{children}</p>
    </div>
  );
}

/** The faint concentric circles at the bottom-right of a selected card, behind its content (the card needs `isolate`). Clipped to the card's own rounded corners. */
export function SelectedCardTexture() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[var(--z-below)] overflow-hidden rounded-[inherit]">
      <svg viewBox="0 0 120 120" className="absolute -bottom-10 -right-6 h-40 w-40">
        <circle cx="70" cy="70" r="50" fill="var(--accent)" fillOpacity="0.06" />
        <circle cx="90" cy="90" r="34" fill="var(--accent)" fillOpacity="0.06" />
      </svg>
    </span>
  );
}

export const ICON_DATA = 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2';
export const ICON_CALL = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z';
export const ICON_GIFT = 'M20 12v9H4v-9 M2 7h20v5H2z M12 21V7 M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z';
export const ICON_SPEED = 'M12 20a8 8 0 1 1 8-8 M12 12l4-4';
export const ICON_TV = 'M3 6h18v12H3z M8 21h8';
export const ICON_CARD = 'M3 6h18v12H3z M3 10h18 M6 15h4';
export const STAR_ICON = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z';


/** The plan fields a card draws its feature list from (public/mock-data/products.json). */
export interface OfferProduct {
  productId: string;
  name: string;
  dataAllowanceGB?: number | null;
  minutesAllowance?: string;
  speedTier?: string;
  speedTierMbps?: number;
  iptvIncluded?: boolean;
  benefits?: string[];
  features?: string[];
}

/** Up to four facts about a plan, read from its product record - never typed in per card. */
export function planFeatureRows(plan: OfferProduct | undefined): { icon: string; text: string }[] {
  const rows: { icon: string; text: string }[] = [];
  // A plan that lists its own facts shows exactly those, then its free extras.
  if (plan?.features?.length) {
    plan.features.forEach((f, i) => rows.push({ icon: i === 0 ? ICON_DATA : /minute|call/i.test(f) ? ICON_CALL : ICON_CARD, text: f }));
    (plan.benefits ?? []).forEach((b) => rows.push({ icon: ICON_GIFT, text: b }));
    return rows;
  }
  if (plan?.dataAllowanceGB) rows.push({ icon: ICON_DATA, text: `${plan.dataAllowanceGB} GB data` });
  if (plan?.minutesAllowance) {
    rows.push({ icon: ICON_CALL, text: /minute|call/i.test(plan.minutesAllowance) ? plan.minutesAllowance : `${plan.minutesAllowance} minutes` });
  }
  if (plan?.speedTierMbps) rows.push({ icon: ICON_SPEED, text: `${plan.speedTierMbps} Mbps fibre` });
  if (plan?.iptvIncluded) rows.push({ icon: ICON_TV, text: 'IPTV included' });
  (plan?.benefits ?? []).forEach((b) => rows.push({ icon: ICON_GIFT, text: b }));
  return rows.slice(0, 4);
}


/**
 * The selected mark: a red circle with a tick on the card's top-right corner. Put it inside a `relative` card, only while it is selected.
 * The one selected mark for every selectable card in the app (with CARD_SELECTED's red border and warm fill); the whole card is the control, so no card has its own Select button.
 */
export function SelectedTick() {
  return (
    <span aria-hidden className="absolute -right-2.5 -top-2.5 z-[var(--z-raised)] flex h-7 w-7 items-center justify-center rounded-[var(--radius-circle)] bg-accent text-accent-on shadow-[var(--shadow-selected-ring)]">
      <Icon path="M20 6L9 17l-5-5" className="w-4 h-4" strokeWidth={3} />
    </span>
  );
}
