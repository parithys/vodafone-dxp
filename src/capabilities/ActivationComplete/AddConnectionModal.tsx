import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { connectionUnavailable, eligibleAdditionalPlans, lineCatalogueOf, packageSummary, primaryLine1, resolvePackageState } from '../../engines/familyPackage';
import type { ConnectionUnavailable, EligiblePlan, FamilyLine, FamilyNextAction, FamilyOrder, FamilyRole, PackageSummary } from '../../engines/familyPackage';
import { formatQar } from '../../lib/format';

interface PackageOnRecord {
  packageId: string;
  /** What the package needs next, from its state: the connection type is never asked for. */
  nextAction: FamilyNextAction;
  /** The plans an additional connection can be on now (both Primary Lines active), with what the catalogue says of each. */
  eligiblePlans: (EligiblePlan & { name: string; mrcQAR: number })[];
  summary: PackageSummary;
  planName: string | undefined;
  /** Why nothing can be added, when nothing can. */
  unavailable: ConnectionUnavailable | undefined;
}

/** The customer's package as it is on record right now: its lines, its state, what is on it, and the next connection it can take. */
async function readPackage(customerId: string): Promise<PackageOnRecord | undefined> {
  const [lines, orders, products] = await Promise.all([
    mockDataEngine.list<FamilyLine>('family-package-lines'),
    mockDataEngine.list<FamilyOrder>('orders'),
    mockDataEngine.list<{ productId: string; name?: string; mrcQAR?: number; planClass?: string; secondaryPlanType?: string }>('products'),
  ]);
  const own = lines.filter((l) => l.customerId === customerId);
  const first = primaryLine1(own);
  if (!first) return undefined;
  const inPackage = own.filter((l) => l.packageId === first.packageId);
  const catalogue = lineCatalogueOf(products);
  const state = resolvePackageState(inPackage, orders);
  const summary = packageSummary(inPackage, orders, catalogue);
  const eligiblePlans = eligibleAdditionalPlans(state, catalogue).flatMap((e) => {
    const p = products.find((x) => x.productId === e.planId);
    return p ? [{ ...e, name: p.name ?? e.planId, mrcQAR: p.mrcQAR ?? 0 }] : [];
  });
  return { packageId: first.packageId, nextAction: state.nextAction, eligiblePlans, summary, planName: products.find((p) => p.productId === summary.planId)?.name, unavailable: connectionUnavailable(inPackage, orders, catalogue) };
}

/**
 * ADD ANOTHER CONNECTION: what a customer's Family Package needs next, from its state - the agent is never asked for a connection type. The package is read every time the modal
 * opens (and again when the agent continues), so a package that changed meanwhile is never stale. Primary Line 2 available: it is the next connection, on the package's plan, at no
 * additional charge. Both Primary Lines active: the agent selects the plan on the next page and the line's type follows from it. Continue hands the package to `onStart`, which
 * starts the New Postpaid journey from Customer Verification, joined to the same package (the journey judges it again at submission).
 */
export function AddConnectionModal(props: AddConnectionModalProps) {
  // Mounted only while open: every opening starts from loading and reads the package afresh.
  return props.open ? <AddConnectionDialog {...props} /> : null;
}

interface AddConnectionModalProps {
  open: boolean;
  onClose: () => void;
  customerId: string;
  /** Starts the journey for the type chosen, joined to the package (the caller owns the route). */
  onStart: (familyLine: { packageId: string; role?: FamilyRole }) => void;
  /** Runs before the journey starts (the confirmation page records its activity and releases the customer there). */
  onBeforeStart?: () => Promise<void> | void;
  /** Opened because the customer asked for another Family Package while already holding one: the package is shown first and a connection is added to it instead. */
  alreadyActive?: boolean;
}

