import type { InputHTMLAttributes } from 'react';

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

// Radio, per the 2026-09-25 asset: an 18px circle that fills solid brand red
// with a white centre when checked, replacing the native control that tinted
// from --field-selected (#c09696) and drew a dark dot on dusty pink.
//
// The counterpart of Checkbox, and built the same way for the same reasons -
// see that file. The real <input> is still here, still focusable, still
// type="radio"; appearance-none strips the platform dot so the fill and
// border tokens apply, and the white centre is an aria-hidden sibling toggled
// by peer-checked.
//
// The centre is a ring rather than a dot: the asset shows a red disc with a
// white hole punched through it, which at 18px reads more clearly than a
// small dot on a red field - the white separates the fill from the mark
// instead of the mark having to out-contrast it.
//
// `type` is omitted from the props so a caller cannot turn this into a
// checkbox and get a round control with a checkbox's semantics. `name` still
// passes through, which is what groups a set of radios.
export function Radio({ className = '', ...rest }: RadioProps) {
  return (
    // The wrapper takes the caller's className, which is what the existing
    // call sites use for alignment (`mt-1` where the label wraps to several
    // lines and the control has to sit on the first one).
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <input
        type="radio"
        className="peer appearance-none m-0 w-[var(--size-choice-box)] h-[var(--size-choice-box)] rounded-[var(--radius-pill)] border border-[var(--field-border)] bg-bg cursor-pointer
          checked:bg-[var(--field-radio-selected)] checked:border-[var(--field-radio-selected)]
          disabled:cursor-not-allowed disabled:border-[var(--field-border-disabled)] disabled:bg-[var(--field-bg-disabled)]
          focus:outline-none focus-visible:border-[var(--field-focus-border)]! focus-visible:shadow-[var(--field-focus-ring)]"
        {...rest}
      />
      {/* Never hit-testable - a click landing on the centre must reach the
          input underneath it. Opacity rather than conditional rendering so the
          geometry is identical in both states. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto w-[6px] h-[6px] rounded-[var(--radius-pill)] bg-accent-on opacity-0 peer-checked:opacity-100 peer-disabled:bg-[var(--field-label-disabled)]"
      />
    </span>
  );
}
