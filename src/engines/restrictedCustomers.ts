// The customers a role may not see, as a lookup over the customer list. Pure: the hook (hooks/useRestrictedCustomers) feeds it the loaded customers
// and the signed-in role; tests feed it anything. Until the customers are known (`customers` is null) NOTHING is shown: isRestricted answers true
// and the row filters return no rows - a protected customer is never drawn "until we find out".

export interface SegmentRow {
  customerId: string;
  name: string;
  segment?: string;
}

export function buildRestrictedIndex(customers: readonly SegmentRow[] | null, canView: (segment: string | undefined) => boolean) {
  const ready = customers !== null;
  const hidden = new Map<string, string>();
  for (const c of customers ?? []) if (!canView(c.segment)) hidden.set(c.customerId, c.name);
  const names = [...hidden.values()].map((n) => n.toLowerCase());
  return {
    ready,
    /** A record for this customer must not be shown. Unknown until loaded -> true. A record with no customer id is not restricted. */
    isRestricted: (customerId: string | null | undefined): boolean => (!ready ? true : customerId ? hidden.has(customerId) : false),
    /** True when free text (a task name, a title) names a restricted customer. */
    mentionsRestricted: (text: string | null | undefined): boolean => Boolean(text) && names.some((n) => text!.toLowerCase().includes(n)),
    /** The rows the role may see, and how many were held back. Nothing before the customers are known. */
    filter<T>(rows: readonly T[], customerIdOf: (row: T) => string | null | undefined): { visible: T[]; hiddenCount: number } {
      if (!ready) return { visible: [], hiddenCount: 0 };
      const visible = rows.filter((r) => !hidden.has(customerIdOf(r) ?? ''));
      return { visible, hiddenCount: rows.length - visible.length };
    },
    /** The same, for a row that names its customer in more than one way: `isHidden` decides (it may use isRestricted / mentionsRestricted). */
    exclude<T>(rows: readonly T[], isHidden: (row: T) => boolean): { visible: T[]; hiddenCount: number } {
      if (!ready) return { visible: [], hiddenCount: 0 };
      const visible = rows.filter((r) => !isHidden(r));
      return { visible, hiddenCount: rows.length - visible.length };
    },
  };
}
