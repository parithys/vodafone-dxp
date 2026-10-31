import { useEffect } from 'react';

/** Clears a one-shot flag the moment the step it sits on is shown. */
export function SpendFlag({ active, onSpend }: { active: boolean; onSpend: () => void }) {
  useEffect(() => {
    if (active) onSpend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
