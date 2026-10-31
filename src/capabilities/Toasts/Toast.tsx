import { Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import type { ToastBrand, ToastKind, ToastRow } from '../../stores/notificationStore';
import { Icon } from '../../components/primitives/Icon';
import { VodafoneMark } from '../../components/primitives/VodafoneMark';

const CLOSE_ICON = 'M18 6L6 18 M6 6l12 12';

// The icon that says what a plain toast is, in the kind's colour: a ticked circle for success, a triangle for a warning, an "i" circle for information
// and an octagon for an error (24px grid paths, drawn with the same 2px stroke as the rest of the icon set).
const KIND_ICON: Record<ToastKind, string> = {
  success: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12.5l2.7 2.7L16 9.5',
  warning: 'M10.3 3.9L2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9.5v4 M12 17h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 7.5h.01',
  error: 'M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z M12 8v5 M12 16.5h.01',
};

// Value colour per row tone, lifted toward white because the surface is dark
// in BOTH themes: the base tokens are tuned for light backgrounds, and the
// brightened dark-mode values only apply under .dark, which does not help a
// dark toast sitting in the light theme.
//
// 'id' borrows --field-calendar-range, the only cyan already in the palette,
// so a reference number reads as a distinct class of value from a status
// without introducing a new hue. Lifted 45% to land on the mint the reference
// uses rather than the saturated cyan the raw token gives.
// One definition, used by BOTH the 'id' row tone and the headline reference,
// so a reference number looks the same wherever it appears. The ticket id
// moved from a row into the headline on 2026-09-25 and lost this treatment in
// the move; naming it is what stops the two drifting again.
const ID_TONE = 'text-[var(--toast-fg-id)]';

const rowToneClass: Record<NonNullable<ToastRow['tone']>, string> = {
  default: 'text-on-dark',
  id: ID_TONE,
  success: 'text-[var(--toast-fg-success)]',
};

// Maps the store's serialisable ToastBrand to a mark. The store holds
// 'vodafone' | 'other' and a relationship string; deciding what those LOOK
// like is this layer's job, which is why no ReactNode crosses into state.
//
// The Vodafone case shows the mark AND the SEGMENT (Consumer / Business),
// because for an existing customer "which operator" is not the useful half -
// the agent already knows they are at a Vodafone counter. What they need
// before they speak is which kind of customer this is.
//
// Prepaid/Postpaid used to occupy this slot and moved to the Mobile number
// row on 2026-09-25, where it reads as "(Postpaid)" directly under the
// number it describes. Keeping it here as well put the same fact on the card
// twice; and the two are different in kind anyway - a segment describes the
// customer, a relationship describes one line.
//
// The 'other' case shows the mark alone. There is no relationship to state: a
// competitor's customer has no Vodafone prepaid/postpaid standing, and
// printing one would be an invention rather than a blank.
//
// A Vodafone customer with no segment on file ALSO shows the mark alone.
// This slot briefly read "No active lines", which was wrong twice over:
//
// - It answered a question the slot does not ask. The slot is the
//   relationship type for the number Qnomy handed over; how many lines the
//   customer holds is a different fact and now has its own row.
// - It over-claimed. The two source fields count MOBILE lines only, so it
//   announced "No active lines" for a customer whose fixed-line service is
//   active - CUST-1003 holds GigaHome account ACC-5003.
//
// An empty slot is no longer ambiguous now that "Active lines" is a labelled
// row, which is what made the filler look necessary in the first place.
function ToastBrandMark({ brand }: { brand: ToastBrand }) {
  // A competitor's customer shows no mark at all.
  if (brand.operator !== 'vodafone') return null;
  return (
    <span className="flex items-center gap-2">
      <VodafoneMark className="w-4 h-4 shrink-0" />
      {brand.segment && (
        <span className="text-[length:var(--fs-caption)] font-medium whitespace-nowrap text-on-dark">
          {brand.segment}
        </span>
      )}
    </span>
  );
}

// A plain (one-line) toast is colour-coded by what it says: green for success, red for an error, amber for a
// warning, blue for information - a tinted surface with a coloured border and dot, and the page's own text colour
// on top (so contrast holds in both themes). The structured card keeps its dark panel; its dot carries the kind.
const kindSurface: Record<ToastKind, string> = {
  success: 'border border-success bg-tone-success',
  error: 'border border-danger bg-tone-danger',
  warning: 'border border-warn bg-tone-warn',
  info: 'border border-[var(--signal-blue)] bg-tone-blue-soft',
};
const kindDot: Record<ToastKind, string> = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warn)',
  info: 'var(--signal-blue)',
};

const dotColour: Record<ToastKind, string> = {
  success: 'var(--toast-dot-success)',
  error: 'var(--toast-dot-error)',
  warning: 'var(--toast-dot-warning)',
  info: 'var(--toast-dot-info)',
};

