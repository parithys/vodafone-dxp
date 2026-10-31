import type { ReactNode } from 'react';
import { Button } from '../../primitives/Button';

/** Title row (title + Save as Draft / Abandon Order), the fixed customer, and the pop-up-blocked notice. */
export function WizardTitleBand({
  title,
  titleAside,
  titleAction,
  popupBlocked,
  onSaveExit,
  saveHidden = false,
  onAbandon,
  abandonHidden,
  onRequestSaveExit,
  onRequestAbandon,
}: {
  title: string;
  titleAside?: ReactNode;
  /** Optional page-specific control shown before the shared draft and abandon actions. */
  titleAction?: ReactNode;
  popupBlocked: boolean;
  onSaveExit: (() => void) | undefined;
  /** The current step does not offer Save as Draft (see WizardStep.canSaveDraft). */
  saveHidden?: boolean;
  onAbandon: (() => void) | undefined;
  abandonHidden: boolean;
  onRequestSaveExit: () => void;
  onRequestAbandon: () => void;
}) {
  // Save as Draft and Abandon Order sit in the page's title row, at the right.
  const exitLinks = (
    <>
              {/* "Save as Draft" (2026-09-28) - distinct from Abandon: this
                  keeps the draft for later resumption rather than deleting
                  it. No confirmation modal, unlike Abandon - it is not
                  destructive, so it should not carry the same weight. Stays
                  available even once locked: a signed-but-unpaid order is
                  exactly the kind of thing an agent needs to be able to set
                  aside and come back to. */}
              {onSaveExit && !saveHidden && (
                <Button
                  variant="secondary"
                  compact
                  onClick={onRequestSaveExit}
                >
                  Save as Draft
                </Button>
              )}
              {/* "Abandon Order" - removed 2026-09-26, restored 2026-09-27 on
                  direction. A ghost (tertiary) button as of 2026-10-04, with Save as Draft as
                  the secondary button; neither is primary, so neither competes with Continue. Confirmed before it fires, because it discards
                  everything the agent has entered. Hidden from hideAbandonFrom
                  onward (2026-09-28) - see that prop's own note. */}
              {onAbandon && !abandonHidden && (
                <Button
                  variant="secondary"
                  compact
                  onClick={onRequestAbandon}
                >
                  Abandon Order
                </Button>
              )}
    </>
  );

  // The secondary buttons here take the light page-tint fill (white on hover), like the buttons inside a card or header.
  // Title area: carries the page's own padding and a bottom border, so the step rail below it can sit flush against the left edge.
  return (
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-6 bg-[var(--title-band-bg)] text-on-dark [--btn-secondary-fill:var(--icon-tile-bg)] [--btn-secondary-hover:var(--bg)] border-b border-[var(--field-card-border)]">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <h1 className="text-[length:var(--fs-h4)] font-bold text-on-dark">{title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {titleAction}
            {exitLinks}
          </div>
        </div>
        {/* The fixed customer for this journey sits under the title. */}
        {titleAside && <div>{titleAside}</div>}
        {popupBlocked && (
          <p role="alert" className="text-on-dark text-[length:var(--fs-caption)] mt-3">
            The browser blocked the customer view pop-up. Allow pop-ups for this site and try again.
          </p>
        )}
      </div>
  );
}
