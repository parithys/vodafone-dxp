import { Link } from 'react-router-dom';
import { RESTRICTED_CUSTOMER_MESSAGE, RESTRICTED_CUSTOMER_TITLE } from '../../data/customerSegments';
import { Icon } from '../primitives/Icon';
import { LOCK } from '../../assets/icons';


/**
 * Shown INSTEAD of a customer when the signed-in role may not see their segment (Safwa, Safwa+, Royal). It carries no customer information: no name,
 * ID, number or even the segment. `compact` is the inline form used under an ID field; the full form is the page that replaces Customer 360.
 */
export function RestrictedCustomerNotice({ compact = false, backTo, backLabel }: { compact?: boolean; backTo?: string; backLabel?: string }) {
  return (
    <div role="alert" className={`row-start notice-danger-edge ${compact ? 'p-3' : 'p-5'}`}>
      <Icon path={LOCK} className="icon-md mt-0.5 text-danger" />
      <div className="min-w-0 space-y-1">
        <p className="title title-sm font-semibold">{RESTRICTED_CUSTOMER_TITLE}</p>
        <p className="caption-secondary">{RESTRICTED_CUSTOMER_MESSAGE}</p>
        {backTo && (
          <Link to={backTo} className="link-note">
            {backLabel ?? 'Back'}
          </Link>
        )}
      </div>
    </div>
  );
}
