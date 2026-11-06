import { toneFor, type Tone } from '../../../lib/statusTone';
import { formatDate, formatQarLoose, formatTime } from '../../../lib/format';
import { ACTIVE, ACTIVITY, ALERT, BAN, BELL, C360_KIT_BUILDING, CALENDAR_ICON, CHECK, CHEVRON_DOWN, CHEVRON_LEFT, CHEVRON_RIGHT, CLEAR_ICON, CLIPBOARD, CLOCK, COPY, CPU, DATABASE, DOWNLOAD, EDIT, EYE_ICON, FILTER, FLAG, GIFT, GLOBE_ICON, HEADSET, HISTORY, HOME, IC_ARROW_RIGHT, IC_BARS, IC_BOX, IC_CARD, IC_CART, IC_EXTERNAL, IC_FILE, IC_LOCK, IC_PIN, IC_STAR, IC_SWAP, IC_TAG, INFO, LAYERS, LINK, MAIL_ICON, MOBILE, PERSON, PHONE_ICON, PLUS_ICON, RECEIPT, REFRESH, SEARCH, SETTINGS, SHIELD, SHIELD_CHECK, SIGNAL_TOWER, TARGET, TREND, TV, USERS, WALLET, WIFI, X_CIRCLE } from '../../../assets/icons';

export const IC = {
  calendar: CALENDAR_ICON,
  user: PERSON,
  users: USERS,
  phone: PHONE_ICON,
  mail: MAIL_ICON,
  globe: GLOBE_ICON,
  shield: SHIELD,
  shieldCheck: SHIELD_CHECK,
  alert: ALERT,
  info: INFO,
  check: CHECK,
  checkCircle: ACTIVE,
  xCircle: X_CIRCLE,
  x: CLEAR_ICON,
  clock: CLOCK,
  file: IC_FILE,
  card: IC_CARD,
  wallet: WALLET,
  bars: IC_BARS,
  tag: IC_TAG,
  star: IC_STAR,
  gift: GIFT,
  target: TARGET,
  flag: FLAG,
  ban: BAN,
  home: HOME,
  building: C360_KIT_BUILDING,
  pin: IC_PIN,
  settings: SETTINGS,
  refresh: REFRESH,
  download: DOWNLOAD,
  external: IC_EXTERNAL,
  plus: PLUS_ICON,
  edit: EDIT,
  chevRight: CHEVRON_RIGHT,
  chevLeft: CHEVRON_LEFT,
  chevDown: CHEVRON_DOWN,
  arrowRight: IC_ARROW_RIGHT,
  search: SEARCH,
  filter: FILTER,
  box: IC_BOX,
  cart: IC_CART,
  headset: HEADSET,
  bell: BELL,
  link: LINK,
  eye: EYE_ICON,
  history: HISTORY,
  swap: IC_SWAP,
  layers: LAYERS,
  database: DATABASE,
  mobile: MOBILE,
  wifi: WIFI,
  tv: TV,
  cpu: CPU,
  clipboard: CLIPBOARD,
  activity: ACTIVITY,
  copy: COPY,
  lock: IC_LOCK,
  receipt: RECEIPT,
  signalTower: SIGNAL_TOWER,
  trend: TREND,
} as const;

/** Tinted fill + foreground per tone, from design tokens. */
export const TONE: Record<Tone, { bg: string; fg: string; border: string }> = {
  red: { bg: 'bg-tone-accent', fg: 'text-accent', border: 'border-[var(--danger-border)]' },
  green: { bg: 'bg-tone-success', fg: 'text-success', border: 'border-[var(--success-border)]' },
  amber: { bg: 'bg-[var(--warn-bg)]', fg: 'text-[var(--warn-text)]', border: 'border-[var(--warn-border)]' },
  blue: { bg: 'bg-tone-blue', fg: 'text-[var(--signal-blue)]', border: 'border-tone-blue-border' },
  purple: { bg: 'bg-tone-info', fg: 'text-[var(--info)]', border: 'border-[var(--info-border)]' },
  grey: { bg: 'bg-[var(--surface)]', fg: 'text-fg-2', border: 'border-[var(--field-card-border)]' },
};

export { toneFor, type Tone };

// Paging is the Pagination capability's (capabilities/Pagination): one hook, one bar, one pager for every paged list.
export { usePagination as usePaging } from '../../../capabilities';

export const fmtDate = (v: unknown): string | undefined => (v === undefined || v === null || v === '' ? undefined : formatDate(v));

export const fmtDateTime = (v: unknown): { date?: string; time?: string } => {
  if (v === undefined || v === null || v === '') return {};
  return { date: formatDate(v), time: /T\d/.test(String(v)) ? formatTime(v) : undefined };
};

export const qar = formatQarLoose;
