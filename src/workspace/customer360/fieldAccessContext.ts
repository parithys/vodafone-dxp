import { createContext, useContext } from 'react';

export type AccessMode = 'real-time' | 'drill-down' | 'hidden';

export type ModeOf = (label: string | undefined) => AccessMode;
export const allowAll: ModeOf = () => 'real-time';
export const AccessContext = createContext<ModeOf>(allowAll);

/** The access mode for a label on the current page. */
export function useFieldAccess(): ModeOf {
  return useContext(AccessContext);
}
