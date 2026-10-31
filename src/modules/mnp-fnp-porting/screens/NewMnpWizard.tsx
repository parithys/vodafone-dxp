import { useSearchParams } from 'react-router-dom';
import { NewConnectionWizard } from '../../new-connection/NewConnectionWizard';

// SCR-121-134 - MNP port-in is not a journey of its own: it is New Connection with MNP as the chosen product. Customer
// Identification comes first and the MNP steps (mnpSteps.tsx) continue in the same wizard. The Postpaid/Prepaid choice that
// SCR-120 used to gate the wizard with is made on the product step now; a link that already names it (`?type=postpaid|prepaid`)
// starts with it chosen.
//
// Evidence behind the steps (kept from the standalone wizard):
//
// Postpaid (UJ-069 "MNP Postpaid Port-In (Desktop, Other Operator to Vodafone)," high confidence): Contact -> Address -> Billing -> SIM
// Serial -> Plan (Bill Limit) -> Donor Details -> Donor Attachment -> CAF -> Activity -> Submit.
//
// Prepaid (UJ-010 "MNP Prepaid," module-hierarchy's "MNP prepaid port-in (tablet)"): Contact -> Address -> SIM Serial -> Plan (prepaid
// pack + discount, VAL-337) -> Donor Details -> Donor Attachment -> CAF (BR-233 balance-forfeiture declaration + module-hierarchy's
// "CAF form dynamically binds Qatari ID/Passport number field for prepaid subscribers") -> Activity. No Billing/Bill Limit step -
// prepaid carries no credit limit or bill cycle (BR-002/BR-005). VAL-332-335's Donor Details fields are shared across both.
//
// UJ-069 itself (a Consumer/HRN case) ends with Status Pending, not auto-completed like a direct activation, since a real port
// request depends on the donor operator's response. Postpaid B2B2C orders additionally route to manager approval, generalizing
// UJ-081/UJ-082; no B2B2C concept is evidenced for MNP prepaid, so the prepaid path ignores isB2B2C.
export function NewMnpWizard() {
  const [params] = useSearchParams();
  const raw = params.get('type');
  const type = raw === 'postpaid' || raw === 'prepaid' ? raw : undefined;
  // Without a type the product step stays on screen so the agent chooses the plan type being ported onto.
  return <NewConnectionWizard flow="new" title="MNP Port-In" initialProduct="mnp" initialValues={type ? { mnpType: type } : { mnpType: 'postpaid', mnpTypeUnchosen: true, productPreselected: false }} />;
}
