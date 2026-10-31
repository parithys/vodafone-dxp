import { OfferDetailsDrawer } from '../../capabilities/CrossSellOffers/OfferDetailsDrawer';
import type { OfferDetails } from '../../capabilities/CrossSellOffers/OfferDetailsDrawer';
import type { PostpaidPlan } from './postpaidPlanModel';
import { ICON_GIFT, planFeatureRows } from '../primitives/offerCardParts';
import { formatQar } from '../../lib/format';

interface PlanDetailsDrawerProps {
  detailPlan: PostpaidPlan | null;
  onClose: () => void;
  /** With onSelectProduct: the drawer's footer button selects the plan. */
  selectedProductId?: string;
  onSelectProduct?: (productId: string) => void;
  /** Lists the plan's own facts and its bill limit in the drawer (the Offers tab). */
  showPlanDetails?: boolean;
}

/* Plan details, on demand, in the same side drawer as a Recommended offer (title, summary, the plan's free extras,
   a facts panel, what is included and related documents). A drawer rather than a modal: it is reference material
   read while choosing, so it slides in beside the list instead of covering it. Everything shown is catalogue data. */
export function PlanDetailsDrawer({ detailPlan, onClose, selectedProductId, onSelectProduct, showPlanDetails = false }: PlanDetailsDrawerProps) {
  const p = detailPlan;
  const details: OfferDetails | null = p
    ? {
        offerName: p.name,
        offerDescription: p.features?.length
          ? p.features.join(' \u00b7 ')
          : [p.dataAllowanceGB ? `${p.dataAllowanceGB} GB data` : 'Unlimited data', p.minutesAllowance].filter(Boolean).join(' \u00b7 '),
        monthlyRental: p.mrcQAR,
        campaignCode: p.productId,
        codeLabel: 'Product code',
        // No status or offer type: neither says anything about the plan (an empty value leaves its row out).
        status: '',
        // Only what is specific to this plan: its own Speed and Fair Usage Policy lines. The shared international-minutes tables and the
        // generic "to calculate..." links are not plan facts, so they are not shown; a plan with no FUP on record shows just its facts.
        policy: p.fup?.length ? { title: 'Speed and Fair Usage Policy (FUP)', bullets: p.fup, tables: [], links: [] } : undefined,
      }
    : null;
  return (
    <OfferDetailsDrawer
      offer={details}
      serviceLabel="Postpaid"
      fixedService={false}
      highlight={p?.benefits?.[0] ? { title: p.benefits[0], subtitle: `Included with ${p.name}` } : null}
      includedNames={[]}
      planDetails={p && showPlanDetails ? [...(p.features?.length ? p.features : planFeatureRows(p).filter((r) => r.icon !== ICON_GIFT).map((r) => r.text)), `Bill limit: ${formatQar(p.mrcQAR)}`] : undefined}
      showRelatedDocuments={false}
      hideStatusTags
      selected={Boolean(p && selectedProductId === p.productId)}
      onSelect={() => p && onSelectProduct?.(p.productId)}
      onClose={onClose}
    />
  );
}
