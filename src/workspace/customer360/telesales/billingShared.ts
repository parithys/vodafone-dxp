import { formatMonthYear, formatQar } from '../../../lib/format';
import { type Ctx } from './TelesalesOverview';
import { type Rec } from './shared';

export const catalogOf = (ctx: Ctx) => (ctx.data.demoCatalog[0] ?? {}) as Rec;

export const qar = (n: number) => formatQar(n);

export const monthLabel = (period: string) => {
  const [y, m] = period.split('-').map(Number);
  return formatMonthYear(new Date(y, (m || 1) - 1, 1));
};

export type ReactNodeLike = import('react').ReactNode;
