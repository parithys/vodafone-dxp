import { toneFor } from '../sections/c360KitModel';
import { Pill } from './TelesalesOverview';
import { I } from './telesalesOverviewModel';
import { CHECK, CHEVRON_DOWN, CHEVRON_UP, DOTS, DOWNLOAD, PLUS_ICON, SHIELD } from '../../../assets/icons';

export const ICON = {
  ...I,
  down: CHEVRON_DOWN,
  up: CHEVRON_UP,
  shield: SHIELD,
  plus: PLUS_ICON,
  check: CHECK,
  dots: DOTS,
  download: DOWNLOAD,
};

export const yesNo = (v: boolean | string | undefined | null) => {
  const yes = v === true || v === 'Yes';
  return <Pill tone={yes ? 'green' : 'red'}>{yes ? 'Yes' : 'No'}</Pill>;
};

// One status-to-colour map for Customer 360 and Telesales alike: toneFor in c360KitModel.
export const pillFor = (status: string) => {
  const t = toneFor(status);
  return (t === 'grey' || t === 'purple' ? 'neutral' : t) as 'neutral' | 'green' | 'blue' | 'red' | 'amber';
};
