import { Button } from '../primitives/Button';
import { DataTable } from '../primitives/DataTable';
import { Drawer } from '../primitives/Drawer';
import type { PricingRecharge } from './prepaidCartModel';

/**
 * A recharge's international reach in the side drawer: the minutes it gives and the countries they cover and, for a "View Country Bonus" recharge, the
 * bonus minutes per country. Reference read while choosing; everything shown is catalogue data (RechargeCountryInfo).
 */
export function RechargeCountryDrawer({ recharge, onClose }: { recharge: PricingRecharge | null; onClose: () => void }) {
  const info = recharge?.countryInfo;
  return (
    <Drawer
      open={Boolean(recharge && info)}
      onClose={onClose}
      title={recharge ? `${recharge.name} - ${info?.button === 'View Country Bonus' ? 'Country Bonus' : 'Eligible countries'}` : 'Countries'}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {info && (
        <div className="space-y-4">
          <section aria-label="Eligible Countries" className="card p-5 space-y-3">
            <p className="caption-heading">Eligible Countries</p>
            <p className="title title-md font-semibold">{info.minutes}</p>
            <ul className="cluster">
              {info.countries.map((c) => (
                <li key={c} className="chip-soft">
                  {c}
                </li>
              ))}
            </ul>
          </section>
          {info.bonus && (
            <section aria-label="Country Bonus" className="card p-5 space-y-3">
              <p className="caption-heading">Country Bonus</p>
              <p className="title title-md font-semibold">{info.bonus.heading}</p>
              <DataTable
                variant="plain"
                dense
                pageSize={Infinity}
                rows={info.bonus.rows}
                rowKey={(r) => r.iso}
                columns={[
                  { key: 'country', header: 'Country', sortable: false, strong: true, render: (r) => r.country },
                  { key: 'bonus', header: 'Bonus Minutes', sortable: false, render: (r) => r.bonus },
                ]}
              />
            </section>
          )}
        </div>
      )}
    </Drawer>
  );
}
