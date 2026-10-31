/**
 * Order of the roles in the Switch role list: CBU-only roles first, then EBU-only, then roles with no business unit, then
 * everything else (shared units such as "CBU + EBU", qualified labels such as "Primarily CBU", IT / Corporate).
 * Within a group the roles keep their order in personas.json.
 */
const rank = (label: string | undefined): number => {
  const l = (label ?? '').trim();
  if (l === 'CBU') return 0;
  if (l === 'EBU') return 1;
  if (l === '' || l === '-') return 2;
  return 3;
};

export function sortByBusinessUnit<T extends { businessUnitLabel?: string }>(roles: readonly T[]): T[] {
  return roles.map((r, i) => ({ r, i })).sort((a, b) => rank(a.r.businessUnitLabel) - rank(b.r.businessUnitLabel) || a.i - b.i).map(({ r }) => r);
}