function AddConnectionDialog({ onClose, customerId, onStart, onBeforeStart, alreadyActive }: AddConnectionModalProps) {
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [pkg, setPkg] = useState<PackageOnRecord | undefined>();
  const [staleNote, setStaleNote] = useState(false);
  const [starting, setStarting] = useState(false);
  // One start per opening: a repeated click or press cannot start the journey twice.
  const startedRef = useRef(false);

  // Read afresh on every mount (the dialog is mounted per opening) and on retry.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    readPackage(customerId)
      .then((p) => {
        if (cancelled) return;
        setPkg(p);
        setState('ready');
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [customerId, attempt]);

  const retry = () => {
    setState('loading');
    setAttempt((n) => n + 1);
  };

  // What the package needs next that the agent can act on: Primary Line 2, or an additional connection on the plan they will select.
  const actionable = pkg?.nextAction === 'PRIMARY_LINE_2' || (pkg?.nextAction === 'ADDITIONAL_PLAN' && pkg.eligiblePlans.length > 0);
  const start = async () => {
    if (!pkg || !actionable || starting || startedRef.current) return;
    startedRef.current = true;
    setStarting(true);
    try {
      // Read again: what was shown is only good if it is still what the package needs.
      const fresh = await readPackage(customerId);
      setPkg(fresh);
      if (!fresh || fresh.nextAction !== pkg.nextAction) {
        setStaleNote(true);
        startedRef.current = false;
        return;
      }
      await onBeforeStart?.();
      onClose();
      onStart({ packageId: fresh.packageId });
    } catch {
      setState('error');
      startedRef.current = false;
    } finally {
      setStarting(false);
    }
  };

  const startLabel = pkg?.nextAction === 'PRIMARY_LINE_2' ? 'Add Primary Line 2' : 'Select A Plan';
  return (
    <Modal
      open
      onClose={onClose}
      // Named for what is actually the case: a package that has nothing to add says why (e.g. Primary Line 1 awaiting approval), not that it is "active".
      title={pkg?.unavailable?.title ?? (alreadyActive ? 'Family Package Already Active' : 'Add Another Connection')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {/* Opened because the customer already has a package: not adding to it is skipping the dialog, and the order stays held on the plan page. */}
            {alreadyActive ? 'Skip' : 'Cancel'}
          </Button>
          <Button variant="primary" disabled={!actionable || state !== 'ready' || starting} onClick={() => void start()}>
            {starting ? 'Starting…' : startLabel}
          </Button>
        </>
      }
    >
      {state === 'loading' && <p role="status" className="text-secondary">Loading the Family Package…</p>}
      {state === 'error' && (
        <div className="stack gap-3">
          <p role="alert" className="notice-danger pad-row">The Family Package could not be read. Try again.</p>
          <div>
            <Button variant="secondary" onClick={retry}>
              Try Again
            </Button>
          </div>
        </div>
      )}
      {state === 'ready' && (
        <div className="stack gap-4">
          {staleNote && <p role="alert" className="notice-warning pad-row">The Family Package has changed. What it needs next has been updated.</p>}
          {!pkg ? (
            <p className="text-secondary">This customer has no Family Package.</p>
          ) : !actionable ? (
            <>
              {alreadyActive && <PackageDetails pkg={pkg} />}
              <div role="status" className="stack gap-2">
                {(pkg.unavailable?.reasons ?? ['No further connection can be added to this Family Package.']).map((r) => (
                  <p key={r} className="text-secondary">{r}</p>
                ))}
              </div>
            </>
          ) : (
            <>
              {alreadyActive && <PackageDetails pkg={pkg} />}
              {pkg.nextAction === 'PRIMARY_LINE_2' ? (
                <p className="text-secondary">Primary Line 2 is the next connection. It is included in this Family Package on {pkg.planName ?? 'its plan'}, at no additional charge.</p>
              ) : (
                <>
                  <p className="text-secondary">Both included Primary Lines are active. Select the plan for the additional connection on the next page. These plans are available:</p>
                  <ul className="stack gap-1" aria-label="Available plans">
                    {pkg.eligiblePlans.map((e) => (
                      <li key={e.planId} className="text-secondary">
                        {e.name} - {formatQar(e.mrcQAR)}/mo
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

const heading: CSSProperties = { margin: 0, fontWeight: 600, color: 'var(--fg)' };
const muted: CSSProperties = { margin: 0, fontSize: 'var(--fs-caption)', color: 'var(--fg-2)' };

/** What the customer's existing Family Package holds, and which of what is left is free or paid. Plain elements and tokens only, so it looks the same on hosts that do not build the app's component classes (the Figma Make site). */
function PackageDetails({ pkg }: { pkg: PackageOnRecord }) {
  const { summary } = pkg;
  const row = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={muted}>{label}</span>
      <span style={{ color: 'var(--fg)', textAlign: 'right' }}>{value}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: '1px solid var(--field-card-border)', borderRadius: 'var(--radius-card)', background: 'var(--surface-subtle)' }}>
      <p style={heading}>This customer already has an active Family Package</p>
      {row('Family Package', pkg.planName ?? 'Family Plan')}
      {row('Lines activated', summary.activated.map((a) => `${a.count} ${a.label}`).join(', ') || 'None')}
      {row('Free lines available', summary.free.length ? summary.free.map((f) => `${f.label} (${f.lineLabel})`).join(', ') : 'None')}
    </div>
  );
}
