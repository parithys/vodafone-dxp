import { useState, useRef, useEffect, useCallback, useId, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipGroup } from './TooltipContext';
import { Badge } from './Badge';

// A tooltip on something a keyboard can't reach is information only a mouse can read: plain text elements and badges
// become focusable when they carry one (a control, link or anything already given a tabIndex is left alone).
const NON_INTERACTIVE_TAGS = new Set(['span', 'div', 'p', 'strong', 'em', 'small', 'li', 'dd', 'dt', 'td', 'th', 'svg']);

type Placement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /** The tooltip copy - a label (1-5 words), not documentation. */
  content: ReactNode;
  /** A single interactive element: icon button, control, chip, etc. */
  children: ReactElement;
  /** Default "right" - matches sidebar/toolbar icon-row convention. */
  placement?: Placement;
  /** Skip wrapping when the control already has a visible, permanent label. */
  disabled?: boolean;
  /** Measure the gap from this element's edge instead of the trigger's, on
   * the axis the tooltip extends along. Only the axis moves - the tooltip
   * still centres on the trigger across it.
   *
   * For triggers that sit INSET inside a surface the tooltip should line up
   * with. The collapsed nav rail is the case: its icon buttons are inset by
   * 8px, so a tooltip measured from the button lands 8px left of the sub-menu
   * flyouts, which measure from the rail edge - two hover overlays on the same
   * rail, at two different x positions.
   *
   * A ref, not an element: a leaf row's hover doesn't re-render the Sidebar,
   * so a plain element prop would stay frozen at the `null` it held on the
   * first render. */
  anchorRef?: RefObject<HTMLElement | null>;
}

const VIEWPORT_MARGIN = 8;

/** A pixel token read from the root. A token written as an expression (calc(var(--space-unit) * 2)) does not parse as a number, so a fallback is used rather than NaN: a NaN offset left the tooltip with no top and it drew off the bottom of the screen. */
function pxToken(name: string, fallback: number): number {
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(n) ? n : fallback;
}

