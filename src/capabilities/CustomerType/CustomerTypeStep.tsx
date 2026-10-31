import { CARD_SELECTED, SelectedTick, CARD_IDLE } from '../../components/primitives/offerCardParts';
import { useEffect } from 'react';
import { Input } from '../../components/primitives/Input';
import { Icon } from '../../components/primitives/Icon';
import { CompanySearchInput } from '../../components/domain/CompanySearchInput';
import type { CompanySelection } from '../../components/domain/CompanySearchInput';
import { QidImageUpload } from '../../components/domain/QidImageUpload';
import { isScanAccepted } from '../../components/domain/qidImageUploadModel';
import { CARD, CARD_SELECTABLE } from '../stepStyles';
import { TYPE_OPTIONS, isCompanySupported } from './customerTypeModel';
import type { CustomerType, CustomerTypeValue } from './customerTypeModel';

export function CustomerTypeStep({
  value,
  onChange,
  derivedCompany,
}: {
  value: CustomerTypeValue;
  onChange: (v: CustomerTypeValue) => void;
  /** Employer already on the MOI record, offered as the B2B2C starting point. */
  derivedCompany?: CompanySelection;
}) {
  // Standard customer is the default. An employer on the MOI record is not
  // selected for the agent - it only prefills the company if they choose B2B2C.
  useEffect(() => {
    if (value.type) return;
    onChange({ type: 'none' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const type = value.type;

  return (
    <div className="space-y-5">
      <div role="group" aria-label="Additional discounts" className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))]">
        {OPTION_CARDS(value, onChange, derivedCompany)}
      </div>

      {type === 'b2b2c' && (
        <div className={`${CARD} space-y-3`}>
          <div className="grid gap-4 sm:grid-cols-[7fr_3fr] items-start">
            <CompanySearchInput
              label="Company Name"
              required
              allowAddNew={false}
              value={value.company ?? {}}
              onChange={(company) => onChange({ ...value, company })}
            />
            <Input
              label="ID Number"
              value={value.idNumber ?? ''}
              onChange={(e) => onChange({ ...value, idNumber: e.target.value })}
              placeholder="Employee ID number"
              autoComplete="off"
              // Same height as the company search field beside it (py-3).
              className="py-3!"
            />
          </div>
          {value.company?.companyName && (
            isCompanySupported(value.company) ? null : (
              <p className="text-danger text-[length:var(--fs-caption)]">
                This company is not in the supported company list, so B2B2C cannot continue. Choose another customer type.
              </p>
            )
          )}
        </div>
      )}

      {type && type !== 'none' && (type !== 'b2b2c' || isCompanySupported(value.company)) && (
        <div className="space-y-5">
          {/* One card for the office ID: scanned, or uploaded from the same card's own "Upload document". */}
          <div className="flex flex-col gap-2 min-w-0">
          <div className={EQUAL_CARD}>
          <QidImageUpload
            documentType="Office ID"
            bothCaptureActions
            variant={type === 'b2b2c' || type === 'retired' || type === 'mada' ? type : undefined}
            value={value.officeId ?? {}}
            // A clear scan or upload is accepted and saved as it lands; a rescan or new upload replaces it, so only the latest image counts.
            onChange={(officeId) => onChange({ ...value, officeId, officeAccepted: isScanAccepted(officeId) })}
          />
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Makes the Scan and Upload cards the same height: the card fills its column and its main area grows to fill the card. */
const EQUAL_CARD = 'flex-1 [&>div]:h-full [&>div>div:first-child]:flex-1';

const TYPE_ICONS: Partial<Record<CustomerType, string>> = {
  b2b2c: 'M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 9h5a1 1 0 0 1 1 1v11M3 21h18M8 8h2M8 12h2M8 16h2',
  retired: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v4l2 1',
  mada: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3',
};

const CHECK_ICON = 'M5 12.5l4.5 4.5L19 7.5';

function OPTION_CARDS(value: CustomerTypeValue, onChange: (v: CustomerTypeValue) => void, derivedCompany?: CompanySelection) {
  // Standard customer is not a card: it is what applies when none of the
  // special types is selected. Clicking the selected card again deselects it.
  return TYPE_OPTIONS.filter((o) => o.key !== 'none').map((o) => {
    const checked = value.type === o.key;
    // Switching type discards what belonged to the previous one, so a stale
    // company or office-ID scan cannot ride along into the new type.
    const choose = () => checked ? onChange({ type: 'none' }) : onChange({ type: o.key, company: o.key === 'b2b2c' ? (value.company ?? (derivedCompany?.companyName ? derivedCompany : undefined)) : undefined });
    return (
      // The whole card is the control (no radio circle): selected state is the
      // red border + tint, announced as a radio via role/aria-checked.
      <div
        key={o.key}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={choose}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            choose();
          }
        }}
        className={`${CARD_SELECTABLE} cursor-pointer transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${checked ? CARD_SELECTED : CARD_IDLE}`}
      >
        {checked && <SelectedTick />}
        <div className="flex items-center gap-3">
          {/* Icon tile: tinted at rest, solid accent when selected. */}
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] transition-colors ${checked ? 'bg-accent text-accent-on' : 'bg-surface-warm text-accent'}`}
          >
            <Icon path={TYPE_ICONS[o.key] ?? CHECK_ICON} className="w-5 h-5" />
          </span>
          <span className="min-w-0 flex-1 text-fg font-medium text-[length:var(--fs-body)]">{o.label}</span>
        </div>
      </div>
    );
  });
}

// ---------------------------------------------------------------- Cross-sales offers
