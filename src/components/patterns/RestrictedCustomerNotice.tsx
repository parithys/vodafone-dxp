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
    <div role="alert" className={`flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--danger-border)] bg-tone-danger-soft ${compact ? 'p-3' : 'p-5'}`}>
      <Icon path={LOCK} className="w-5 h-5 shrink-0 mt-0.5 text-danger" />
      <div className="min-w-0 space-y-1">
        <p className="text-fg font-semibold text-[length:var(--fs-body)]">{RESTRICTED_CUSTOMER_TITLE}</p>
        <p className="text-fg-2 text-[length:var(--fs-caption)]">{RESTRICTED_CUSTOMER_MESSAGE}</p>
        {backTo && (
          <Link to={backTo} className="inline-block pt-1 text-[length:var(--fs-caption)] font-semibold text-link hover:underline">
            {backLabel ?? 'Back'}
          </Link>
        )}
      </div>
    </div>
  );
}
