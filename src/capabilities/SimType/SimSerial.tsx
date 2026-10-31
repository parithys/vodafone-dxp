import type { ComponentProps } from 'react';
import { SimSerialScanner } from '../../components/domain/SimSerialScanner';

/**
 * SIM SERIAL - scan or enter a SIM's serial number and validate it against inventory. Part of the SIM Type
 * capability: the Physical option of SIM Type is this, and journeys that only need the serial (port-in, SIM swap,
 * the dual-play serial check) mount it directly. `onChange` reports the serial, whether it validated, and - the
 * moment validation succeeds - the ICCID and stock status.
 */
export type SimSerialProps = ComponentProps<typeof SimSerialScanner>;

export function SimSerial(props: SimSerialProps) {
  return <SimSerialScanner {...props} />;
}
