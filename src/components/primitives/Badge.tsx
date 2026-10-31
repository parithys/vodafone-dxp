// Real Vodafone TagPill per design-system.md §7 has 2 variants; broader status-pill
// usage (Order/Lead/Ticket lifecycle states) needs more - extended per
// component-catalogue.md §5 rather than replaced.
export type BadgeVariant =
  | 'outlined-red'
  | 'filled-neutral'
  | 'success'
  | 'success-solid'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent'
  | 'tag-blue'
  | 'tag-amber'
  | 'tag-green'
  | 'tag-violet'
  | 'tag-red'
  | 'tag-primary';

import type { ComponentPropsWithRef } from 'react';

interface BadgeProps extends ComponentPropsWithRef<'span'> {
  variant?: BadgeVariant;
}

// Status pills follow the 2026-09-24 reference: outlined rather than filled -
// a --bg interior, a 1px tinted border and a coloured label. That replaces the
// 12%-tint fills these carried before, which the reference does not use
// anywhere. `info` is new, for the reference's violet "Requires Approval"
// chip; no call site is rewired to it here, it is only made available.
//
// The leading status dot went with it - the reference's pills are label-only.
// It cost nothing in accessibility terms: the dot was aria-hidden and took
// its colour from the text, so the pill's own label was always what conveyed
// the status, not the colour.
//
// CORNER IS --radius-pill AGAIN as of 2026-09-27, reversing the 2026-09-24
// reference's own 32px -> 4px drop. That reference measured its pills at
// rx="3.5" (4px) specifically because it did NOT round the ends off fully -
// see the now-removed --radius-tag token's own comment, and
// VFQ_DXP_Design_Principles_Reference.md's matching note. Direction on
// 2026-09-27 is a single consistent pill radius across every pill-shaped
// control app-wide, badges included, which is a deliberate supersession of
// that reference's corner - not a rediscovery of the shape it replaced.
const variantClasses: Record<BadgeVariant, string> = {
  'outlined-red': 'border border-accent text-[var(--accent-text)] bg-transparent',
  'filled-neutral': 'bg-light-neutral text-fg-2',
  success: 'bg-bg border border-[var(--success-border)] text-success',
  // Solid green, white label, per the 2026-09-26 asset. A SEPARATE variant
  // rather than a change to `success` because the two are used for different
  // jobs: `success` is a status readout that appears many-at-a-time (the
  // eligibility report puts eight in a column, where eight solid green
  // blocks would shout), while this is a single confirmation of an action
  // that just succeeded. Changing the shared variant would have restyled all
  // fourteen call sites, including those columns.
  //
  // Its own --badge-success-solid token: --success is tuned as a TEXT and
  // border colour on a light surface, and is too light to carry white text
  // at this size.
  'success-solid': 'bg-[var(--badge-success-solid)] text-on-dark border border-transparent',
  warning: 'bg-bg border border-[var(--warn-border)] text-[var(--warn-text)]',
  danger: 'bg-bg border border-[var(--danger-border)] text-danger',
  info: 'bg-bg border border-[var(--info-border)] text-[var(--info)]',
  accent: 'bg-accent text-accent-on',
  // Soft-filled category tags (2026-10-01, number cards): RESERVED / STAR / FREE.
  // Tint + same-hue label, no border - they label a kind of thing rather than
  // report a status, so they sit quieter than the outlined status pills above.
  'tag-blue': 'bg-[var(--tag-blue-bg)] text-[var(--tag-blue-fg)] border border-transparent',
  'tag-amber': 'bg-[var(--tag-amber-bg)] text-[var(--warn-text)] border border-transparent',
  'tag-green': 'bg-tone-success text-success border border-transparent',
  'tag-violet': 'bg-tone-info text-[var(--info)] border border-transparent',
  'tag-red': 'bg-tone-accent text-accent border border-transparent',
  // The Primary marker (primary contact / primary line): solid brand plum with a white label, so it stands apart from every tinted tag.
  'tag-primary': 'bg-[var(--tag-primary-bg)] text-[var(--tag-primary-fg)] border border-transparent',
};

// Takes the span's own props and ref, so a Tooltip can wrap it (hover, focus and aria-describedby land on the pill).
export function Badge({ variant = 'filled-neutral', children, className = '', ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[length:var(--fs-tag)] font-medium whitespace-nowrap shrink-0 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
