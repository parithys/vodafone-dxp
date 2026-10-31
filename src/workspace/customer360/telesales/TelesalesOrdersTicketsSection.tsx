import { isClosedTicket } from '../../../lib/statusTone';
import { FilterSelect } from '../sections/C360Kit';
import { SearchField } from '../../../components/primitives/SearchField';
import { useState } from 'react';
import { Card, Pill, dateTime, type Ctx } from './TelesalesOverview';
import { ActionList, BarChart, HeaderButton, ICON, PillTabs, SectionHeader, StatStrip, Table, TableCard, TileLinks, pillFor, WideBlock } from './TelesalesKit';
import { rowDate, type Rec } from './shared';
import { strOrEmpty as str } from '../../../lib/values';
import { PAGE } from './listShared';
import { Pagination } from '../../../capabilities';

export function OrdersTicketsSection({ ctx }: { ctx: Ctx }) {
  const { data } = ctx;
  const orders = [...data.orders].sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt)));
  const tickets = [...data.tickets].sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt)));
  const [oq, setOq] = useState('');
  const [ot, setOt] = useState('All Order Types');
  const [os, setOs] = useState('All Statuses');
  const [op, setOp] = useState(0);
  const [tq, setTq] = useState('');
  const [tc, setTc] = useState('All Categories');
  const [ts, setTs] = useState('All Statuses');
  const [tp, setTp] = useState(0);
  const [chart, setChart] = useState('orders');
  const oTypes = ['All Order Types', ...Array.from(new Set(orders.map((o) => str(o.orderType)).filter(Boolean)))];
  const oStats = ['All Statuses', ...Array.from(new Set(orders.map((o) => str(o.status)).filter(Boolean)))];
  const tCats = ['All Categories', ...Array.from(new Set(tickets.map((t) => str(t.category)).filter(Boolean)))];
  const tStats = ['All Statuses', ...Array.from(new Set(tickets.map((t) => str(t.status)).filter(Boolean)))];
  const fo = orders.filter((o) => (ot === 'All Order Types' || str(o.orderType) === ot) && (os === 'All Statuses' || str(o.status) === os) && `${str(o.orderId)} ${str(o.orderType)} ${str(o.status)}`.toLowerCase().includes(oq.toLowerCase()));
  const ft = tickets.filter((t) => (tc === 'All Categories' || str(t.category) === tc) && (ts === 'All Statuses' || str(t.status) === ts) && `${str(t.ticketId)} ${str(t.category)} ${str(t.status)}`.toLowerCase().includes(tq.toLowerCase()));
  const cnt = (list: Rec[], re: RegExp) => list.filter((x) => re.test(str(x.status))).length;
  const overdue = tickets.filter((t) => t.slaDueAt && new Date(str(t.slaDueAt)) < new Date() && !isClosedTicket(t.status)).length;
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-GB', { month: 'short' }) };
  });
  const bucket = (list: Rec[]) => months.map((m) => ({ label: m.label, value: list.filter((x) => str(x.createdAt).startsWith(m.key)).length }));
  const feed = [
    ...orders.map((o) => ({ at: o.createdAt, activity: 'Order created', ref: str(o.orderId), by: str(o.createdBy ?? '-') })),
    ...tickets.map((t) => ({ at: t.createdAt, activity: 'Ticket created', ref: str(t.ticketId), by: str(t.createdBy ?? '-') })),
    ...data.payments.map((p) => ({ at: p.capturedAt, activity: 'Payment received', ref: str(p.receiptNumber ?? p.paymentId), by: 'Customer' })),
  ]
    .filter((e) => e.at)
    .sort((a, b) => str(b.at).localeCompare(str(a.at)))
    .slice(0, 5);
  const pageOf = <T,>(list: T[], p: number) => list.slice(p * PAGE, p * PAGE + PAGE);
  return (
    <>
      <SectionHeader />
      <StatStrip
        items={[
          { value: orders.length, label: 'Total Orders' },
          { value: cnt(orders, /complete|deliver/i), label: 'Completed', tone: 'ok' },
          { value: cnt(orders, /progress|draft|submitted|approval/i), label: 'In Progress' },
          { value: cnt(orders, /cancel/i), label: 'Cancelled', tone: 'bad' },
          { value: tickets.length, label: 'Total Trouble Tickets' },
          { value: cnt(tickets, /solved|resolved|closed/i), label: 'Resolved', tone: 'ok' },
          { value: cnt(tickets, /open|not solved|progress/i), label: 'Open' },
          { value: overdue, label: 'Overdue', tone: 'warn' },
        ]}
      />
      <WideBlock className="">
      <Card title={`Orders ({orders.length})`} icon={ICON.card} link="View All Orders" onLink={() => ctx.goToTab('ts-history')}>
        <div className="px-4 py-3 flex gap-2 border-b border-[var(--field-card-border)]">
          <SearchField value={oq} onChange={(e) => { setOq(e.target.value); setOp(0); }} onClear={() => { setOq(''); setOp(0); }} placeholder="Search by order number, product or status..." aria-label="Search orders" wrapperClassName="flex-1 min-w-48" />
          <FilterSelect label="Order Type" value={ot} options={oTypes.map((x) => ({ value: x, label: x }))} onChange={(v) => { setOt(v); setOp(0); }} />
          <FilterSelect label="Order Status" value={os} options={oStats.map((x) => ({ value: x, label: x }))} onChange={(v) => { setOs(v); setOp(0); }} />
          <HeaderButton primary>+ New Order</HeaderButton>
        </div>
        <Table
          rows={pageOf(fo, op)}
          empty="No orders on file for this customer."
          cols={[
            { header: 'Order Number', render: (o) => <b>{str(o.orderId)}</b> },
            { header: 'Date', render: (o) => (o.createdAt ? dateTime(o.createdAt).d : '-') },
            { header: 'Product / Service', render: (o) => str(o.orderType) },
            { header: 'Order Type', render: (o) => str(o.orderSubType ?? o.orderType) },
            { header: 'Status', render: (o) => <Pill tone={pillFor(str(o.status))}>{str(o.status)}</Pill> },
            { header: 'Channel', render: (o) => str(o.sourceChannel) || '-' },
            { header: 'Actions', render: () => <span className="text-accent font-bold">···</span> },
          ]}
        />
        <Pagination className="m-4" page={op + 1} total={fo.length} pageSize={PAGE} onPage={(p) => setOp(p - 1)} />
      </Card>
      </WideBlock>
      <WideBlock className="">
        <Card title={`Trouble Tickets (${tickets.length})`} icon={ICON.help} link="View All Tickets" onLink={() => ctx.goToTab('ts-history')}>
          <div className="px-4 py-3 flex gap-2 border-b border-[var(--field-card-border)]">
            <SearchField value={tq} onChange={(e) => { setTq(e.target.value); setTp(0); }} onClear={() => { setTq(''); setTp(0); }} placeholder="Search by ticket number, issue or status..." aria-label="Search tickets" wrapperClassName="flex-1 min-w-48" />
            <FilterSelect label="Ticket Category" value={tc} options={tCats.map((x) => ({ value: x, label: x }))} onChange={(v) => { setTc(v); setTp(0); }} />
            <FilterSelect label="Ticket Status" value={ts} options={tStats.map((x) => ({ value: x, label: x }))} onChange={(v) => { setTs(v); setTp(0); }} />
            <HeaderButton primary>+ Create Ticket</HeaderButton>
          </div>
          <Table
            rows={pageOf(ft, tp)}
            empty="No trouble tickets on file for this customer."
            cols={[
              { header: 'Ticket Number', render: (t) => <b>{str(t.ticketId)}</b> },
              { header: 'Date', render: (t) => (t.createdAt ? dateTime(t.createdAt).d : '-') },
              { header: 'Issue Category', render: (t) => str(t.category) },
              { header: 'Priority', render: (t) => <Pill tone={pillFor(str(t.priority).replace(/^\d-/, ''))}>{str(t.priority).replace(/^\d-/, '')}</Pill> },
              { header: 'Status', render: (t) => <Pill tone={pillFor(str(t.status))}>{str(t.status)}</Pill> },
              { header: 'Channel', render: (t) => str(t.channel ?? t.createdVia) || '-' },
              { header: 'Actions', render: () => <span className="text-accent font-bold">···</span> },
            ]}
          />
          <Pagination className="m-4" page={tp + 1} total={ft.length} pageSize={PAGE} onPage={(p) => setTp(p - 1)} />
        </Card>
      </WideBlock>
      <div className="contents">
        <TableCard
          title="Recent Activities"
          icon={ICON.refresh}
          link="View All"
          rows={feed}
          cols={[
            { header: 'Date & Time', render: (e) => rowDate(e.at) },
            { header: 'Activity', render: (e) => e.activity },
            { header: 'Reference', render: (e) => <b>{e.ref}</b> },
            { header: 'Performed By', render: (e) => e.by },
          ]}
        />
        <Card title="Order & Ticket Insights" icon={ICON.bars}>
          <div className="px-5 pt-3">
            <PillTabs active={chart} onChange={setChart} items={[{ key: 'orders', label: 'Orders' }, { key: 'tickets', label: 'Trouble Tickets' }]} />
          </div>
          <BarChart data={bucket(chart === 'orders' ? orders : tickets)} height={140} />
        </Card>
        <Card title="Quick Actions" icon={ICON.bars}>
          <ActionList
            items={[
              { title: 'Create New Order', sub: 'Place a new order for this customer' },
              { title: 'Create Trouble Ticket', sub: 'Log a new issue or request' },
              { title: 'View Order History', sub: 'See all past orders' },
              { title: 'View Trouble Ticket History', sub: 'See all past tickets' },
              { title: 'Check Order / Ticket Status', sub: 'Track an existing request' },
            ]}
          />
        </Card>
      </div>
      <WideBlock className="">
        <Card title="Related Information" icon={ICON.search}>
          <TileLinks
            columns={5}
            items={[
              { key: 'ia', title: 'Installed Assets', sub: 'View all installed assets', icon: ICON.grid, onClick: () => ctx.goToTab('ts-products') },
              { key: 'cn', title: 'Connections', sub: 'View customer connections', icon: ICON.phone, onClick: () => ctx.goToTab('ts-products') },
              { key: 'bp', title: 'Billing Profile', sub: 'View billing profiles', icon: ICON.card, onClick: () => ctx.goToTab('ts-billing') },
              { key: 'ch', title: 'Contact History', sub: 'View communication history', icon: ICON.user, onClick: () => ctx.goToTab('ts-contact') },
              { key: 'at', title: 'Audit Trail', sub: 'View all changes and activities', icon: ICON.refresh, onClick: () => ctx.goToTab('ts-history') },
            ]}
          />
        </Card>
      </WideBlock>
    </>
  );
}
