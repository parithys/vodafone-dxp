# Capability Library

Every reusable capability in the app, **one implementation each**. A journey never builds a capability from parts; it
mounts the capability and says what its context needs.

```
capabilities/
  index.ts                  the barrel - journeys import from here (never from a capability's parts)
  registry.json             the ONE list of capabilities (hand-maintained): name, summary, entry, parts, status
  consumers.generated.json  who consumes each - GENERATED from the import graph, never edited by hand
  registry.ts               typed access to the two files above
  previews.tsx              live previews shown in the in-app Capability Library
  <Name>/
    <Name>.tsx              the capability component - one entry point, its context passed as props
    step.tsx                the wizard step builder(s) that mount it (where it is a journey step)
    index.ts                the capability's public API
```

## Using one

```tsx
import { ServiceAddress, serviceAddressStep } from '../../capabilities';
```

A guided journey lists steps from the builders (`serviceAddressStep({ mode: 'structured' })`); a screen mounts the
component. Step names come from `data/stepLabels.ts`, so one step is never called two things.

## Changing one

Edit the files under `capabilities/<Name>/` (or the parts the registry lists). Every journey imports them, so the
change - UI, styling, fields, states, logic - reaches all of them. The in-app **Administration > Capability Library**
tab shows each capability, its files with "Open in editor" links, the journeys that use it, and a live preview.

## Adding one

1. Create `capabilities/<Name>/` with the component, `step.tsx` if it is a step, and `index.ts`; export it from
   `capabilities/index.ts`.
2. Add it to `registry.json`.
3. Regenerate: `python3 reference/scripts/build_reusable_capabilities_inventory.py` (updates
   `consumers.generated.json` and the inventory workbook). The script aborts if a listed file is missing, and reports
   any journey that imports a capability's part directly instead of using it (a *bypass*) - fix those.

Every capability in `registry.json` is now consolidated under `capabilities/`. (`status: "registered"` remains available for a
shared implementation that cannot move yet; none uses it today.)

Shared components under `components/` import a capability's file directly (e.g. `../../capabilities/SideDrawer/Drawer`);
journeys (`modules/`, `workspace/`, `navigation/`) import from the barrel. This keeps the barrel free of import cycles.
