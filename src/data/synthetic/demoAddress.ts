import { SHOW_DEMO_CONTENT } from './syntheticMarker';

/** The placeholder every field of the demonstration address holds: no real value, just "-". */
const DASH = '-';

/**
 * A placeholder address that fills an Address step that has nothing in it, so the page does not read blank in a demonstration. Every field is "-":
 * synthetic, not customer data, and with VITE_SHOW_DEMO=false it is not offered (the step stays as it was).
 */
export const DEMO_ADDRESS = {
  zone: DASH,
  streetNo: DASH,
  buildingNo: DASH,
  aptFlatUnit: DASH,
  floor: DASH,
  poBox: DASH,
  area: DASH,
  country: DASH,
  addressLine: DASH,
} as const;

export const demoAddressOffered = SHOW_DEMO_CONTENT;
