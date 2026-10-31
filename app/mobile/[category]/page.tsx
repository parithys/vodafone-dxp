import { MobileLineRoute } from '../../../src/next/routes';
import { PRODUCT_LINE_BY_KEY } from '../../../src/navigation/journeyCatalogue';

// The categories of the Mobile product line, from the journey catalogue (the same list /mobile/:category validates against).
export const dynamicParams = false;
export function generateStaticParams() {
  return (PRODUCT_LINE_BY_KEY.get('mobile')?.categories ?? []).map((c) => ({ category: c.key }));
}

export default function Page() {
  return <MobileLineRoute />;
}
