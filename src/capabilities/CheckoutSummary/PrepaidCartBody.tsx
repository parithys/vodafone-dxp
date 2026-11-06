import { useEffect, useRef, useState } from 'react';
import { PrepaidCart } from './CheckoutSummary';
import { LINE_KEYS, allLines } from '../../components/patterns/prepaidCartModel';

/**
 * The step body of the prepaid "Add another subscription?" decision. Adding commits the finished subscription to the
 * cart (`cart`), clears the per-line keys so the plan, number and SIM steps start fresh, and returns to the plan step
 * one render later - after the wizard has recomputed its steps with the cleared values.
 */
export function PrepaidCartBody({
  values,
  setValue,
  goToStepKey,
}: {
  values: Record<string, unknown>;
  setValue: (field: string, value: unknown) => void;
  goToStepKey: (key: string) => void;
}) {
  // Each Add Another bumps `requested`; the effect below acts once per request, a render later (no state set in the effect).
  const [requested, setRequested] = useState(0);
  const handled = useRef(0);
  useEffect(() => {
    if (handled.current === requested) return;
    handled.current = requested;
    goToStepKey('plan');
  }, [requested, goToStepKey]);
  return (
    <PrepaidCart
      lines={allLines(values)}
      onAddAnother={() => {
        setValue('cart', allLines(values));
        for (const key of LINE_KEYS) setValue(key, key === 'addonIds' ? [] : undefined);
        setRequested((n) => n + 1);
      }}
    />
  );
}
