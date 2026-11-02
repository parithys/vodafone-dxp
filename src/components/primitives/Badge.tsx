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
  | 'danger-solid'
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
// Each variant is a semantic class in src/ui-components.css (.badge-success, .badge-tag-blue ...), which holds its colours and the reasons for them.
const variantClasses: Record<BadgeVariant, string> = {
  'outlined-red': 'badge-outlined-red',
  'filled-neutral': 'badge-filled-neutral',
  success: 'badge-success',
  'success-solid': 'badge-success-solid',
  warning: 'badge-warning',
  danger: 'badge-danger',
  'danger-solid': 'badge-danger-solid',
  info: 'badge-info',
  accent: 'badge-accent',
  'tag-blue': 'badge-tag-blue',
  'tag-amber': 'badge-tag-amber',
  'tag-green': 'badge-tag-green',
  'tag-violet': 'badge-tag-violet',
  'tag-red': 'badge-tag-red',
  'tag-primary': 'badge-tag-primary',
};

// Takes the span's own props and ref, so a Tooltip can wrap it (hover, focus and aria-describedby land on the pill).
export function Badge({ variant = 'filled-neutral', children, className = '', ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={`badge ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
