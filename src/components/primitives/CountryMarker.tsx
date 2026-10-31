interface CountryMarkerProps {
  iso: string;
  /** Accessible name is carried by the control around this, so it is hidden. */
  className?: string;
}

// Circular country marker shown beside a dial code.
//
// Why not real flags for all 65 countries: there is no flag asset set in this
// repo and no flag package installed, the app is deliberately self-contained
// (nothing fetches outside its own directory, so a flag CDN is out), and emoji
// flags render as the bare letters "QA" on Windows - which is what an agent
// desk runs.
//
// So the rule is: draw a flag only where it can be drawn CORRECTLY, and show a
// lettered chip everywhere else. A wrong flag is worse than no flag - most of
// this list needs an emblem or script to be right (Saudi Arabia's shahada,
// India's chakra, Oman's khanjar), and approximating a national flag on a
// telecom product is not a tradeoff worth making for a decorative 16px glyph.
//
// Both variants share the same circular 16px footprint so the column still
// reads as one set rather than two treatments. Swapping the chips for real
// flags later is a drop-in: add cases here, change nothing at the call sites.
export function CountryMarker({ iso, className = '' }: CountryMarkerProps) {
  const base = `w-4 h-4 shrink-0 rounded-[var(--radius-pill)] ${className}`;

  if (iso === 'QA') {
    // Qatar: maroon field, white hoist band, nine-point serration between
    // them. Geometric, so it is drawn exactly rather than approximated - and
    // it is the default selection, which is the case the supplied design
    // shows.
    return (
      <svg viewBox="0 0 16 16" className={base} aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="var(--brand-qatar)" />
        <path d="M0 0h5v16H0z" fill="var(--paper)" />
        <path
          d="M5 0l-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889-1.6 0.889 1.6 0.889z"
          fill="var(--brand-qatar)"
        />
      </svg>
    );
  }

  return (
    <span
      className={`${base} inline-flex items-center justify-center bg-surface border border-border-soft text-[0.5rem] font-semibold leading-none text-fg-2`}
      aria-hidden="true"
    >
      {iso}
    </span>
  );
}
