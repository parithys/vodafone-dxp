import { Badge } from './Badge';
import { ServiceTypeTag } from './ServiceTypeTag';
import { connectionTag } from '../../lib/connectionType';

/** The connection-type tag (Postpaid, Prepaid, Fixed Line in the shared service-type colours; Home Internet amber ...). Use this, not a hand-coloured pill. */
export function ConnectionTypeTag({ category, label }: { category: string; /** Overrides the default wording, keeping the colour. */ label?: string }) {
  const t = connectionTag(category);
  if (t.serviceTag && !label) return <ServiceTypeTag type={t.serviceTag} />;
  return <Badge variant={t.variant}>{label ?? t.label}</Badge>;
}
