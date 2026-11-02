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
          className={`start-card card-option-lg ${
            c.primary
              ? 'primary-tile'
              : 'card-idle text-fg'
          }`}
        >
          <span className={`option-glyph p-3 ${c.primary ? 'bg-on-dark-fill-2 text-accent-on' : 'icon-tint'}`}>
            <Icon path={c.icon} className="size-6 " />
          </span>
          <span className="title-inherit title-lg block leading-snug">{c.title}</span>
          <span className={`text-secondary block flex-1 ${c.primary ? 'text-accent-on' : ''}`}>{c.description}</span>
          <span className="title-inherit title-sm inline-flex items-center gap-1">
            Start
            <Icon path={ICONS.chevron} className="size-4 " />
          </span>
        </button>
      ))}
    </div>
  );
}
