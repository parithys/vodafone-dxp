import { useCallback, useRef, useState } from 'react';
import { useNotificationStore } from '../stores/notificationStore';

/**
 * Wraps a save/submit action so it cannot be fired twice and cannot leave the screen stuck.
 *
 * - A second call while the first is running is ignored (a ref, so it holds even between two clicks in the same
 *   render), which is what stops a double-clicked Abandon from writing two activities.
 * - A failure is caught and shown as an error toast in plain language; the raw exception goes to the console only.
 * - `pending` always returns to false (success or failure), so a Save button never sticks on "Saving…".
 *
 * `run` resolves to true when the action completed, false when it failed or was ignored, so a caller can close its
 * drawer only on success.
 *
 * `useSubmitGuard` is the same thing for a component with several actions (or whose handlers sit after an early return,
 * where a hook cannot go): call it once at the top and wrap each handler body in `guard(async () => { ... })`.
 */
export function useSubmitGuard(failureMessage = 'That did not go through. Please try again.') {
  const pushToast = useNotificationStore((s) => s.pushToast);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);

  const guard = useCallback(
    async (action: () => Promise<unknown> | unknown): Promise<boolean> => {
      if (busy.current) return false;
      busy.current = true;
      setPending(true);
      try {
        await action();
        return true;
      } catch (err) {
        console.error('[useSubmit] action failed:', err);
        pushToast('error', failureMessage);
        return false;
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
    [pushToast, failureMessage]
  );

  return { guard, pending };
}

/** A save action bound to the guard above: `run(...args)` is the guarded call. */
export function useSubmit<A extends unknown[]>(action: (...args: A) => Promise<unknown> | unknown, failureMessage?: string) {
  const { guard, pending } = useSubmitGuard(failureMessage);
  const latest = useRef(action);
  latest.current = action;
  const run = useCallback((...args: A) => guard(() => latest.current(...args)), [guard]);
  return { run, pending };
}
