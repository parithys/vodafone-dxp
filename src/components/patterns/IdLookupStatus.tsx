import { ValidationStatus, TechnicalFailure } from './ValidationStatus';
import { Button } from '../primitives/Button';
import { isoToDmy } from './idLookupModel';
import type { DuplicateCandidate } from './idLookupModel';
import type { IdLookupFailure } from './useIdLookup';

interface IdLookupStatusProps {
  loading: boolean;
  failure: IdLookupFailure | null;
  retrying: boolean;
  expiredNotice: boolean;
  duplicates: DuplicateCandidate[] | null;
  hasMoiResult: boolean;
  runMoiValidation: (opts?: { forceCustomerId?: string; retry?: boolean }) => Promise<void>;
}

export function IdLookupStatus({ loading, failure, retrying, expiredNotice, duplicates, hasMoiResult, runMoiValidation }: IdLookupStatusProps) {
  return (
    <>
      {/* ---- Validation status. Each state looks different (see ValidationStatus):
          technical failure = amber and unresolved, business result = red, pending
          = neutral, success = green. A technical failure never reads as "not found". */}
      {loading && !failure && !retrying && !hasMoiResult && (
        <ValidationStatus variant="pending" title="Validating the identity document…">
          Checking MOI and the customer records. Nothing is decided until this completes.
        </ValidationStatus>
      )}
      {(failure || retrying) && (
        <TechnicalFailure
          service={failure?.service ?? 'moi'}
          kind={failure?.kind ?? 'unexpected'}
          attempts={failure?.attempts ?? 0}
          retrying={retrying}
          onRetry={() => void runMoiValidation({ retry: true })}
          exhaustedHint="Retake the scan to read the document again, or use Save as Draft to resume later."
        />
      )}
      {expiredNotice && !hasMoiResult && (
        <TechnicalFailure
          service="moi"
          kind="expired"
          attempts={0}
          onRetry={() => void runMoiValidation()}
        />
      )}
      {duplicates && (
        <ValidationStatus variant="technical" tag="Needs a decision" title="More than one customer record matches this ID">
          <p>No customer has been selected automatically. Choose the record that belongs to this person, or ask Customer Data Management to merge the duplicates.</p>
          <ul className="mt-2 space-y-2">
            {duplicates.map((d) => (
              <li key={d.customerId} className="flex items-center justify-between gap-3 rounded-[var(--radius-button)] border border-border-soft bg-bg px-3 py-2">
                <span className="min-w-0">
                  <span className="block text-fg font-medium truncate">{d.name}</span>
                  <span className="block text-muted text-[length:var(--fs-caption)]">{d.customerId} - born {isoToDmy(d.dob)}</span>
                </span>
                <Button variant="secondary" compact onClick={() => void runMoiValidation({ forceCustomerId: d.customerId })}>
                  Use this record
                </Button>
              </li>
            ))}
          </ul>
        </ValidationStatus>
      )}
    </>
  );
}
