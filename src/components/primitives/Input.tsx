import type { InputHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: ReactNode;
  readOnly?: boolean;
  /**
   * Fixed content locked inside the field's left edge - currently the country
   * flag and dial code on PhoneNumberInput. NOT named `prefix`: React's
   * HTMLAttributes already declares an RDFa `prefix?: string`, so that name
   * collides and fails to typecheck.
   *
   * Providing this moves the border from the <input> onto a wrapper, because a
   * prefix has to sit inside the same outline as the text. Fields WITHOUT a
   * prefix keep the original markup untouched, so this cannot shift the other
   * ~60 inputs in the app.
   */
  leadingAddon?: ReactNode;
  /**
   * Fixed content locked inside the field's RIGHT edge - a status tick, a
   * unit, a small action. Same wrapper mechanics as leadingAddon (the border
   * moves onto a wrapper so the addon sits inside the outline), and the two
   * compose: a field may carry both.
   *
   * No divider rule, unlike leadingAddon: that divider separates a prefix the
   * user is reading BEFORE the value (a dial code), whereas a trailing status
   * belongs to the value it follows and a rule would read as a second field.
   */
  trailingAddon?: ReactNode;
}

// Field chrome (border/radius/state colors) per the light-mode textbox
// reference supplied 2026-09-15 - see the --field-* tokens in tokens.css.
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leadingAddon, trailingAddon, className = '', id, 'aria-describedby': ariaDescribedby, placeholder: _noPlaceholder, ...rest },
  ref
) {
  const autoId = useId();
  // On a touch device a numeric-only field opens the numeric keypad, not the full keyboard: a number input asks for it by its type
  // (decimal when its step allows fractions); any other field names it with inputMode.
  const fractional = rest.step === 'any' || (rest.step !== undefined && !Number.isInteger(Number(rest.step)));
  const keypad = rest.inputMode ?? (rest.type === 'number' ? (fractional ? 'decimal' : 'numeric') : undefined);
  const inputId = id ?? `input-${autoId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  // The error message is pointed at too, not just the helper. It replaces the
  // helper in the layout, so previously an invalid field announced no reason
  // at all - the text was on screen but referenced by nothing.
  const describedBy =
    [ariaDescribedby, error ? errorId : helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined;
  const isFilled = rest.value !== undefined && rest.value !== null && rest.value !== '';
  // readOnly is NOT disabled. A disabled input drops its text to
  // --field-label-disabled (#b2b2b2, about 2.3:1 on white), which is fine for
  // "this control is unavailable" and wrong for "this is registry data you
  // must read back to the customer". readOnly keeps --fg text and its value
  // stays selectable; the recessed --surface fill signals it cannot be typed
  // into.
  const isReadOnly = Boolean(rest.readOnly) && !rest.disabled;
  // 2026-09-28: readOnly fields must be as inert as disabled ones - not just
  // unable to accept a keystroke, but unfocusable, unselectable and
  // unclickable too. HTML readOnly alone doesn't get you there: the input can
  // still take focus on click, still shows a text cursor, and its value can
  // still be drag-selected. select-none stops the selection; the mousedown
  // handler below stops the focus (preventing the default on mousedown is the
  // standard way to block focus-on-click without reaching for `disabled`,
  // which would also drop the text to the greyed disabled colour - wrong for
  // registry data the agent still has to read, just not touch).
  const readOnlyClass = isReadOnly ? 'bg-surface cursor-default select-none' : 'bg-bg';
  const blockReadOnlyFocus = isReadOnly ? (e: MouseEvent<HTMLInputElement>) => e.preventDefault() : undefined;
  // OUT OF THE TAB ORDER, and no focus ring (2026-09-26).
  //
  // A read-only field used to take focus and draw the same pink ring an
  // editable one does - which is the ring announcing "type here" on a field
  // that will refuse every keystroke. Worse on the Contact step, where six
  // consecutive registry fields sat between the agent and the two they can
  // actually edit: eight tab presses to reach Email.
  //
  // Skipping them costs nothing in accessibility terms. tabindex=-1 removes a
  // control from SEQUENTIAL navigation only; the input keeps its role, name
  // and value in the accessibility tree, so a screen reader still reaches and
  // reads it in browse mode. `disabled` inputs are already unfocusable by
  // the browser, so this only changes the readOnly case.
  //
  // A caller can still opt back in by passing its own tabIndex, since `rest`
  // spreads after this.
  const focusClass = isReadOnly
    ? ''
    : 'focus-visible:border-[var(--field-focus-border)]! focus-visible:bg-[var(--field-focus-bg)] focus-visible:shadow-[var(--field-focus-ring)]';
  // No hover border on a read-only field: it cannot be edited, so the hover
  // highlight (which signals "this is interactive") would be misleading.
  // Disabled fields are already excluded by the `enabled:` variant.
  const hoverBorder = isReadOnly ? '' : ' enabled:hover:border-[var(--field-hover-border)]';
  const borderClass = error
    ? 'border-[var(--field-border-error)]'
    : isFilled && !isReadOnly
      ? `border-[var(--field-border-filled)]${hoverBorder}`
      : `border-[var(--field-border)]${hoverBorder}`;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className={`text-[length:var(--fs-label)] ${rest.disabled ? 'text-[var(--field-label-disabled)]' : 'text-fg'}`}>
          {label}
          {/* Required marker, per the 2026-09-24 reference, which asterisks
              "Identification Document Type *" and "ID Number *". This is the
              FIRST field in the app to use it: mandatory has until now been
              expressed only by the wizard disabling Continue via its step
              isValid, with nothing on the field itself. aria-hidden because
              the input carries aria-required, so a screen reader announces
              the state rather than reading a bare asterisk. */}
          {rest.required && (
            <span className="text-[var(--field-border-error)]" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}
      {leadingAddon || trailingAddon ? (
        // focus-within, not focus-visible: the outline belongs to the wrapper
        // now, but the thing being focused is the inner input.
        <div
          // bg set here, not via Tailwind's disabled: pseudo-class - that only
          // matches the element it is written on, and `disabled` sits on the
          // <input> inside this wrapper, not on this div.
          className={`relative flex items-center min-h-[var(--control-h-md)] rounded-[var(--field-radius)] border
            ${rest.disabled ? 'bg-[var(--field-bg-disabled)]' : isReadOnly ? 'bg-surface cursor-default' : 'bg-bg'}
            ${/* `enabled:` matches form controls only, so on this wrapper <div> the
                 hover border never fired - use plain hover (and none when disabled). */ ''}
            ${rest.disabled ? borderClass.replace(' enabled:hover:border-[var(--field-hover-border)]', '') : borderClass.replace('enabled:hover:', 'hover:')}
            ${isReadOnly ? '' : 'focus-within:border-[var(--field-focus-border)]! focus-within:bg-[var(--field-focus-bg)] focus-within:shadow-[var(--field-focus-ring)]'}
            ${rest.disabled ? 'border-[var(--field-border-disabled)]' : ''}`}
        >
          {leadingAddon && (
            <>
              <span className="flex items-center gap-2 self-stretch rounded-l-[calc(var(--field-radius)-1px)] bg-[var(--surface)] pl-3 pr-2 text-[length:var(--fs-body)] text-fg-2 shrink-0 select-none">
                {leadingAddon}
              </span>
              <span className="self-stretch my-2 w-px bg-[var(--field-border)] shrink-0" aria-hidden="true" />
            </>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-required={rest.required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`flex-1 min-w-0 bg-transparent px-3 py-2 text-[length:var(--fs-body)] text-[var(--color-field-text-filled)]
              focus:outline-none focus-visible:shadow-none disabled:text-[var(--field-label-disabled)]
              ${isReadOnly ? 'select-none' : ''}
              ${className}`}
            tabIndex={isReadOnly ? -1 : undefined}
            onMouseDown={blockReadOnlyFocus}
            {...rest}
            inputMode={keypad}
          />
          {trailingAddon && (
            <span className="flex items-center gap-2 pr-3 pl-2 shrink-0 select-none">{trailingAddon}</span>
          )}
        </div>
      ) : (
        <input
          ref={ref}
          id={inputId}
          aria-required={rest.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`rounded-[var(--field-radius)] border px-3 py-2 text-[length:var(--fs-body)] text-[var(--color-field-text-filled)]
            ${readOnlyClass}
            ${borderClass}
            focus:outline-none ${focusClass}
            disabled:border-[var(--field-border-disabled)] disabled:text-[var(--field-label-disabled)] disabled:bg-[var(--field-bg-disabled)]
            ${className}`}
          tabIndex={isReadOnly ? -1 : undefined}
          onMouseDown={blockReadOnlyFocus}
          {...rest}
          inputMode={keypad}
        />
      )}
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
});
