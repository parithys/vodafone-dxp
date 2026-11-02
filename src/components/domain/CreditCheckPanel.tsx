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
      <div className="notice-success p-3 text-[length:var(--fs-caption)] text-fg">
        <Badge variant="success">Credit Check</Badge> <span className="ml-2">{result.message}</span>
      </div>
    );
  }

  return (
    <div className="notice-warning p-3 space-y-2">
      <div className="row-tight">
        <Badge variant="warning">Unresolved Policy Conflict</Badge>
      </div>
      <p className="text-[length:var(--fs-caption)] text-fg">{result.message}</p>
      <label className="row-tight text-[length:var(--fs-caption)] text-fg">
        <Checkbox checked={acknowledged} onChange={(e) => onAcknowledge(e.target.checked)} />
        I acknowledge this policy is unresolved (see conflict-report.md Conflict 1) and am proceeding without a
        definitive credit-check gate.
      </label>
    </div>
  );
}
