// Lightweight inline stroke-icon primitive - no icon library dependency.
// Path data is hand-authored per icon, not pulled from a design-system spec.
//
// Stroke weight raised 1.6 -> 2 on 2026-09-25 so icons read more strongly,
// particularly in the collapsed nav rail where the icon is the only label a
// row has. 2 is also the conventional weight for a 24px stroke icon, so the
// hand-authored paths now match what an icon set would ship.
//
// Deliberately set here and not per call site: this primitive renders every
// stroke icon in the app, so a single value is what keeps them consistent.
// Anything needing a different weight should take a prop rather than inlining
// its own <svg>, or that consistency is gone immediately.
const STROKE_WIDTH = 2;

export function Icon({ path, className = 'w-5 h-5', strokeWidth = STROKE_WIDTH }: { path: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
