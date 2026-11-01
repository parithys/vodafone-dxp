import { useRef, type ReactNode } from 'react';
import type { WizardStep } from './guidedWizardTypes';
import { WizardFooter } from './WizardFooter';
import { WizardStepHeader } from './WizardStepHeader';
import { WizardStepPanel } from './WizardStepPanel';
import { WizardTitleBand } from './WizardTitleBand';

/**
 * A guided-journey step's page for a screen that is not itself a wizard (the Number Management Portal): the same title band, step
 * card with its heading and header action, and fixed action bar as GuidedActivationWizard, built from the same parts. The screen
 * says what is on the page; none of the layout, spacing or button placement is its own.
 *
 * `step` supplies the heading (label / heading / subheading) and the optional header action. `onNext` shows the footer's primary
 * button (Continue, with the chevron) enabled by `canProceed`; leave it out for a page with no next step.
 */
export function StandaloneStepPage({
  title,
  description,
  titleActions,
  step,
  onNext,
  canProceed = true,
  children,
}: {
  title: string;
  description?: ReactNode;
  /** The band's right-hand actions (Abandon Order), placed as in a journey. */
  titleActions?: { onAbandon: () => void };
  step: WizardStep;
  onNext?: () => void;
  canProceed?: boolean;
  children: ReactNode;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  return (
    <div className="flex-1 min-h-full flex flex-col">
      <WizardTitleBand
        title={title}
        titleAside={description ? <span className="text-on-dark-2 text-[length:var(--fs-body)]">{description}</span> : undefined}
        onAbandon={titleActions?.onAbandon}
        onRequestAbandon={titleActions?.onAbandon}
      />
      <WizardStepPanel bottomClass={onNext ? 'pb-24' : ''}>
        <WizardStepHeader
          currentStep={step}
          allowCustomerView={false}
          viewOpen={false}
          toggleCustomerView={() => {}}
          stepHeadingRef={headingRef}
          values={{}}
          setValue={() => {}}
        />
        {children}
        {onNext && (
          <WizardFooter
            fixedToViewport
            currentStep={step}
            currentIndex={0}
            // More than one step, so the primary button reads Continue (as on every journey's first page), never Save & Finish.
            stepCount={2}
            values={{}}
            isLocked={false}
            canProceed={canProceed}
            submitting={false}
            goBack={() => {}}
            goNext={async () => onNext()}
            setValue={() => {}}
            onAbandonStep={() => {}}
          />
        )}
      </WizardStepPanel>
    </div>
  );
}
