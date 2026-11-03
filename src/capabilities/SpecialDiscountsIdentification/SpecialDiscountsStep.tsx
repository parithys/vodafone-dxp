import { CARD_SELECTED, SelectedTick, CARD_IDLE } from '../../components/primitives/offerCardParts';
import { useEffect } from 'react';
import { Input } from '../../components/primitives/Input';
import { Icon } from '../../components/primitives/Icon';
import { CompanySearchInput } from '../../components/domain/CompanySearchInput';
import type { CompanySelection } from '../../components/domain/CompanySearchInput';
import { QidImageUpload } from '../../components/domain/QidImageUpload';
import { isScanAccepted } from '../../components/domain/qidImageUploadModel';
import { CARD, CARD_SELECTABLE } from '../stepStyles';
import { TYPE_OPTIONS, isCompanySupported } from './specialDiscountsModel';
import type { SpecialDiscountType, SpecialDiscountsValue } from './specialDiscountsModel';
import { B2B2C, CHECK_ICON, MADA, RETIRED } from '../../assets/icons';

export function SpecialDiscountsStep({
  value,
  onChange,
  derivedCompany,
}: {
  value: SpecialDiscountsValue;
  onChange: (v: SpecialDiscountsValue) => void;
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
          <div className="split-7-3">
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
          <div className="stack gap-2 min-w-0">
          <div className={EQUAL_CARD}>
          <QidImageUpload
            documentType="Office ID"
            // This step's own rule: the reader on every device, upload on a tablet or when there is no reader.
            readerEverywhere
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

const TYPE_ICONS: Partial<Record<SpecialDiscountType, string>> = {
  b2b2c: B2B2C,
  retired: RETIRED,
  mada: MADA,
};


function OPTION_CARDS(value: SpecialDiscountsValue, onChange: (v: SpecialDiscountsValue) => void, derivedCompany?: CompanySelection) {
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
        className={`${CARD_SELECTABLE} cursor-pointer transition-colors focus-ring ${checked ? CARD_SELECTED : CARD_IDLE}`}
      >
        {checked && <SelectedTick />}
        <div className="row">
          {/* Icon tile: tinted at rest, solid accent when selected. */}
          <span
            className={`icon-box ${checked ? 'bg-accent text-accent-on' : 'bg-surface-warm text-accent'}`}
          >
            <Icon path={TYPE_ICONS[o.key] ?? CHECK_ICON} className="size-5 " />
          </span>
          <span className="min-w-0 flex-1 value-text">{o.label}</span>
        </div>
      </div>
    );
  });
}

// ---------------------------------------------------------------- Cross-sales offers
