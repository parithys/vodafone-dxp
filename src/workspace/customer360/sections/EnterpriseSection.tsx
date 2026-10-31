import type { ActiveCustomerSummary } from '../../../stores/customerContextStore';
import { ProductActionGroups, type ProductActionGroup } from '../ProductActionGroups';

// Account Setup (SCR-007) is the one real enterprise screen in the catalogue
// today - it manages the account structure the other five product lines
// would eventually sit on top of. They're listed as requested by the
// taxonomy but honestly marked not-yet-built.
const GROUPS: ProductActionGroup[] = [
  {
    title: 'Enterprise Services',
    actions: [
      { label: 'Mobile Enterprise', description: 'Manage bulk mobile lines and plans for a business account.' },
      { label: 'IoT', description: "Provision SIM-connected IoT devices under the customer's enterprise account." },
      { label: 'Connectivity', description: 'Set up dedicated business internet or leased-line connectivity.' },
      { label: 'Business Fibre', description: 'Activate fibre broadband for a business premises, separate from consumer fibre plans.' },
      { label: 'Managed Services', description: 'Configure managed IT/network services bundled under the enterprise account.' },
      { label: 'Account Setup', description: 'Create the enterprise account structure - parent/sub-accounts, billing hierarchy - before any product lines are added.', screenId: 'SCR-007' },
    ],
  },
];

export function EnterpriseSection({ customer }: { customer: ActiveCustomerSummary }) {
  return <ProductActionGroups groups={GROUPS} customer={customer} />;
}