// Toast/Alert/ConfirmDialog per notification-catalogue.md section 4's evidenced
// taxonomy. Error toasts use role="alert" (implicitly assertive) so screen
// readers interrupt for failures; success/info/warning use role="status"
// (polite) so they're announced without stealing focus from whatever the user
// was doing.
//
// The card is a dark --charcoal-panel surface in both themes. A toast is
// transient and overlays whatever the agent is reading, so an inverted surface
// separates it from the page without leaning on the elevation the rest of the
// re-skin removed - and it looks the same in dark mode instead of inverting
// along with the page underneath it.
//
// STRUCTURE, for the structured variant. Header band, full-bleed rule, body:
// three stacked blocks, NOT a flex row with the rule nested inside a content
// column. The dot and the title are inside the header's own padding, so the
// rule can span the card edge to edge. Nesting it beside the dot - which is
// what this did first - insets the rule by the dot's width plus its gap, and
// no amount of padding tuning fixes that because the rule is simply in the
// wrong box.
//
// Type carries the hierarchy: the title is caption-sized, uppercase and
// tracked; labels are caption-sized and dimmed; VALUES are body-sized and
// semibold. Rendering labels and values at one size, which this also did
// first, leaves the agent no way to scan values without reading labels too.
export function ToastContainer() {
  const { toasts, dismissToast, dismissAllToasts } = useNotificationStore();
  const stackRef = useRef<HTMLDivElement>(null);

  // Clicking anywhere off the stack clears it.
  //
  // Attached on a deferred tick, NOT synchronously: almost every toast in this
  // app is pushed BY a click (Next Customer, Finish, Save), and that same
  // click is still propagating when this effect runs. Listening immediately
  // would let the originating click dismiss the toast it just created, so the
  // notification would never be readable.
  //
  // pointerdown rather than click, so the dismissal happens as the agent
  // starts interacting elsewhere instead of waiting for mouseup, and it still
  // fires for touch.
  //
  // Escape is bound too. Without it this feature would be mouse-only: there is
  // no keyboard equivalent of "click outside", so a keyboard user would be
  // left with only the per-toast dismiss button while everyone else got a
  // one-gesture clear.
  useEffect(() => {
    if (!toasts.length) return;
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 0);
    const onPointerDown = (e: PointerEvent) => {
      if (!armed) return;
      if (stackRef.current?.contains(e.target as Node)) return;
      dismissAllToasts();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissAllToasts();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(arm);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [toasts.length, dismissAllToasts]);

  if (!toasts.length) return null;
  return (
    // Two stacks: one-line toasts sit directly below the app header (h-16 in PersonaSwitcher) so they never cover its controls; structured cards (ticket assigned etc.) sit at the bottom centre, clear of the page content they annotate. items-center with no fixed stack width, because a
    // structured card needs room for five columns while a one-line card should
    // stay narrow - each card sets its own max-width and they centre
    // independently rather than all stretching to the widest one.
    //
    // pointer-events-none on the stack keeps the wide footprint from
    // swallowing clicks on the page behind it; only the cards take pointer
    // events back.
    <div ref={stackRef}>
      {[
        { key: 'top', list: toasts.filter((t) => !t.rows?.length), pos: 'top-[calc(4rem+0.75rem)]' },
        { key: 'bottom', list: toasts.filter((t) => t.rows?.length), pos: 'bottom-4' },
      ].map(({ key, list, pos }) => (
        <div key={key} className={`fixed ${pos} inset-x-0 z-[var(--z-toast)] flex flex-col items-center gap-2 px-4 pointer-events-none`}>
      {list.map((t) => {
        const structured = Boolean(t.rows?.length);
        return (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            aria-live={t.kind === 'error' ? 'assertive' : 'polite'}
            className={`pointer-events-auto w-full overflow-hidden rounded-[var(--radius-card)] shadow-raised ${
              !structured ? kindSurface[t.kind] : 'bg-[var(--charcoal-panel)]'
            } ${structured ? 'max-w-[60rem]' : 'max-w-[34rem]'}`}
          >
            {structured ? (
              <>
                <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-[var(--radius-pill)] shrink-0"
                      style={{ backgroundColor: dotColour[t.kind] }}
                      aria-hidden="true"
                    />
                    <span className="text-on-dark font-semibold text-[length:var(--fs-caption)] uppercase tracking-[0.12em] truncate">
                      {t.message}
                      {/* The reference keeps the headline's uppercase and
                          tracking - it inherits them - and changes only
                          colour, so it reads as the same line rather than as
                          a separate chip. */}
                      {t.reference && <span className={`ml-1.5 ${ID_TONE}`}>{t.reference}</span>}
                    </span>
                  </span>
                  {/* Operator mark and the dismiss button share the right end,
                      so the mark lands inside the header row rather than
                      becoming a third justify-between column floating in the
                      middle of it. */}
                  <span className="flex items-center gap-4 shrink-0">
                    {t.brand && <ToastBrandMark brand={t.brand} />}
                    <button type="button"
                      onClick={() => dismissToast(t.id)}
                      aria-label="Dismiss notification"
                      className="text-on-dark-2 hover:text-on-dark"
                    >
                      <Icon path={CLOSE_ICON} className="w-5 h-5" />
                    </button>
                  </span>
                </div>

                {/* Full-bleed: a sibling of the header, not a child of it. */}
                <div className="border-t border-on-dark-line-1" />

                <div className="px-5 py-4">
                  {/* Two rows, one column per field. grid-rows-2 with
                      grid-flow-col puts each dt on the top row and its dd
                      directly beneath, while keeping dt/dd adjacent in the DOM
                      so the list stays semantically paired for a screen
                      reader. Five stacked label+value divs would look
                      identical only while every label fits on one line - the
                      moment one wraps, the value baselines stop aligning.

                      grid-rows-[auto_auto], NOT Tailwind's grid-rows-2: that
                      utility is repeat(2, minmax(0,1fr)), which forces both
                      rows to the SAME height. With two values wrapping to two
                      lines that made the label row 44px tall for a 19px line,
                      which reads as phantom padding under every label and is
                      not removable by touching padding, because there is
                      none - the dt has padding 0. Auto rows size to their own
                      content. */}
                  <dl className="grid grid-rows-[auto_auto] grid-flow-col auto-cols-fr gap-x-6 gap-y-1.5">
                    {t.rows!.map((row) => (
                      <Fragment key={row.label}>
                        <dt className="text-on-dark-2 text-[length:var(--fs-caption)] leading-snug">{row.label}</dt>
                        <dd
                          className={`text-[length:var(--fs-body)] font-semibold leading-snug ${rowToneClass[row.tone ?? 'default']}`}
                        >
                          {/* An actionable value launches on click - the
                              purpose of visit starting its journey. Underlined
                              rather than merely coloured, because the value
                              keeps its row colour and colour alone would not
                              distinguish it from the three values that are
                              only text. */}
                          {row.value}
                          {/* Own line, at caption size and dimmed, so it
                              qualifies the value above without competing with
                              it for the row's visual weight. */}
                          {row.sub && (
                            <span className="block text-on-dark-2 text-[length:var(--fs-caption)] font-normal leading-snug">
                              {row.sub}
                            </span>
                          )}
                          {/* The breakdown, under the count. Each identifier
                              opens the owning Customer 360 tab with that
                              service loaded.

                              Dismissing on click is deliberate: the toast
                              overlays the page it is navigating to, so leaving
                              it up would cover the record the agent just asked
                              to see. Clicking a link does NOT trigger the
                              outside-click dismissal - the link is inside the
                              stack - so this is the only thing that closes
                              it. */}
                          {row.links && row.links.length > 0 && (
                            <span className="mt-1.5 flex flex-col gap-1 font-normal">
                              {row.links.map((link) => (
                                <Link
                                  key={link.label}
                                  to={`/customer/${link.customerId}`}
                                  state={{ tab: link.tab, serviceRef: link.serviceRef }}
                                  onClick={() => dismissToast(t.id)}
                                  // The product name is NOT displayed (2026-09-25 -
                                  // identifiers only), but it is still the link's
                                  // accessible name. "SVC-30011" read aloud on its own
                                  // says nothing about where the link goes, and an
                                  // aria-label is announced without being rendered, so
                                  // this costs the visual design nothing.
                                  aria-label={link.note ? `${link.label} - ${link.note}` : link.label}
                                  className={`block text-[length:var(--fs-caption)] font-medium text-link underline decoration-white/30 underline-offset-2 hover:decoration-current`}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </span>
                          )}
                        </dd>
                      </Fragment>
                    ))}
                  </dl>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <span className="shrink-0" style={{ color: kindDot[t.kind] }} aria-hidden="true">
                  <Icon path={KIND_ICON[t.kind]} className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[length:var(--fs-caption)] leading-snug text-fg">{t.message}</p>
                  {t.detail && (
                    <p className="text-[length:var(--fs-caption)] leading-snug mt-0.5 text-fg-2">{t.detail}</p>
                  )}
                </div>
                <button type="button"
                  onClick={() => dismissToast(t.id)}
                  aria-label="Dismiss notification"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-muted hover:text-fg"
                >
                  <Icon path={CLOSE_ICON} className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
        </div>
      ))}
    </div>
  );
}
