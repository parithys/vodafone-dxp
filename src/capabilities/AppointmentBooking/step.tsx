import { APPOINTMENT_LABEL } from '../../data/stepLabels';
import type { WizardStep } from '../../components/patterns/wizard/guidedWizardTypes';
import { AppointmentBooking } from './AppointmentBooking';
import { isAppointmentComplete } from '../../components/patterns/appointmentModel';
import type { AppointmentBookingValue } from '../../components/patterns/appointmentModel';

/**
 * Appointment booking, stored under `appointment`; complete once a cluster, date and time slot are chosen and, when the customer asked
 * for a specific date and time, that request is complete and within the allowed dates.
 */
export function appointmentBookingStep(): WizardStep {
  return {
    key: 'appointment',
    label: APPOINTMENT_LABEL,
    render: ({ values, setValue }) => (
      <AppointmentBooking value={(values.appointment as AppointmentBookingValue) ?? {}} onChange={(v) => setValue('appointment', v)} />
    ),
    isValid: (values) => isAppointmentComplete(values.appointment as AppointmentBookingValue | undefined),
  };
}
