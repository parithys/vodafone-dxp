import { Link, useNavigate } from 'react-router-dom';
import { getAllRoutes } from '../../engines/configEngine';
import { useCustomerContext } from '../../stores/customerContextStore';
import { Icon } from '../../components/primitives/Icon';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import type { ZoneSize } from './dashboardLayout';
import type { PillTone } from './heroFigures';
import { ALERT_ICON, CHECK_CIRCLE, FIBRE_HOME, FORM, ICONS_HEADSET, ICONS_MOBILE, ICONS_TAG, ICONS_USERS, ICON_DATA, OPEN_ARROW, REFRESH_ICON_PATH, SIM_CARD, TICKET, TREND_UP, USER_SMALL } from '../../assets/icons';

const PILL_TONES: Record<PillTone, string> = {
  neutral: 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]',
  amber: 'bg-[var(--tint-amber-bg)] text-[var(--tint-amber-fg)]',
  pink: 'bg-[var(--tint-pink-bg)] text-[var(--tint-pink-fg)]',
  green: 'bg-[var(--tint-green-bg)] text-[var(--tint-green-fg)]',
};

const ICONS = {
  ticket: TICKET,
  checkCircle: CHECK_CIRCLE,
  users: ICONS_USERS,
  simCard: SIM_CARD,
  refresh: REFRESH_ICON_PATH,
  openArrow: OPEN_ARROW,
  mobile: ICONS_MOBILE,
  wifi: FIBRE_HOME,
  chart: ICON_DATA,
  tag: ICONS_TAG,
  alert: ALERT_ICON,
  headset: ICONS_HEADSET,
  clipboard: FORM,
  trending: TREND_UP,
  users2: USER_SMALL,
};

export interface ZoneTile {
  key: string;
  label: string;
  count: number;
  /** Absent for a read-only zone, so the tile renders inert. */
  to?: string;
  loadingKind?: string;
  /** Small status pill above the figure. */
  pill?: { text: string; tone: PillTone };
}

export interface ZoneCard {
  label: string;
  sub: string;
  value: string | number;
  icon: string;
  loadingKind?: string;
}

export interface ZoneAction {
  label: string;
  screenId?: string;
  path?: string;
}

export interface ZoneSpec {
  heading: string;
  /** Line under the heading (landing-page zones). */
  subheading?: string;
  /** Icon-tile tint for the cards ('pink' for the product zone). */
  cardTone?: 'pink';
  headingIcon: string;
  tiles: ZoneTile[];
  cards: ZoneCard[];
  actions: ZoneAction[];
  /** Rendered under the cards - recently viewed customers, or recently
   * updated catalogue items. */
  listTitle?: string;
  listEmpty?: string;
  listItems?: { id: string; primary: string; secondary: string; to?: string; badge?: string }[];
}

export const ZONE_ICONS = ICONS;

/** Grid density follows the zone's size, so the same zone definition serves a
 * full-width Customer-First dashboard and a half-width Hybrid column. */
