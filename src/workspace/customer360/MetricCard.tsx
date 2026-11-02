// Shared by the Customer 360 header's KPI strip and the Billing tab's own
// detail cards - one visual treatment for "label, headline value, subtext"
// rather than two components that could drift apart.
export function MetricCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="card p-4">
      <div className="eyebrow">{label}</div>
      <div className="metric-value mt-1">{value}</div>
      <div className="caption-secondary mt-1">{subtext}</div>
    </div>
  );
}
