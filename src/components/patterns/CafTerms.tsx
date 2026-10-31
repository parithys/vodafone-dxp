import { useEffect, useState, type ReactNode } from 'react';
import * as mockDataEngine from '../../engines/mockDataEngine';
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
  closingHeader,
  children,
}: {
  /** Accepted for callers that still pass it; the panel no longer links out. */
  termsUrl?: string;
  enabled: boolean;
  signed?: boolean;
  /** 'page' (default): the panel grows to its full content and the page itself scrolls, so the signature block
   * follows the last section with no inner scrollbar. 'container': the terms scroll inside a fixed-height panel. */
  scrollMode?: 'container' | 'page';
  /** Which journey's terms to show: a section scoped to the other journey is left out. Postpaid by default. */
  journey?: 'postpaid' | 'prepaid';
  /** A heading over the closing part of the panel (the customer's details, agreements and signature), above its dividing line. */
  closingHeader?: ReactNode;
  children: ReactNode;
}) {
  const [sections, setSections] = useState<TncSection[] | undefined>();
  useEffect(() => {
    mockDataEngine.list<TncSection>('tnc-full-text').then((all) => setSections(all.filter((s) => !s.journey || s.journey === journey)));
  }, [journey]);
  // Without the terms (not the customer-facing page, or none loaded) the form stands alone.
  if (!enabled || !sections || sections.length === 0) return <>{children}</>;
  // Once signed there is nothing left to read: show just the signed form (applicant, signed
  // badge and signature) not the whole scrolling document or its link.
  if (signed) {
    return (
      // The signed primary contact, laid out like the secondary contact's form: heading, the key terms as one line each, then who signed and the signature.
      <section aria-label="Signed application form" className="card p-4 space-y-3">
        {closingHeader}
        <ul className="space-y-2 text-[length:var(--fs-caption)]">
          {sections.map((s) => (
            <li key={s.sectionId}>
              <span className="text-fg font-semibold">{s.title}: </span>
              <span className="text-fg-2">{s.body}</span>
            </li>
          ))}
        </ul>
        {children}
      </section>
    );
  }
  return (
    <section aria-label="Full Terms and Conditions" className="card ">
      <div className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-3">
        <h3 className="text-fg font-semibold text-[length:var(--fs-body)]">Key Terms &amp; Conditions</h3>
      </div>
      {/* tabIndex so the panel can be scrolled with the keyboard. */}
      <div
        tabIndex={scrollMode === 'page' ? undefined : 0}
        className={`px-4 py-3 space-y-4 ${scrollMode === 'page' ? '' : 'max-h-[34rem] overflow-y-auto focus:outline-none focus-visible:shadow-[var(--focus-ring)]'}`}
      >
        {sections.map((s) => (
          <div key={s.sectionId}>
            <h4 className="text-fg font-medium text-[length:var(--fs-body)]">{s.title}</h4>
            <p className="text-fg-2 text-[length:var(--fs-caption)] leading-relaxed mt-1">{s.body}</p>
          </div>
        ))}
        {/* The application form (agreement checkbox and signature) is the LAST thing in the
            scroll area, so the customer has to scroll through every section to reach it. */}
        {closingHeader}
        <div className="border-t border-border-soft mt-2 pt-2">{children}</div>
      </div>
    </section>
  );
}
