import { useState } from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../../components/primitives/Badge';
import { Button } from '../../components/primitives/Button';
import { Checkbox } from '../../components/primitives/Checkbox';
import { ChoiceCards } from '../../components/primitives/ChoiceCards';
import { CloseButton } from '../../components/primitives/CloseButton';
import { ConnectionTypeTag } from '../../components/primitives/ConnectionTypeTag';
import { CountryMarker } from '../../components/primitives/CountryMarker';
import { DataTable, type Column } from '../../components/primitives/DataTable';
import { Drawer } from '../../components/primitives/Drawer';
import { EmptyState } from '../../components/primitives/EmptyState';
import { ErrorBanner } from '../../components/primitives/ErrorBanner';
import { Icon } from '../../components/primitives/Icon';
import { IconButton } from '../../components/primitives/IconButton';
import { Input } from '../../components/primitives/Input';
import { Modal } from '../../components/primitives/Modal';
import { CARD_HIGHLIGHT, CARD_IDLE, CARD_SELECTED, SelectedCardTexture, SelectedPlanFigure, SelectedTick } from '../../components/primitives/offerCardParts';
import { OverlayPortal } from '../../components/primitives/OverlayPortal';
import { Pagination } from '../../components/primitives/Pagination';
import { PanelIcon } from '../../components/primitives/PanelIcon';
import { PhoneNumberInput } from '../../components/primitives/PhoneNumberInput';
import { Radio } from '../../components/primitives/Radio';
import { SearchField } from '../../components/primitives/SearchField';
import { SegmentedTabs } from '../../components/primitives/SegmentedTabs';
import { Select } from '../../components/primitives/Select';
import { ServiceTypeTag } from '../../components/primitives/ServiceTypeTag';
import { SignaturePad } from '../../components/primitives/SignaturePad';
import { Spinner } from '../../components/primitives/Spinner';
import { NestedTabs, PageLevelTabs } from '../../components/primitives/TabLevel';
import { TabStrip } from '../../components/primitives/TabStrip';
import { Tabs } from '../../components/primitives/Tabs';
import { Textarea } from '../../components/primitives/Textarea';
import { Tooltip } from '../../components/primitives/Tooltip';
import { TooltipGroup } from '../../components/primitives/TooltipContext';
import { VodafoneMark } from '../../components/primitives/VodafoneMark';
import { VodafoneWordmark } from '../../components/primitives/VodafoneWordmark';
import { PageHeader } from '../../components/patterns/PageHeader';
import { StarStat } from '../../components/domain/StarStat';
import { ComponentCatalogue } from './ComponentCatalogue';
import { UI_LIBRARY_GROUPS } from './uiLibraryCoverage';
import { useNotificationStore } from '../../stores/notificationStore';
import { BOOK_ICON, CARD_ICON, DOWNLOAD, GLOBE_ICON_ALT, SHIELD_ICON, TRASH } from '../../assets/icons';

// The UI Components Library: every distinct UI component the application uses, rendered as it is - the real component with throwaway local state,
// never a redrawn copy - grouped by kind, each shown once with its applicable variants and states. A change to a component shows here and in
// every screen that uses it. (The Capability Library tab beside it covers whole journey capabilities; this one covers the parts they are built from.)

/** One rendered example with its name beneath it. */
function Specimen({ name, note, children, wide = false }: { name: string; note?: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={`stack gap-2 ${wide ? 'sm:col-span-2 xl:col-span-3' : ''}`}>
      <div className="cluster specimen-row p-4">{children}</div>
      <figcaption className="px-1">
        <span className="caption-strong">{name}</span>
        {note && <span className="caption-muted"> - {note}</span>}
      </figcaption>
    </figure>
  );
}

