import { getPersona, getCustomer360FieldsForTopic, getCustomer360Department } from './configEngine';
import type { Customer360Field } from '../types/config';

export type FieldVisibility = 'real-time' | 'drill-down' | 'hidden';

/**
 * Fulfilment (VFQ12354) and Back Office Fulfilment (VFQ12355) -
 * the two personas the Mapping sheet names but "Customer 360 List - FINAL"
 * has no department column for at all (2026-09-28 direction, confirmed
 * rather than inferred a department match that doesn't exist in the source).
 * They get exactly two things: whatever is Real Time for literally every
 * department the source DOES cover ("common to all"), and Drill Down access
 * to the three topics their own order/install-fulfilment work actually
 * touches. Everything else stays hidden rather than guessed at.
 */
const FULFILMENT_FALLBACK_STAFF_IDS = new Set(['VFQ12354', 'VFQ12355']);
const FULFILMENT_FALLBACK_DRILLDOWN_TOPICS = new Set(['Assets', 'Account Information', 'Activation/Modification Sidebar']);

/** True when every department the source assigned a value to for this field
 * agrees it's Real Time - the "common to all" rows the fulfilment fallback
 * above borrows from. A field with zero assigned departments is not common to
 * anything, so it does not qualify. */
function isRealTimeForEveryDepartment(field: Customer360Field): boolean {
  const values = Object.values(field.departments);
  return values.length > 0 && values.every((v) => v === 'real-time');
}

function findField(topic: string, details: string): Customer360Field | undefined {
  return getCustomer360FieldsForTopic(topic).find((f) => f.details === details);
}

/**
 * What a given persona sees for one Customer 360 field, straight from
 * "Customer 360 List - FINAL": 'real-time' renders inline (on the overview or
 * inside the topic's own tab), 'drill-down' requires the agent to open a
 * dedicated view, 'hidden' covers both the source's explicit 'n-a' and a
 * department cell the source simply left blank - see Customer360Field's own
 * note on why those two are kept distinct in the stored data even though they
 * resolve the same way here.
 */
export function getFieldVisibility(personaId: string | undefined, topic: string, details: string): FieldVisibility {
  if (!personaId) return 'hidden';
  const field = findField(topic, details);
  if (!field) return 'hidden';
  const persona = getPersona(personaId);
  if (!persona) return 'hidden';

  if (FULFILMENT_FALLBACK_STAFF_IDS.has(persona.staffId)) {
    if (isRealTimeForEveryDepartment(field)) return 'real-time';
    return FULFILMENT_FALLBACK_DRILLDOWN_TOPICS.has(topic) ? 'drill-down' : 'hidden';
  }

  const department = getCustomer360Department(persona.staffId);
  if (!department) return 'hidden';
  const value = field.departments[department];
  return value === 'real-time' || value === 'drill-down' ? value : 'hidden';
}

/** Every field row declared for a topic, in source order - callers combine
 * this with getFieldVisibility() per field rather than the engine baking
 * persona filtering into the list itself, so a section component can still
 * render its own "nothing to show" state instead of an empty list looking
 * like a loading failure. */
export function getTopicFields(topic: string): Customer360Field[] {
  return getCustomer360FieldsForTopic(topic);
}

/** The subset of a topic's fields this persona can see at all (Real Time or
 * Drill Down), each paired with which of the two it gets. */
export function getVisibleTopicFields(
  personaId: string | undefined,
  topic: string
): { field: Customer360Field; visibility: 'real-time' | 'drill-down' }[] {
  return getTopicFields(topic)
    .map((field) => ({ field, visibility: getFieldVisibility(personaId, topic, field.details) }))
    .filter((row): row is { field: Customer360Field; visibility: 'real-time' | 'drill-down' } => row.visibility !== 'hidden');
}

/** Whether a topic/tab has anything at all to show this persona - drives
 * whether the tab itself appears (e.g. Blacklist View, Penalty View, EBU stay
 * off the tab strip entirely for a persona with zero visible fields there,
 * rather than showing an empty tab). */
export function isTopicVisible(personaId: string | undefined, topic: string): boolean {
  return getVisibleTopicFields(personaId, topic).length > 0;
}
