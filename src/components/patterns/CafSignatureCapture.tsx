import { useEffect, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';
import { SelectedTick } from '../primitives/offerCardParts';
import { Button } from '../primitives/Button';
import { Checkbox } from '../primitives/Checkbox';
import { SignatureCapture } from './SignatureCapture';
import { Badge } from '../primitives/Badge';
import { CafDocumentUpload } from '../domain/CafDocumentUpload';
import type { CafDocument } from '../domain/CafDocumentUpload';
import { AdditionalDocumentsUpload } from '../domain/AdditionalDocumentsUpload';
import type { AdditionalDocument } from '../domain/AdditionalDocumentsUpload';
import type { DocumentRequirement, JourneyDocument } from '../../engines/journeyDocuments';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { composeSignedCafImage } from '../../lib/signedCafImage';
import type { TncLegalFacts } from './checkoutSummaryModel';
import { buildTncBullets } from './cafTermsModel';
import type { TncBulletTemplate } from './cafTermsModel';
import { FullTerms } from './CafTerms';
import { CAF_TYPES, detectCafType } from './cafTypes';
import type { CafType } from './cafTypes';


interface CafSignatureCaptureProps {
  value: {
    cafType?: CafType;
    signatureDataUrl?: string;
    /** Full variant: the signed form as one image (key terms, agreements, signature, who signed), for Journey Documents. */
    signedCafDataUrl?: string;
    /** The customer has ticked "I have read and agree to the full Terms and Conditions." */
    termsAccepted?: boolean;
    /** With a Supplementary Form: the primary customer has read it and agrees (the one signature then covers both forms). */
    supplementaryAgreed?: boolean;
    /** Full variant: the customer agrees to marketing communications and special offers (Campaigns). Ticked unless the agent unticks it. */
    marketingConsent?: boolean;
    /** With a Supplementary Form: the secondary contact has read it and agrees, and signs it on its own (the Supplementary Form only). */
    secondaryAgreed?: boolean;
    secondarySignatureDataUrl?: string;
    documents?: CafDocument[];
    /** Post-signature supporting documents - see AdditionalDocumentsUpload. */
    additionalDocuments?: AdditionalDocument[];
  };
  onChange: (value: CafSignatureCaptureProps['value']) => void;
  customerName?: string;
  /** Binds an ID Number line onto the CAF preview - module-hierarchy.json's
   * "CAF form dynamically binds Qatari ID/Passport number field for prepaid
   * subscribers." Omit for flows where this binding isn't evidenced. */
  idLabel?: string;
  idValue?: string;
  /**
   * Customer-facing order summary, rendered under the signature block
   * (2026-09-27 walkthrough). The agent reads this to the customer BEFORE
   * they sign, so it is the same set of facts Checkout showed - passed in
   * already derived, so the two surfaces cannot disagree about what was sold.
   * Omitted by the other five journeys that share this component, which
   * render the CAF without a commercial summary exactly as before.
   */
  orderSummary?: { label: string; value: string }[];
  /**
   * New Connection layout: no Key Information panel and no order read-back here (Checkout shows the order); the page is
   * the full Terms & Conditions followed by the application form and signature.
   */
  fullTerms?: boolean;
  /** Open the signature pad inline, under the Please Sign button, instead of in a drawer. */
  inlineSignaturePad?: boolean;
  /** Post-signature document labels as a list of values instead of free text. */
  documentLabelOptions?: string[];
  /**
   * Which journey's application form this is (postpaid by default). Prepaid carries its own form title and its own
   * Terms & Conditions (Mobile Prepaid BRSD MPRA_001_CAF_02 / CAF_03); the signature, agreement and documents
   * behaviour is the same capability for both.
   */
  journey?: 'postpaid' | 'prepaid';
  /** Extra rows on the application form (the prepaid form's mobile numbers and SIM serials, for example), as label/value. */
  formDetails?: { label: string; value: string }[];
  /**
   * The Supplementary Form, when the line has an actual user other than the applicant: its rows (the actual user's details). The ONE signature
   * below then signs both forms - the CAF by the applicant and the Supplementary Form by the applicant and the actual user - and says so.
   */
  supplementaryForm?: { rows: { label: string; value: string }[]; /** The secondary contact, who signs the Supplementary Form on their own. */ actualUserName?: string };
  /** Draw the Additional documents card on a white background (default: the grey surface). */
  documentsOnWhite?: boolean;
  /** Cap on post-signature documents (default 10). */
  maxAdditionalDocuments?: number;
  /** Documents this order requires (its scenario, the role): asked for in Additional Documents, after signing, and nowhere earlier. */
  documentRequirements?: DocumentRequirement[];
  /** Everything the journey already holds, listed in Additional Documents to view and download. */
  journeyDocuments?: JourneyDocument[];
  /** Link target for "the complete terms", shown beneath the summary. */
  termsUrl?: string;
  /**
   * Opt-in (2026-09-28, Postpaid only). When true:
   *  - the manual CAF-Type picker is replaced by detectCafType()'s real
   *    device-capability check, set once and never re-offered to the agent;
   *  - CAF-Touch Screen requires the SAME in-app signature CAF-Digital does
   *    (under the original three-way design only Digital did - Touch Screen
   *    meant signing on a separate off-screen terminal - but that no longer
   *    fits once a device check, not an agent, is choosing between them: both
   *    detectable outcomes now mean "sign on THIS screen", just with a
   *    finger instead of a mouse);
   *  - the legacy "Signed documents" upload (CafDocumentUpload) is dropped,
   *    since there is no more off-screen-signed paper to scan back once
   *    signing always happens in-app;
   *  - a concise, dynamic T&C bullet summary (tnc-summary-bullets.json +
   *    legalFacts) renders ahead of the commercial orderSummary, with a
   *    "View Full Terms & Conditions" link as the stated fallback;
   *  - the CAF preview stays on screen once signed (2026-09-28 "preview of
   *    the signed CAF"), and an AdditionalDocumentsUpload appears alongside
   *    it for whatever else needs attaching afterward - no signature
   *    required for any of those.
   * The other five journeys sharing this component (MNP, Passport-to-QID,
   * etc.) omit this prop and keep the original picker-led behaviour exactly
   * as it was.
   */
  autoDetectDeviceType?: boolean;
  /** Raw order figures for the dynamic T&C bullets - see TncLegalFacts. */
  legalFacts?: TncLegalFacts;
  /**
   * Advances the wizard past this step (2026-09-30). Only read once `signed`
   * - the wizard's own Back/Continue footer is hidden at that point (see
   * NewPostpaidWizard's `customerFacing` on the 'caf' step, now true AFTER
   * signing rather than before), so the Continue button below is the only
   * way forward and this is what it calls. Omitted by the other five
   * journeys sharing this component, none of which flip customerFacing this
   * way.
   */
  onContinue?: () => void;
  /** Save the draft, confirm with a toast and go to the dashboard (customer-facing action row). */
  onSave?: () => void;
  /** Show the "I have read and agree" checkbox and keep Please Sign disabled until it is ticked. */
  requireTermsAgreement?: boolean;
  /** See FullTerms: 'page' lets the terms grow to full height so only the page scrolls. Defaults to the scrolling panel. */
  termsScrollMode?: 'container' | 'page';
}

// Pattern 6: CAF/Contract Signature Capture - CAF Type card selector (Digital/
// Manual/Touch Screen, styled like the ID Type picker), bilingual (AR/EN)
// document preview pre-populated from
// applicant/billing/plan data, then a "Please Sign" pad modal (drawn signature,
// Clear/Done) - reused identically for CAF, MNP application, Passport-to-QID
// forms (SCR-058, SCR-069/070, SCR-084, SCR-127/129, etc.).
/** What the secondary contact (the actual user, on the Supplementary Form) agrees to. */
const SECONDARY_CONTACT_TERMS = [
  { title: 'Package Management', body: 'The Ahli Package Owner can manage your number, including SIM replacement, plan changes, add-ons, and service requests.' },
  { title: 'Billing & Usage', body: 'All Ahli Package charges are billed to the Ahli Package Owner, who can view usage, allowances, and billing details.' },
  { title: 'Your Privacy', body: 'The Ahli Package Owner cannot access your call or SMS content, browsing history, or location information.' },
  { title: 'Leaving the Package', body: 'You can request to leave the Ahli Package, subject to any applicable commitments and outstanding charges.' },
] as const;

export function CafSignatureCapture({
  value,
  onChange,
  customerName,
  idLabel,
  idValue,
  orderSummary,
  fullTerms = false,
  inlineSignaturePad = false,
  documentLabelOptions,
  maxAdditionalDocuments,
  documentRequirements,
  journeyDocuments,
  documentsOnWhite = false,
  journey = 'postpaid',
  formDetails,
  supplementaryForm,
  termsUrl,
  autoDetectDeviceType,
  legalFacts,
  onContinue,
  onSave,
  requireTermsAgreement = false,
  termsScrollMode,
}: CafSignatureCaptureProps) {
  // The latest value: an asynchronous write (a document read, the signed form drawn) must build on what the journey holds now, not on the render that started it.
  const valueRef = useRef(value);
  valueRef.current = value;
  // A document type is chosen but its file is not uploaded yet: Continue waits.
  const [documentPending, setDocumentPendingState] = useState(false);
  // A required document is not uploaded yet: Continue waits for it too.
  const [missingRequired, setMissingRequired] = useState(0);
  const setDocumentPending = setDocumentPendingState;
  const documentsBlock = documentPending || missingRequired > 0;
  const [bulletTemplates, setBulletTemplates] = useState<TncBulletTemplate[]>([]);

  useEffect(() => {
    if (!autoDetectDeviceType) return;
    mockDataEngine.list<TncBulletTemplate>('tnc-summary-bullets').then(setBulletTemplates);
  }, [autoDetectDeviceType]);

  // Auto-select ONCE, the moment this call site mounts with nothing chosen
  // yet - the same "derive a default without stomping an existing value"
  // shape Plan & Add-ons' Bill Limit default uses. Guarded on value.cafType
  // rather than re-running every render, so an agent who somehow lands back
  // here after signing does not have their recorded type silently replaced.
  useEffect(() => {
    if (!autoDetectDeviceType || value.cafType) return;
    onChange({ ...value, cafType: detectCafType() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDetectDeviceType]);

  if (autoDetectDeviceType) {
    // Both auto-detected outcomes sign in-app now - see the prop's own note
    // on why Touch Screen no longer means "signed off-screen" once a device
    // check, not the agent, is what chose it.
    const showsInAppSignature = value.cafType === 'Digital' || value.cafType === 'Touch Screen';
    const signed = showsInAppSignature && Boolean(value.signatureDataUrl);
    // With a Supplementary Form the secondary contact signs it too: the step is done only when both have signed.
    const secondarySigned = Boolean(value.secondarySignatureDataUrl);
    const allSigned = signed && (!supplementaryForm || secondarySigned);
    const bullets = buildTncBullets(legalFacts, bulletTemplates);

    return (
      <div className="space-y-4">
        {/* The wizard's own step heading is not rendered while this step is
            customer-facing (GuidedActivationWizard hides all of its chrome
            for that render, including <h2>{label}</h2>) - this stands in so
            the screen is not handed to a customer with no heading at all.
            Shown when `signed` now (2026-09-30, reversed along with
            customerFacing): the wizard's own "CAF & Signature" heading is
            present for the whole unsigned review, so repeating one here
            would say the same thing twice; once signed, that chrome - and
            its heading - disappears, and this is what fills the gap. */}
        {signed && <h2 className="title title-xl">Signed</h2>}

        {/* Concise, dynamic, business-maintained bullets (2026-09-28 request),
            read to the customer before signature. Moved above the CAF card
            (2026-09-30): the customer reads what they're agreeing to FIRST,
            then signs the form below it, rather than being asked to sign
            ahead of the terms that follow. The commercial recap
            (orderSummary) stays alongside rather than being replaced: what
            was bought and what terms bind the customer are complementary
            facts, not the same one restated. */}
        {!signed && !fullTerms && (bullets.length > 0 || (orderSummary && orderSummary.length > 0)) && (
          <>
          {/* Key Information is the part the customer must not skip, so it is a tinted panel with 4px
              brand-accent left and right edges and an uppercase heading (2026-10-04). Existing tokens only: --surface-warm
              fill, --accent edge; text stays --fg / --fg-2 (about 12:1 and 6:1 on that fill). */}
          <div className="my-2 consent-panel p-6 space-y-3">
            {/* Renamed from "What the customer is agreeing to" (2026-09-28
                request) to match the heading BR-009's Key Information panel
                already uses elsewhere (NewMnpWizard, NewPrepaidWizard) -
                Postpaid-only; the other five journeys sharing this component
                keep their own heading below, unaffected. */}
            <h4 className="title title-md uppercase tracking-wide">Key Information</h4>
            {bullets.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 caption-secondary">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {orderSummary && orderSummary.length > 0 && (
              <dl className={bullets.length > 0 ? 'pt-2 border-t border-border-soft' : undefined}>
                {orderSummary.map((row) => (
                  <div key={row.label} className="spread py-1.5 row-rule">
                    <dt className="text-fg text-[length:var(--fs-caption)]">{row.label}</dt>
                    <dd className="text-fg text-[length:var(--fs-caption)] text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {/* Fallback, not the primary route (2026-09-28 request): the
                bullets above are the concise answer for the common cases;
                this is for anything they do not cover. */}
            {termsUrl && (
              <p className="caption-muted">
                For anything not covered above,{' '}
                <a href={termsUrl} target="_blank" rel="noreferrer" className="link underline">
                  View Full Terms & Conditions
                </a>
                .
              </p>
            )}
          </div>
          </>
        )}

        <FullTerms
          termsUrl={termsUrl}
          enabled={fullTerms}
          signed={signed}
          scrollMode={termsScrollMode}
          journey={journey}
          closingHeader={
            signed ? (
              // Signed: the same heading row as the secondary contact's form (the name is on the Signed by line below).
              <div className="caption-muted">
                <h3 className="title title-sm font-semibold">Key Terms &amp; Conditions: Primary Contact</h3>
                {customerName && <p className="text-fg font-medium">{customerName}</p>}
              </div>
            ) : (
              <div className="mt-2 divider-top pt-4 caption-muted">
                <h3 className="title title-sm font-semibold">Terms &amp; Conditions: Primary Contact</h3>
                {customerName && <p className="text-fg font-medium">{customerName}</p>}
              </div>
            )
          }
        >
        <div className={`${fullTerms ? (signed ? '' : 'py-4 pr-4') : 'card p-4'} ${inlineSignaturePad ? '' : 'bg-surface'}`}>
          {formDetails && formDetails.length > 0 && (
            <dl className="mb-2">
              {formDetails.map((row) => (
                <div key={row.label} className="spread py-1 row-rule text-[length:var(--fs-caption)]">
                  <dt className="text-fg">{row.label}</dt>
                  <dd className="text-fg text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {idLabel && (
            <p className="body-text">
              {idLabel}: <span className="font-medium">{idValue ?? '-'}</span>
            </p>
          )}
          {supplementaryForm && !fullTerms && (
            <div id="supplementary-form-primary" className="mt-3 card-frame-soft p-3 space-y-2" aria-label="Supplementary Form">
              <dl>
                <div className="spread py-1 divider-bottom text-[length:var(--fs-caption)]">
                  <dt className="text-fg">Primary Customer</dt>
                  <dd className="text-fg text-right">{customerName ?? '-'}</dd>
                </div>
                {supplementaryForm.rows.map((row) => (
                  <div key={row.label} className="spread py-1 row-rule text-[length:var(--fs-caption)]">
                    <dt className="text-fg">{row.label}</dt>
                    <dd className="text-fg text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="caption-secondary">
                The primary customer's one signature below signs both forms: the Customer Application Form and this Supplementary Form.
              </p>
            </div>
          )}

          {signed ? (
            <div className={`${fullTerms ? '' : 'mt-3 '}row`}>
              <Badge variant="success">{fullTerms ? `Signed by ${customerName ?? 'the primary customer'}` : supplementaryForm ? 'Signed: CAF and Supplementary Form' : 'Signed'}</Badge>
              <img src={value.signatureDataUrl} alt="Signature" className="signature-thumb" />
            </div>
          ) : (
            <>
              {/* Full variant: marketing consent (ticked by default), then the terms, then the supplementary terms. */}
              {fullTerms && (
                <p className="body-text">
                  I understand that a copy of the Terms and Conditions will be delivered to the email I provided and verified.
                </p>
              )}
              {fullTerms && (
                <label className="mt-3 row gap-2 cursor-pointer">
                  <Checkbox checked={value.marketingConsent !== false} onChange={(e) => onChange({ ...value, marketingConsent: e.target.checked })} />
                  <span className="body-text">I agree to receive marketing communications and special offers (Campaigns).</span>
                </label>
              )}
              {requireTermsAgreement && (
                <label className="mt-3 row gap-2 cursor-pointer">
                  <Checkbox
                    checked={Boolean(value.termsAccepted)}
                    onChange={(e) => onChange({ ...value, termsAccepted: e.target.checked })}
                  />
                  <span className="body-text">
                    {fullTerms ? 'I have read and agreed to the full' : 'I have read and agree to the full'}{' '}
                    {termsUrl ? (
                      <a href={termsUrl} target="_blank" rel="noreferrer" className="link underline">
                        Terms and Conditions
                      </a>
                    ) : (
                      'Terms and Conditions'
                    )}
                    .
                  </span>
                </label>
              )}
              {/* Only with a verified secondary contact (the Supplementary Form exists only then): otherwise there is nothing supplementary to agree to. */}
              {supplementaryForm && (
                <label className="mt-3 row gap-2 cursor-pointer">
                  <Checkbox checked={Boolean(value.supplementaryAgreed)} onChange={(e) => onChange({ ...value, supplementaryAgreed: e.target.checked })} />
                  {fullTerms ? (
                    <span className="body-text">
                      I have read and agreed to the applicable{' '}
                      {termsUrl ? (
                        <a href={termsUrl} target="_blank" rel="noreferrer" className="link underline">
                          Supplementary Terms
                        </a>
                      ) : (
                        'Supplementary Terms'
                      )}
                      .

                    </span>
                  ) : (
                    <span className="body-text">I have read and agree to the{' '}
                      <button type="button" className="link underline" onClick={() => document.getElementById('supplementary-form-primary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                        Supplementary Form
                      </button>
                      .</span>
                  )}
                </label>
              )}
              <SignatureCapture
                // The full Terms and the supplementary terms are both mandatory before signing; marketing consent is optional.
                disabled={((requireTermsAgreement || fullTerms) && !value.termsAccepted) || (Boolean(supplementaryForm) && !value.supplementaryAgreed)}
                onSave={(dataUrl) => {
                  onChange({ ...value, signatureDataUrl: dataUrl });
                  if (!fullTerms) return;
                  // The signed CAF the journey keeps carries what the customer saw and agreed to, not only the pen stroke.
                  void mockDataEngine
                    .list<{ title: string; body: string; journey?: string }>('tnc-full-text')
                    .then((all) =>
                      composeSignedCafImage({
                        heading: 'Key Terms & Conditions: Primary Contact',
                        customerName,
                        sections: all.filter((x) => !x.journey || x.journey === journey),
                        agreements: [
                          { text: 'I agree to receive marketing communications and special offers (Campaigns).', agreed: value.marketingConsent !== false },
                          { text: 'I have read and agreed to the full Terms and Conditions.', agreed: Boolean(value.termsAccepted) },
                          ...(supplementaryForm ? [{ text: 'I have read and agreed to the applicable Supplementary Terms.', agreed: Boolean(value.supplementaryAgreed) }] : []),
                        ],
                        signatureDataUrl: dataUrl,
                      })
                    )
                    .then((signedCafDataUrl) => onChange({ ...valueRef.current, signatureDataUrl: dataUrl, signedCafDataUrl }))
                    .catch(() => undefined);
                }}
              />
            </>
          )}
        </div>
        </FullTerms>

        {/* The secondary contact signs the Supplementary Form ONLY, on its own: the form shown separately, its own consent and its own pad,
            enabled once that consent is ticked. Shown after the primary customer has signed. */}
        {signed && supplementaryForm && (
          <section id="supplementary-form-secondary" aria-label="Supplementary Form - secondary contact" className="card p-4 space-y-3">
            <div className="caption-muted">
              <h3 className="title title-sm font-semibold">Supplementary Form: Secondary Contact</h3>
              {supplementaryForm.actualUserName && <p className="text-fg font-medium">{supplementaryForm.actualUserName}</p>}
            </div>
            {/* The terms the secondary contact agrees to by signing. */}
            <ul className="space-y-2 text-[length:var(--fs-caption)]">
              {SECONDARY_CONTACT_TERMS.map((t) => (
                <li key={t.title}>
                  <span className="text-fg font-semibold">{t.title}: </span>
                  <span className="text-fg-2">{t.body}</span>
                </li>
              ))}
            </ul>
            {secondarySigned ? (
              <div className="row">
                <Badge variant="success">Signed by {supplementaryForm.actualUserName ?? 'the secondary contact'}</Badge>
                <img src={value.secondarySignatureDataUrl} alt="Secondary contact signature" className="signature-thumb" />
              </div>
            ) : (
              <>
                <label className="row gap-2 cursor-pointer">
                  <Checkbox checked={Boolean(value.secondaryAgreed)} onChange={(e) => onChange({ ...value, secondaryAgreed: e.target.checked })} />
                  <span className="body-text">I have read and agree to the{' '}
                    <button type="button" className="link underline" onClick={() => document.getElementById('supplementary-form-secondary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                      Supplementary Form
                    </button>
                    .</span>
                </label>
                <SignatureCapture disabled={!value.secondaryAgreed} onSave={(dataUrl) => onChange({ ...value, secondarySignatureDataUrl: dataUrl })} />
              </>
            )}
          </section>
        )}

        {/* Post-signature, agent view: the signed CAF preview above stays on
            screen (2026-09-28 "preview of the signed CAF"), and whatever
            else this order needs attached - no signature required for any
            of it - goes here instead of the legacy "Signed documents"
            uploader, which had nothing left to collect once signing always
            happens in-app. */}
        {/* agent-only: hidden in the customer's pop-up - attaching documents is the agent's job. */}
        {/* Only once every required signature is captured: the primary CAF and, with an actual user, the secondary contact's. */}
        {allSigned && (
          <div className="agent-only">
            <AdditionalDocumentsUpload
              documents={value.additionalDocuments ?? []}
              onChange={(documents) => onChange({ ...valueRef.current, additionalDocuments: documents })}
              labelOptions={documentLabelOptions}
              whiteBackground={documentsOnWhite}
              maxDocuments={maxAdditionalDocuments}
              onPendingChange={setDocumentPending}
              requirements={documentRequirements}
              onMissingRequiredChange={setMissingRequired}
              journeyDocuments={journeyDocuments}
            />
          </div>
        )}

        {/* The wizard's own Continue is gone along with the rest of its
            chrome once signed (customerFacing flips true) - this is the
            replacement, same reasoning as the "Please Sign" button above:
            the step's own content owns whatever action it needs. Additional
            documents are optional (isValid never required them), so nothing
            gates this beyond having signed at all. */}
        {onSave ? (
          // Save and Continue on the right. Continue appears once signed.
          <div className="agent-only split-nowrap">
            <div />
            <div className="row">
              {onSave && (
                <Button variant="secondary" onClick={onSave}>
                  Save
                </Button>
              )}
              {allSigned && onContinue && (
                <Button
                  variant="primary"
                  onClick={onContinue}
                  disabled={documentsBlock}
                  title={documentPending ? 'Upload the selected document first' : missingRequired > 0 ? 'Upload the required documents first' : undefined}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        ) : (
          allSigned && onContinue && (
            <div className={`agent-only ${inlineSignaturePad ? 'flex justify-end' : ''}`}>
              <Button
                variant="primary"
                className={inlineSignaturePad ? undefined : 'w-full'}
                onClick={onContinue}
                disabled={documentsBlock}
                title={documentPending ? 'Upload the selected document first' : missingRequired > 0 ? 'Upload the required documents first' : undefined}
              >
                Continue
              </Button>
            </div>
          )
        )}

      </div>
    );
  }

  // Unchanged for the five other journeys sharing this component (MNP,
  // Passport-to-QID, etc.), none of which asked for any of the above.
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[length:var(--fs-label)] text-fg-2 mb-2">CAF Type</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,11rem),1fr))] gap-3">
          {CAF_TYPES.map((t) => {
            const selected = t.type === value.cafType;
            return (
              <button
                key={t.type}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ ...value, cafType: t.type })}
                className={`choice-tile ${
                  selected ? 'option-chosen text-[var(--field-card-selected)]' : 'card-idle text-fg'
                }`}
              >
                {selected && <SelectedTick />}
                <Icon path={t.icon} className="size-6 " />
                <span className="text-[length:var(--fs-caption)] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {value.cafType === 'Digital' && (
        <div className="card p-4 card-surface">
          <div className="caption-muted mb-2">
            <span>Vodafone Customer Application Form</span>
          </div>
          <p className="body-text">
            Applicant: <span className="font-medium">{customerName ?? '-'}</span>
          </p>
          {idLabel && (
            <p className="body-text">
              {idLabel}: <span className="font-medium">{idValue ?? '-'}</span>
            </p>
          )}
          <p className="caption-secondary mt-1">
            By signing below, the applicant accepts the General Terms and Conditions of Vodafone Qatar.
          </p>

          {value.signatureDataUrl ? (
            <div className="mt-3 row">
              <Badge variant="success">Signed</Badge>
              <img src={value.signatureDataUrl} alt="Signature" className="signature-thumb" />
            </div>
          ) : (
            <SignatureCapture onSave={(dataUrl) => onChange({ ...value, signatureDataUrl: dataUrl })} />
          )}
        </div>
      )}

      {/* Upload of the signed paperwork. Gated on the CAF actually being
          signed: for CAF-Digital that is the in-app signature; for Manual and
          Touch Screen the signing happens off-screen, so choosing either type
          IS the point at which there is paper to scan back in - which is why
          those two do not wait for signatureDataUrl, which they never set. */}
      {value.cafType && (value.cafType !== 'Digital' || value.signatureDataUrl) && (
        <CafDocumentUpload
          documents={value.documents ?? []}
          onChange={(documents) => onChange({ ...value, documents })}
        />
      )}

      {/* Read to the customer before signature. Deliberately BELOW the CAF
          preview and above the pad: it is the plain-language version of what
          the form commits them to, and it is the last thing on screen before
          they sign. */}
      {orderSummary && orderSummary.length > 0 && (
        <div className="card card-surface p-4 space-y-2">
          <h4 className="value-text">What the Customer Is Agreeing To</h4>
          <dl className="text-[length:var(--fs-caption)]">
            {orderSummary.map((row) => (
              <div key={row.label} className="spread py-1.5 row-rule">
                <dt className="text-fg">{row.label}</dt>
                <dd className="text-fg text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
          {termsUrl && (
            <a
              href={termsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[length:var(--fs-caption)] link underline"
            >
              Read the full terms and conditions
            </a>
          )}
        </div>
      )}

    </div>
  );
}
