import type { ZsbAddressValue } from './ZsbAddressStep';

/** What the Address fields hold when there is no billing address to take them from. */
export const ADDRESS_PLACEHOLDER = '-';

/** The Address step's value when it was filled in for the agent (not typed), and which source it came from: a billing profile's id, or 'none'. */
export type PrefilledAddress = ZsbAddressValue & { prefilledKey?: string };

const labelled = (line: string, word: string): string | undefined => new RegExp(`\\b${word}\\s*(?:no\\.?|number)?\\s*:?\\s*(\\d+)`, 'i').exec(line)?.[1];

/**
 * The secondary Address, filled from a billing profile's billing address. The profile holds ONE free-text line (not zone / street / building),
 * so the line is kept whole as the address line, and Zone, Street and Building are taken only where the line itself labels them ("Zone 45,
 * Street 12"); anything it does not name is the placeholder, never guessed. A profile with no address (empty, "None") gives the placeholder
 * for the three numbers.
 */
export function addressFromBillingLine(line: string | null | undefined): ZsbAddressValue {
  const text = (line ?? '').trim();
  if (!text || /^none$/i.test(text)) return { zone: ADDRESS_PLACEHOLDER, streetNo: ADDRESS_PLACEHOLDER, buildingNo: ADDRESS_PLACEHOLDER };
  return {
    zone: labelled(text, 'zone') ?? ADDRESS_PLACEHOLDER,
    streetNo: labelled(text, 'street') ?? ADDRESS_PLACEHOLDER,
    buildingNo: labelled(text, 'building') ?? ADDRESS_PLACEHOLDER,
    addressLine: text,
  };
}

/** Whether the Address holds anything an agent (or a registry fetch) put there, as opposed to nothing or an automatic prefill. */
export const addressIsEntered = (a: PrefilledAddress | undefined): boolean =>
  Boolean(a) && !a?.prefilledKey && Object.values(a ?? {}).some((v) => v !== undefined && v !== '');

/** The address as one line for a stored billing profile: only what is a value (the placeholder "-" is none), or undefined when nothing is. */
export function storedAddressLine(a: { zone?: string; streetNo?: string; buildingNo?: string } | undefined): string | undefined {
  const real = (v: string | undefined) => (v && v.trim() && v.trim() !== ADDRESS_PLACEHOLDER ? v.trim() : undefined);
  return [real(a?.zone) && `Zone ${real(a?.zone)}`, real(a?.streetNo) && `Street ${real(a?.streetNo)}`, real(a?.buildingNo) && `Building ${real(a?.buildingNo)}`].filter(Boolean).join(', ') || undefined;
}
