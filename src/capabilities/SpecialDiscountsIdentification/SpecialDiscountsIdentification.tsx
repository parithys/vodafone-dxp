import { SpecialDiscountsStep } from './SpecialDiscountsStep';
import type { SpecialDiscountsValue } from './specialDiscountsModel';
import type { CompanySelection } from './CompanySearchInput';

/**
 * SPECIAL DISCOUNTS IDENTIFICATION - the Special Discounts section of Mobile Postpaid Activation (the SSOT), as its own capability:
 * the agent chooses Consumer B2B2C, Retiree or MADA, supplies the evidence for it (company, ID number, Office ID scan or upload),
 * which is accepted as soon as it is captured (no OK / Cancel). It replaces Customer Verification's ID-type selection for the special-discounts journeys.
 *
 * Independent of Customer Verification and Customer Type: it has its own copy of every part, and always offers both
 * "Initiate scan" and "Upload document" on every device.
 */
export interface SpecialDiscountsIdentificationProps {
  value: SpecialDiscountsValue;
  onChange: (value: SpecialDiscountsValue) => void;
  /** Employer already on the MOI record, offered as the Consumer B2B2C starting point. */
  derivedCompany?: CompanySelection;
}

export function SpecialDiscountsIdentification({ value, onChange, derivedCompany }: SpecialDiscountsIdentificationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-fg font-semibold text-[length:var(--fs-h5)]">Special Discounts</h3>
      <SpecialDiscountsStep value={value} onChange={onChange} derivedCompany={derivedCompany} />
    </div>
  );
}
