/**
 * Which inventory components the UI Components Library renders live: component name -> the component whose specimen shows it.
 * (Most are their own host; Pager is drawn inside Pagination and IconRail inside Tabs' rail layout.) tests/componentCoverage.test.mjs
 * fails if a host is not imported by UiComponentsLibrarySection.tsx, or if a Primitive-layer component is missing from this list.
 * Every other component is still listed, with its source, in the library's Component Catalogue.
 */
export const LIVE_SPECIMENS: Record<string, string> = Object.fromEntries(
  [
    'Badge', 'Button', 'Checkbox', 'ChoiceCards', 'CloseButton', 'ConnectionTypeTag', 'CountryMarker', 'DataTable', 'Drawer', 'EmptyState', 'ErrorBanner',
    'Icon', 'IconButton', 'Input', 'Modal', 'NestedTabs', 'OptionToggle', 'OverlayPortal', 'Pagination', 'PageLevelTabs', 'PanelIcon', 'PhoneNumberInput', 'Radio',
    'SearchField', 'SegmentedTabs', 'Select', 'SelectedCardTexture', 'SelectedPlanFigure', 'SelectedTick', 'ServiceTypeTag', 'SignaturePad', 'Spinner',
    'TabStrip', 'Tabs', 'Textarea', 'Tooltip', 'TooltipGroup', 'VodafoneMark', 'VodafoneWordmark', 'PageHeader', 'StarStat',
  ].map((n) => [n, n]),
);
LIVE_SPECIMENS.Pager = 'Pagination';
LIVE_SPECIMENS.IconRail = 'Tabs';

/** The groups of the UI Components Library, in the order of its left-hand navigation: [id, label]. */
export const UI_LIBRARY_GROUPS: [string, string][] = [
  ['buttons', 'Buttons'],
  ['forms', 'Form Controls'],
  ['cards', 'Cards'],
  ['tabs', 'Tabs'],
  ['overlays', 'Modals & Drawers'],
  ['alerts', 'Alerts & Notifications'],
  ['tags', 'Tags & Badges'],
  ['tables', 'Tables'],
  ['navigation', 'Navigation'],
  ['pagination', 'Pagination'],
  ['tooltips', 'Tooltips'],
  ['empty', 'Empty States & Loading'],
  ['other', 'Other'],
  ['catalogue', 'Component Catalogue'],
];
