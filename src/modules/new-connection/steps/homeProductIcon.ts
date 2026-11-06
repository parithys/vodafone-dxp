import type { HomeProduct } from '../products';
import { FWA_OUTDOOR, ICONS_HOME, ICONS_PHONE, FIBRE_STRANDS } from '../../../assets/icons';

// The icon tile of each home product card (the same card as the Installation Address service types).
export const HOME_PRODUCT_ICON: Record<HomeProduct, string> = {
  // Optical fibre: a cut cable inside a ring, its strands fanning out to nodes (drawn thin: see strokeWidth below).
  fibre:
    FIBRE_STRANDS,
  'fixed-line': ICONS_PHONE,
  fwa: FWA_OUTDOOR,
  '5g-home': ICONS_HOME,
};
