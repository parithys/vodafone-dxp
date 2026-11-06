import { createContext, useContext } from 'react';

export interface TooltipGroupContextValue {
  isGroupActive: () => boolean;
  activateGroup: () => void;
}

export const TooltipGroupContext = createContext<TooltipGroupContextValue | null>(null);

export function useTooltipGroup() {
  return useContext(TooltipGroupContext);
}
