import { useEffect } from 'react';

/** Keeps `multiSims` at the number the order provisions: a Multi-SIM whose add-on was removed is dropped, and none are held when there are none. Renders nothing. */
export function TrimMultiSims({ count, values, setValue }: { count: number; values: Record<string, unknown>; setValue: (field: string, value: unknown) => void }) {
  const held = values.multiSims as unknown[] | undefined;
  useEffect(() => {
    if (!held || held.length <= count) return;
    setValue('multiSims', count === 0 ? undefined : held.slice(0, count));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [held?.length, count]);
  return null;
}
