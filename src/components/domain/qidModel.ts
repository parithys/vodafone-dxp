import { ID_TYPES } from '../../data/idTypes';
import type { IdType } from '../../data/idTypes';

/** The label of an ID type's number field, e.g. "Qatar ID (QID) Number". */
export function idNumberLabel(idType: IdType): string {
  return (ID_TYPES.find((t) => t.type === idType) ?? ID_TYPES[0]).numberLabel;
}
