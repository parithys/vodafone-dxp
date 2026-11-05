import { useEffect, useRef } from 'react';
import { useEntityStore } from '../../stores/entityStore';
import type { FamilyLine } from '../../engines/familyPackage';
import type { GuidedContactValue } from '../../capabilities';
import type { EligibilityResult } from '../../components/domain/eligibilityTypes';
import { orphanFamilyLines, repairFamilyCustomer } from './repairFamilyCustomer';

/**
 * Invisible: when the customer's Family Package is held by their ID alone (no customer record), makes the record and links the package to it, then puts the
 * customer's id on the journey's eligibility result so the rest of the order - and the package's Customer 360 - find the same customer. Renders nothing.
 */
export function FamilyCustomerRepair({ lines, values, setValue }: { lines: readonly FamilyLine[]; values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) {
  const contact = values.contact as GuidedContactValue | undefined;
  const eligibility = values.eligibility as EligibilityResult | undefined;
  const tried = useRef<string | undefined>(undefined);
  const createRecord = useEntityStore((s) => s.createRecord);
  const updateRecord = useEntityStore((s) => s.updateRecord);
  useEffect(() => {
    const orphans = orphanFamilyLines(lines, contact?.idNumber);
    if (orphans.length === 0 || !eligibility || tried.current === contact?.idNumber) return;
    tried.current = contact?.idNumber;
    void repairFamilyCustomer({ contact, eligibility, orphanLines: orphans }, { createRecord, updateRecord }).then((customerId) => {
      if (customerId && !eligibility.customerId) setValue('eligibility', { ...eligibility, customerId });
    });
  }, [lines, eligibility, contact, createRecord, updateRecord, setValue]);
  return null;
}
