import type { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** SVG path data, as for <Icon>. */
  icon: string;
  /** What the button does. Required: an icon alone is not a name. */
  label: string;
  /** `danger` turns the hover colour red, for remove/delete. */
  tone?: 'default' | 'danger';
  /** Draws the card border and fill (the kebab / "more actions" look). */
  bordered?: boolean;
  /** sm = compact glyph button inline with text; md = 36px control. */
  size?: 'sm' | 'md';
}

/**
 * The one icon-only button: a labelled, keyboard-reachable control with the app's focus ring and a 36px hit area (28px
 * `sm`). Use it for download / print / copy / remove / more-actions. For closing a dialog use CloseButton.
 */
export function IconButton({ icon, label, tone = 'default', bordered = false, size = 'md', className = '', type = 'button', ...rest }: IconButtonProps) {
  const box = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const hover = tone === 'danger' ? 'hover:text-danger' : 'hover:text-fg';
  const frame = bordered ? 'border border-[var(--field-card-border)] bg-bg' : '';
  return (
    <button
      type={type}
      aria-label={label}
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded-[var(--radius-button)] text-muted ${hover} ${frame} focus:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${className}`}
      {...rest}
    >
      <Icon path={icon} className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </button>
  );
}
