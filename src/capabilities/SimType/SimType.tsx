import type { ComponentProps } from 'react';
import { SimTypeStep } from '../../components/domain/SimTypeStep';

/**
 * SIM TYPE - the one application-wide capability for choosing and validating the SIM: Physical (scan or enter the
 * serial, validated against inventory) or eSIM (issued with an activation code, handed over after payment).
 *
 * Journeys mount THIS component (usually through simTypeStep); none of them mounts SimTypeStep itself.
 * `customerEmail` is where the eSIM's QR code is sent.
 */
export type SimTypeProps = ComponentProps<typeof SimTypeStep>;

export function SimType(props: SimTypeProps) {
  return <SimTypeStep {...props} />;
}
