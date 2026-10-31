import { Icon } from '../../../components/primitives/Icon';
import { canUseFeature } from '../../../engines/personaEngine';
import { usePersonaStore } from '../../../stores/personaStore';
import type { ConnectionProduct } from '../products';
import { HOME_CONNECTION_FEATURE, canStartProduct } from '../productAccess';
import { handOverToHomeConnection, productEligibilityClear } from './productChoice';
import { homeConnectionRoute } from './homeConnectionRoute';
import type { ProductStepContext } from './ProductSelection';
import { CHEVRON_RIGHT, ICONS_HOME, ICONS_PHONE, ICONS_SWAP, ICON_CARD, MOBILE_ALT } from '../../../assets/icons';

const ICONS = {
  home: ICONS_HOME,
  phone: ICONS_PHONE,
  swap: ICONS_SWAP,
  mobile: MOBILE_ALT,
  card: ICON_CARD,
  chevron: CHEVRON_RIGHT,
};

interface StartCard {
  key: string;
  title: string;
  description: string;
  icon: string;
  primary?: boolean;
  /** The product it stands for, or undefined for the home connection (its own journey). */
  product?: ConnectionProduct;
}

const CARDS: StartCard[] = [
  { key: 'postpaid', title: 'New Postpaid', description: 'Monthly mobile plan with bundles.', icon: ICONS.card, product: 'postpaid', primary: true },
  { key: 'home', title: 'New Home Connection', description: 'Fibre broadband & TV for the home.', icon: ICONS.home },
  { key: 'fixed-line', title: 'New Fixed Line', description: 'Landline voice service setup.', icon: ICONS.phone, product: 'fixed-line' },
  { key: 'mnp', title: 'New MNP', description: 'Port a number from another operator.', icon: ICONS.swap, product: 'mnp' },
  { key: 'prepaid', title: 'New Prepaid', description: 'Pay-as-you-go mobile line.', icon: ICONS.mobile, product: 'prepaid' },
];

/**
 * The five ways to start (New Postpaid first, the primary one) for a customer with no cross-sales offer, as cards (what the footer buttons were): New Home Connection, New Fixed Line,
 * New MNP, New Prepaid and New Postpaid. Each does what its button did. Only the products this role may start are shown; Postpaid always stays.
 */
export function StartCards({
  values,
  setValue,
  goNext,
  ctx,
  choose,
}: {
  values: Record<string, unknown>;
  setValue: (field: string, value: unknown) => void;
  goNext: () => void;
  ctx: ProductStepContext;
  choose: (product: ConnectionProduct) => void;
}) {
  const personaId = usePersonaStore.getState().activePersonaId;
  const shown = CARDS.filter((c) => (c.key === 'home' ? canUseFeature(personaId, HOME_CONNECTION_FEATURE) : c.product === 'postpaid' || !c.product || canStartProduct(personaId, c.product)));
  const start = (c: StartCard) => {
    if (!c.product) return handOverToHomeConnection(ctx, values, homeConnectionRoute(ctx));
    // The same product again, with its eligibility already judged: go on.
    if (values.product === c.product && productEligibilityClear(values)) {
      setValue('productPreselected', false);
      goNext();
      return;
    }
    choose(c.product);
  };
  return (
    <div className="grid w-full gap-4" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }} role="group" aria-label="Start a new service">
      {shown.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => start(c)}
          className={`flex flex-col items-start gap-3 rounded-[var(--radius-card-lg)] border p-5 text-left transition-colors focus:outline-none focus-visible:shadow-[var(--focus-ring)] ${
            c.primary
              ? 'border-transparent bg-[image:var(--accent-gradient)] text-accent-on enabled:hover:bg-[image:var(--accent-gradient-hover)]'
              : 'border-[var(--field-card-border)] bg-bg text-fg hover:bg-[var(--field-card-hover-bg)]'
          }`}
        >
          <span className={`inline-flex p-3 rounded-[var(--radius-card)] ${c.primary ? 'bg-on-dark-fill-2 text-accent-on' : 'bg-[var(--icon-tile-bg)] text-[var(--icon-tile-fg)]'}`}>
            <Icon path={c.icon} className="w-6 h-6" />
          </span>
          <span className="block font-bold text-[length:var(--fs-h5)] leading-snug">{c.title}</span>
          <span className={`block flex-1 text-[length:var(--fs-body)] ${c.primary ? 'text-accent-on' : 'text-fg-2'}`}>{c.description}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[length:var(--fs-body)]">
            Start
            <Icon path={ICONS.chevron} className="w-4 h-4" />
          </span>
        </button>
      ))}
    </div>
  );
}
