import { useEffect } from 'react';
import { canViewCustomerSegment } from '../../../engines/agentPrivilegeEngine';
import { usePersonaStore } from '../../../stores/personaStore';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { checkPassportOwner, type PassportCheck } from '../passportToQidModel';

/**
 * Checks the typed MSISDN and Passport against the records as they are typed: the line must belong to a customer on file and the Passport must be
 * on file under that same customer. The verdict goes to the wizard (it gates Continue) and is read out under the fields.
 */
export function PassportOwnerCheck({ msisdn, passportNumber, result, onResult }: { msisdn: string; passportNumber: string; result: PassportCheck | undefined; onResult: (r: PassportCheck | undefined) => void }) {
  useEffect(() => {
    if (!msisdn || !passportNumber) {
      onResult(undefined);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const [customers, documents, assets, accounts] = await Promise.all([
        mockDataEngine.list<{ customerId: string; name: string; dob: string; nationality: string; phone?: string }>('customers'),
        mockDataEngine.list<{ identityDocumentId?: string; customerId: string; documentType: string; documentNumber: string }>('identity-documents'),
        mockDataEngine.list<{ serviceId?: string; accountId?: string }>('installed-assets'),
        mockDataEngine.list<{ accountId: string; customerId: string }>('accounts'),
      ]);
      const segmentOf = new Map(customers.map((c) => [c.customerId, (c as { segment?: string }).segment]));
      const canView = (customerId: string) => canViewCustomerSegment(usePersonaStore.getState().activePersonaId, segmentOf.get(customerId));
      if (!cancelled) onResult(checkPassportOwner({ msisdn, passportNumber }, { customers, documents, assets, accounts }, canView));
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msisdn, passportNumber]);
  if (!result) return null;
  return result.ok ? (
    <p role="status" className="text-success text-[length:var(--fs-caption)] col-span-2">
      Passport {result.owner.passportNumber} is on file for {result.owner.name} ({result.owner.customerId}), the owner of this line.
    </p>
  ) : (
    <p role="alert" className="text-danger text-[length:var(--fs-caption)] col-span-2">
      {result.message}
    </p>
  );
}
