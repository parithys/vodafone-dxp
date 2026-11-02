import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';
import { Spinner } from '../primitives/Spinner';
import { describeFailure, failureReference, MAX_RETRIES, type FailureKind, type ServiceName } from '../../engines/serviceCall';
import { Button } from '../primitives/Button';
import { CHECK_ICON, CROSS, WARNING } from '../../assets/icons';

// The one panel every Customer Verification validation reports through, so the
// five situations an agent can be in look different at a glance and never get
// confused with each other:
//
//   success           green, tick            the check completed and passed
//   business-failure  red, cross             the system ANSWERED and the answer is no
//                                            (ID not found, retiree not confirmed ...)
//   technical         amber, warning         the system did NOT give a usable answer -
//                                            nothing is decided; retry or recover
//   pending           neutral, spinner       the check is in progress
//   retry             amber, spinner         a retry is in progress (attempt n of N)
//
// Colours come from the design tokens already used for those meanings
// (--success, --danger, --warn-*), not new ones.

export type ValidationVariant = 'success' | 'business-failure' | 'technical' | 'pending' | 'retry';


const STYLE: Record<ValidationVariant, { shell: string; icon: string; tag: string }> = {
  success: {
    shell: 'border-[var(--success-border)] bg-tone-success-soft',
    icon: 'text-success',
    tag: 'Validated',
  },
  'business-failure': {
    shell: 'border-[var(--danger-border)] bg-tone-danger-soft',
    icon: 'text-danger',
    tag: 'Not validated',
  },
  technical: {
    shell: 'border-[var(--warn-border)] bg-[var(--warn-bg)]',
    icon: 'text-[var(--warn-text)]',
    tag: 'System issue - unresolved',
  },
  pending: {
    shell: 'border-border bg-surface',
    icon: 'text-muted',
    tag: 'Validation pending',
  },
  retry: {
    shell: 'border-[var(--warn-border)] bg-[var(--warn-bg)]',
    icon: 'text-[var(--warn-text)]',
    tag: 'Retrying',
  },
};

export function ValidationStatus({
  variant,
  title,
  children,
  actions,
  reference,
  tag,
}: {
  variant: ValidationVariant;
  title: string;
  children?: ReactNode;
  /** Buttons / links offered for this state (Retry, a fallback ...). */
  actions?: ReactNode;
  /** A reference to quote when escalating. */
  reference?: string;
  /** Overrides the default small label above the title. */
  tag?: string;
}) {
  const s = STYLE[variant];
  const busy = variant === 'pending' || variant === 'retry';
  return (
    <div
      role={variant === 'technical' || variant === 'business-failure' ? 'alert' : 'status'}
      className={`card-frame p-4 flex gap-3 ${s.shell}`}
    >
      <span className={`mt-0.5 shrink-0 ${s.icon}`}>
        {busy ? (
          <Spinner size={20} label={title} />
        ) : (
          <Icon path={variant === 'success' ? CHECK_ICON : variant === 'business-failure' ? CROSS : WARNING} className="size-5 " />
        )}
      </span>
      <div className="min-w-0 space-y-1">
        <p className={`text-[length:var(--fs-micro)] caps-strong ${s.icon}`}>{tag ?? s.tag}</p>
        <p className="value-text">{title}</p>
        {children && <div className="text-secondary">{children}</div>}
        {reference && <p className="caption-muted">Reference: {reference}</p>}
        {actions && <div className="cluster gap-2 pt-2">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * A technical failure, with Retry while attempts remain and a controlled
 * recovery state once they are spent - never an endless retry loop.
 */
export function TechnicalFailure({
  service,
  kind,
  attempts,
  onRetry,
  retrying,
  exhaustedHint,
  extraActions,
}: {
  service: ServiceName;
  kind: FailureKind;
  /** Attempts made so far (the failed one included). */
  attempts: number;
  onRetry?: () => void;
  retrying?: boolean;
  /** What the agent can do once retries are spent (a defined fallback, or save & exit). */
  exhaustedHint?: ReactNode;
  extraActions?: ReactNode;
}) {
  const { title, message } = describeFailure(service, kind);
  const exhausted = attempts >= MAX_RETRIES;
  if (retrying) {
    return (
      <ValidationStatus variant="retry" title="Trying again…" tag={`Retrying - attempt ${Math.min(attempts + 1, MAX_RETRIES)} of ${MAX_RETRIES}`}>
        Nothing is decided until the check completes.
      </ValidationStatus>
    );
  }
  return (
    <ValidationStatus
      variant="technical"
      title={title}
      tag={exhausted ? 'System issue - needs follow-up' : kind === 'expired' ? 'Validation expired' : undefined}
      reference={exhausted ? failureReference(service, kind) : undefined}
      actions={
        <>
          {!exhausted && onRetry && (
            <Button variant="primary" compact onClick={onRetry}>
              {kind === 'expired' ? 'Validate again' : `Retry (${attempts} of ${MAX_RETRIES} used)`}
            </Button>
          )}
          {extraActions}
        </>
      }
    >
      <p>{message}</p>
      {exhausted && (
        <p className="mt-1">
          This did not succeed after {MAX_RETRIES} attempts, so retrying is paused to avoid repeated failures.{' '}
          {exhaustedHint ?? 'Use Save as Draft to resume later, or contact support and quote the reference below.'}
        </p>
      )}
    </ValidationStatus>
  );
}
