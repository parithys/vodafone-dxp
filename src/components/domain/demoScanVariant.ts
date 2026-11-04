import { createContext } from 'react';

/**
 * A demo-only way to start the simulated card reader: a text link beside "Initiate scan" that makes the reader present a different kind of person (the demo has no
 * real reader, so which card it reads is the simulation's to choose). Provided by a journey piece that needs one (the Secondary Contact's "Scan Below 18");
 * the scanner shows the link only when a variant is provided, and only while demo content is on.
 *
 * `onSelect` is called before the pass starts and may refuse it by returning false (no such person to present). `onStandard` is called when the ordinary
 * "Initiate scan" starts, so the simulation returns to its normal card.
 */
export interface DemoScanVariant {
  label: string;
  onSelect: () => boolean | void;
  onStandard: () => void;
}

export const DemoScanVariantContext = createContext<DemoScanVariant | undefined>(undefined);
