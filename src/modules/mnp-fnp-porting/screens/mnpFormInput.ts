import type { GuidedContactValue } from '../../../components/patterns/guidedContactModel';
import type { DonorDetailsValue } from '../../../components/patterns/DonorDetailsStep';
import type { MnpFormInput } from '../../../components/patterns/DonorAttachmentStep';

export const isPrepaidMnp = (values: Record<string, unknown>) => values.mnpType === 'prepaid';
export const contactOf = (values: Record<string, unknown>) => values.contact as GuidedContactValue | undefined;

/** What the MNP Form is generated from: the journey's validated customer, donor, product and SIM data. */
export const mnpFormInputOf = (values: Record<string, unknown>): MnpFormInput => ({
  customerName: contactOf(values)?.moiResult?.name,
  idType: contactOf(values)?.idType,
  idNumber: contactOf(values)?.idNumber,
  mnpType: isPrepaidMnp(values) ? 'prepaid' : 'postpaid',
  productId: values.productId as string | undefined,
  simSerial: values.simSerial as string | undefined,
  donor: values.donorDetails as DonorDetailsValue | undefined,
});