// Portal-rendered hover/focus tooltip - see .claude/skills/hover-tooltip.
// Never nested inline (would get clipped by ancestor overflow:hidden), never
// a native title="" (inconsistent OS-level delay, no touch support).
export function Tooltip({ content, children, placement = 'right', disabled = false, anchorRef }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [resolvedPlacement, setResolvedPlacement] = useState<Placement>(placement);
  const [wraps, setWraps] = useState(false);

  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const group = useTooltipGroup();

  // useCallback so the two effects below can list it as a dependency: it now
  // closes over the anchorRef prop, so it is no longer trivially stable.
  const computePosition = useCallback((place: Placement) => {
    const trigger = triggerRef.current;
    if (!trigger) return null;

    const triggerRect = trigger.getBoundingClientRect();
    // The offset axis comes from the anchor when one is given, the centring
    // axis always from the trigger. Read at measure time, not render time, so
    // it reflects the rail's current width rather than a stale collapsed one.
    const offsetRect = anchorRef?.current?.getBoundingClientRect() ?? triggerRect;
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const tw = tooltipRect?.width ?? 0;
    const th = tooltipRect?.height ?? 0;
    const offset = pxToken('--tooltip-offset', 8);

    const positions: Record<Placement, { top: number; left: number }> = {
      right: { top: triggerRect.top + triggerRect.height / 2 - th / 2, left: offsetRect.right + offset },
      left: { top: triggerRect.top + triggerRect.height / 2 - th / 2, left: offsetRect.left - tw - offset },
      top: { top: offsetRect.top - th - offset, left: triggerRect.left + triggerRect.width / 2 - tw / 2 },
      bottom: { top: offsetRect.bottom + offset, left: triggerRect.left + triggerRect.width / 2 - tw / 2 },
    };

    return { pos: positions[place], tw, th };
  }, [anchorRef]);

  // Collision-aware placement: flip if the preferred side would clip the
  // viewport. Runs after first paint once the tooltip has real dimensions.
  useEffect(() => {
    if (!visible) return;

    const result = computePosition(placement);
    if (!result) return;
    let { pos, tw, th } = result;
    let finalPlacement = placement;

    const overflowsRight = pos.left + tw > window.innerWidth - VIEWPORT_MARGIN;
    const overflowsLeft = pos.left < VIEWPORT_MARGIN;
    const overflowsBottom = pos.top + th > window.innerHeight - VIEWPORT_MARGIN;
    const overflowsTop = pos.top < VIEWPORT_MARGIN;

    if (placement === 'right' && overflowsRight) finalPlacement = 'left';
    if (placement === 'left' && overflowsLeft) finalPlacement = 'right';
    if (placement === 'top' && overflowsTop) finalPlacement = 'bottom';
    if (placement === 'bottom' && overflowsBottom) finalPlacement = 'top';

    if (finalPlacement !== placement) {
      const flipped = computePosition(finalPlacement);
      if (flipped) pos = flipped.pos;
    }

    pos.left = Math.min(Math.max(pos.left, VIEWPORT_MARGIN), window.innerWidth - tw - VIEWPORT_MARGIN);
    pos.top = Math.min(Math.max(pos.top, VIEWPORT_MARGIN), window.innerHeight - th - VIEWPORT_MARGIN);

    setResolvedPlacement(finalPlacement);
    setCoords(pos);

    const maxWidth = pxToken('--tooltip-max-width', 240);
    setWraps(tw >= maxWidth - 1);
  }, [visible, placement, computePosition]);

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const handleShow = () => {
    if (disabled || !content) return;
    clearTimers();

    const isGroupActive = group?.isGroupActive();
    const delayVar = isGroupActive ? '--tooltip-show-delay-grouped' : '--tooltip-show-delay';
    const delay = parseInt(getComputedStyle(document.documentElement).getPropertyValue(delayVar) || '0', 10);

    showTimer.current = setTimeout(() => {
      setVisible(true);
      group?.activateGroup();
    }, delay);
  };

  const handleHide = () => {
    clearTimers();
    const delay = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tooltip-hide-delay') || '0', 10);
    hideTimer.current = setTimeout(() => setVisible(false), delay);
  };

  // Escape dismisses without moving the pointer or losing focus (WCAG 1.4.13).
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const reposition = () => {
      const result = computePosition(resolvedPlacement);
      if (result) setCoords(result.pos);
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [visible, resolvedPlacement, computePosition]);

  useEffect(() => clearTimers, []);

  if (!isValidElement(children)) return children;
  if (disabled) return children;

  const childProps = children.props as Record<string, unknown>;
  const needsFocus = (typeof children.type === 'string' ? NON_INTERACTIVE_TAGS.has(children.type) : children.type === Badge) && childProps.tabIndex === undefined;
  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const childRef = (children as unknown as { ref?: unknown }).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') (childRef as { current: HTMLElement | null }).current = node;
    },
    onMouseEnter: (e: React.MouseEvent) => {
      (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      handleShow();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      handleHide();
    },
    onFocus: (e: React.FocusEvent) => {
      (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      handleShow();
    },
    onBlur: (e: React.FocusEvent) => {
      (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      handleHide();
    },
    'aria-describedby': visible ? id : undefined,
    ...(needsFocus ? { tabIndex: 0 } : {}),
  });

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            data-placement={resolvedPlacement}
            data-state={coords ? 'visible' : 'positioning'}
            className={`tooltip-surface${wraps ? ' tooltip-surface--wrap' : ''}`}
            onMouseEnter={clearTimers}
            onMouseLeave={handleHide}
            style={coords ? { top: coords.top, left: coords.left } : { top: -9999, left: -9999 }}
          >
            <span className="tooltip-surface__label">{content}</span>
          </div>,
          document.body
        )}
    </>
  );
}
