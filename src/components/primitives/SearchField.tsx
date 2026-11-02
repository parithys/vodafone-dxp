import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { Icon } from './Icon';
import { CLEAR_ICON, SEARCH_ICON } from '../../assets/icons';


interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Leaves out the leading search icon: a dropdown field (company, Kahramaa / Vodafone ID) is a Select that takes typing, not a search box. */
  hideIcon?: boolean;
  /** Shows a clear (x) button while there is text. */
  onClear?: () => void;
  /** Classes for the wrapper (width, margin). The field itself is never restyled per page. */
  wrapperClassName?: string;
  wrapperRef?: Ref<HTMLDivElement>;
  /** Anything that hangs off the field, e.g. a results dropdown positioned against the wrapper. */
  children?: ReactNode;
}

/**
 * The one search / lookup text field, taken from the Customer Search page: leading search icon,
 * rounded field border that fills darker once it has text, body-lg text, and a clear button.
 * Every search box in the app uses this, so they all look and behave the same.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { onClear, hideIcon = false, wrapperClassName = '', wrapperRef, children, className = '', value, ...rest },
  ref
) {
  const filled = value !== undefined && value !== null && String(value) !== '';
  return (
    <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
      {!hideIcon && (
        <span className={`absolute left-3 center-y pointer-events-none ${rest.disabled ? 'text-[var(--field-label-disabled)]' : 'text-muted'}`}>
          <Icon path={SEARCH_ICON} className="w-4.5 h-4.5" />
        </span>
      )}
      <input
        ref={ref}
        type="text"
        value={value}
        className={`form-control form-control-search ${hideIcon ? 'pl-3' : 'pl-10'} ${rest.disabled ? 'form-control-default' : filled ? 'form-control-filled' : 'form-control-default'} ${className}`}
        {...rest}
        // A dropdown-style field (company, Kahramaa / Vodafone ID) shows no placeholder; a real search box keeps its hint.
        placeholder={rest.role === 'combobox' ? undefined : rest.placeholder}
      />
      {onClear && filled && !rest.disabled && (
        <button type="button" onClick={onClear} aria-label="Clear search" className="field-clear-btn">
          <Icon path={CLEAR_ICON} className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  );
});
