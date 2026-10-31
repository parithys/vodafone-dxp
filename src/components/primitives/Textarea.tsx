import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, className = '', id, 'aria-describedby': ariaDescribedby, placeholder: _noPlaceholder, ...rest }: TextareaProps) {
  // No placeholder / watermark text in any field: the label says what it is. (The prop is accepted so call sites need no change.)
  const autoId = useId();
  const textareaId = id ?? `textarea-${autoId}`;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;
  const describedBy = [ariaDescribedby, error ? errorId : helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined;
  const isFilled = rest.value !== undefined && rest.value !== null && rest.value !== '';
  const borderClass = error
    ? 'border-[var(--field-border-error)]'
    : isFilled
      ? 'border-[var(--field-border-filled)] enabled:hover:border-[var(--field-hover-border)]'
      : 'border-[var(--field-border)] enabled:hover:border-[var(--field-hover-border)]';
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className={`text-[length:var(--fs-label)] ${rest.disabled ? 'text-[var(--field-label-disabled)]' : 'text-fg'}`}>
          {label}
          {/* Same required marker as Input: aria-hidden, the textarea carries aria-required. */}
          {rest.required && (
            <span className="text-[var(--field-border-error)]" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={4}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={rest.required || undefined}
        className={`rounded-[var(--field-radius)] border px-3 py-2 text-[length:var(--fs-body)] text-[var(--color-field-text-filled)] bg-bg
          ${borderClass}
          focus:outline-none focus-visible:border-[var(--field-focus-border)]! focus-visible:bg-[var(--field-focus-bg)] focus-visible:shadow-[var(--field-focus-ring)]
          disabled:border-[var(--field-border-disabled)] disabled:text-[var(--field-label-disabled)] disabled:bg-[var(--field-bg-disabled)]
          ${className}`}
        {...rest}
      />
      {helperText && !error && (
        <span id={helperId} className="text-[length:var(--fs-caption)] text-muted">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" className="text-[length:var(--fs-caption)] text-[var(--field-border-error)]">
          {error}
        </span>
      )}
    </div>
  );
}
