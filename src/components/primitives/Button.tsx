import type { ButtonHTMLAttributes } from 'react';

// Real Vodafone Button per design-system.md §7 (5 variants). primary-rect/ghost-rect
// are the recommended fit for a form-heavy enterprise app (2px corners); the pill
// variants are editorial/marketing-oriented per component-catalogue.md §5 but kept
// available since the source does specify them.
// `secondary-rect` is a SIXTH variant with no §7 counterpart, added 2026-09-27.
// See SECONDARY_SURFACE below for what it is and when to reach for it instead
// of `ghost-rect`.
// The canonical variants are the first four. The legacy names after them stay valid (they alias to the same
// treatments) so older call sites keep compiling, but new code uses primary | secondary | tertiary | destructive.
//   primary      the red gradient call to action
//   secondary    white, grey border, bold - the default for every other button (Back, Cancel, View ...)
//   tertiary     a text link that performs an action: teal, bold, no box
//   destructive  irreversible / dangerous confirmations (cancel, reject, delete)
export type ButtonVariant =
  | 'primary' | 'secondary' | 'tertiary' | 'destructive'
  | 'primary-rect' | 'primary-pill' | 'ghost-rect' | 'glass-pill' | 'content-ghost-pill' | 'secondary-rect';
export type ButtonSize = 'sm' | 'md' | 'lg';

// The warm/secondary surface: colour only, no geometry. Exported because this
// treatment predates the variant and had spread to three call sites that
// CANNOT be a <Button> - two <Link>s (category chips, not-yet-built links) and
// an action tile whose shape is a two-line card on --radius-card, not a button.
// Those keep their own radius/padding and compose this for colour, so the
// palette lives in one place and a link can never drift from the button.
//
// Choosing between the two secondaries:
//   ghost-rect      - neutral, recedes. Cancel/Back/Close; the thing you press
//                     to NOT do the action. Transparent on --border.
//   secondary-rect  - warm, invites. A real action that simply isn't the
//                     page's primary one: quick actions, category chips.
//
// Colours per secondary-normal.svg / secondary-hover.svg (2026-09-27). Both
// assets are a 1px #E60000 stroke around a fill that is the ONLY thing which
// changes between states: white at rest, #FFF0F0 on hover. Every value already
// existed as a token, so nothing new was minted - `white` is --bg, `#FFF0F0` is
// --surface-warm, `#E60000` is --accent.
//
// Note this INVERTS the previous model. --surface-warm used to be the resting
// fill and the border did the hovering (transparent -> accent); now the border
// is accent in BOTH states and the fill does the work (--bg -> --surface-warm).
// The short-lived --surface-warm-border token existed only to be that resting
// border, so it was deleted with this change rather than left orphaned.
//
// Update 2026-10-01: border and label are the SAME red, --accent-secondary
// (#FF4D4D), per direction - red label, red outline, white fill. This
// supersedes the earlier --accent-hover and the 2026-09-27 --deep-red label.
// NOTE: #FF4D4D on white is about 3.3:1, under SC 1.4.3's 4.5:1 for 14px text
// (a deliberate trade for the requested colour; revisit if contrast is audited).
//
// Resting colour only - the hover is deliberately NOT bundled in, because the
// two element families need different selectors for it. `enabled:hover:` (what
// every other variant here uses, so a disabled button never shifts colour under
// the cursor) compiles to `:enabled`, which matches form controls only: on an
// <a> it silently never fires, so folding it in here would have left the links
// with no hover at all. Buttons add `enabled:hover:`, links add plain `hover:`.
export const SECONDARY_SURFACE =
  'border-[var(--accent-secondary)] bg-bg text-[var(--accent-secondary)]';

// The secondary BUTTON look: the page-tint fill with the standard grey border, bold and flat - no shadow - going white
// on hover (same look as the breadcrumb Back chip; since 2026-10-10, was white at rest). Defined once as the semantic
// class `.btn-secondary` in index.css (colour only), and shared by the Button variants below and the link-styled
// buttons that sit beside them (ProductLinePage's category chips, WorkspaceNotYetBuilt's links). The breadcrumb Back
// chip has its own `.breadcrumb-back`, so the two can be restyled independently. SECONDARY_SURFACE above is the
// OUTLINED look and stays for selectable cards and anything else that needs a visible edge.
export const SECONDARY_BUTTON_SURFACE = 'btn-secondary';

// The primary fill, standardised 2026-09-27: --accent-gradient, white label,
// no visible border. Exported for the same reason as SECONDARY_SURFACE - the
// selected state of every chip/toggle group uses this exact treatment and none
// of them is a <Button>, so the gradient lives in one place.
//
// `bg-[image:...]` and not `bg-[...]`: the value is a background-image. The
// `image:` hint is load-bearing - without it Tailwind resolves the bare var()
// to background-COLOR, which silently paints nothing for a gradient.
//
// Border is 1px TRANSPARENT rather than the specified `0px solid #e60000`.
// Visually identical - background-clip defaults to border-box, so the gradient
// paints straight through a transparent border, and the specified border is
// 0-width (invisible) either way. Keeping the 1px preserves the box-model
// parity documented below: at 0px a filled button is 2px shorter than
// ghost-rect and the two stop sitting level side by side.
//
// No glow or shadow on any button, at rest or on hover (2026-10-08).
// It lives here so every primary - Button, chips, the login button - glows identically.
export const PRIMARY_SURFACE =
  'border-transparent bg-[image:var(--accent-gradient)] text-accent-on !font-bold';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** sm = compact, md = default, lg = prominent (login, hero actions). `compact` is the older spelling of size="sm". */
  size?: ButtonSize;
  compact?: boolean;
}

// The look of every variant lives in src/ui-components.css as semantic classes (.btn, .btn-primary, .btn-secondary, .btn-tertiary, .btn-destructive,
// .btn-glass; sizes .btn-sm / .btn-md / .btn-lg), so a button reads `class="btn btn-primary btn-md"` and the utilities, tokens and hover / active /
// disabled states are written once, there. The comments that explained each choice (the transparent border that keeps a primary and a secondary the
// same height, the flat disabled fill, no glow, no colour shift on press) are kept with those rules.
const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  'primary-rect': 'btn-primary',
  'primary-pill': 'btn-primary btn-pill',
  // Back / Cancel and the actions beside them: white (page tint on a card), grey border, bold, flat.
  secondary: 'btn-secondary',
  'secondary-rect': 'btn-secondary',
  'ghost-rect': 'btn-secondary',
  'content-ghost-pill': 'btn-secondary btn-chip',
  'glass-pill': 'btn-glass',
  tertiary: 'btn-tertiary',
  destructive: 'btn-destructive',
};

export function Button({ variant = 'primary', size, compact, className = '', children, ...rest }: ButtonProps) {
  const resolved: ButtonSize = size ?? (compact ? 'sm' : 'md');
  return (
    <button
      type="button"
      // A text-link button (tertiary) has no box and sets its own text size, so it takes no size class.
      className={`btn ${variantClass[variant]} ${variant === 'tertiary' ? '' : `btn-${resolved}`} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
