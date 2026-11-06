import { useEffect, useRef } from 'react';
import { EligibilityChecksList } from '../../../components/domain/EligibilityRows';
import { buildEligibilityRows } from '../../../components/domain/eligibilityRowsModel';
import type { EligibilityResult } from '../../../components/domain/eligibilityTypes';
import { ID_TYPE_NOTICE, idTypeApprovalOf } from './idTypeNotice';

/**
 * Says, on the page AFTER a Recommended Offer was selected, that the customer's ID type needs approval in the journey the offer opened. An offer moves straight on once its
 * journey is known, so the product page cannot carry the message; the first page the agent lands on does, once, and no later page repeats it. (A journey chosen with a footer
 * button stays on the product page, which shows the same message there: nothing to carry.) The ID type is judged only after the journey is identified - never at Contact.
 */
export function IdTypeApprovalNotice({ stepKey, values, setValue }: { stepKey: string; values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) {
  const flag = values[ID_TYPE_NOTICE];
  const set = useRef(setValue);
  useEffect(() => {
    set.current = setValue;
  });
  // The first page to show it claims it, so a later page does not show it again.
  useEffect(() => {
    if (flag === true) set.current(ID_TYPE_NOTICE, stepKey);
  }, [flag, stepKey]);
  const check = idTypeApprovalOf(values.eligibility as EligibilityResult | undefined);
  if (!check || (flag !== true && flag !== stepKey)) return null;
  return (
    <div className="mb-6">
      <EligibilityChecksList rows={buildEligibilityRows([check], false, undefined, 'postpaid', true, false)} />
    </div>
  );
}
