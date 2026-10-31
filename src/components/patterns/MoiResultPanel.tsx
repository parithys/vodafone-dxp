import { idTypeLabel } from '../domain/QidInput';
import { identityFromMoi } from './guidedContactModel';
import { IdentityDetailsCard, identityFacts } from '../../capabilities/CustomerIdentification/IdentityDetailsCard';
import type { IdLookupValue } from './idLookupModel';

interface MoiResultPanelProps {
  moiResult: NonNullable<IdLookupValue['moiResult']>;
  idType?: IdLookupValue['idType'];
  /** The agent already chose the document type in this journey, so it is not repeated. */
  hideDocumentType?: boolean;
  /** The ID number that was looked up, listed (read-only) with the validated identity when given. */
  idNumber?: string;
  /** e.g. "MOI validated at 07/10/2026, 06:14:30". */
  statusText: string;
}

/*
 * The MOI-validated Identity Details for every journey that identifies a customer by ID but does not collect
 * contact details (Passport-to-QID, SIM Swap, Pre-to-Post, Prepaid ...): the same card, facts and MOI-validated
 * treatment as New Connection's Contact step, so the result looks the same wherever the capability is used.
 */
export function MoiResultPanel({ moiResult, idType, idNumber, hideDocumentType, statusText }: MoiResultPanelProps) {
  const identity = identityFromMoi(moiResult);
  return (
    <div className="pt-6 border-t border-border-soft">
      <IdentityDetailsCard
        status={statusText}
        facts={identityFacts(
          { ...identity, idNumber, idTypeLabel: idType ? idTypeLabel(idType) : '' },
          { showDocumentType: !hideDocumentType, idType }
        )}
      />
    </div>
  );
}
