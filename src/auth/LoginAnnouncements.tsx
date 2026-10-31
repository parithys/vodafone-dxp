import { useEffect, useState } from 'react';
import { Icon } from '../components/primitives/Icon';
import { formatNewsDate, useLoginNews } from './useLoginNews';
import type { NewsItem } from './useLoginNews';
import { appPath } from '../lib/basePath';

// The sign-in screen's "Company Updates & Announcements" panel: a carousel over the latest news from the Vodafone Qatar
// news page (see useLoginNews) that shows two at a time (never more) on a glass card over the skyline photo. The arrows
// and the dots (one per item) move it a card at a time and wrap round; it also advances by itself, and pauses while the
// pointer is on it. With no news available the panel is simply not drawn - there is no placeholder content.

const CHEV_LEFT = 'M15 18l-6-6 6-6';
const CHEV_RIGHT = 'M9 18l6-6-6-6';
const AUTO_MS = 7000;

function Card({ a }: { a: NewsItem }) {
  // The whole card is the link (there is no separate "Read more" link in the design).
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read more: ${a.title} (opens in a new tab)`}
      className="group block w-full h-full text-left rounded-[var(--radius-card)] bg-bg text-fg overflow-hidden shadow-[var(--shadow-login-card)] focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <img src={appPath(a.image)} alt="" className="block w-full aspect-[5/3] object-cover" />
      <span className="block px-[6%] pt-4 pb-5 space-y-1.5">
        <span className="font-bold text-[length:var(--fs-body-lg)] leading-snug line-clamp-2 group-hover:underline">{a.title}</span>
        <span className="text-fg-2 text-[length:var(--fs-body)] leading-snug line-clamp-3">{a.summary}</span>
        <span className="block pt-2 text-muted text-[length:var(--fs-caption)]">{formatNewsDate(a.date)}</span>
      </span>
    </a>
  );
}

export function LoginAnnouncements() {
  const items = useLoginNews();
  return items.length > 0 ? <NewsCarousel items={items} /> : null;
}

function NewsCarousel({ items }: { items: NewsItem[] }) {
  const n = items.length;
  // Two cards show at a time, so with two or fewer there is nothing to slide to.
  const slides = n > 2;
  // `pos` is the position of the track, 0..n. The track holds the cards followed by a copy of the first two, so moving
  // past the last card slides on to those copies and then snaps back to 0 without animating - the carousel wraps round
  // as one continuous slide instead of rewinding.
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const index = pos % n;
  const [paused, setPaused] = useState(false); // pointer or keyboard focus is on the panel
  const [stopped, setStopped] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches); // the user's own Pause / reduced-motion
  const next = () => {
    setAnimate(true);
    setPos((p) => p + 1);
  };
  const prev = () => {
    if (pos === 0) {
      // Jump (unanimated) to the copy of the first card at the end, then slide back one.
      setAnimate(false);
      setPos(n);
      requestAnimationFrame(() => requestAnimationFrame(() => { setAnimate(true); setPos(n - 1); }));
    } else {
      setAnimate(true);
      setPos(pos - 1);
    }
  };
  const goTo = (i: number) => {
    setAnimate(true);
    setPos(i);
  };
  useEffect(() => {
    if (!slides || paused || stopped) return;
    const t = setInterval(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [slides, paused, stopped]);
  // After sliding onto the copies at the end, snap back to the real start.
  const onSlideEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // Only the track's own slide counts - a card's hover transition bubbles up here too.
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    if (pos >= n) {
      setAnimate(false);
      setPos(pos - n);
    }
  };
  const track = slides ? [...items, ...items.slice(0, 2)] : items;
  return (
    <section
      aria-label="Company Updates & Announcements"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-on-dark font-semibold uppercase tracking-wide text-[length:var(--fs-caption-upper)]">Latest Updates</h3>
        {slides && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={stopped}
            onClick={() => setStopped((v) => !v)}
            className="rounded-[var(--radius-pill)] px-3 py-1 text-on-dark-2 text-[length:var(--fs-caption)] hover:text-on-dark focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            {stopped ? 'Play' : 'Pause'}
          </button>
          <button
            type="button"
            aria-label="Previous announcement"
            onClick={prev}
            className="w-10 h-10 rounded-[var(--radius-pill)] border border-on-dark-line-3 bg-on-dark-fill-2 text-on-dark flex items-center justify-center hover:bg-on-dark-fill-3 focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <Icon path={CHEV_LEFT} className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next announcement"
            onClick={next}
            className="w-10 h-10 rounded-[var(--radius-pill)] border border-on-dark-line-3 bg-on-dark-fill-2 text-on-dark flex items-center justify-center hover:bg-on-dark-fill-3 focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <Icon path={CHEV_RIGHT} className="w-5 h-5" />
          </button>
        </div>
        )}
      </div>
      {/* Two cards show at a time; the track slides one card per step. Reduced-motion users get no slide. */}
      <div className="overflow-hidden" aria-live={stopped || paused ? 'polite' : 'off'}>
        <div
          className={`flex gap-4 ${animate ? 'transition-transform duration-[var(--motion-slower)] ease-[var(--ease-standard)] motion-reduce:transition-none' : ''}`}
          style={{ transform: `translateX(calc(${pos} * -1 * (50% + 0.5rem)))` }}
          onTransitionEnd={onSlideEnd}
        >
          {track.map((a, i) => (
            <div key={`${a.id}-${i}`} className="shrink-0 basis-[calc(50%-0.5rem)] min-w-0" aria-hidden={i < pos || i > pos + 1} inert={i < pos || i > pos + 1}>
              <Card a={a} />
            </div>
          ))}
        </div>
      </div>
      {slides && (
      <div className="flex items-center justify-center gap-3 mt-6" role="group" aria-label="Choose announcement">
        {items.map((a, i) => (
          <button
            key={a.id}
            type="button"
            aria-current={i === index ? 'true' : undefined}
            aria-label={`Show ${a.title}`}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-[var(--radius-pill)] transition-colors ${i === index ? 'bg-accent' : 'bg-on-dark-4 hover:bg-on-dark-3'}`}
          />
        ))}
      </div>
      )}
    </section>
  );
}
