import { sortByBusinessUnit } from './personaOrder';
import { EmptyState } from '../components/primitives/EmptyState';
import { purgeProtectedDataForRole } from '../engines/roleSwitchPurge';
import { formatTime } from '../lib/format';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkflowInbox } from './useWorkflowInbox';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useNotificationStore } from '../stores/notificationStore';
import { getAllPersonas } from '../engines/configEngine';
import { pickProfileForRole } from '../engines/agentProfileEngine';
import { NavLogoToggle } from './NavLogoToggle';
import { Icon } from '../components/primitives/Icon';
import { Select } from '../components/primitives/Select';
import { Modal } from '../components/primitives/Modal';
import { Button } from '../components/primitives/Button';
import { draftHasProgress, useWorkflowStore } from '../stores/workflowStore';
import { Tooltip } from '../components/primitives/Tooltip';
import { TooltipGroup } from '../components/primitives/TooltipContext';
import { useSidebarStore } from '../stores/sidebarStore';
import { useQnomyQueueStore } from '../stores/qnomyQueueStore';
import { usePersonaStore } from '../stores/personaStore';
import { canSeeQnomyTicketNumber } from '../engines/agentPrivilegeEngine';
import { GlobalSearch } from './GlobalSearch';
import { SessionReferenceNumbers } from './SessionReferenceNumbers';
import { HeaderContextChips } from './HeaderContextChips';
import { useMinWidth } from '../hooks/useMinWidth';
import { detectDeviceType } from '../lib/deviceType';

const ICONS = {
  moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
  sun: 'M12 4V2 M12 22v-2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4 M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  bell: 'M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8z M9.5 17a2.5 2.5 0 0 0 5 0',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.2 9a2.8 2.8 0 1 1 3.9 2.6c-.9.4-1.4 1-1.4 2 M12 17h.01',
  chevronDown: 'M6 9l6 6 6-6',
  signOut: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
};

