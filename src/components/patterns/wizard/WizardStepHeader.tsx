import type { RefObject } from 'react';
import type { WizardStep } from './guidedWizardTypes';
import { hasCustomerView } from './customerViewPolicy';
import { CustomerViewButton } from './CustomerViewButton';


export function WizardStepHeader({
  currentStep,
  allowCustomerView,
  viewOpen,
  toggleCustomerView,
  stepHeadingRef,
  values,
  setValue,
}: {
  currentStep: WizardStep | undefined;
  allowCustomerView: boolean | undefined;
  viewOpen: boolean;
  toggleCustomerView: () => void;
  stepHeadingRef: RefObject<HTMLHeadingElement | null>;
  /** For the step's own header action, when it has one. */
  values?: Record<string, unknown>;
  setValue?: (field: string, value: unknown) => void;
}) {
  const showCustomerView = allowCustomerView && hasCustomerView(currentStep?.key);
  const action = currentStep?.headerAction && values && setValue ? currentStep.headerAction({ values, setValue }) : null;
  // Title left; Customer view floats at the right (see below) and the title row leaves room for it.
  return (
    <>
      {/* Floats: a zero-height sticky strip at the top of the step panel, so Customer view (and the step's own header action)
          stay in reach however far the agent scrolls. It sits at the title row when the panel is at the top, inset from the top by the same 24px as from the right
          (items-start: the button hangs from the strip instead of being centred on its zero height). */}
      {(showCustomerView || action) && (
        <div className="pointer-events-none sticky top-6 z-[var(--z-raised)] flex h-0 items-start justify-end">
          <div className="pointer-events-auto flex items-center gap-3">
              {action}
              {showCustomerView && <CustomerViewButton viewOpen={viewOpen} onToggle={toggleCustomerView} />}
            </div>
        </div>
      )}
        <div className={`flex min-h-[39px] flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4 ${showCustomerView && action ? 'sm:pr-[26rem]' : showCustomerView || action ? 'sm:pr-48' : ''}`}>
          <div>
            {currentStep?.eyebrow && (
              <p className="text-[var(--tint-teal-fg)] text-[length:var(--fs-tag)] font-semibold uppercase tracking-wide mb-1">{currentStep.eyebrow}</p>
            )}
            <h2
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-[length:var(--fs-h4)] font-bold text-fg focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
            >
              {currentStep?.heading ?? currentStep?.label}
            </h2>
            {currentStep?.subheading && (
              <p className="text-fg-2 text-[length:var(--fs-body)] mt-1">{currentStep.subheading}</p>
            )}
          </div>
        </div>
    </>
  );
}
