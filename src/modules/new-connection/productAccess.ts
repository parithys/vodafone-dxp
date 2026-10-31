import { canUseFeature } from '../../engines/personaEngine';
import type { ConnectionProduct } from './products';

/**
 * The grant each product of the New Connection journey needs (public/config/personas.json). The journey itself is the postpaid one; Prepaid, MNP and
 * Fixed Line are started from its Recommended Offers page, and a role may use only the products it holds - the buttons and the choice itself
 * follow the grant, so a role is never carried into a journey the menu does not offer it. Home Connection is the fixed-line grant.
 */
export const PRODUCT_FEATURE: Record<ConnectionProduct, string> = {
  postpaid: 'postpaid.new-postpaid-wizard',
  prepaid: 'prepaid.new-prepaid-wizard',
  'fixed-line': 'fixedline.new-fixed-line-wizard',
  mnp: 'mnp.port-in-wizard',
};

export const HOME_CONNECTION_FEATURE = PRODUCT_FEATURE['fixed-line'];

export const canStartProduct = (personaId: string, product: ConnectionProduct): boolean => canUseFeature(personaId, PRODUCT_FEATURE[product]);
