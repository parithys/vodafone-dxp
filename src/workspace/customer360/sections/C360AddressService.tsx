import { isClosedTicket } from '../../../lib/statusTone';
import { Button } from '../../../components/primitives/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/primitives/Icon';
import { OsmEmbed } from '../../../components/domain/OsmEmbed';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import type { Customer360Data } from '../../../engines/customer360Engine';
import type { CustomerService, ServiceCategory } from '../../../engines/customerServicesEngine';
import { AddressEditDrawer, type AddressRecord } from './AddressSection';
import { ActionButton, DetailRows, GridTable, IC, LinkAction, Panel, StatusPill, TabPage, fmtDate } from './C360Kit';
import type { Tone } from './C360Kit';
import { Dv } from '../demoValues';

const TICKET_DETAIL_ROUTE = '/trouble-ticketing-complaints/ticket-homepage';

interface Appointment {
  appointmentId: string;
  orderId?: string;
  technicianId?: string;
  status?: string;
  appointmentDate?: string;
  timeSlot?: string;
}
interface WfmActivity {
  id: string;
  activityType?: string;
  startTime?: string;
  activityStatus?: string;
  resourceId?: string;
  customerDetails?: string;
  serviceDetails?: string;
}

// Which of the customer's services put a kind of network in service: by the service category Customer 360 classifies each service into
// (customerServicesEngine), not by matching words in its name and label.
const AVAILABILITY: { label: string; icon: string; tone: Tone; categories: ServiceCategory[] }[] = [
  { label: 'Mobile Network', icon: IC.mobile, tone: 'green', categories: ['Prepaid', 'Postpaid'] },
  { label: 'Fixed Line (Fibre)', icon: IC.phone, tone: 'green', categories: ['GigaHome Fibre', 'Fixed Line'] },
  { label: 'Home Internet', icon: IC.wifi, tone: 'green', categories: ['GigaHome Fibre', 'GigaHome 5G'] },
  { label: 'TV Services', icon: IC.tv, tone: 'green', categories: ['TV / Entertainment'] },
  { label: 'IoT / M2M', icon: IC.cpu, tone: 'green', categories: ['Smart Devices'] },
];

const addressLine = (a: AddressRecord) => [a.addressLine1, a.addressLine2, a.city, a.country].filter(Boolean).join(', ');

/**
 * Address & Service tab: customer addresses (edit via the existing verified address editor), service availability,
 * RFS check form, installation / service information and the address & network tools. Availability is read from the
 * services the customer already has; the app holds no per-address availability, map or RFS-check service, so those
 * controls are shown disabled.
 */
