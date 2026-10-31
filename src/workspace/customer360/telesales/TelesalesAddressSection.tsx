import { Button } from '../../../components/primitives/Button';
import { Icon } from '../../../components/primitives/Icon';
import { accountAddressResolvers } from '../sections/accountAddressResolvers';
import { Card, KV, Pill, asText, dateTime, type Ctx } from './TelesalesOverview';
import { ActionList, Field, HeaderButton, ICON, SectionHeader, TableCard, yesNo, WideBlock } from './TelesalesKit';
import { rowDate, demoOf, arr, type Rec } from './shared';
import { strOrEmpty as str } from '../../../lib/values';
import { Input } from '../../../components/primitives/Input';

// ============================================================================ Address
export function AddressSection({ ctx }: { ctx: Ctx }) {
  const { data } = ctx;
  const demo = demoOf(ctx);
  const a = (d: string) => asText(accountAddressResolvers[d]?.(data));
  const zone = str(a('Zone')) || '-';
  const street = str(a('Street')) || '-';
  const building = str(a('Building')) || '-';
  const rfs = str(a('RFS Flag (Y/N)'));
  const serv = (demo.serviceability ?? {}) as Rec;
  const type = (demo.addressType ?? {}) as Rec;
  const history = arr<Rec>(demo.addressHistory);
  return (
    <>
      <SectionHeader
       
       
       
        actions={<HeaderButton primary>⟳ Update Address</HeaderButton>}
      />
      <div className="contents">
        <Card title="National Address (NAS)" icon={ICON.globe}>
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--field-card-border)]">
            <Pill tone="green">Verified</Pill>
            <Button variant="tertiary" type="button">View in Map →</Button>
          </div>
          <KV label="Zone">{zone}</KV>
          <KV label="Street">{street}</KV>
          <KV label="Building">{building}</KV>
          <KV label="RFS Flag">{rfs ? yesNo(rfs) : '-'}</KV>
        </Card>
        <Card title="Open Address (Manual / Alternative)" icon={ICON.globe} link="Edit">
          <div className="p-5 space-y-3">
            {[
              ['Zone', zone],
              ['Street', street],
              ['Building', building],
              ['RFS Flag', rfs || '-'],
            ].map(([label, value]) => (
              <Input key={label} label={label} value={value} readOnly />
            ))}
          </div>
        </Card>
        <Card title="Location Map" icon={ICON.globe}>
          <div className="p-5">
            <div className="relative h-44 rounded-[var(--radius-card)] bg-gradient-to-br from-[var(--telesales-map-from)] to-[var(--telesales-map-to)] overflow-hidden">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-[var(--radius-pill)] bg-accent text-accent-on flex items-center justify-center">
                <Icon path={ICON.globe} className="w-5 h-5" />
              </span>
              <div className="absolute right-3 bottom-3 rounded-[var(--radius-button)] bg-bg px-3 py-2 text-[length:var(--fs-caption)]">
                <div className="font-bold text-fg">{zone}</div>
                <div className="text-fg-2">{street}</div>
                <div className="text-fg-2">{building}</div>
              </div>
            </div>
            <Button variant="tertiary" type="button" className="mt-3">View in Google Maps →</Button>
          </div>
        </Card>
      </div>
      <div className="contents">
        <Card title="Serviceability Information" icon={ICON.bars}>
          {['Mobile Coverage', 'Fixed Line', 'Fibre (Home)', 'TV Service', '5G Coverage'].map((k) => (
            <Field key={k} label={k}>
              <Pill tone="green">{str(serv[k]) || 'Available'}</Pill>
            </Field>
          ))}
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-fg-2">Remarks</span>
            <span className="text-fg font-bold text-[length:var(--fs-body-lg)]">{str(serv.Remarks)}</span>
          </div>
        </Card>
        <Card title="Address Type & Usage" icon={ICON.globe} link="Edit">
          <div className="p-5 space-y-3">
            {[
              ['Address Type', str(type.addressType)],
              ['Usage Type', str(type.usageType)],
            ].map(([label, value]) => (
              <Input key={label} label={label} value={value} readOnly />
            ))}
            <Input label="Valid From" value={type.validFrom ? dateTime(type.validFrom).d : '-'} readOnly />
            <Input label="Valid To" value={type.validTo ? dateTime(type.validTo).d : '-'} readOnly />
          </div>
          <KV label="Is Mailing Address">{yesNo(type.isMailing as boolean)}</KV>
          <KV label="Is Billing Address">{yesNo(type.isBilling as boolean)}</KV>
        </Card>
        <Card title="Related Information" icon={ICON.search}>
          <ActionList
            items={[
              { title: 'Address History', sub: 'View full previous addresses' },
              { title: 'NAS Details', sub: 'View full NAS information' },
              { title: 'Linked Connections', sub: 'See which services are linked to this address', onClick: () => ctx.goToTab('ts-products') },
              { title: 'Address Validation', sub: 'Check and validate address' },
              { title: 'Serviceability Check', sub: 'Check product availability at this address' },
            ]}
          />
        </Card>
      </div>
      <WideBlock className="">
        <TableCard
          title={`Address History (${history.length})`}
          icon={ICON.refresh}
          link="View All"
          rows={history}
          cols={[
            { header: '#', render: (_r, i) => i + 1 },
            { header: 'Address Type', render: (r) => str(r.type) },
            { header: 'Zone', render: (r) => str(r.zone) },
            { header: 'Street', render: (r) => str(r.street) },
            { header: 'Building', render: (r) => str(r.building) },
            { header: 'RFS Flag', render: (r) => (r.rfs ? <Pill tone="green">Yes</Pill> : 'No') },
            { header: 'Valid From', render: (r) => dateTime(r.from).d },
            { header: 'Valid To', render: (r) => (r.to ? dateTime(r.to).d : '-') },
            { header: 'Status', render: (r) => <Pill tone={str(r.status) === 'Current' ? 'green' : 'neutral'}>{str(r.status)}</Pill> },
            { header: 'Updated By', render: (r) => str(r.by) },
            { header: 'Updated On', render: (r) => rowDate(r.on) },
            { header: 'Action', render: () => <span className="text-link font-semibold">View</span> },
          ]}
        />
      </WideBlock>
    </>
  );
}
