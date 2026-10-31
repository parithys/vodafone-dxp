import { FilterSelect } from '../sections/C360Kit';
import { overallCreditLimitOf } from '../creditLimitView';
import { useState } from 'react';
import { Icon } from '../../../components/primitives/Icon';
import { buildAssetsFieldResolver } from '../sections/assetsResolvers';
import { Card, Pill, Ring, dateTime, type Ctx } from './TelesalesOverview';
import { BarChart, Field, ICON, PillTabs, SectionHeader, StatStrip, TableCard, yesNo } from './TelesalesKit';
import { rowDate, demoOf, arr, type Rec } from './shared';
import { strOrEmpty as str } from '../../../lib/values';
import { catalogOf, qar } from './billingShared';
import { formatQarAny } from '../../../lib/format';

// ============================================================================ Usage & Behaviour
export function UsageSection({ ctx }: { ctx: Ctx }) {
  const { data, services } = ctx;
  const demo = demoOf(ctx);
  const cat = catalogOf(ctx);
  const [pickedRef, setPickedRef] = useState(services[0]?.ref);
  const [series, setSeries] = useState('data');
  const cur = services.find((s) => s.ref === pickedRef) ?? services[0];
  const res = buildAssetsFieldResolver(cur, data);
  const bal = data.inPlatformBalances[0];
  const use = data.serviceUsage[0];
  const ex = data.overviewExtras[0];
  const dig = data.digitalEngagement[0];
  const dataTotal = use ? Number(use.currentDataUsageGB) + Number(use.availableDataBalanceGB) : 0;
  const dataLeft = bal?.dataBalanceGB != null ? Number(bal.dataBalanceGB) : Number(use?.availableDataBalanceGB ?? 0);
  const voiceTotal = Number(ex?.voiceAllowanceMin ?? 500);
  const voiceLeft = bal?.voiceBalanceMinutes != null ? Number(bal.voiceBalanceMinutes) : Math.max(0, voiceTotal - Number(use?.currentVoiceUsageMinutes ?? 0));
  const smsTotal = Number(ex?.smsAllowance ?? 500);
  const smsLeft = bal?.smsBalanceCount != null ? Number(bal.smsBalanceCount) : Number(ex?.smsRemaining ?? 0);
  const trend = arr<{ month: string; dataRegular: number; dataOut: number; voiceRegular: number; voiceOut: number; smsRegular: number; smsOut: number }>(demo.usageTrend);
  const recharges = arr<Rec>(demo.recharges);
  const cdr = [...data.callDetailRecords].sort((a, b) => str(b.callDate).localeCompare(str(a.callDate))).slice(0, 10);
  const insights = arr<{ name: string; sub: string }>(cat.usageInsights);
  const addons = data.addonsDiscounts.filter((a) => a.category !== 'Discount');
  const discounts = data.addonsDiscounts.filter((a) => a.category === 'Discount');
  const creditLimit = data.creditLimits[0];
  const billLimit = res('Bill Limit') ?? (creditLimit ? `${formatQarAny(overallCreditLimitOf(data) ?? str(creditLimit.creditLimitQar ?? creditLimit.creditLimitQAR))}` : '-');
  const used = (left: number, total: number) => (total ? `${Math.round(((total - left) / total) * 100)}% Used` : '');
  const chart = trend.map((t) => ({
    label: t.month,
    value: series === 'data' ? t.dataRegular : series === 'voice' ? t.voiceRegular : series === 'sms' ? t.smsRegular : t.dataRegular + t.voiceRegular / 20 + t.smsRegular / 20,
    extra: series === 'data' ? t.dataOut : series === 'voice' ? t.voiceOut : series === 'sms' ? t.smsOut : 0,
  }));
  const unit = series === 'data' ? 'GB' : series === 'voice' ? 'Min' : series === 'sms' ? 'SMS' : '';
  return (
    <>
      <SectionHeader
       
       
       
        actions={
          <label className="inline-flex items-center gap-3 card px-4 py-2 text-[length:var(--fs-body)]">
            Select Connection
            <FilterSelect captioned label="Select Connection" value={pickedRef} options={services.map((s) => ({ value: s.ref, label: `${s.identifier} (${s.label})` }))} onChange={setPickedRef} />
            <Pill tone="green">{cur?.status ?? 'Active'}</Pill>
          </label>
        }
      />
      <StatStrip
        items={[
          { value: <span>{dataLeft} GB <span className="text-muted font-normal text-[length:var(--fs-caption)]">of {Math.round(dataTotal)} GB</span></span>, label: 'Data Usage', icon: ICON.grid },
          { value: <span>{voiceLeft} <span className="text-muted font-normal text-[length:var(--fs-caption)]">of {voiceTotal} Mins</span></span>, label: 'Voice Usage', icon: ICON.phone },
          { value: <span>{smsLeft} <span className="text-muted font-normal text-[length:var(--fs-caption)]">of {smsTotal} SMS</span></span>, label: 'SMS Usage', icon: ICON.phone },
          { value: qar(Number(bal?.mainBalanceQAR ?? 0)), label: 'Primary Balance' },
          { value: dig?.appLastLoginAt ? dateTime(dig.appLastLoginAt).d : '-', label: dig?.appActiveUser ? 'Active User · Last App Login' : 'Last App Login' },
          { value: dig ? `${str(dig.appDigitalAdoptionPct)}%` : '-', label: 'Digital Adoption' },
          { value: str(ex?.phoneVersion) || '-', label: `Phone Version · App ${str(dig?.appVersion) || '-'}` },
        ]}
      />
      <div className="contents">
        <Card title="Usage Trend" icon={ICON.bars}>
          <div className="px-5 pt-3">
            <PillTabs
              active={series}
              onChange={setSeries}
              items={[
                { key: 'data', label: 'Data' },
                { key: 'voice', label: 'Voice' },
                { key: 'sms', label: 'SMS' },
                { key: 'total', label: 'Total' },
              ]}
            />
          </div>
          <BarChart data={chart} unit={unit} height={170} />
          <div className="px-5 pb-4 flex gap-5 text-fg-2 text-[length:var(--fs-caption)]">
            <span>
              <span className="inline-block w-2 h-2 rounded-[var(--radius-pill)] bg-accent mr-1" />
              Regular Usage
            </span>
            <span>
              <span className="inline-block w-2 h-2 rounded-[var(--radius-pill)] bg-[var(--telesales-chart-slate)] mr-1" />
              Out of Bundle
            </span>
          </div>
        </Card>
        <TableCard
          title="Recent Usage (Last 10)"
          icon={ICON.refresh}
          link="View All"
          rows={cdr}
          empty="No recent usage on file."
          cols={[
            { header: 'Date & Time', render: (r) => rowDate(r.callDate) },
            { header: 'Type', render: (r) => str(r.callType) },
            { header: 'Details', render: (r) => str(r.destination) },
            { header: 'Amount / Volume', render: (r) => <b>{`${Math.round(Number(r.durationSeconds ?? 0) / 60)} Mins`}</b> },
          ]}
        />
        <TableCard
          title="Recharge History"
          icon={ICON.card}
          link="View All"
          rows={recharges}
          cols={[
            { header: 'Date', render: (r) => dateTime(r.at).d },
            { header: 'Amount', render: (r) => <b>{qar(Number(r.amountQar))}</b> },
            { header: 'Type', render: (r) => str(r.type) },
            { header: 'Channel', render: (r) => str(r.channel) },
          ]}
        />
      </div>
      <div className="contents">
        <Card title="Usage Behaviour Insights" icon={ICON.bars} link="View Details">
          <div className="p-5 grid grid-cols-2 gap-3">
            {insights.map((i) => (
              <div key={i.name} className="rounded-[var(--radius-card)] border border-[var(--field-card-border)] p-4">
                <Icon path={ICON.bars} className="w-4 h-4 text-muted" />
                <div className="text-fg font-bold text-[length:var(--fs-body)] mt-3">{i.name.replace('Calls', 'Calls').replace(/^High (Data|Roaming) (User)?$/, (m) => m)}</div>
                <div className="text-fg-2 text-[length:var(--fs-caption)]">{i.sub}</div>
              </div>
            ))}
          </div>
          <Field label="Last Login">{dig?.appLastLoginAt ? rowDate(dig.appLastLoginAt) : '-'}</Field>
          <Field label="Active User">{dig ? yesNo(dig.appActiveUser as boolean) : '-'}</Field>
          <Field label="Digital Adoption">{dig ? `${str(dig.appDigitalAdoptionPct)}%` : '-'}</Field>
          <Field label="App Version">{str(dig?.appVersion) || '-'}</Field>
        </Card>
        <Card title="App & Digital Behaviour" icon={ICON.user} link="View Details">
          <Field label="Registered Email">{str(data.customer.email) || '-'}</Field>
          <Field label="Phone Version">{str(ex?.phoneVersion) || '-'}</Field>
          <Field label="App User Since">{dig?.appUserSince ? dateTime(dig.appUserSince).d : '-'}</Field>
          <Field label="Preferred Channel">{dig ? 'App' : '-'}</Field>
        </Card>
      </div>
      <div className="contents">
        <Card title="Current Balances" icon={ICON.card} link="View Details">
          <div className="p-5 space-y-4">
            <div>
              <Ring value={String(dataLeft)} unit="GB" sub={`of ${Math.round(dataTotal)} GB`} fraction={dataTotal ? dataLeft / dataTotal : undefined} label="Data" />
              <div className="text-muted text-[length:var(--fs-caption)] text-right">{used(dataLeft, dataTotal)}</div>
            </div>
            <div>
              <Ring value={String(voiceLeft)} sub={`of ${voiceTotal} Mins`} fraction={voiceTotal ? voiceLeft / voiceTotal : undefined} label="Voice" />
              <div className="text-muted text-[length:var(--fs-caption)] text-right">{used(voiceLeft, voiceTotal)}</div>
            </div>
            <div>
              <Ring value={String(smsLeft)} sub={`of ${smsTotal} SMS`} fraction={smsTotal ? smsLeft / smsTotal : undefined} label="SMS" />
              <div className="text-muted text-[length:var(--fs-caption)] text-right">{used(smsLeft, smsTotal)}</div>
            </div>
            <Ring value={qar(Number(bal?.mainBalanceQAR ?? 0))} fraction={1} label="Primary Balance" wide />
          </div>
        </Card>
        <Card title="Plan & Add-On Usage" icon={ICON.card} link="View Plan Details">
          <Field label="Plan Name">{str(res('Plan Name')) || cur?.label || '-'}</Field>
          <Field label="Active Add-Ons">
            {addons.length} <span className="text-link font-semibold">View All</span>
          </Field>
          <Field label="Active Discounts">{discounts.length ? str(discounts[0].name) : '-'}</Field>
          <Field label="Pending Discounts">{discounts.length}</Field>
          <Field label="Discount Expiry Date">{str(res('Existing Discounts Expiry Date')) || '-'}</Field>
          <Field label="Bill Limit">{billLimit}</Field>
        </Card>
        <Card title="Behaviour Flags" icon={ICON.shield}>
          <Field label="Repeat Call Flag">{yesNo(false)}</Field>
          <Field label="Barring Flags">{yesNo(false)}</Field>
          <Field label="Autobase Eligibility">{yesNo(true)}</Field>
          <Field label="Star Number Value">{yesNo(Boolean(res('Star number value')))}</Field>
          <Field label="Usage Pattern">{insights.slice(0, 2).map((i) => i.name.replace(/ (User|Calls)$/, '')).join(', ') || '-'}</Field>
          <Field label="Lifetime Value">{use ? 'High' : '-'}</Field>
        </Card>
      </div>
    </>
  );
}
