// The sidebar-panel icon: a rounded window whose left pane (the navigation) is shaded, and a chevron in the main pane that
// points away from the navigation to collapse it and towards it to expand it.
export function PanelIcon({ expanded, className }: { expanded: boolean; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="4" width="18" height="16" rx="3.5" />
      <path d="M9.5 4v16" />
      <path d="M3 7.5a3.5 3.5 0 0 1 3.5-3.5h3v16h-3A3.5 3.5 0 0 1 3 16.5z" fill="currentColor" fillOpacity="0.16" stroke="none" />
      <path d={expanded ? 'M16.5 9.5L14 12l2.5 2.5' : 'M13.5 9.5L16 12l-2.5 2.5'} />
    </svg>
  );
}
