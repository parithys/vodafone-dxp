import { useEffect, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import type { TncBulletTemplate } from '../../components/patterns/cafTermsModel';
import { CafSignatureCapture } from '../../components/patterns/CafSignatureCapture';
import { KeyInformationPanel } from '../../components/patterns/KeyInformationPanel';

type Capture = ComponentProps<typeof CafSignatureCapture>;

/**
 * CAF & SIGNATURE - the one application-wide capability for the Customer Agreement Form: the customer reads the
 * terms, the CAF type is set (Digital / Touch Screen / paper), the signature is captured and the order's
 * supporting documents are attached.
 *
 * Journeys mount THIS component (usually through cafSignatureStep in wizard/wizardSteps, or New Connection's
 * cafStep for the full variant) and say what their context needs; none of them wires CafSignatureCapture itself.
 *
 *   variant 'standard'  the CAF with the customer's name; the CAF type follows the device when
 *                       `autoDetectDeviceType` is set. Prepaid, port-in, Pre-to-Post, FWA, Fixed Line.
 *   variant 'full'      New Connection: the customer reads back the order summary and T&C facts, signs on an inline
 *                       pad, agrees to the terms, attaches up to five documents, then continues from the signed view.
 *
 *   keyInformation      statements the customer must see before signing (e.g. prepaid: no lock-in period).
 */
type Common = {
  value: Capture['value'];
  onChange: Capture['onChange'];
  customerName?: string;
  /** The ID the CAF reads back (label and number), where the journey shows one - e.g. prepaid port-in. */
  idLabel?: string;
  idValue?: string;
  keyInformation?: ReactNode[];
  /**
   * Key Information read from the business-maintained statements (tnc-summary-bullets.json) whose scenario key starts
   * with this prefix - e.g. 'prepaid-' for the prepaid terms (MPRA_001_CAF_02) - shown with any `keyInformation` above.
   */
  keyInformationScenario?: string;
};

export type CafSignatureProps =
  | (Common & { variant?: 'standard'; autoDetectDeviceType?: boolean })
  | (Common & {
      variant: 'full';
      orderSummary?: Capture['orderSummary'];
      fullTerms?: Capture['fullTerms'];
      legalFacts?: Capture['legalFacts'];
      /** Called from the signed view's own Continue (the wizard footer is hidden once signed). */
      onContinue?: Capture['onContinue'];
      /** 'page' lets the terms grow to full height so the page scrolls (the customer-view pop-up). */
      termsScrollMode?: Capture['termsScrollMode'];
      /** Which journey's form and Terms & Conditions: postpaid (default) or prepaid. */
      journey?: Capture['journey'];
      /** Extra rows on the application form (label/value). */
      formDetails?: Capture['formDetails'];
      /** The Supplementary Form of an actual user: one signature signs it together with the CAF. */
      supplementaryForm?: Capture['supplementaryForm'];
      /** Additional Documents: what this order requires, and what the journey already holds (viewable, downloadable). */
      documentRequirements?: Capture['documentRequirements'];
      documentLabelOptions?: Capture['documentLabelOptions'];
      journeyDocuments?: Capture['journeyDocuments'];
    });

/**
 * Additional documents, as Mobile Postpaid Activation has them: the one definition every journey that mounts this capability uses
 * (up to five files, on the white card; the document types come from public/config/document-types.json). Change it here, not in a journey.
 */
const ADDITIONAL_DOCUMENTS: Pick<Capture, 'maxAdditionalDocuments' | 'documentsOnWhite'> = {
  maxAdditionalDocuments: 5,
  documentsOnWhite: true,
};

export function CafSignature(props: CafSignatureProps) {
  const { value, onChange, customerName, idLabel, idValue, keyInformationScenario } = props;
  const [scenarioItems, setScenarioItems] = useState<string[]>([]);
  useEffect(() => {
    if (!keyInformationScenario) return;
    let cancelled = false;
    mockDataEngine.list<TncBulletTemplate>('tnc-summary-bullets').then((all) => {
      if (!cancelled) setScenarioItems(all.filter((t) => t.scenarioKey.startsWith(keyInformationScenario)).map((t) => t.template));
    });
    return () => {
      cancelled = true;
    };
  }, [keyInformationScenario]);
  const keyInformation = [...(props.keyInformation ?? []), ...scenarioItems];
  const capture =
    props.variant === 'full' ? (
      <CafSignatureCapture
        value={value}
        onChange={onChange}
        customerName={customerName}
        idLabel={idLabel}
        idValue={idValue}
        orderSummary={props.orderSummary}
        fullTerms={props.fullTerms}
        legalFacts={props.legalFacts}
        onContinue={props.onContinue}
        termsScrollMode={props.termsScrollMode}
        journey={props.journey}
        formDetails={props.formDetails}
        supplementaryForm={props.supplementaryForm}
        documentLabelOptions={props.documentLabelOptions ?? []}
        documentRequirements={props.documentRequirements}
        journeyDocuments={props.journeyDocuments}
        inlineSignaturePad
        {...ADDITIONAL_DOCUMENTS}
        termsUrl="https://www.vodafone.qa/en/terms-and-conditions"
        autoDetectDeviceType
        requireTermsAgreement
      />
    ) : (
      <CafSignatureCapture
        value={value}
        onChange={onChange}
        customerName={customerName}
        idLabel={idLabel}
        idValue={idValue}
        // Always: the CAF type is the device's (Digital on the web, Touch Screen on a tablet), never picked by hand.
        autoDetectDeviceType
        {...ADDITIONAL_DOCUMENTS}
      />
    );
  if (!keyInformation?.length) return capture;
  return (
    <div className="space-y-6">
      <KeyInformationPanel items={keyInformation} />
      {capture}
    </div>
  );
}
