// Small value coercions shared across screens. Records come from JSON, so every field is `unknown`
// until it has been checked; these two turn "missing" (undefined / null / empty string) into a
// single, predictable shape.

/** A displayable string, or undefined when the value is missing (undefined, null or ''). */
export const str = (v: unknown): string | undefined => (v === undefined || v === null || v === '' ? undefined : String(v));

/** Like `str`, but a missing value becomes '' - for callers that concatenate or always render text. */
export const strOrEmpty = (v: unknown): string => (v === undefined || v === null || v === '' ? '' : String(v));

/** A finite-looking number, or undefined when the value is missing or not numeric. */
export const num = (v: unknown): number | undefined =>
  v === undefined || v === null || v === '' || Number.isNaN(Number(v)) ? undefined : Number(v);
