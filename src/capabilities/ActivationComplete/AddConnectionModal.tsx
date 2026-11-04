import { useEffect, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import { Modal } from '../../components/primitives/Modal';
import { Radio } from '../../components/primitives/Radio';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { connectionOptions, lineCatalogueOf, primaryLine1 } from '../../engines/familyPackage';
import type { ConnectionOption, FamilyLine, FamilyOrder, FamilyRole } from '../../engines/familyPackage';
import { CARD_IDLE, CARD_SELECTED, SelectedTick } from '../SelectableCard';

/** The customer's package as it is on record right now: its lines and the connection types that can be added to it. */
async function readPackage(customerId: string): Promise<{ packageId: string; options: ConnectionOption[] } | undefined> {
  const [lines, orders, products] = await Promise.all([
    mockDataEngine.list<FamilyLine>('family-package-lines'),
    mockDataEngine.list<FamilyOrder>('orders'),
    mockDataEngine.list<{ productId: string; planClass?: string }>('products'),
  ]);
  const own = lines.filter((l) => l.customerId === customerId);
  const first = primaryLine1(own);
  return first ? { packageId: first.packageId, options: connectionOptions(own.filter((l) => l.packageId === first.packageId), orders, lineCatalogueOf(products)) } : undefined;
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
}

function AddConnectionDialog({ onClose, customerId, onStart, onBeforeStart }: AddConnectionModalProps) {
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [pkg, setPkg] = useState<{ packageId: string; options: ConnectionOption[] } | undefined>();
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
      title="Add Another Connection"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!chosen || state !== 'ready' || starting} onClick={() => void start()}>
            {starting ? 'Starting…' : 'Continue'}
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
              <p className="text-secondary">Select the connection type required by the customer.</p>
              <div role="radiogroup" aria-label="Connection type" className="stack gap-3">
                {options.map((o) => (
                  <label key={o.role} className={`row-start card-frame p-4 cursor-pointer ${chosen === o.role ? CARD_SELECTED : CARD_IDLE}`}>
                    {chosen === o.role && <SelectedTick />}
                    <Radio name="family-connection-type" className="mt-1" checked={chosen === o.role} onChange={() => setChosen(o.role)} />
                    <span>
                      <span className="block text-fg font-medium">{o.label}</span>
                      <span className="block caption-secondary">{o.lineLabel}</span>
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
