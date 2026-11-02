import { Tooltip } from '../components/primitives/Tooltip';
import { VodafoneMark } from '../components/primitives/VodafoneMark';
import { PanelIcon } from '../components/primitives/PanelIcon';

/**
 * The brand logo that doubles as the side navigation's collapse / expand control. At rest it is the Vodafone mark; when the
 * pointer (or keyboard focus) is on it the mark cross-fades into the collapse icon (navigation expanded) or the expand icon
 * (navigation collapsed), with a tooltip naming the action. Pressing it toggles the navigation.
 */
export function NavLogoToggle({
  expanded,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: {
  expanded: boolean;
  onToggle: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
}) {
  const label = expanded ? 'Collapse navigation' : 'Expand navigation';
  return (
    <Tooltip content={label} placement="right">
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        aria-label={label}
        aria-expanded={expanded}
        className="group relative nav-icon-tile nav-ghost-quiet focus-ring"
      >
        <VodafoneMark className="logo-swap-out" />
        <PanelIcon
          expanded={expanded}
          className="logo-swap-in"
        />
      </button>
    </Tooltip>
  );
}

/**
 * The collapse control shown on the right of the expanded navigation's header: the panel icon, always visible
 * (the logo on the left is then just the brand). Collapsed, the logo toggle above is the way back.
 */
export function NavCollapseButton({ onToggle }: { onToggle: () => void }) {
  return (
    <Tooltip content="Collapse navigation" placement="right">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Collapse navigation"
        aria-expanded={true}
        className="relative nav-icon-tile nav-ghost focus-visible:bg-[var(--nav-hover-bg)] focus-ring"
      >
        <PanelIcon expanded={true} className="size-6 " />
      </button>
    </Tooltip>
  );
}
