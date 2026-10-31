import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import type { WizardStep } from './guidedWizardTypes';

const CHEVRON_LEFT = 'M15 18l-6-6 6-6';
const CHEVRON_RIGHT = 'M9 18l6-6-6-6';

export function WizardFooter({
  fixedToViewport = false,
  hasSummaryAside = false,
  avoidBottomTray = false,
  currentStep,
  currentIndex,
  stepCount,
  values,
  isLocked,
  canProceed,
  submitting,
  goBack,
  goNext,
  setValue,
  onAbandonStep,
}: {
  fixedToViewport?: boolean;
  hasSummaryAside?: boolean;
  avoidBottomTray?: boolean;
  currentStep: WizardStep | undefined;
  currentIndex: number;
  stepCount: number;
  values: Record<string, unknown>;
  isLocked: boolean;
  canProceed: boolean;
  submitting: boolean;
  goBack: () => void;
  goNext: () => Promise<void>;
  setValue: (field: string, value: unknown) => void;
  onAbandonStep: (opts?: { hideKeepWorking?: boolean }) => void;
}) {
  const fixedPosition = avoidBottomTray ? 'bottom-20 lg:bottom-0' : 'bottom-0';

  return (
        <div className={fixedToViewport
          ? `fixed inset-x-0 ${fixedPosition} z-[var(--z-sticky-raised)] border-t border-border-soft bg-bg shadow-raised`
          : 'mt-6'
        }>
        <div className={`flex w-full items-center justify-between ${fixedToViewport ? `px-4 py-4 sm:px-8 ${hasSummaryAside ? 'lg:pr-[calc(var(--spacing)*96)]' : ''}` : ''}`}>
          <div className="flex items-center gap-3">
            {/* Locked (2026-09-28): Back disappears entirely alongside the
                rail going unclickable - "disable/remove Back navigation".
                currentIndex > 0 alone would still show it on Payment even
                though the rail behind it is frozen. */}
            {currentIndex > 0 && !isLocked && (
              <Button variant="secondary" onClick={goBack}>
                <Icon path={CHEVRON_LEFT} className="w-4 h-4" />
                Back
              </Button>
            )}
            {currentStep?.footerLeft?.({ values: values })}
          </div>
          {(() => {
            const defaultButton = (
              <Button variant="primary" onClick={goNext} disabled={!canProceed || submitting}>
                {submitting ? 'Submitting…' : currentIndex === stepCount - 1 ? 'Save & Finish' : 'Continue'}
                {!submitting && <Icon path={CHEVRON_RIGHT} className="w-4 h-4" />}
              </Button>
            );
            return (
              currentStep?.primaryAction?.({
                values: values,
                setValue,
                goNext: () => void goNext(),
                abandon: onAbandonStep,
                defaultButton,
              }) ?? defaultButton
            );
          })()}
        </div>
        </div>
  );
}
