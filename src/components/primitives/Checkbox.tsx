import type { InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

// Checkbox, per the 2026-09-25 asset: an 18px tile that fills solid brand red
// with a white tick when checked, replacing the native control that tinted
// from --field-selected (#c09696) via `accent-[…]` and rendered a dark tick on
// dusty pink.
//
// The REAL <input> is still here, still focusable, still type="checkbox" - it
// is drawn rather than replaced. `appearance-none` strips the platform tile so
// the border/fill tokens apply, and the tick is an aria-hidden sibling toggled
// by `peer-checked`. Two things this buys over the alternatives:
//
// - Over `::after` content on the input: pseudo-elements on form controls are
//   only reliable once appearance is none, and their support has historically
//   varied. An SVG sibling has no such caveat.
// - Over a visually-hidden input plus a styled <span>: nothing here has to
//   re-implement focus, space-to-toggle, indeterminate, form association or
//   label click-through. The element the browser manages is the element the
//   agent interacts with.
//
// `type` is omitted from the props so a caller cannot turn this into a radio
// and get a square control with a tick.
//
// Sizing note: the tile does not scale with surrounding text. At 18px it
// matches the x-height of --fs-body without dominating the caption-sized rows
// (the credit-check acknowledgement, the ticket hashtags) that also use it.
export function Checkbox({ className = '', ...rest }: CheckboxProps) {
  return (
    // The wrapper takes the caller's className, which is what the existing
    // call sites use for alignment (`mt-1` where the label wraps to several
    // lines and the box has to sit on the first one).
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <input
        type="checkbox"
        className="peer appearance-none m-0 w-[var(--size-choice-box)] h-[var(--size-choice-box)] rounded-[var(--radius-checkbox)] border border-[var(--field-border)] bg-bg cursor-pointer
          checked:bg-[var(--field-checkbox-selected)] checked:border-[var(--field-checkbox-selected)]
          disabled:cursor-not-allowed disabled:border-[var(--field-border-disabled)] disabled:bg-[var(--field-bg-disabled)]
          focus:outline-none focus-visible:border-[var(--field-focus-border)]! focus-visible:shadow-[var(--field-focus-ring)]"
        {...rest}
      />
      {/* Sized and positioned over the tile, never hit-testable - a click that
          lands on the tick must reach the input underneath it, not stop on an
          SVG. Opacity rather than conditional rendering so the geometry is
          identical in both states. */}
      <svg
        viewBox="0 0 18 18"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-[var(--size-choice-box)] h-[var(--size-choice-box)] text-on-dark opacity-0 peer-checked:opacity-100"
      >
        <path
          d="M4.5 9.25l3 3 6-6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
