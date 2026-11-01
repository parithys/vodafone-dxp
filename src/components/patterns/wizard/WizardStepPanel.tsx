import type { KeyboardEventHandler, ReactNode, Ref } from 'react';

/**
 * The page body every guided step sits in: the step card (32px from the page edges, 24px padding) in the left column, with
 * anything that belongs under the card beneath it, and the Journey Summary column to its right. `bottomClass` leaves room
 * for the fixed action bar. Guided journeys and the Number Management Portal both lay their steps out with this, so the
 * card, its margins and the room for the action bar never differ between them.
 */
export function WizardStepPanel({
  panelRef,
  onKeyDown,
  cardClassName = '',
  bottomClass = 'pb-24',
  below,
  aside,
  children,
}: {
  panelRef?: Ref<HTMLDivElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  cardClassName?: string;
  bottomClass?: string;
  /** Under the card, in the same column (the below-panel slot, the small-screen summary accordion). */
  below?: ReactNode;
  /** The right-hand column (the Journey Summary). */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`flex-1 flex items-stretch ${bottomClass}`}>
      <div className="flex-1 min-w-0">
        <div ref={panelRef} className={`m-8 card p-6 ${cardClassName}`} onKeyDown={onKeyDown}>
          {children}
        </div>
        {below}
      </div>
      {aside}
    </div>
  );
}
