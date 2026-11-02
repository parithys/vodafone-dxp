/** One fact on a Star-number card: a muted label over a bold value (no icon). `alert` is the red upfront charge. */
export function StarStat({ label, value, alert = false, plainValue = false }: { label: string; value: string; alert?: boolean; plainValue?: boolean }) {
  return (
    <div className="row gap-2 min-w-0">
      <div className="min-w-0">
        <p className={`text-[length:var(--fs-caption)] ${alert ? 'text-accent' : 'text-fg-2'}`}>{label}</p>
        <p className={`stat-value ${plainValue ? 'font-normal' : 'font-bold'} ${alert ? 'text-accent' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