// Top bar: theme toggle, notifications, help, and a profile chip (with
// "Logged in as" role-switching moved into its dropdown) - replaces the
// earlier plain "Logged in as [Select] · Sign out" bar. Persona switching
// itself is unchanged (frontend-architecture.md §8's dev/demo "login-as"
// control, not a real auth boundary); it's just relocated.
//
// The in-menu "Switch role" control was removed on 2026-09-25 in favour of
// signing out and back in as a different Staff ID, then restored on
// 2026-09-29 at the user's request so a persona/department comparison
// (e.g. seeing which Customer 360 tabs a given department can see) doesn't
// require a full re-login per role. setActivePersona/pickProfileForRole were
// deliberately kept wired for exactly this reuse across both removals.
export function PersonaSwitcher() {
  const activePersonaId = usePersonaStore((s) => s.activePersonaId);
  const setActivePersona = usePersonaStore((s) => s.setActivePersona);
  const staffId = useAuthStore((s) => s.staffId);
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const setProfile = useAuthStore((s) => s.setProfile);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const history = useNotificationStore((s) => s.history);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const pushToast = useNotificationStore((s) => s.pushToast);
  const toggleMobileOpen = useSidebarStore((s) => s.toggleMobileOpen);
  const sidebarPinned = useSidebarStore((s) => s.pinned);
  // The queue indicator and Next Customer are a web-layout feature: not shown on a tablet or phone (narrow window or touch).
  const showQueue = useMinWidth(1024) && detectDeviceType() === 'web';
  const toggleSidebarPinned = useSidebarStore((s) => s.togglePinned);
  const customersServed = useQnomyQueueStore((s) => s.customersServed);
  const personas = getAllPersonas();
  // A journey with progress in it is lost on sign-out (the page reloads)
  // (and the new role may not be able to continue it) so both ask first; closing or reloading the tab warns too.
  const hasUnsavedJourney = useWorkflowStore((s) => Object.values(s.drafts).some(draftHasProgress));
  const [pendingLeave, setPendingLeave] = useState<null | { kind: 'signOut' } | { kind: 'role'; personaId: string }>(null);
  useEffect(() => {
    if (!hasUnsavedJourney) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedJourney]);
  // Same gate the Qnomy ticket control uses, so the counter appears exactly
  // for the roles that can actually finish a walk-in.
  const showQnomy = canSeeQnomyTicketNumber(activePersonaId);
  const inbox = useWorkflowInbox();
  const navigate = useNavigate();
  const unreadCount = history.filter((h) => !h.read).length + inbox.unseen;

  const [open, setOpen] = useState<'notifications' | 'profile' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggle = (panel: 'notifications' | 'profile') => {
    setOpen((prev) => (prev === panel ? null : panel));
    if (panel === 'notifications') {
      markAllRead();
      inbox.markSeen();
    }
  };

  // Whatever the app kept about a protected-segment customer this role may not see (active customer, journey hold and draft, notifications that name
  // them) is dropped when the role changes - and on load, for a role that cannot see what a previous one left behind.
  useEffect(() => {
    void purgeProtectedDataForRole(activePersonaId);
  }, [activePersonaId]);

  const initials = profile ? `${profile.name.split(' ')[0][0]}${profile.name.split(' ').slice(-1)[0][0]}` : '??';

  // Switching role must fully swap the displayed identity too - not just the
  // RBAC-driving personaId - otherwise the profile chip keeps showing the
  // login-time agent even after picking a different role, which is what
  // made this look like it required a sign-out/sign-in to take effect.
  // The profile is resolved FIRST and the persona and profile are then set together: setting the persona first left the new role with the
  // previous agent's identity for the (random 200-600 ms) lookup, and for ever if it failed. A later switch wins over an earlier one still in flight.
  const latestSwitch = useRef(0);
  const switchRole = async (personaId: string) => {
    const mine = ++latestSwitch.current;
    try {
      const newProfile = await pickProfileForRole(personaId);
      if (mine !== latestSwitch.current) return;
      setActivePersona(personaId);
      setProfile(newProfile);
    } catch (e) {
      if (mine !== latestSwitch.current) return;
      console.error('Role switch failed', e);
      pushToast('error', 'Could not switch role.', { detail: 'The role has no agent identity configured. You are still signed in as before.' });
    }
  };
  const handleRoleSwitch = (personaId: string) => {
    if (personaId === activePersonaId) return;
    if (hasUnsavedJourney) setPendingLeave({ kind: 'role', personaId });
    else void switchRole(personaId);
  };
  const requestSignOut = () => {
    if (hasUnsavedJourney) setPendingLeave({ kind: 'signOut' });
    else signOut();
  };
  const confirmLeave = () => {
    const p = pendingLeave;
    setPendingLeave(null);
    if (p?.kind === 'signOut') signOut();
    else if (p?.kind === 'role') void switchRole(p.personaId);
  };

  return (
    // Bottom border is --nav-border, not --border-soft: this bar and the
    // sidebar's logo header are both h-16 with a bottom border, sitting side
    // by side, so they read as ONE horizontal rule across the shell. At
    // --border-soft (#eeeeee) against the rail's #e0e0e0 the line visibly
    // stepped where they met. Sharing the token rather than copying the value
    // keeps them joined in dark mode too, where the two resolve differently
    // (#3a3d42 vs rgba(255,255,255,.1)).
    <header className="relative z-[var(--z-header)] grid grid-cols-[auto_minmax(0,1fr)_auto] md:grid-cols-[auto_minmax(8rem,28rem)_minmax(max-content,1fr)_auto] items-center gap-3 h-16 px-4 border-b border-[var(--nav-border)] bg-header-glass backdrop-blur">
      <button type="button"
        onClick={toggleMobileOpen}
        aria-label="Open navigation"
        className="md:hidden col-start-1 w-9 h-9 -ml-1 rounded-[var(--radius-pill)] flex items-center justify-center text-fg-2 hover:bg-surface shrink-0"
      >
        <Icon path={ICONS.menu} className="w-5 h-5" />
      </button>
      {/* Desktop: the side navigation is hidden until pinned. Hovering this previews it over the page; clicking pins it open. */}
      {!sidebarPinned && (
        <div className="hidden md:flex col-start-1 -ml-1 shrink-0">
          {/* Collapsed: the brand logo, which becomes the expand icon on hover (see NavLogoToggle). Only a click expands the navigation. */}
          <NavLogoToggle expanded={false} onToggle={toggleSidebarPinned} />
        </div>
      )}
      <div className="col-start-2 w-full">
        <GlobalSearch />
      </div>
      {/* One flex strip so the session reference numbers and the
          approach-driven context chips sit side by side rather than stacking. */}
      <div className="hidden md:flex col-start-3 justify-self-center items-center gap-3">
        {showQueue && <SessionReferenceNumbers />}
        <HeaderContextChips />
      </div>

      <TooltipGroup>
      <div ref={containerRef} className="col-start-3 md:col-start-4 justify-self-end ml-auto flex items-center gap-2">
        {/* Customers served this session. The COUNT alone is on screen and
            "Customers Served" is the tooltip, per direction - the topbar is
            already dense, and a bare figure beside the icon row reads as a
            counter without a label competing with the search box and the
            profile chip for width.

            Only for roles that work the walk-in queue: the same gate the
            Qnomy ticket control uses. A back-office or oversight role never
            clicks Finish, so their count could only ever read 0, and a
            permanent zero looks like a broken stat rather than a role that
            does not serve customers at a counter.

            CLICKABLE as of 2026-09-27, opening the Ticket History page
            (QnomyTicketHistory) - the count answers "how many", and this is
            where "which ones" lives. A <Link>, not a button + navigate(): the
            destination is a real page with its own URL, so it should behave
            like any other link (open in a new tab, show in the status bar on
            hover, etc.) rather than only ever working via a click handler. */}
        {showQnomy && (
          <Tooltip content="Customers Served" placement="bottom">
            <Link
              to="/ticket-history"
              // aria-label carries the count, same as before - the tooltip
              // text alone would announce "Customers Served" with no number.
              aria-label={`Customers Served: ${customersServed}. View ticket history.`}
              // Filled --accent with white text, matching the profile-initials
              // avatar at the other end of this same strip rather than
              // inventing a colour for it. No border: the fill defines the
              // pill, and keeping --border-soft as well left a pale ring
              // around a solid shape.
              //
              // White on #e60000 is 5.25:1, so it clears SC 1.4.3 for normal
              // text - which matters because the digit IS the content here,
              // not decoration.
              //
              // cursor-pointer, not cursor-default: this is now a real
              // navigation target, and the base-layer button/link cursor rule
              // in index.css does not reach a <Link> with no href-shaped
              // ancestor styling of its own.
              className="min-w-10 h-10 px-2 rounded-[var(--radius-pill)] bg-accent text-accent-on flex items-center justify-center font-semibold text-[length:var(--fs-body)] cursor-pointer"
            >
              {customersServed}
            </Link>
          </Tooltip>
        )}

        <Tooltip content={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} placement="bottom">
          <button type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-[var(--radius-pill)] border border-border-soft flex items-center justify-center text-fg-2 hover:bg-surface"
          >
            <Icon path={theme === 'dark' ? ICONS.sun : ICONS.moon} className="w-4.5 h-4.5" />
          </button>
        </Tooltip>

        <div className="relative">
          <Tooltip content="Notifications" placement="bottom">
            <button type="button"
              onClick={() => toggle('notifications')}
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
              aria-haspopup="true"
              aria-expanded={open === 'notifications'}
              className="relative w-10 h-10 rounded-[var(--radius-pill)] border border-border-soft flex items-center justify-center text-fg-2 hover:bg-surface"
            >
              <Icon path={ICONS.bell} className="w-4.5 h-4.5" />
              {unreadCount > 0 && <span aria-hidden="true" className="absolute top-1.5 right-1.5 w-2 h-2 rounded-[var(--radius-pill)] bg-accent" />}
            </button>
          </Tooltip>
          {open === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 card shadow-raised z-[var(--z-popover)] max-h-96 overflow-y-auto">
              <p className="px-4 py-3 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-fg border-b border-border-soft">Notifications</p>
              {inbox.items.length > 0 && (
                <div className="border-b border-border-soft">
                  <p className="px-4 pt-3 pb-1 text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-fg">Workflow Updates</p>
                  {inbox.items.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => {
                        setOpen(null);
                        navigate(i.to);
                      }}
                      className="block w-full px-4 py-2.5 text-left border-b border-border-soft last:border-b-0 hover:bg-surface focus:outline-none focus-visible:bg-surface"
                    >
                      <span className="block text-fg font-medium text-[length:var(--fs-body)]">{i.title}</span>
                      <span className="block text-fg-2 text-[length:var(--fs-caption)] break-words">{i.detail}</span>
                    </button>
                  ))}
                </div>
              )}
              {history.length === 0 && inbox.items.length === 0 && <EmptyState compact message="No notifications yet." />}
              {history.map((h) => (
                <div key={h.id} className="px-4 py-3 border-b border-border-soft last:border-0">
                  {/* The reference is rendered here too, not just in the
                      toast. A keyed notification stores its number separately
                      from its headline so the toast can colour it, so a bell
                      entry that printed `message` alone would read "Assigned
                      Ticket Number:" with the number missing entirely.
                      --field-calendar-range raw, not the toast's white-lifted
                      mix: this panel is a light --bg surface, where that mix
                      would be near-invisible. */}
                  <p className="text-fg text-[length:var(--fs-body)]">
                    {h.message}
                    {h.reference && (
                      <span className="ml-1 font-semibold text-[var(--field-calendar-range)]">{h.reference}</span>
                    )}
                  </p>
                  {/* History shares the toast model, so a toast that split its
                      subject onto a detail line would otherwise lose it here. */}
                  {h.detail && <p className="text-fg-2 text-[length:var(--fs-caption)]">{h.detail}</p>}
                  <p className="text-[length:var(--fs-caption)] text-muted mt-0.5">{formatTime(h.at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button type="button"
            onClick={() => toggle('profile')}
            aria-label="User profile menu"
            aria-haspopup="menu"
            aria-expanded={open === 'profile'}
            className="flex items-center gap-2 rounded-[var(--radius-pill)] pl-1.5 pr-3 py-1.5 hover:bg-surface"
          >
            <span className="w-7 h-7 rounded-[var(--radius-pill)] bg-accent text-on-dark text-[length:var(--fs-caption)] font-semibold flex items-center justify-center">
              {initials}
            </span>
            <span className="hidden md:block text-left">
              <span className="block text-fg text-[length:var(--fs-caption)] font-medium leading-tight">{profile?.name ?? staffId}</span>
              <span className="block text-muted text-[length:var(--fs-micro)] leading-tight">{profile?.team ?? '-'}</span>
            </span>
            <Icon path={ICONS.chevronDown} className="w-3.5 h-3.5 text-muted" />
          </button>
          {open === 'profile' && (
            <div className="absolute right-0 mt-2 w-72 card shadow-raised z-[var(--z-popover)]">
              <div className="px-4 py-3">
                <p className="text-fg font-medium">{profile?.name ?? staffId}</p>
                <p className="text-muted text-[length:var(--fs-caption)]">
                  {staffId} · {profile?.jobTitle ?? '-'}
                </p>
              </div>
              <Link
                to="/profile"
                onClick={() => setOpen(null)}
                className="block px-4 py-2.5 text-[length:var(--fs-body)] text-fg-2 hover:bg-surface hover:text-fg border-t border-border-soft"
              >
                Edit profile
              </Link>
              <div className="px-4 py-3 border-t border-border-soft">
                <p className="flex items-center gap-2 text-fg-2 text-[length:var(--fs-body)]">
                  <Icon path={ICONS.help} className="w-4 h-4" />
                  Help &amp; Support
                </p>
                <p className="text-muted text-[length:var(--fs-caption)] mt-1">
                  Contact the IT Service Desk at <span className="text-link">servicedesk@vodafone.qa</span> or extension 4100 for platform issues.
                </p>
              </div>
              <div className="px-4 py-3 border-t border-border-soft">
                <label className="text-[length:var(--fs-caption)] text-fg mb-1 block">Switch Role</label>
                <Select
                  aria-label="Switch role"
                  value={activePersonaId}
                  onChange={(e) => handleRoleSwitch(e.target.value)}
                  options={sortByBusinessUnit(personas).map((p) => ({ value: p.id, label: `${p.name} · ${p.businessUnitLabel}` }))}
                />
              </div>
              <button type="button"
                onClick={requestSignOut}
                className="w-full flex items-center gap-2 px-4 py-3 border-t border-border-soft text-danger hover:bg-surface text-left"
              >
                <Icon path={ICONS.signOut} className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      </TooltipGroup>
      <Modal
        open={pendingLeave !== null}
        onClose={() => setPendingLeave(null)}
        title={pendingLeave?.kind === 'signOut' ? 'Sign out and lose your journey?' : 'Switch role with a journey in progress?'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setPendingLeave(null)}>
              Stay
            </Button>
            <Button variant="primary" onClick={confirmLeave}>
              {pendingLeave?.kind === 'signOut' ? 'Sign out anyway' : 'Switch anyway'}
            </Button>
          </div>
        }
      >
        <p className="text-fg-2 text-[length:var(--fs-body)]">
          {pendingLeave?.kind === 'signOut'
            ? 'A journey is in progress and has not been saved. Signing out discards it - use Save as Draft in the journey to keep it as a draft.'
            : 'A journey is in progress. The new role may not be able to continue it - use Save as Draft in the journey first to keep it as a draft.'}
        </p>
      </Modal>
    </header>
  );
}
