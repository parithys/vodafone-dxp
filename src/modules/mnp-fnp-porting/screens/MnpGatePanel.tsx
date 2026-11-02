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
      <div className="row-between mb-2">
        <h3 className="title-sm">Validations</h3>
        <Badge variant="danger">{failed.length} to fix</Badge>
      </div>
      <ul className="divide-y divide-border-soft">
        {gate.map((c) => (
          <li key={c.id} className="split-nowrap py-2">
            <span className="body-text">{c.label}</span>
            {c.ok ? (
              <Badge variant="success">Done</Badge>
            ) : (
              <span className="row">
                <span className="text-danger text-[length:var(--fs-caption)]">{c.detail}</span>
                <Button variant="secondary" compact onClick={() => onFix(c.id)}>
                  Fix
                </Button>
              </span>
            )}
          </li>
        ))}
      </ul>
      {failed.length > 0 && <p className="caption-secondary mt-2">Payment and submission stay blocked until every validation is done.</p>}
    </section>
  );
}
