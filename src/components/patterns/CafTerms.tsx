import { useEffect, useState, type ReactNode } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { OptionToggle } from '../primitives/OptionToggle';
import type { TncSection } from './cafTermsModel';

/**
 * The complete Terms & Conditions, in their own bordered panel directly above the signature block, so the
 * customer can read all of it before signing. By default the panel grows to its full content and the page
 * scrolls; `scrollMode="container"` keeps it at a fixed height with its own scrollbar.
 */
export function FullTerms({
  enabled,
  signed,
  scrollMode = 'page',
  journey = 'postpaid',
  sections: sectionsOverride,
  closingHeader,
  supplementaryTerms,
  keyInformation,
  ipay,
  children,
}: {
  /**
   * New Prepaid's iPAY Activation: a Yes / No toggle (editable until the CAF is signed) placed after the prepaid terms and BEFORE the iPAY Terms & Conditions, which are shown only while it is
   * Yes - the customer reads and agrees to them only when they take iPAY. Once signed it reads Yes / No and the iPAY terms stay as signed.
   */
  ipay?: { value: boolean; onChange: (value: boolean) => void; sections: readonly TncSection[] };
  /** The key statements the customer must see before signing (no lock-in period ...): the first lines of Key Terms & Conditions, ahead of its sections. */
  keyInformation?: ReactNode[];
  /** Accepted for callers that still pass it; the panel no longer links out. */
  termsUrl?: string;
  enabled: boolean;
  signed?: boolean;
  /** 'page' (default): the panel grows to its full content and the page itself scrolls, so the signature block
   * follows the last section with no inner scrollbar. 'container': the terms scroll inside a fixed-height panel. */
  scrollMode?: 'container' | 'page';
  /** Which journey's terms to show: a section scoped to the other journey is left out. Postpaid by default. */
  journey?: 'postpaid' | 'prepaid';
  /** The journey's own sections, instead of the shared catalogue's (New Prepaid: its configurable terms, with the iPAY supplement only when iPAY is on). */
  sections?: readonly TncSection[];
  /** A heading over the closing part of the panel (the customer's details, agreements and signature), above its dividing line. */
  closingHeader?: ReactNode;
  /** With a Secondary Contact on the line: the supplementary terms, in a second card beside the general ones (each card closes with its
   * contact's name). The agreements and signature (children) then sit below both cards at full width. Absent: the single panel, unchanged. */
  supplementaryTerms?: { terms: readonly { title: string; body: string }[]; primaryContactName?: string; secondaryContactName?: string };
  children: ReactNode;
}) {
  const [catalogue, setCatalogue] = useState<TncSection[] | undefined>();
  useEffect(() => {
    if (sectionsOverride) return;
    mockDataEngine.list<TncSection>('tnc-full-text').then((all) => setCatalogue(all.filter((s) => !s.journey || s.journey === journey)));
  }, [journey, sectionsOverride]);
  const sections = sectionsOverride ?? catalogue;
  // Without the terms (not the customer-facing page, or none loaded) the form stands alone.
  if (!enabled || !sections || sections.length === 0) return <>{children}</>;
  const ipayBlock = ipay ? (
    <div className="stack gap-3 divider-top pt-4">
      <div className="split-nowrap">
        <span className="value-text">iPAY Activation</span>
        {signed ? <span className="text-fg font-medium">{ipay.value ? 'Yes' : 'No'}</span> : <OptionToggle label="iPAY Activation" className="w-44" items={[{ key: 'yes', label: 'Yes' }, { key: 'no', label: 'No' }]} active={ipay.value ? 'yes' : 'no'} onChange={(k) => ipay.onChange(k === 'yes')} />}
      </div>
      {ipay.value &&
        ipay.sections.map((s) => (
          <div key={s.sectionId}>
            <h4 className="value-text">{s.title}</h4>
            <p className="caption-secondary leading-relaxed mt-1">{s.body}</p>
          </div>
        ))}
    </div>
  ) : null;
  const keyInfo = keyInformation?.length ? (
    <ul className="list-disc list-inside space-y-1 text-secondary">
      {keyInformation.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ) : null;
  // With a Secondary Contact the terms are the same two cards signed or not; signed, the children are just the Signed badge and signature.
  if (supplementaryTerms && supplementaryTerms.terms.length > 0) {
    return (
      <div className="space-y-4">
        {/* One shared frame holds both columns, which carry no borders of their own (a hairline divides them). items-stretch: both columns take
            the height of the taller one, and each pins its contact block to its bottom edge, so the two line up. */}
        <div className="card">
          <div className="two-col-top items-stretch gap-0">
            <section aria-label="General Key Terms and Conditions" className="stack gap-0">
              <div className="split-nowrap divider-bottom pad-row">
                <h3 className="title title-sm font-semibold">Key Terms &amp; Conditions</h3>
              </div>
              <div className="pad-row stack gap-4 flex-1">
                {keyInfo}
                {sections.map((s) => (
                  <div key={s.sectionId}>
                    <h4 className="value-text">{s.title}</h4>
                    <p className="caption-secondary leading-relaxed mt-1">{s.body}</p>
                  </div>
                ))}
                {ipayBlock}
                <div className="mt-auto">
                  <div className="mt-2 divider-top pt-4 caption-muted">
                    <h3 className="title title-sm font-semibold">Primary Contact</h3>
                    {supplementaryTerms.primaryContactName && <p className="text-fg font-medium">{supplementaryTerms.primaryContactName}</p>}
                  </div>
                </div>
              </div>
            </section>
            <section aria-label="Supplementary Key Terms and Conditions" className="stack gap-0 lg:border-l border-border-soft">
              <div className="split-nowrap divider-bottom pad-row">
                <h3 className="title title-sm font-semibold">Supplementary Key Terms &amp; Conditions</h3>
              </div>
              <div className="pad-row stack gap-4 flex-1">
                {supplementaryTerms.terms.map((t) => (
                  <div key={t.title}>
                    <h4 className="value-text">{t.title}</h4>
                    <p className="caption-secondary leading-relaxed mt-1">{t.body}</p>
                  </div>
                ))}
                <div className="mt-auto">
                  <div className="mt-2 divider-top pt-4 caption-muted">
                    <h3 className="title title-sm font-semibold">Secondary Contact</h3>
                    {supplementaryTerms.secondaryContactName && <p className="text-fg font-medium">{supplementaryTerms.secondaryContactName}</p>}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* Full width, below both columns, no frame of its own: the "I understand" and "I agree" statements, the agreements and the signature
            (once signed: the Signed badge and the signature). */}
        <div>{children}</div>
      </div>
    );
  }
  // Once signed there is nothing left to read: show just the signed form (applicant, signed
  // badge and signature) not the whole scrolling document or its link.
  if (signed) {
    return (
      // The signed primary contact, laid out like the secondary contact's form: heading, the key terms as one line each, then who signed and the signature.
      <section aria-label="Signed application form" className="card p-4 space-y-3">
        {closingHeader}
        {keyInfo}
        <ul className="space-y-2 text-[length:var(--fs-caption)]">
          {sections.map((s) => (
            <li key={s.sectionId}>
              <span className="text-fg font-semibold">{s.title}: </span>
              <span className="text-fg-2">{s.body}</span>
            </li>
          ))}
        </ul>
        {ipayBlock}
        {children}
      </section>
    );
  }
  return (
    <section aria-label="Full Terms and Conditions" className="card ">
      <div className="split-nowrap divider-bottom pad-row">
        <h3 className="title title-sm font-semibold">Key Terms &amp; Conditions</h3>
      </div>
      {/* tabIndex so the panel can be scrolled with the keyboard. */}
      <div
        tabIndex={scrollMode === 'page' ? undefined : 0}
        className={`pad-row space-y-4 ${scrollMode === 'page' ? '' : 'max-h-[34rem] overflow-y-auto focus-ring'}`}
      >
        {keyInfo}
        {sections.map((s) => (
          <div key={s.sectionId}>
            <h4 className="value-text">{s.title}</h4>
            <p className="caption-secondary leading-relaxed mt-1">{s.body}</p>
          </div>
        ))}
        {ipayBlock}
        {/* The application form (agreement checkbox and signature) is the LAST thing in the
            scroll area, so the customer has to scroll through every section to reach it. */}
        {closingHeader}
        <div className="divider-top mt-2 pt-2">{children}</div>
      </div>
    </section>
  );
}
