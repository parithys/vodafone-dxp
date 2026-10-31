import { useNavigate } from 'react-router-dom';
import { getAllRoutes } from '../../engines/configEngine';
import { LeadListView } from '../../modules/lead-management/LeadListView';
import { useCustomerContext } from '../../stores/customerContextStore';
import { Button } from '../../components/primitives/Button';
import { Icon } from '../../components/primitives/Icon';

const PLUS_ICON = 'M12 5v14 M5 12h14';
// Bidirectional arrows - porting a number in from another carrier is a
// swap, not a fresh connection, so it gets a distinct icon from the rest.
const SWAP_ICON = 'M8 3L4 7l4 4 M4 7h16 M16 21l4-4-4-4 M20 17H4';

// Resolved by screenId, not a hardcoded path - SCR-037 is filed under the
// sim-number-management module route in routes.json despite being the
// Mobile Postpaid wizard, so looking it up avoids baking in that quirk.
//
// Every genuinely blank-start "new customer" wizard belongs here (none of
// these read customerContextStore) - Prepaid and MNP Port-In were previously
// missing even though both are fully built. Pre-to-Post Migration and SIM
// Swap are deliberately NOT included: both act on a line/service the
// customer already has, so they're Customer 360 product actions, not new
// acquisitions.
const ACQUISITION_ACTIONS = [
  { label: 'New Postpaid Connection', screenId: 'SCR-037', icon: PLUS_ICON },
  { label: 'New Prepaid Connection', screenId: 'SCR-190', icon: PLUS_ICON },
  { label: 'New Fixed Line', screenId: 'SCR-043', icon: PLUS_ICON },
  { label: 'New FWA / 5G Home', screenId: 'SCR-077', icon: PLUS_ICON },
  // SCR-120, not SCR-121 - the wizard itself now requires a Postpaid/Prepaid
  // choice (module-hierarchy.json's "MNP guided process presents Postpaid/
  // Prepaid choice before data entry") before it'll accept data entry.
  { label: 'MNP Port-In', screenId: 'SCR-120', icon: SWAP_ICON },
];

// Sales = the lead/prospect pipeline (wraps the existing Lead Management
// screens unchanged) plus the entry point for acquiring a customer who
// doesn't exist yet. Clears the active-customer bridge before launching
// acquisition - these wizards must start blank even if the agent was just
// looking at a different customer's Customer 360.
export function SalesWorkspace() {
  const navigate = useNavigate();
  const clearActiveCustomer = useCustomerContext((s) => s.clearActiveCustomer);

  const startAcquisition = (screenId: string) => {
    const route = getAllRoutes().find((r) => r.screenId === screenId);
    if (!route) return;
    clearActiveCustomer();
    navigate(route.path);
  };

  return (
    <div>
      <div className="px-8 pt-8">
        <h2 className="text-[length:var(--fs-h5)] font-bold text-fg mb-1">Start a New Customer Acquisition</h2>
        <p className="text-fg-2 text-[length:var(--fs-body)] mb-4">Select an acquisition type to begin a new journey.</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {ACQUISITION_ACTIONS.map((action, index) => (
            <Button
              key={action.label}
              variant={index === 0 ? 'primary' : 'secondary'}
              compact
              className={index === 0 ? '' : '!bg-bg'}
              onClick={() => startAcquisition(action.screenId)}
            >
              <Icon path={action.icon} className={`w-4 h-4 ${index === 0 ? '' : 'text-muted'}`} />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      <LeadListView scope="all" />
    </div>
  );
}
