import { useEffect, useState } from 'react';
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
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!pending) return;
    setPending(false);
    goToStepKey('plan');
  }, [pending, goToStepKey]);
  return (
    <PrepaidCart
      lines={allLines(values)}
      onAddAnother={() => {
        setValue('cart', allLines(values));
        for (const key of LINE_KEYS) setValue(key, key === 'addonIds' ? [] : undefined);
        setPending(true);
      }}
    />
  );
}
