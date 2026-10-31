/**
 * The one place the app turns money, dates and sizes into text, so the same value reads the same everywhere
 * ("QAR 1,500" in checkout and in Customer 360; "12 Mar 2025, 14:32" in every history list). Locale is fixed to en-GB:
 * the app's own strings are English and the market uses day-first dates and 24-hour time.
 */
const LOCALE = 'en-GB';

const isEmpty = (v: unknown) => v === undefined || v === null || v === '';

/** "1,500" / "112.50" - an amount without its currency, for where "QAR" is drawn beside it: whole amounts have no decimals, fractional amounts always have two. */
export function formatAmount(amount: number): string {
  return Number.isInteger(amount)
    ? amount.toLocaleString(LOCALE)
    : amount.toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** formatAmount for any value: a number, or text that holds one, is formatted; other text passes through. */
export function formatAmountAny(v: unknown): string {
  if (typeof v === 'number') return formatAmount(v);
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return formatAmount(Number(v));
  return String(v ?? '');
}

/** "QAR 1,500" - whole amounts have no decimals, fractional amounts always have two ("QAR 112.50"). */
export function formatQar(amount: number, opts: { nbsp?: boolean } = {}): string {
  return `QAR${opts.nbsp ? ' ' : ' '}${formatAmount(amount)}`;
}

/** formatQar for any value: a number, or text that holds one ("12.5"), is formatted (two decimals when it has any); other text passes through after "QAR ". */
export function formatQarAny(v: unknown): string {
  if (typeof v === 'number') return formatQar(v);
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return formatQar(Number(v));
  return `QAR ${String(v ?? '')}`;
}

/** formatQar for a value that may be missing or not a number: numbers format, other text passes through, empty is undefined. */
export function formatQarLoose(v: unknown): string | undefined {
  if (isEmpty(v)) return undefined;
  return typeof v === 'number' ? formatQar(v) : `QAR ${String(v)}`;
}

const toDate = (v: unknown): Date | undefined => {
  if (isEmpty(v)) return undefined;
  const d = v instanceof Date ? v : new Date(typeof v === 'number' ? v : String(v));
  return Number.isNaN(d.getTime()) ? undefined : d;
};

/** "12/03/2025" (dd/mm/yyyy, the only date format the app shows). Unparseable text is returned as-is; empty is ''. */
export function formatDate(v: unknown): string {
  const d = toDate(v);
  if (!d) return isEmpty(v) ? '' : String(v);
  return d.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** "14:32" (24-hour). */
export function formatTime(v: unknown): string {
  const d = toDate(v);
  if (!d) return isEmpty(v) ? '' : String(v);
  return d.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}

/** "12/03/2025, 14:32". */
export function formatDateTime(v: unknown): string {
  const d = toDate(v);
  if (!d) return isEmpty(v) ? '' : String(v);
  return `${formatDate(d)}, ${formatTime(d)}`;
}

/** "03/2025" (mm/yyyy: a month with no day). */
export function formatMonthYear(v: unknown): string {
  const d = toDate(v);
  if (!d) return isEmpty(v) ? '' : String(v);
  return d.toLocaleDateString(LOCALE, { month: '2-digit', year: 'numeric' });
}

/** "1.2 MB", "340 KB", "812 B". */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
