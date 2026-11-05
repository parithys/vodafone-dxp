import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { connectionOptions, lineCatalogueOf, packageSummary, primaryLine1 } from '../../engines/familyPackage';
import type { ConnectionOption, FamilyLine, FamilyOrder, FamilyRole, PackageSummary } from '../../engines/familyPackage';

/**
 * The option cards are styled inline, from design tokens only, on purpose: this modal must look the same on hosts that do not build the app's
 * `@layer components` / `@apply` classes (the Figma Make site), so it depends on no project class for its layout, border or radio.
 */
function optionStyle(selected: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    cursor: 'pointer',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 'var(--radius-card)',
    borderColor: selected ? 'var(--field-card-selected)' : 'var(--field-card-border)',
    background: selected ? 'linear-gradient(135deg, var(--surface-warm), var(--bg) 90%)' : 'var(--bg)',
    boxShadow: selected ? 'var(--shadow-selected-ring)' : 'none',
  };
}

interface PackageOnRecord {
  packageId: string;
  options: ConnectionOption[];
  summary: PackageSummary;
  planName: string | undefined;
}

/** The customer's package as it is on record right now: its lines, what is on it and left, and the connection types that can be added to it. */
async function readPackage(customerId: string): Promise<PackageOnRecord | undefined> {
  const [lines, orders, products] = await Promise.all([
    mockDataEngine.list<FamilyLine>('family-package-lines'),
    mockDataEngine.list<FamilyOrder>('orders'),
    mockDataEngine.list<{ productId: string; name?: string; planClass?: string }>('products'),
  ]);
  const own = lines.filter((l) => l.customerId === customerId);
  const first = primaryLine1(own);
  if (!first) return undefined;
  const inPackage = own.filter((l) => l.packageId === first.packageId);
  const catalogue = lineCatalogueOf(products);
  const summary = packageSummary(inPackage, orders, catalogue);
  return { packageId: first.packageId, options: connectionOptions(inPackage, orders, catalogue), summary, planName: products.find((p) => p.productId === summary.planId)?.name };
}

/**
 * ADD ANOTHER CONNECTION: the choice of connection type for a customer's Family Package. Which types are offered is read from the package every time the
 * modal opens (and again when the agent continues), so a limit reached by the line just added, or a package that changed meanwhile, is never stale: only
 * what can be added now is listed, in no activation order - any listed type can be chosen first. Continue hands the type and the package to `onStart`, which starts the
 * New Postpaid journey for that type from Customer Verification, joined to the same package (the journey judges them again at submission).
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
  onStart: (familyLine: { packageId: string; role: FamilyRole }) => void;
  /** Runs before the journey starts (the confirmation page records its activity and releases the customer there). */
  onBeforeStart?: () => Promise<void> | void;
  /** Opened because the customer asked for another Family Package while already holding one: the package is shown first and a connection is added to it instead. */
  alreadyActive?: boolean;
}

function AddConnectionDialog({ onClose, customerId, onStart, onBeforeStart, alreadyActive }: AddConnectionModalProps) {
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [pkg, setPkg] = useState<PackageOnRecord | undefined>();
  const [chosen, setChosen] = useState<FamilyRole | undefined>();
  const [staleNote, setStaleNote] = useState(false);
  const [starting, setStarting] = useState(false);

  // Read afresh on every mount (the dialog is mounted per opening) and on retry.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    readPackage(customerId)
      .then((p) => {
        if (cancelled) return;
        setPkg(p);
        // The free line is offered first (it is the only option while it is open): it is already the choice.
        if (p?.options.length === 1) setChosen(p.options[0].role);
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

  const start = async () => {
    if (!chosen || starting) return;
    setStarting(true);
    try {
      // Read again: the choice is only good if it is still available.
      const fresh = await readPackage(customerId);
      setPkg(fresh);
      if (!fresh || !fresh.options.some((o) => o.role === chosen)) {
        setChosen(undefined);
        setStaleNote(true);
        return;
      }
      await onBeforeStart?.();
      onClose();
      onStart({ packageId: fresh.packageId, role: chosen });
    } catch {
      setState('error');
    } finally {
      setStarting(false);
    }
  };

  const options = pkg?.options ?? [];
  return (
    <Modal
      open
      onClose={onClose}
      title={alreadyActive ? 'Family Package Already Active' : 'Add Another Connection'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!chosen || state !== 'ready' || starting} onClick={() => void start()}>
            {starting ? 'Starting…' : alreadyActive ? 'Add To This Package' : 'Continue'}
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
          {staleNote && <p role="alert" className="notice-warning pad-row">That connection type is no longer available. The list has been updated.</p>}
          {options.length === 0 ? (
            <p className="text-secondary">{pkg ? 'No further connection types can be added to this Family Package.' : 'This customer has no Family Package.'}</p>
          ) : (
            <>
              {alreadyActive && pkg && <PackageDetails pkg={pkg} />}
              <p className="text-secondary">{pkg && pkg.summary.free.length > 0 ? 'The free line is offered first. Paid lines open once it has been activated.' : 'Select the connection type required by the customer.'}</p>
              <div role="radiogroup" aria-label="Connection type" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {options.map((o) => (
                  <label key={o.role} style={optionStyle(chosen === o.role)}>
                    <input
                      type="radio"
                      name="family-connection-type"
                      checked={chosen === o.role}
                      onChange={() => setChosen(o.role)}
                      style={{ marginTop: '0.25rem', width: '1.125rem', height: '1.125rem', accentColor: 'var(--accent)', flexShrink: 0 }}
                    />
                    <span>
                      <span style={{ display: 'block', fontWeight: 500, color: 'var(--fg)' }}>{o.label}</span>
                      <span style={{ display: 'block', fontSize: 'var(--fs-caption)', color: 'var(--fg-2)' }}>{o.lineLabel} · {o.charge === 'Free' ? 'Free line' : 'Paid line'}</span>
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

const heading: CSSProperties = { margin: 0, fontWeight: 600, color: 'var(--fg)' };
const muted: CSSProperties = { margin: 0, fontSize: 'var(--fs-caption)', color: 'var(--fg-2)' };

/** What the customer's existing Family Package holds, and which of what is left is free or paid. Plain elements and tokens only (see optionStyle). */
function PackageDetails({ pkg }: { pkg: PackageOnRecord }) {
  const { summary } = pkg;
  const row = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={muted}>{label}</span>
      <span style={{ color: 'var(--fg)', textAlign: 'right' }}>{value}</span>
    </div>
  );
  const types = (list: { label: string }[]) => (list.length ? list.map((t) => t.label).join(', ') : 'None');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: '1px solid var(--field-card-border)', borderRadius: 'var(--radius-card)', background: 'var(--surface-subtle)' }}>
      <p style={heading}>This customer already has an active Family Package</p>
      <p style={muted}>A second package cannot be started. Add the connection to the existing one instead.</p>
      {row('Family Package', pkg.planName ?? 'Family Plan')}
      {row('Lines activated', summary.activated.map((a) => `${a.count} ${a.label}`).join(', ') || 'None')}
      {row('Lines still available', summary.available.map((a) => (a.remaining === null ? `${a.label} (no limit)` : `${a.remaining} ${a.label}`)).join(', ') || 'None')}
      {row('Free lines available', summary.free.length ? summary.free.map((f) => `${f.label} (${f.lineLabel})`).join(', ') : 'None')}
      {row('Paid lines available', summary.paidOpen ? types(summary.paid) : summary.free.length ? `${types(summary.paidTypes)} (open after the free line)` : 'None')}
    </div>
  );
}
