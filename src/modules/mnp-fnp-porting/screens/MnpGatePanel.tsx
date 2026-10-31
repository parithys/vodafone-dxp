import { Badge } from '../../../components/primitives/Badge';
import { Button } from '../../../components/primitives/Button';
import type { GateCheck } from './mnpValidationGate';

/** BR-MNP-009's validation gate: every mandatory validation with its result, and a way back to fix a failed one. Shown only when one fails. */
export function MnpValidationGate({ gate, onFix }: { gate: GateCheck[]; onFix: (checkId: string) => void }) {
  const failed = gate.filter((c) => !c.ok);
  // Shown only while something fails: with every validation passed there is nothing for the agent to act on.
  if (failed.length === 0) return null;
  return (
    <section className="card p-4 card-surface" aria-label="Validation gate">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-fg text-[length:var(--fs-body)]">Validations</h3>
        <Badge variant="danger">{failed.length} to fix</Badge>
      </div>
      <ul className="divide-y divide-border-soft">
        {gate.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 py-2">
            <span className="text-fg text-[length:var(--fs-body)]">{c.label}</span>
            {c.ok ? (
              <Badge variant="success">Done</Badge>
            ) : (
              <span className="flex items-center gap-3">
                <span className="text-danger text-[length:var(--fs-caption)]">{c.detail}</span>
                <Button variant="secondary" compact onClick={() => onFix(c.id)}>
                  Fix
                </Button>
              </span>
            )}
          </li>
        ))}
      </ul>
      {failed.length > 0 && <p className="text-fg-2 text-[length:var(--fs-caption)] mt-2">Payment and submission stay blocked until every validation is done.</p>}
    </section>
  );
}
