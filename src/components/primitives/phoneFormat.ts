// Presentation-only formatting ("+974 50350824": the digits of the number are never split by a space) for a complete, valid
// +974-prefixed 8-digit local number (mobile or landline - Qatar numbers of
// either kind are 8 digits after the country code, so this isn't restricted
// to mobile-prefix digits). Kept exported: callers outside this field still
// format stored numbers for display.
export function formatQatarPhoneForDisplay(raw: string): string {
  const digits = raw.replace(/^\+/, '');
  if (!digits.startsWith('974')) return raw;
  const local = digits.slice(3);
  if (!/^\d{8}$/.test(local)) return raw;
  return `+974 ${local}`;
}
