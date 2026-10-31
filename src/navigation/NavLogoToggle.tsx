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
        className="group relative shrink-0 w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--nav-fg-muted)] hover:bg-[var(--nav-hover-bg)] focus-visible:bg-[var(--nav-hover-bg)] focus-visible:shadow-[var(--focus-ring)] focus:outline-none transition-colors duration-[var(--motion-base)]"
      >
        <VodafoneMark className="absolute w-7 h-7 transition-all duration-[var(--motion-base)] ease-out group-hover:opacity-0 group-hover:scale-75 group-focus-visible:opacity-0 group-focus-visible:scale-75" />
        <PanelIcon
          expanded={expanded}
          className="absolute w-6 h-6 text-[var(--nav-fg)] opacity-0 scale-75 transition-all duration-[var(--motion-base)] ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100"
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
        className="relative shrink-0 w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--nav-fg-muted)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-fg)] focus-visible:bg-[var(--nav-hover-bg)] focus-visible:shadow-[var(--focus-ring)] focus:outline-none transition-colors duration-[var(--motion-base)]"
      >
        <PanelIcon expanded={true} className="w-6 h-6" />
      </button>
    </Tooltip>
  );
}
