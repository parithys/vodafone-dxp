import { createContext, useContext, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

interface TooltipGroupContextValue {
  isGroupActive: () => boolean;
  activateGroup: () => void;
}

const TooltipGroupContext = createContext<TooltipGroupContextValue | null>(null);

// Wrap an icon row/toolbar/nav in this so consecutive tooltips in the same
// cluster skip the full show-delay after the first one appears - matches
// how sidebars and topbars actually get scanned by mouse. Optional; Tooltip
// works standalone without a provider.
export function TooltipGroup({ children }: { children: ReactNode }) {
  const activeUntil = useRef<number>(0);

  const isGroupActive = useCallback(() => Date.now() < activeUntil.current, []);

  const activateGroup = useCallback(() => {
    const groupWindow = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--tooltip-group-window') || '500',
      10
    );
    activeUntil.current = Date.now() + groupWindow;
  }, []);

  return <TooltipGroupContext.Provider value={{ isGroupActive, activateGroup }}>{children}</TooltipGroupContext.Provider>;
}

export function useTooltipGroup() {
  return useContext(TooltipGroupContext);
}