export function C360AddressService({
  data,
  services,
  canEdit,
  requireVerification,
  onTicketCreated,
}: {
  data: Customer360Data;
  services: CustomerService[];
  goToTab?: (key: string) => void;
  canEdit: boolean;
  requireVerification: (action: () => void) => void;
  onTicketCreated: (ticket: Record<string, unknown>) => void;
}) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressRecord[]>(() => data.addresses as unknown as AddressRecord[]);
  const [editing, setEditing] = useState<AddressRecord | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wfm, setWfm] = useState<WfmActivity[]>([]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([mockDataEngine.list<Appointment>('appointments'), mockDataEngine.list<WfmActivity>('wfm-activities')]).then(([a, w]) => {
      if (cancelled) return;
      setAppointments(a);
      setWfm(w);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const primary = addresses.find((a) => a.primaryStatus === 'Primary') ?? addresses[0];
  const others = addresses.filter((a) => a !== primary);

  const orderIds = new Set(data.orders.map((o) => String(o.orderId)));
  const customerName = data.customer.name.toLowerCase();
  const installs = wfm.filter((w) => /install/i.test(String(w.activityType)) && String(w.customerDetails ?? '').toLowerCase().includes(customerName));
  const lastInstall = [...installs].sort((a, b) => String(b.startTime).localeCompare(String(a.startTime)))[0];
  const nextAppointment = appointments
    .filter((a) => a.orderId && orderIds.has(a.orderId) && !/(complete|cancel)/i.test(String(a.status)))
    .sort((a, b) => String(a.appointmentDate).localeCompare(String(b.appointmentDate)))[0];
  const latestOpenTicket = [...data.tickets].filter((t) => !isClosedTicket(t.status)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  const installedServices = services.filter((s) => s.tab !== 'mobile').map((s) => s.label);

  const edit = primary && canEdit ? () => requireVerification(() => setEditing(primary)) : undefined;

  return (
    <TabPage icon={IC.pin} tone="blue" title="Address & Service" subtitle="View customer addresses, service availability and network information">
      <div className="grid grid-cols-1 @6xl:grid-cols-3 gap-4 items-stretch">
        <Panel
          icon={IC.home}
          title="Customer Address"
          action={
            edit && (
              <Button variant="secondary" compact onClick={edit}>
                Edit Address
              </Button>
            )
          }
        >
          {primary ? (
            <DetailRows
              rows={[
                { label: 'Address Type', value: primary.primaryStatus === 'Primary' ? 'Primary' : 'Other' },
                { label: 'Street', value: primary.streetNo ? `Street ${primary.streetNo}` : '-' },
                { label: 'Building', value: primary.buildingNo ? `Building ${primary.buildingNo}` : '-' },
                { label: 'Zone', value: primary.zone ? `Zone ${primary.zone}` : '-' },
                { label: 'Area', value: <Dv k="area" /> },
                { label: 'City', value: primary.city || '-' },
                { label: 'State / Province', value: <Dv k="stateProvince" /> },
                { label: 'Postal Code', value: primary.poBox || (primary as unknown as { postalCode?: string }).postalCode || '-' },
                { label: 'Country', value: primary.country || '-' },
                { label: 'Source', value: <Dv k="addressSource" /> },
                { label: 'Last Updated', value: fmtDate((primary as unknown as { effectiveFrom?: string }).effectiveFrom) ?? '-' },
              ]}
            />
          ) : (
            <p className="text-muted text-[length:var(--fs-body)]">No addresses on file for this customer.</p>
          )}
        </Panel>

        <Panel
          icon={IC.pin}
          title="Map View"
          className="@6xl:col-span-2 flex flex-col"
          bodyClassName="flex-1 flex flex-col"
        >
          <p className="text-fg-2 text-[length:var(--fs-body)] mb-3">{primary ? addressLine(primary) : 'No address selected'}</p>
          <OsmEmbed
            title="Map of the Customer's Address"
            fill
            latitude={(primary as unknown as { latitude?: number } | undefined)?.latitude}
            longitude={(primary as unknown as { longitude?: number } | undefined)?.longitude}
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-4 items-stretch">
        <Panel icon={IC.signalTower} title="Service Availability" action={<ActionButton onClick={undefined} disabled>Check Another Address</ActionButton>}>
          <ul>
            {AVAILABILITY.map((a) => {
              const has = services.filter((s) => a.categories.includes(s.category));
              return (
                <li key={a.label} className="flex items-center gap-3 py-2.5 border-b border-border-soft text-[length:var(--fs-body)]">
                  <span className="flex-1 text-fg-2">{a.label}</span>
                  {has.length > 0 ? (
                    <>
                      <span className="w-5 h-5 rounded-[var(--radius-pill)] bg-success-solid text-on-dark flex items-center justify-center shrink-0">
                        <Icon path={IC.check} className="w-3 h-3" />
                      </span>
                      <span className="w-36 min-w-0">
                        <span className="block text-success font-medium leading-tight">In Service</span>
                        <span className="block text-muted text-[length:var(--fs-caption)] truncate">{has.length} line{has.length === 1 ? '' : 's'}</span>
                      </span>
                    </>
                  ) : (
                    <span className="w-36"><Dv k="serviceAvailability" /></span>
                  )}
                </li>
              );
            })}
            <li className="flex items-center justify-between gap-3 pt-3 text-[length:var(--fs-body)]">
              <span className="text-fg-2">Last Checked</span>
              <span className="text-fg font-medium"><Dv k="lastChecked" /></span>
            </li>
          </ul>
        </Panel>

        <Panel icon={IC.calendar} title="Installation / Service Information">
          <DetailRows
            rows={[
              { label: 'Last Installation Date', value: fmtDate(lastInstall?.startTime) ?? '-' },
              { label: 'Installed Services', value: installedServices.length > 0 ? installedServices.join(', ') : '-' },
              { label: 'Installation Status', value: lastInstall?.activityStatus ? <StatusPill status={String(lastInstall.activityStatus)} /> : '-' },
              { label: 'Technician Reference', value: lastInstall?.resourceId ?? nextAppointment?.technicianId ?? '-' },
              { label: 'Next Appointment', value: nextAppointment ? `${fmtDate(nextAppointment.appointmentDate) ?? ''}${nextAppointment.timeSlot ? ` | ${nextAppointment.timeSlot}` : ''}`.trim() : '-' },
              {
                label: 'Related Ticket',
                value: latestOpenTicket ? (
                  <span className="inline-flex items-center gap-3">
                    {String(latestOpenTicket.ticketId)}
                    <LinkAction onClick={() => navigate(`${TICKET_DETAIL_ROUTE}?id=${String(latestOpenTicket.ticketId)}`)}>View</LinkAction>
                  </span>
                ) : (
                  '-'
                ),
              },
            ]}
          />
        </Panel>
      </div>

      <div>
        <Panel icon={IC.pin} title={`Other Addresses (${others.length})`} action={<ActionButton disabled>Add Address</ActionButton>} flush>
          <div className="px-2 pb-3">
            <GridTable
              cols={[
                { key: 'n', header: '#', render: (_r, i) => i + 1 },
                { key: 'type', header: 'Address Type', render: (a) => (a.primaryStatus ? String(a.primaryStatus) : 'Other') },
                { key: 'address', header: 'Address', render: (a) => addressLine(a) || '-' },
                { key: 'source', header: 'Source', render: () => <Dv k="addressSource" /> },
                { key: 'status', header: 'Status', render: (a) => <StatusPill status={a.activeFlag === false ? 'Inactive' : 'Active'} /> },
              ]}
              rows={others}
              rowKey={(a) => a.id}
              empty="No other addresses on file."
            />
          </div>
        </Panel>
      </div>

      {editing && (
        <AddressEditDrawer
          address={editing}
          customerId={data.customer.customerId}
          readOnly={!canEdit}
          onClose={() => setEditing(null)}
          onSaved={(patch) => setAddresses((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...patch } : a)))}
          onTicketCreated={onTicketCreated}
        />
      )}
    </TabPage>
  );
}
