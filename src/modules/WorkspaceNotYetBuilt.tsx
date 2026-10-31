import { Link, useSearchParams } from 'react-router-dom';
import { getAllModules } from '../engines/configEngine';
import { NAV_BY_KEY, type NavKey } from '../navigation/navManifest';
import { NotYetBuiltPanel } from './NotYetBuiltPanel';
import { Icon } from '../components/primitives/Icon';
import { SECONDARY_BUTTON_SURFACE } from '../components/primitives/Button';

const OPEN_ARROW = 'M7 17L17 7 M7 7h10v10';

// The workspace-level counterpart to ScreenNotYetBuilt, for nav destinations
// that are applicable to a role but not yet implemented. Requirement: such a
// feature must stay VISIBLE as a placeholder indicating planned functionality,
// consistently across roles - not disappear from the rail.
//
// Two things make it a signpost rather than a dead end:
//   - it states what the workspace WILL do (from the manifest's planned copy)
//   - it links to the already-built modules/workspaces that cover that ground
//     today, so the agent isn't stranded
//
// It also echoes ?id=, which is what lets search results legitimately point
// here: the placeholder names the record you asked for instead of pretending
// to show it, or 404ing.
export function WorkspaceNotYetBuilt({ navKey }: { navKey: NavKey }) {
  const item = NAV_BY_KEY.get(navKey);
  const [params] = useSearchParams();
  const requestedId = params.get('id');
  const planned = item?.planned;
  const modules = getAllModules();

  const related = (planned?.relatedModuleSlugs ?? [])
    .map((slug) => modules.find((m) => m.moduleSlug === slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => ({ label: m.module, to: `/${m.moduleSlug}` }));
  const launchers = [...related, ...(planned?.relatedWorkspaces ?? [])];

  return (
    <NotYetBuiltPanel
      badge="Planned"
      title={item?.label ?? 'Planned workspace'}
      body={
        planned?.summary
        ?? 'This workspace is part of the planned information architecture but is not yet built.'
      }
    >
      {requestedId && (
        <p className="text-fg-2 text-[length:var(--fs-body)] mb-4">
          A detail view for <code className="text-[length:var(--fs-caption)]">{requestedId}</code> is planned here.
        </p>
      )}

      {planned?.capabilities && planned.capabilities.length > 0 && (
        <>
          <h2 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted mt-6 mb-2">
            Planned Capabilities
          </h2>
          <ul className="text-fg-2 text-[length:var(--fs-body)] space-y-1 list-disc pl-5">
            {planned.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {launchers.length > 0 && (
        <>
          <h2 className="text-[length:var(--fs-caption-upper)] uppercase tracking-wide text-muted mt-6 mb-2">
            Available Today
          </h2>
          <div className="flex flex-wrap gap-2">
            {launchers.map((l) => (
              // Soft-pink fill (2026-09-27), matching every other secondary/
              // clickable button in the app - see ProductLinePage.tsx's
              // category chips, the first place this treatment landed. Was
              // an outlined, unfilled pill, then briefly a full pill; now an
              // 8px corner (--radius-button), same day, for the app-wide
              // button-radius consistency pass. The arrow icon keeps its own
              // --muted/group-hover:accent colouring rather than following
              // the label into deep-red, since it is a directional cue, not
              // part of the link's own text.
              <Link
                key={l.to}
                to={l.to}
                className={`group inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border px-3 py-1.5 text-[length:var(--fs-caption)] ${SECONDARY_BUTTON_SURFACE}`}
              >
                {l.label}
                <Icon path={OPEN_ARROW} className="w-3.5 h-3.5 text-muted group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </>
      )}
    </NotYetBuiltPanel>
  );
}
