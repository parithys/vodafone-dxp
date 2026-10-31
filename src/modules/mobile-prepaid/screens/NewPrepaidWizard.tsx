import { NewConnectionWizard } from '../../new-connection/NewConnectionWizard';

// SCR-190: New Prepaid Activation is not a journey of its own. It is New Connection with Prepaid already chosen as the
// product: Customer Verification still comes first, the product step then moves on by itself (Back returns to it), and
// the prepaid steps - one journey for web and tablet - continue in the same wizard. The steps are in prepaidSteps.tsx; the
// requirement-to-implementation map (MPRA_001_*) and the open items are in
// reference/outputs/VFQ_DXP_Mobile_Prepaid_Requirements_Coverage_Reference.md.
export function NewPrepaidWizard() {
  return <NewConnectionWizard flow="new" title="New Prepaid Activation" initialProduct="prepaid" />;
}
