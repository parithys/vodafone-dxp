// The service options a new postpaid line is created with (chosen on the plan's extras page).
export interface ServiceOptions {
  dnd: boolean;
  dob: boolean;
  vas: boolean;
}
/** A new line starts with all three on; the agent unticks what the customer declines. */
export const DEFAULT_SERVICE_OPTIONS: ServiceOptions = { dnd: true, dob: true, vas: true };
