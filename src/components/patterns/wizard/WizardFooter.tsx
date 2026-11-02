import { Button } from '../../primitives/Button';
import { Icon } from '../../primitives/Icon';
import type { WizardStep } from './guidedWizardTypes';
import { CHEVRON_LEFT, CHEVRON_RIGHT } from '../../../assets/icons';


export function WizardFooter({
  fixedToViewport = false,
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
          ? `action-bar ${fixedPosition}`
          : 'mt-6'
        }>
        <div className={`row-between w-full ${fixedToViewport ? 'footer-bar-pad' : ''}`}>
          <div className="row">
            {/* Locked (2026-09-28): Back disappears entirely alongside the
                rail going unclickable - "disable/remove Back navigation".
                currentIndex > 0 alone would still show it on Payment even
                though the rail behind it is frozen. */}
            {currentIndex > 0 && !isLocked && (
              <Button variant="secondary" onClick={goBack}>
                <Icon path={CHEVRON_LEFT} className="size-4 " />
                Back
              </Button>
            )}
            {currentStep?.footerLeft?.({ values: values })}
          </div>
          {(() => {
            const defaultButton = (
              <Button variant="primary" onClick={goNext} disabled={!canProceed || submitting}>
                {submitting ? 'Submitting…' : currentIndex === stepCount - 1 ? 'Save & Finish' : 'Continue'}
                {!submitting && <Icon path={CHEVRON_RIGHT} className="size-4 " />}
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
