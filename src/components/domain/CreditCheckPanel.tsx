import { useEffect, useState } from 'react';
import { evaluateRule } from '../../engines/ruleEngine';
import { Badge } from '../primitives/Badge';
import { Checkbox } from '../primitives/Checkbox';

interface CreditCheckPanelProps {
  collectionStatus: string;
  acknowledged: boolean;
  onAcknowledge: (value: boolean) => void;
}

// Surfaces BR-FIBRE-OUTSTANDING-THRESHOLD's evaluation (conflict-report.md
// Conflict 1) as a visible, explicit decision point - never a silent pass/fail.
// When the rule reports the threshold is genuinely unresolved, the agent must
// tick an explicit override to proceed; this is a UX/business decision layered
// on top of the rule engine, not the engine silently unblocking itself.
export function CreditCheckPanel({ collectionStatus, acknowledged, onAcknowledge }: CreditCheckPanelProps) {
  const [result, setResult] = useState<{ pass: boolean; message?: string } | null>(null);

  useEffect(() => {
    setResult(evaluateRule('BR-FIBRE-OUTSTANDING-THRESHOLD', { collectionStatus }));
  }, [collectionStatus]);

  if (!result) return null;

  if (result.pass) {
    return (
      <div className="rounded-[var(--radius-card)] border border-success bg-tone-success p-3 text-[length:var(--fs-caption)] text-fg">
        <Badge variant="success">Credit Check</Badge> <span className="ml-2">{result.message}</span>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--warn)] bg-tone-warn-soft p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="warning">Unresolved Policy Conflict</Badge>
      </div>
      <p className="text-[length:var(--fs-caption)] text-fg">{result.message}</p>
      <label className="flex items-center gap-2 text-[length:var(--fs-caption)] text-fg">
        <Checkbox checked={acknowledged} onChange={(e) => onAcknowledge(e.target.checked)} />
        I acknowledge this policy is unresolved (see conflict-report.md Conflict 1) and am proceeding without a
        definitive credit-check gate.
      </label>
    </div>
  );
}
