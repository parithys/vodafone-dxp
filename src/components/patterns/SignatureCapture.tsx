import { SignaturePad } from '../primitives/SignaturePad';

/**
 * The standard signature control, for every journey that captures a signature: a static "Please Sign" label and the
 * signing canvas always on screen below it, with Clear and Save. The pad is disabled until a precondition (e.g. agreeing
 * to the terms) is met, and goes back to disabled - discarding anything drawn - if that is withdrawn. Save hands the
 * signature (a PNG data URL) to `onSave`.
 */
export function SignatureCapture({
  onSave,
  label = 'Please Sign',
  disabled = false,
}: {
  onSave: (dataUrl: string) => void;
  label?: string;
  /** Keeps the pad disabled until a precondition (e.g. agreeing to the terms) is met. */
  disabled?: boolean;
}) {
  return (
    <div className="mt-3">
      <p className={`mb-2 font-bold text-[length:var(--fs-body)] ${disabled ? 'text-fg-2' : 'text-fg'}`}>{label}</p>
      {/* key: switching between disabled and enabled remounts the pad, which discards anything drawn. */}
      <SignaturePad key={String(disabled)} doneLabel="Save" disabled={disabled} onDone={onSave} />
    </div>
  );
}
