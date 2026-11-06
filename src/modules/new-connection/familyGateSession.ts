// The "Family Package Already Active" dialog opens by itself once per active session for a customer: the first time the agent selects a Family Plan for them.
// After that the plan page shows the notice and the button to bring the dialog back, never the dialog by itself again. "Session" is the browser tab's session
// (sessionStorage), so it starts afresh when the tab is closed and reopened.

const KEY = 'vfq-family-package-active-modal-shown';

const read = (): string[] => {
  try {
    const raw = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

/** The dialog has already opened by itself for this customer in this session. */
export const familyModalSeen = (customerId: string): boolean => read().includes(customerId);

/** Records that it has. */
export function markFamilyModalSeen(customerId: string): void {
  try {
    if (typeof sessionStorage !== 'undefined' && !familyModalSeen(customerId)) sessionStorage.setItem(KEY, JSON.stringify([...read(), customerId]));
  } catch {
    // Storage unavailable: the dialog may then open again, which is the safe side of "once".
  }
}
