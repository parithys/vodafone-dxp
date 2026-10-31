/** One fact on a Star-number card: a muted label over a bold value (no icon). `alert` is the red upfront charge. */
export function StarStat({ label, value, alert = false, plainValue = false }: { label: string; value: string; alert?: boolean; plainValue?: boolean }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="min-w-0">
        <p className={`text-[length:var(--fs-caption)] ${alert ? 'text-accent' : 'text-fg-2'}`}>{label}</p>
        <p className={`${plainValue ? 'font-normal' : 'font-bold'} text-[length:var(--fs-body)] leading-tight ${alert ? 'text-accent' : 'text-fg'}`}>{value}</p>
      </div>
    </div>
  );
}
