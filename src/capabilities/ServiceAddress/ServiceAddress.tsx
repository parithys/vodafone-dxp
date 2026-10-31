import { ZsbAddressStep } from '../../components/patterns/ZsbAddressStep';
import type { ZsbAddressValue } from '../../components/patterns/ZsbAddressStep';

/**
 * SERVICE ADDRESS - the one application-wide capability for the address a service is activated at.
 *
 * Journeys mount THIS component (usually through serviceAddressStep in wizard/wizardSteps). There is ONE layout for it
 * everywhere: the Service Information card (Kahramaa Meter ID and Vodafone Premise ID, each with Search, which fills the
 * address from the matching record), then the Zone / Street / Building card, then Additional Details (area, flat / unit,
 * floor, directions). A Qatari ID's registered address is looked up and offered as an editable head start. New
 * Connection, Prepaid, MNP, Fixed Line, FWA and the installation journeys.
 */
export interface ServiceAddressProps {
  /** Kept for existing callers; the only mode. */
  mode?: 'structured';
  value: ZsbAddressValue;
  onChange: (value: ZsbAddressValue) => void;
  /** From Customer Verification: a Qatari national's registered address is prefilled. */
  idNumber?: string;
  nationality?: string;
  /** Show the Kahramaa Meter ID / Vodafone Premise ID card (default yes). A mobile line's journey leaves it out. */
  showServiceIds?: boolean;
}

export function ServiceAddress({ mode: _mode, ...rest }: ServiceAddressProps) {
  return <ZsbAddressStep {...rest} />;
}