/** A named group of specimens. */
function Group({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="panel-soft p-5 space-y-4">
      <div>
        <h3 id={`${id}-title`} className="title title-lg">
          {title}
        </h3>
        <p className="caption-muted">{description}</p>
      </div>
      <div className="fields-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

const ID_CARDS = [
  { key: 'qid', label: 'Qatar ID (QID)', icon: CARD_ICON },
  { key: 'passport', label: 'Passport', icon: BOOK_ICON },
  { key: 'gcc', label: 'GCC ID', icon: GLOBE_ICON_ALT },
  { key: 'dip', label: 'Diplomatic ID', icon: SHIELD_ICON },
];

interface SampleRow {
  id: string;
  name: string;
  plan: string;
  amount: number;
}
const SAMPLE_ROWS: SampleRow[] = [
  { id: 'ORD-1001', name: 'Ahmed Al-Sulaiti', plan: 'Postpaid Plus Extra', amount: 145 },
  { id: 'ORD-1002', name: 'Sophie Laurent', plan: 'Postpaid Essential', amount: 115 },
  { id: 'ORD-1003', name: 'Farhan Chaudhry', plan: 'Postpaid Max', amount: 180 },
];
const SAMPLE_COLUMNS: Column<SampleRow>[] = [
  { key: 'id', header: 'Order', strong: true },
  { key: 'name', header: 'Customer' },
  { key: 'plan', header: 'Plan' },
  { key: 'amount', header: 'Monthly (QAR)', numeric: true },
];

const toastDemo = (kind: 'success' | 'error' | 'warning' | 'info') => () =>
  useNotificationStore.getState().pushToast(kind, `${kind[0].toUpperCase()}${kind.slice(1)} notification`, { detail: 'This is how a notification of this kind looks.' });

/** `initialGroup`: the group shown first (tests render each group in turn). */
export function UiComponentsLibrarySection({ initialGroup = 'buttons' }: { initialGroup?: string }) {
  const [tab, setTab] = useState('open');
  const [segment, setSegment] = useState('offers');
  const [choice, setChoice] = useState<string | undefined>('passport');
  const [card, setCard] = useState<'idle' | 'selected'>('selected');
  const [page, setPage] = useState(3);
  const [phone, setPhone] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [group, setGroup] = useState(initialGroup);
  const [portal, setPortal] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [signed, setSigned] = useState(false);
  const [padKey, setPadKey] = useState(0);
  const options = [
    { value: 'one', label: 'Option One' },
    { value: 'two', label: 'Option Two' },
  ];
  const noop = () => {};

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="title title-xl">UI Components Library</h2>
        <p className="text-secondary">
          Every distinct UI component in use across the application, rendered live from the real component and shown once with its applicable variants and states.
        </p>
      </div>

      <div className="sidebar-grid">
        <aside aria-label="Component groups" className="space-y-3">
          <p className="caption-muted">{UI_LIBRARY_GROUPS.length} groups</p>
          <ul className="space-y-1">
            {UI_LIBRARY_GROUPS.map(([id, label]) => (
              <li key={id}>
                <Button variant={id === group ? 'primary' : 'secondary'} compact aria-pressed={id === group} onClick={() => setGroup(id)}>
                  {label}
                </Button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="space-y-6">
      {group === 'buttons' && (
      <Group id="buttons" title="Buttons" description="The Button component's variants and sizes, the icon-only button, and the close control.">
        <Specimen name="Button - Primary" note="the page's main action">
          <Button variant="primary">Continue</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </Specimen>
        <Specimen name="Button - Secondary" note="supporting actions">
          <Button variant="secondary">Back</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Specimen>
        <Specimen name="Button - Tertiary" note="text-link actions">
          <Button variant="tertiary">View Details</Button>
          <Button variant="tertiary" disabled>
            Disabled
          </Button>
        </Specimen>
        <Specimen name="Button - Destructive" note="removes or discards">
          <Button variant="destructive">Remove</Button>
        </Specimen>
        <Specimen name="Button - Sizes" note="compact, default, large">
          <Button variant="primary" size="sm">
            Compact
          </Button>
          <Button variant="primary">Default</Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </Specimen>
        <Specimen name="Button - With icon">
          <Button variant="secondary">
            <Icon path={DOWNLOAD} className="size-4 " />
            Download
          </Button>
        </Specimen>
        <Specimen name="Icon Button" note="default, bordered, danger, small">
          <IconButton icon={DOWNLOAD} label="Download" />
          <IconButton icon={DOWNLOAD} label="More Actions" bordered />
          <IconButton icon={TRASH} label="Remove" tone="danger" />
          <IconButton icon={DOWNLOAD} label="Download Small" size="sm" />
        </Specimen>
        <Specimen name="Close Button" note="closes dialogs and drawers">
          <CloseButton onClick={noop} />
        </Specimen>
      </Group>
      )}

      {group === 'forms' && (
      <Group id="forms" title="Form Controls" description="Fields and choice controls with their default, filled, error, read-only and disabled states.">
        <Specimen name="Input - Default and helper text">
          <div className="w-full space-y-3">
            <Input label="Full Name" placeholder="" defaultValue="" />
            <Input label="Email" helperText="We send the receipt here." defaultValue="" />
          </div>
        </Specimen>
        <Specimen name="Input - Filled, error, read-only, disabled">
          <div className="w-full space-y-3">
            <Input label="Filled" defaultValue="Ahmed Al-Sulaiti" />
            <Input label="Error" defaultValue="abc" error="Enter a valid value." />
            <Input label="Read-Only" defaultValue="28456701234" readOnly />
            <Input label="Disabled" defaultValue="Not editable" disabled />
          </div>
        </Specimen>
        <Specimen name="Input - With leading addon" note="the phone number field uses it">
          <div className="w-full">
            <PhoneNumberInput label="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </Specimen>
        <Specimen name="Select" note="searchable dropdown: default, error, disabled">
          <div className="w-full space-y-3">
            <Select label="Plan Type" options={options} value={selectValue} onChange={(e) => setSelectValue(e.target.value)} placeholder="Select" />
            <Select label="With Error" options={options} value="" error="Choose an option." />
            <Select label="Disabled" options={options} value="one" disabled />
          </div>
        </Specimen>
        <Specimen name="Search Field" note="with clear button once it has text">
          <div className="w-full space-y-3">
            <SearchField aria-label="Search" placeholder="Search customers" value="" onChange={noop} />
            <SearchField aria-label="Search filled" value="Al-Sulaiti" onChange={noop} onClear={noop} />
          </div>
        </Specimen>
        <Specimen name="Textarea" note="default and error">
          <div className="w-full space-y-3">
            <Textarea label="Comments" rows={2} defaultValue="" />
            <Textarea label="Required Comment" rows={2} defaultValue="" error="Enter a comment." />
          </div>
        </Specimen>
        <Specimen name="Checkbox" note="unchecked, checked, disabled">
          <label className="row gap-2 body-text">
            <Checkbox readOnly /> Unchecked
          </label>
          <label className="row gap-2 body-text">
            <Checkbox defaultChecked /> Checked
          </label>
          <label className="row gap-2 body-text">
            <Checkbox disabled /> Disabled
          </label>
        </Specimen>
        <Specimen name="Radio" note="unselected, selected, disabled">
          <label className="row gap-2 body-text">
            <Radio name="lib-radio" readOnly /> Unselected
          </label>
          <label className="row gap-2 body-text">
            <Radio name="lib-radio" defaultChecked /> Selected
          </label>
          <label className="row gap-2 body-text">
            <Radio name="lib-radio-d" disabled /> Disabled
          </label>
        </Specimen>
        <Specimen name="Choice Cards" note="icon cards: default and selected (the ID type choice)" wide>
          <div className="w-full">
            <ChoiceCards legend="ID Type" items={ID_CARDS} value={choice} onChange={setChoice} />
          </div>
        </Specimen>
        <Specimen name="Signature Pad" note="draw to enable Clear and Done; the ink is a fixed dark colour so it reads on a white form" wide>
          <div className="stack gap-2">
            <SignaturePad key={padKey} onDone={() => setSigned(true)} onCancel={() => { setSigned(false); setPadKey((k) => k + 1); }} />
            {signed && <p className="caption-muted">Signature captured.</p>}
          </div>
        </Specimen>
      </Group>
      )}

      {group === 'cards' && (
      <Group id="cards" title="Cards" description="The card surface and the selectable-card states every card grid shares.">
        <Specimen name="Card" note="the standard surface">
          <div className="card p-4 w-full body-text">Standard Card</div>
        </Specimen>
        <Specimen name="Card - Quiet surface">
          <div className="card card-surface p-4 w-full body-text">Card on the Quieter Fill</div>
        </Specimen>
        <Specimen name="Selectable Card - Default, selected, highlighted" note="click the first to toggle it" wide>
          <button
            type="button"
            aria-pressed={card === 'selected'}
            onClick={() => setCard((c) => (c === 'selected' ? 'idle' : 'selected'))}
            className={`specimen-card p-4 ${card === 'selected' ? CARD_SELECTED : CARD_IDLE}`}
          >
            {card === 'selected' && <SelectedTick />}
            <span className="block title title-sm">{card === 'selected' ? 'Selected' : 'Default'}</span>
            <span className="block caption-secondary">Hover changes the fill only</span>
          </button>
          <div className={`min-w-[12rem] card-frame p-4 ${CARD_HIGHLIGHT}`}>
            <span className="block title title-sm">Highlighted</span>
            <span className="block caption-secondary">A card the app singles out</span>
          </div>
        </Specimen>
        <Specimen name="Selected Card Tick" note="the corner mark on a selected card">
          <div className="relative card p-4 w-40">
            <SelectedTick />
            <span className="body-text">Card</span>
          </div>
        </Specimen>
        <Specimen name="Selected Card Texture" note="the faint circles behind a selected card's content">
          <div className="relative isolate card p-4">
            <SelectedCardTexture />
            <span className="body-text">Selected Card</span>
          </div>
        </Specimen>
        <Specimen name="Stat" note="a label over a bold value; the alert tone is the upfront charge">
          <StarStat label="Price" value="QAR 18,000" />
          <StarStat label="Upfront Charge" value="QAR 9,000" alert />
        </Specimen>
        <Specimen name="Selected Figure" note="the chosen plan's price">
          <SelectedPlanFigure label="Monthly Plan">QAR 145</SelectedPlanFigure>
        </Specimen>
      </Group>
      )}

      {group === 'tabs' && (
      <Group id="tabs" title="Tabs" description="The two tab levels: the underline strip for sections, the pill switcher for filtering within one.">
        <Specimen name="Tab Strip" note="Level 1 - underline" wide>
          <div className="w-full">
            <TabStrip
              items={[
                { key: 'open', label: 'Open Tasks', count: 4 },
                { key: 'drafts', label: 'Drafts', count: 3 },
                { key: 'done', label: 'Completed' },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>
        </Specimen>
        <Specimen name="Segmented Tabs" note="Level 2 - pill" wide>
          <SegmentedTabs
            items={[
              { key: 'offers', label: 'Offers' },
              { key: 'standard', label: 'Standard Plans' },
              { key: 'special', label: 'Special Offers' },
            ]}
            active={segment}
            onChange={setSegment}
          />
        </Specimen>
        <Specimen name="Tabs" note="horizontal: the underline strip with its panel" wide>
          <div className="w-full">
            <Tabs
              label="Specimen Sections"
              items={[
                { key: 'summary', label: 'Summary', content: <p className="text-secondary">Summary panel content.</p> },
                { key: 'history', label: 'History', content: <p className="text-secondary">History panel content.</p> },
              ]}
            />
          </div>
        </Specimen>
        <Specimen name="Tabs - Vertical rail (IconRail)" note="the numbered step rail the guided wizards use" wide>
          <div className="w-full">
            <Tabs
              orientation="vertical"
              rail
              label="Specimen Steps"
              items={[
                { key: 'contact', label: 'Contact', content: <p className="text-secondary">Contact step content.</p> },
                { key: 'address', label: 'Address', content: <p className="text-secondary">Address step content.</p> },
                { key: 'plan', label: 'Plan', content: <p className="text-secondary">Plan step content.</p> },
              ]}
            />
          </div>
        </Specimen>
        <Specimen name="NestedTabs" note="inside a tab panel, a Tab Strip draws as pills (Level 2)">
          <NestedTabs>
            <TabStrip items={[{ key: 'a', label: 'First' }, { key: 'b', label: 'Second' }]} active="a" onChange={noop} />
          </NestedTabs>
        </Specimen>
        <Specimen name="PageLevelTabs" note="resets to page level: the same Tab Strip draws as the underline">
          <NestedTabs>
            <PageLevelTabs>
              <TabStrip items={[{ key: 'a', label: 'First' }, { key: 'b', label: 'Second' }]} active="a" onChange={noop} />
            </PageLevelTabs>
          </NestedTabs>
        </Specimen>
      </Group>
      )}

      {group === 'overlays' && (
      <Group id="overlays" title="Modals & Drawers" description="Open each to see the real dialog: the modal for short confirmations, the side drawer for forms and reference.">
        <Specimen name="Modal" note="centred confirmation dialog">
          <Button variant="secondary" onClick={() => setModal(true)}>
            Open Modal
          </Button>
          <Modal
            open={modal}
            onClose={() => setModal(false)}
            title="Confirm Action"
            footer={
              <>
                <Button variant="secondary" onClick={() => setModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModal(false)}>
                  Confirm
                </Button>
              </>
            }
          >
            <p className="text-secondary">A short confirmation message sits here.</p>
          </Modal>
        </Specimen>
        <Specimen name="OverlayPortal" note="renders its children on the page body, outside the opener, so nothing paints over it">
          <Button variant="secondary" onClick={() => setPortal((v) => !v)}>
            {portal ? 'Hide' : 'Show'} Portal Content
          </Button>
          {portal && (
            <OverlayPortal>
              <div role="status" className="card portal-specimen body-text">
                Rendered on the page body.
              </div>
            </OverlayPortal>
          )}
        </Specimen>
        <Specimen name="Drawer" note="side panel with title, body and footer">
          <Button variant="secondary" onClick={() => setDrawer(true)}>
            Open Drawer
          </Button>
          <Drawer
            open={drawer}
            onClose={() => setDrawer(false)}
            title="Details"
            footer={
              <>
                <Button variant="secondary" onClick={() => setDrawer(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => setDrawer(false)}>
                  Select
                </Button>
              </>
            }
          >
            <p className="text-secondary">Reference material is read here without leaving the list.</p>
          </Drawer>
        </Specimen>
      </Group>
      )}

      {group === 'alerts' && (
      <Group id="alerts" title="Alerts & Notifications" description="Inline error banners and the four notification kinds (click to raise one).">
        <Specimen name="Error Banner" note="inline, role=alert">
          <div className="w-full">
            <ErrorBanner message="This ID type is not supported." />
          </div>
        </Specimen>
        <Specimen name="Notification - Success / Error / Warning / Info" note="raises a real notification" wide>
          <Button variant="secondary" compact onClick={toastDemo('success')}>
            Success
          </Button>
          <Button variant="secondary" compact onClick={toastDemo('error')}>
            Error
          </Button>
          <Button variant="secondary" compact onClick={toastDemo('warning')}>
            Warning
          </Button>
          <Button variant="secondary" compact onClick={toastDemo('info')}>
            Info
          </Button>
        </Specimen>
      </Group>
      )}

      {group === 'tags' && (
      <Group id="tags" title="Tags & Badges" description="Status pills, category tags and the service-type tags.">
        <Specimen name="Badge - Status" note="outlined-red, neutral, success, warning, danger" wide>
          <Badge variant="outlined-red">Outlined Red</Badge>
          <Badge variant="filled-neutral">Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </Specimen>
        <Specimen name="Badge - Solid" note="a single state that must not be missed">
          <Badge variant="success-solid">Validated</Badge>
          <Badge variant="danger-solid">Blocked</Badge>
          <Badge variant="accent">Accent</Badge>
        </Specimen>
        <Specimen name="Badge - Category tags" note="soft-filled">
          <Badge variant="tag-blue">Blue</Badge>
          <Badge variant="tag-amber">Amber</Badge>
          <Badge variant="tag-green">Green</Badge>
          <Badge variant="tag-red">Red</Badge>
          <Badge variant="tag-primary">Primary</Badge>
        </Specimen>
        <Specimen name="Service Type Tag" note="wording and colour from one definition" wide>
          <ServiceTypeTag type="new-postpaid" />
          <ServiceTypeTag type="new-prepaid" />
          <ServiceTypeTag type="mnp-postpaid" />
          <ServiceTypeTag type="new-fixed-line" />
          <ServiceTypeTag type="pre-to-post" />
        </Specimen>
        <Specimen name="Connection Type Tag" note="maps a record's category to its tag">
          <ConnectionTypeTag category="Postpaid" />
          <ConnectionTypeTag category="Prepaid" />
        </Specimen>
      </Group>
      )}

      {group === 'tables' && (
      <Group id="tables" title="Tables" description="The one data table: sortable columns, numeric alignment, row selection by click.">
        <Specimen name="Data Table" note="click a header to sort" wide>
          <div className="w-full">
            <DataTable columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} rowKey={(r) => r.id} pageSize={10} onRowClick={noop} />
          </div>
        </Specimen>
        <Specimen name="Data Table - Empty" note="no rows" wide>
          <div className="w-full">
            <DataTable columns={SAMPLE_COLUMNS} rows={[]} rowKey={(r) => r.id} emptyMessage="No orders match your filters." />
          </div>
        </Specimen>
      </Group>
      )}

      {group === 'navigation' && (
      <Group id="navigation" title="Navigation" description="The page header band and the back control. Breadcrumbs and the sidebar are on every page of the app.">
        <Specimen name="Page Header" note="title, description and actions" wide>
          <div className="w-full overflow-hidden rounded-[var(--radius-card)]">
            <PageHeader bleed={false} level={2} title="Page Title" description="A one-line description of the page." actions={<Button variant="secondary" compact>Action</Button>} />
          </div>
        </Specimen>
        <Specimen name="Back Button" note="the breadcrumb bar's back control">
          <button type="button" className="breadcrumb-back back-link">
            Back
          </button>
        </Specimen>
      </Group>
      )}

      {group === 'pagination' && (
      <Group id="pagination" title="Pagination" description="The page bar and the pager inside it.">
        <Specimen name="Pagination" note="Page n of N, with its pager: Previous, numbered pages with gaps, Next" wide>
          <div className="w-full">
            <Pagination page={page} total={95} pageSize={10} onPage={setPage} />
          </div>
        </Specimen>
      </Group>
      )}

      {group === 'tooltips' && (
      <Group id="tooltips" title="Tooltips" description="The hover and focus label for icon-only controls.">
        <Specimen name="Tooltip" note="hover or focus the button">
          <Tooltip content="Download" placement="bottom">
            <IconButton icon={DOWNLOAD} label="Download" />
          </Tooltip>
        </Specimen>
        <Specimen name="TooltipGroup" note="wraps an icon row: after the first tooltip shows, the next ones skip the delay">
          <TooltipGroup>
            <Tooltip content="Download" placement="bottom">
              <IconButton icon={DOWNLOAD} label="Download" />
            </Tooltip>
            <Tooltip content="Delete" placement="bottom">
              <IconButton icon={TRASH} label="Delete" />
            </Tooltip>
            <Tooltip content="Security" placement="bottom">
              <IconButton icon={SHIELD_ICON} label="Security" />
            </Tooltip>
          </TooltipGroup>
        </Specimen>
      </Group>
      )}

      {group === 'empty' && (
      <Group id="empty" title="Empty States & Loading" description="What a list shows when it has nothing, and the busy indicator.">
        <Specimen name="Empty State" note="with title and message" wide>
          <div className="w-full">
            <EmptyState title="No Reserved Numbers" message="No numbers have been reserved for this customer." />
          </div>
        </Specimen>
        <Specimen name="Empty State - Compact, with action">
          <div className="w-full">
            <EmptyState compact message="No orders match your search or filters." action={<Button variant="tertiary">Clear Filters</Button>} />
          </div>
        </Specimen>
        <Specimen name="Spinner" note="small and large">
          <Spinner size={20} label="Loading" />
          <Spinner size={32} label="Scanning the Document" />
        </Specimen>
      </Group>
      )}

      {group === 'other' && (
      <Group id="other" title="Other" description="Smaller shared pieces.">
        <Specimen name="Country Marker" note="the flag beside a dial code">
          <CountryMarker iso="QA" />
          <CountryMarker iso="IN" />
        </Specimen>
        <Specimen name="Vodafone Mark" note="the red disc with the speech-mark">
          <VodafoneMark className="size-10" />
        </Specimen>
        <Specimen name="Vodafone Wordmark" note="the full logo's lettering, shown beside the mark">
          <VodafoneMark className="size-8" />
          <VodafoneWordmark />
        </Specimen>
        <Specimen name="Panel Icon" note="the sidebar toggle: click to flip expanded / collapsed">
          <button type="button" aria-label={panelOpen ? 'Collapse navigation' : 'Expand navigation'} aria-expanded={panelOpen} onClick={() => setPanelOpen((v) => !v)} className="btn-icon">
            <PanelIcon expanded={panelOpen} className="size-5" />
          </button>
        </Specimen>
        <Specimen name="Icon" note="the shared SVG icon (24px grid)">
          <Icon path={DOWNLOAD} className="size-6 text-fg" />
          <Icon path={SHIELD_ICON} className="size-6 text-accent" />
        </Specimen>
      </Group>
      )}

      {group === 'catalogue' && (
      <section id="catalogue" aria-labelledby="catalogue-title" className="panel-soft p-5 space-y-4">
        <div>
          <h3 id="catalogue-title" className="title title-lg">
            Component Catalogue
          </h3>
          <p className="caption-muted">Every component in the application with where it is shown: live above, inside a capability, or listed here with its source.</p>
        </div>
        <ComponentCatalogue />
      </section>
      )}
        </div>
      </div>
    </div>
  );
}