// Static class names (Tailwind reads them at build time). On a wide screen N items (up to six) share one row.
const XL_COLS: Record<number, string> = { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6' };

/**
 * How many columns item `i` of `n` takes, so that every row - including the last, partly filled one - spans the full width.
 * The grid is 2 columns on a phone, 6 from `sm` (items take 2 of 6, i.e. three across) and, on a wide screen, one column
 * per item. A last row left with one item gives it the whole row; with two items they split it in half.
 */
function itemSpan(i: number, n: number, size: ZoneSize) {
  const rest = n % 3;
  const sm = rest === 1 && i === n - 1 ? 'sm:col-span-6' : rest === 2 && i >= n - 2 ? 'sm:col-span-3' : 'sm:col-span-2';
  const phone = size !== 'half' && n % 2 === 1 && i === n - 1 ? 'col-span-2' : '';
  return `${phone} ${sm} ${size !== 'half' && n <= 6 ? 'xl:col-span-1' : ''}`;
}

function gridCols(size: ZoneSize, full: string, half: string) {
  return size === 'half' ? half : full;
}

export function DashboardZone({
  spec,
  size,
  readOnly,
  loading,
  errors,
  leadsPage = false,
}: {
  spec: ZoneSpec;
  size: ZoneSize;
  readOnly: boolean;
  loading: Record<string, boolean>;
  errors: Record<string, string | undefined>;
  /** The page's first zone: its first quick action is the one primary (red) button on the page. */
  leadsPage?: boolean;
}) {
  const navigate = useNavigate();
  const clearActiveCustomer = useCustomerContext((s) => s.clearActiveCustomer);

  // A collapsed zone still renders its heading so the Focus control's effect is
  // legible - you can see what you de-emphasised rather than it vanishing.
  if (size === 'collapsed') {
    return (
      <section className="card card-lg card-inherit-fill pad-panel">
        <div className="flex items-center gap-2.5 text-fg-2">
          <Icon path={spec.headingIcon} className="w-4.5 h-4.5 text-accent shrink-0" />
          <span className="font-medium text-[length:var(--fs-body)]">{spec.heading}</span>
          <span className="caption-muted ml-auto">
            {spec.tiles.length + spec.cards.length} metrics hidden by Focus
          </span>
        </div>
      </section>
    );
  }

  const launch = (action: ZoneAction) => {
    if (action.path) {
      navigate(action.path);
      return;
    }
    const route = action.screenId ? getAllRoutes().find((r) => r.screenId === action.screenId) : undefined;
    if (!route) return;
    clearActiveCustomer();
    navigate(route.path);
  };

  const value = (v: string | number, kind?: string) => {
    if (kind && loading[kind]) return '-';
    if (kind && errors[kind]) {
      return (
        <span className="text-danger text-[length:var(--fs-body)]" title={errors[kind]}>
          Failed to Load
        </span>
      );
    }
    return v;
  };

  return (
    <section className="min-w-0">
      <div className="split-top gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="title-md tracking-tight">{spec.heading}</h2>
          {spec.subheading && <p className="caption-secondary mt-0.5">{spec.subheading}</p>}
        </div>
      </div>

      {/* The zone's tiles and figure cards share ONE grid, so they sit side by side in a single row on a wide screen (up to five
          across) and every card is as wide as its content needs, instead of two rows of very wide, mostly empty cards. */}
      {spec.tiles.length + spec.cards.length > 0 && (
        <div className={`grid gap-4 mb-6 ${gridCols(size, `grid-cols-2 sm:grid-cols-6 ${spec.tiles.length + spec.cards.length <= 6 ? XL_COLS[spec.tiles.length + spec.cards.length] : ''}`, 'grid-cols-1 sm:grid-cols-6')}`}>
          {spec.tiles.map((tile, ti) => {
            const body = (
              <>
                {tile.pill ? (
                  <span title="Demo value - not yet connected to a live feed" className={`tile-pill ${PILL_TONES[tile.pill.tone]}`}>
                    {tile.pill.text}
                  </span>
                ) : (
                  <span className="block h-6" aria-hidden="true" />
                )}
                <div className="text-[length:var(--fs-stat)] leading-none font-extrabold text-fg mt-5">
                  {value(tile.count, tile.loadingKind)}
                </div>
                <div className="caption-secondary mt-2">{tile.label}</div>
              </>
            );
            const shell = `card card-lg card-inherit-fill p-5 ${itemSpan(ti, spec.tiles.length + spec.cards.length, size)}`;
            if (readOnly || !tile.to) return <div key={tile.key} className={shell}>{body}</div>;
            return (
              <Link
                key={tile.key}
                to={tile.to}
                className={`${shell} card-interactive`}
              >
                {body}
              </Link>
            );
          })}
          {spec.cards.map((card, ci) => (
            // As tall as its row (the grid stretches it), so every card in the row matches, with the figure pinned to the bottom.
            <div key={card.label} className={`card card-lg card-inherit-fill p-5 flex flex-col ${itemSpan(spec.tiles.length + ci, spec.tiles.length + spec.cards.length, size)}`}>
              <div className="split-top gap-3 mb-4">
                <div className="min-w-0">
                  <div className="font-bold text-fg text-[length:var(--fs-caption)] line-clamp-2">{card.label}</div>
                  <div className="text-muted text-[length:var(--fs-xs)] line-clamp-2">{card.sub}</div>
                </div>
                <span className={`w-10 h-10 rounded-[var(--radius-card)] ${spec.cardTone === 'pink' ? 'bg-surface-warm text-accent' : 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]'} icon-tile`}>
                  <Icon path={card.icon} className="w-4.5 h-4.5" />
                </span>
              </div>
              <div className="mt-auto text-[length:var(--fs-stat)] leading-none font-extrabold text-fg">
                {value(card.value, card.loadingKind)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions are suppressed entirely for a read-only role rather than
          rendered disabled - a row of dead buttons is worse than their absence. */}
      {!readOnly && spec.actions.length > 0 && (
        <>
          <div className="wrap-loose mb-6">
            {spec.actions.map((action, i) => (
              // The palette's soft pink fill (2026-09-27), standardised across
              // every secondary/clickable button in the app - see
              // ProductLinePage.tsx's category chips, the first place this
              // treatment landed. This was an outlined, unfilled button before,
              // the one shape in this family that had never picked up the fill.
              // It is the only one of the four that is a real <button type="button"> on a
              // button-shaped box, so it is the one that became the variant.
              // The first action leads in brand red; the rest are quiet white buttons with a soft shadow.
              leadsPage && i === 0 ? (
                <Button
                  key={action.label}
                  variant="primary"
                  onClick={() => launch(action)}
                  className="!px-5 !py-2.5 !text-[length:var(--fs-caption)]"
                >
                  {action.label}
                </Button>
              ) : (
                <Button key={action.label} variant="secondary" onClick={() => launch(action)} className="!px-5 !py-2.5 !text-[length:var(--fs-caption)]">
                  {action.label}
                </Button>
              )
            ))}
          </div>
        </>
      )}

      {spec.listTitle && (
        <>
          <h3 className="title-md mb-3">{spec.listTitle}</h3>
          {(spec.listItems ?? []).length === 0 && (
            <p className="text-muted text-[length:var(--fs-body)]">{spec.listEmpty}</p>
          )}
          <div className="space-y-2">
            {(spec.listItems ?? []).map((item) => {
              const body = (
                <>
                  <div className="min-w-0">
                    <div className="value-text truncate">{item.primary}</div>
                    <div className="caption-secondary truncate">{item.secondary}</div>
                  </div>
                  {item.badge ? (
                    <Badge variant="filled-neutral">{item.badge}</Badge>
                  ) : (
                    <Icon path={ICONS.openArrow} className="icon-sm text-muted" />
                  )}
                </>
              );
              const shell =
                'flex items-center justify-between gap-3 card card-lg card-inherit-fill px-4 py-3';
              if (readOnly || !item.to) return <div key={item.id} className={shell}>{body}</div>;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`${shell} card-interactive`}
                >
                  {body}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
