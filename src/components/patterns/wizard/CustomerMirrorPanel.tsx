import type { WizardStep } from './guidedWizardTypes';

/**
 * The customer's pop-up: the current step drawn in the same container as the agent's step panel - same
 * surface, border, radius, padding and heading styles - so the customer sees the design the agent sees. Only
 * the agent's controls are left out: no Customer view button, no "Visible to customer" label, no sharing
 * outline, no rail or footer. Read-only unless `interactive` (the CAF & Signature step).
 */
export function CustomerMirrorPanel({
  step,
  values,
  interactive,
  onSetValue,
}: {
  step: WizardStep | undefined;
  values: Record<string, unknown>;
  interactive: boolean;
  onSetValue: (field: string, value: unknown) => void;
}) {
  return (
    <div
      className={`w-full card p-6 ${interactive ? '' : '[&_button]:pointer-events-none [&_input]:pointer-events-none [&_select]:pointer-events-none [&_textarea]:pointer-events-none [&_a]:pointer-events-none select-none'}`}
    >
      <div className="mb-4">
        <h2 className="text-[length:var(--fs-h4)] font-bold text-fg">{step?.heading ?? step?.label}</h2>
        {step?.subheading && <p className="text-fg-2 text-[length:var(--fs-body)] mt-1">{step.subheading}</p>}
      </div>
      {step?.render({
        values,
        setValue: interactive ? onSetValue : () => {},
        goNext: () => {},
        goToStepKey: () => {},
        saveDraft: async () => {},
        saveAndExit: async () => {},
        requestAbandon: () => {},
      })}
    </div>
  );
}
