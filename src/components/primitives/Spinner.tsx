interface SpinnerProps {
  /** Pixel diameter. 20 suits a line of body text, 32 a card's empty state. */
  size?: number;
  /**
   * What is being waited for, e.g. "Scanning the document". Announced to
   * assistive tech and NOT drawn - pair the spinner with visible text of your
   * own where the wait needs explaining on screen.
   */
  label: string;
  className?: string;
}

// The app's first spinner. Every busy state before this one said so in words
// ("Loading…", "Checking the MOI registry…"), which works where there is a
// line of text to put it in and does not where the whole card is waiting -
// an agent watching a card reader needs to see that the screen is working
// before they reach for the document again.
//
// A conic-gradient ring rather than a spinning SVG arc or a row of pulsing
// dots: one element, no markup to align, and the taper reads as rotation at
// 20px where a stroked arc goes muddy. The hole is punched with an inverted
// mask, so the ring is a ring at any size without a second element sitting on
// top in the parent's background colour - which would have to know that
// colour, and would be wrong the moment this sat on a tinted surface.
//
// `--accent` for the lit end and `--border` for the track, so it reads as
// branded in both themes without a spinner-specific token.
//
// The label is announced, not drawn. role="status" (implicitly aria-live
// polite) means a screen reader hears it when the wait STARTS without the
// focus being stolen, which matters here because the agent's hands are on the
// reader. Drawing it too would duplicate whatever the caller already wrote
// beside it.
//
// Under prefers-reduced-motion the rotation stops and the ring is drawn
// complete and static - the same call tooltip-tokens.css makes, and the
// reason the status text is mandatory rather than optional: with the motion
// gone, the text is the only thing left saying "waiting".
export function Spinner({ size = 20, label, className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block shrink-0 rounded-[var(--radius-pill)] motion-safe:animate-spin
        bg-[conic-gradient(from_0deg,transparent_0deg,var(--accent)_300deg,var(--accent))]
        motion-reduce:bg-[conic-gradient(var(--accent),var(--accent))]
        [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-2px))]
        ${className}`}
      style={{ width: size, height: size, animationDuration: 'var(--motion-spin)' }}
    />
  );
}
