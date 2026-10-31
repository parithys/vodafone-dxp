import type { ComponentProps } from 'react';
import { AppointmentBookingStep } from '../../components/patterns/AppointmentBookingStep';

/**
 * APPOINTMENT BOOKING - the one application-wide capability for booking the installation visit: cluster, date and
 * time slot.
 *
 * Journeys mount THIS component (usually through appointmentBookingStep in wizard/wizardSteps); none of them
 * mounts AppointmentBookingStep itself, and none restates what makes a booking complete.
 */
export type AppointmentBookingProps = ComponentProps<typeof AppointmentBookingStep>;

export function AppointmentBooking(props: AppointmentBookingProps) {
  return <AppointmentBookingStep {...props} />;
}
