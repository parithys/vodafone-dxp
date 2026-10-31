import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '../../../components/primitives/Badge';
import { Icon } from '../../../components/primitives/Icon';
import type { Customer360Data } from '../../../engines/customer360Engine';

const CHEVRON_UP = 'M18 15l-6-6-6 6';
const CHEVRON_DOWN = 'M6 9l6 6 6-6';

/** A hierarchy row: a button that expands its children, or a plain row when everything is shown open. */
function Row({ as, className, onClick, children }: { as: 'div' | 'button'; className: string; onClick?: () => void; children: React.ReactNode }) {
  return as === 'button' ? (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  );
}

function LevelBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[length:var(--fs-micro)] uppercase tracking-wide font-semibold text-muted shrink-0">
      {children}
    </span>
  );
}

// CUS-001-CAM-03/CAM-04-B: renders the actual 3-tier Customer Account ->
// Billing Account -> Service Account structure (not just a flat account
// list) with click-to-drill-down navigation between levels. Billing Account
// nodes link out to the dedicated Billing Account page (BAM-01); Service
// Account nodes expand inline to show CAM-20's distinct service-account
// detail plus CAM-05/06/07 barring status, so the tier a field belongs to is
// never ambiguous.
export function AccountHierarchySection({ data, expandAll = false }: { data: Customer360Data; expandAll?: boolean }) {
  const location = useLocation();
  const [expandedBillingId, setExpandedBillingId] = useState<string | null>(
    data.billingProfiles[0] ? String(data.billingProfiles[0].billingProfileId) : null
  );
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const billingProfileIds = Array.from(new Set(data.accounts.map((a) => a.billingProfileId).filter(Boolean)));

  return (
    <div className="space-y-3">
      <h3 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide font-semibold text-fg mb-1">
        Account Hierarchy
      </h3>

      {/* Level 1 - Customer Account */}
      <div className="rounded-[var(--radius-card)] border border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)] shadow-[var(--shadow-selected-ring)] p-4">
        <div className="flex items-center gap-3">
          <LevelBadge>Customer Account</LevelBadge>
          <span className="font-medium text-fg">{data.customer.name}</span>
          <Badge variant="filled-neutral">{data.customer.customerId}</Badge>
        </div>
      </div>

      {/* Level 2 - Billing Account(s) */}
      <div className="pl-6 space-y-2 border-l-2 border-border-soft ml-4">
        {billingProfileIds.length === 0 && (
          <p className="text-muted text-[length:var(--fs-body)] py-2">No billing accounts on file.</p>
        )}
        {billingProfileIds.map((billingProfileId) => {
          const profile = data.billingProfiles.find((bp) => bp.billingProfileId === billingProfileId);
          const serviceAccounts = data.accounts.filter((a) => a.billingProfileId === billingProfileId);
          const isOpen = expandAll || expandedBillingId === billingProfileId;
          return (
            <div key={String(billingProfileId)} className="card ">
              <Row
                as={expandAll ? 'div' : 'button'}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${expandAll ? '' : 'hover:bg-surface'}`}
                onClick={expandAll ? undefined : () => setExpandedBillingId(isOpen ? null : String(billingProfileId))}
              >
                {!expandAll && <Icon path={isOpen ? CHEVRON_UP : CHEVRON_DOWN} className="w-4 h-4 text-muted shrink-0" />}
                <LevelBadge>Billing Account</LevelBadge>
                <span className="font-medium text-fg">{String(profile?.name ?? billingProfileId)}</span>
                <Badge variant="filled-neutral">{String(billingProfileId)}</Badge>
                <span className="ml-auto">
                  <Link
                    to={`/billing-account/${billingProfileId}`}
                    // Forwards whatever origin brought the agent to this
                    // record, so the rail keeps showing the same destination
                    // one level deeper instead of falling back to Customer
                    // Search halfway through a queue-driven interaction.
                    state={location.state}
                    onClick={(e) => e.stopPropagation()}
                    className="text-link text-[length:var(--fs-caption)] font-medium hover:underline"
                  >
                    View Billing Account →
                  </Link>
                </span>
              </Row>

              {isOpen && (
                <div className="px-4 pb-4 pl-10 space-y-2 border-t border-border-soft pt-3">
                  {serviceAccounts.length === 0 && (
                    <p className="text-muted text-[length:var(--fs-body)]">No service accounts under this billing account.</p>
                  )}
                  {serviceAccounts.map((account) => {
                    const svcOpen = expandAll || expandedServiceId === account.accountId;
                    const acct = account as unknown as Record<string, unknown>;
                    return (
                      <div key={account.accountId} className="card card-surface">
                        <Row
                          as={expandAll ? 'div' : 'button'}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left ${expandAll ? '' : 'hover:bg-surface-warm'}`}
                          onClick={expandAll ? undefined : () => setExpandedServiceId(svcOpen ? null : account.accountId)}
                        >
                          {!expandAll && <Icon path={svcOpen ? CHEVRON_UP : CHEVRON_DOWN} className="w-3.5 h-3.5 text-muted shrink-0" />}
                          <LevelBadge>Service Account</LevelBadge>
                          <span className="text-fg text-[length:var(--fs-body)]">{account.accountType}</span>
                          <Badge variant={account.status === 'Active' ? 'success' : 'filled-neutral'}>{account.status}</Badge>
                          {String(acct.barringStatus ?? 'Not Barred') !== 'Not Barred' && (
                            <Badge variant="warning">{String(acct.barringStatus)}</Badge>
                          )}
                        </Row>
                        {svcOpen && (
                          <div className="px-3 pb-3 pl-8 grid grid-cols-2 gap-3 text-[length:var(--fs-body)]">
                            <div>
                              <div className="text-[length:var(--fs-caption)] text-muted">Account ID</div>
                              <div className="text-fg">{account.accountId}</div>
                            </div>
                            <div>
                              <div className="text-[length:var(--fs-caption)] text-muted">Barring Type</div>
                              <div className="text-fg">{String(acct.barringType ?? '-')}</div>
                            </div>
                            <div>
                              <div className="text-[length:var(--fs-caption)] text-muted">Barring Reason</div>
                              <div className="text-fg">{String(acct.barringReason ?? '-')}</div>
                            </div>
                            {account.parentAccountId && (
                              <div>
                                <div className="text-[length:var(--fs-caption)] text-muted">Reports To</div>
                                <div className="text-fg">{account.parentAccountId}</div>
                              </div>
                            )}
                            {account.subAccountIds && account.subAccountIds.length > 0 && (
                              <div>
                                <div className="text-[length:var(--fs-caption)] text-muted">Sub-Accounts</div>
                                <div className="text-fg">{account.subAccountIds.join(', ')}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
