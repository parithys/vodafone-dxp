import { useEffect, useRef, useState } from 'react';
import type { SpecimenIdentity } from '../domain/ScannedIdPreview';
import { callService, ServiceError, takeDuplicateFault, VALIDATION_TTL_MS, type FailureKind, type ServiceName } from '../../engines/serviceCall';
import type { QidType } from '../domain/QidInput';
import * as mockDataEngine from '../../engines/mockDataEngine';
import { useActedForCustomer } from './useActedForCustomer';
import { useEnterToSubmit } from '../../hooks/useEnterToSubmit';
import type { NationalAddress, NewCustomerMoi } from './idLookupModel';
import { pickHrnDemoNas, type DemoNasRecord } from './idLookupModel';
import { MAX_SCAN_ATTEMPTS, LEGACY_MAX_SCAN_ATTEMPTS, SCANNABLE_ID_TYPES, captureModeOf, NEW_CUSTOMER_ID_TYPES, buildNewCustomerPatch, isoToDmy, selectScanCandidates } from './idLookupModel';
import type { DuplicateCandidate, IdLookupValue } from './idLookupModel';
import { isIdExpired } from '../../engines/eligibilityEngine';
import { canViewCustomerSegment } from '../../engines/agentPrivilegeEngine';
import { usePersonaStore } from '../../stores/personaStore';
import { resolveExistingCustomer, duplicateCustomerMessage, type LinkedIdUpdate } from './idLinkModel';
import { moiIdDetailsPatch, MOI_UPDATE_BASIS } from './moiIdRefresh';
import { useEntityStore } from '../../stores/entityStore';
import { reconcileIdentity, reconciliationPasses, type AttributeMatch } from './idReconciliation';

export interface IdLookupFailure {
  service: ServiceName;
  kind: FailureKind;
  attempts: number;
}

interface UseIdLookupOptions {
  value: IdLookupValue;
  onChange: (value: IdLookupValue) => void;
  allowedIdTypes?: QidType[];
  autoDetectIdType: boolean;
  verifyThenFetch: boolean;
  asNewCustomer: boolean;
  asCustomerId?: string;
  /** Not the customer on screen: identify someone else (e.g. the actual user of a line). Nobody is bound, so the scanner draws no customer's card by default. */
  unbound?: boolean;
  /** The simulated reader presents THIS customer's own document and card (the demo has no hardware); it binds nothing. For an `unbound` lookup. */
  scanAsCustomerId?: string;
  manualEntry?: boolean;
  /** Offer to create a new customer when no registry knows the ID (QID, Passport, Diplomatic ID). Default true; off for a journey bound to a customer. */
  allowNewCustomer?: boolean;
}

// State, effects and async lookups behind IdLookupStep. Everything here was the
// body of the component, moved verbatim; the JSX stays in IdLookupStep.
export function useIdLookup({ value, onChange, allowedIdTypes, autoDetectIdType, verifyThenFetch, asNewCustomer, asCustomerId: explicitCustomerId, unbound = false, scanAsCustomerId, manualEntry = false, allowNewCustomer = true }: UseIdLookupOptions) {
  // The customer the SCANNER defaults to (the one the journey was opened for, else the one selected). It only decides whose card the reader
  // draws: who the presented ID belongs to is always decided by the ID itself (MOI), never by the context.
  const asCustomerId = useActedForCustomer(explicitCustomerId, asNewCustomer || unbound);
  /** The ID the agent presented belongs to someone other than the customer this journey is bound to (that customer's name). */
  const [ownerMismatch, setOwnerMismatch] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  // The attribute-level result of a reconciliation that FAILED (the identity is not accepted, so it is not on the value): what to show the agent.
  const [reconciliation, setReconciliation] = useState<AttributeMatch[] | undefined>();
  // Why a person cannot be taken as a new customer or linked to an existing one (a Passport link that disagrees, a duplicate): shown to the agent.
  const [linkProblem, setLinkProblem] = useState<string | undefined>();
  // The ID resolved to a customer in a protected segment (Safwa, Safwa+, Royal) the signed-in role may not see: nothing about them is kept or shown.
  const [accessRestricted, setAccessRestricted] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);
  // The customer the reader would present is protected from this role: the simulated scan reads nothing (it would put their QID in the number field).
  const cardRestrictedRef = useRef(false);
  // The current value, readable from an async continuation that was started
  // under an older one.
  //
  // Both lookups below are two-hop mock calls taking up to 600ms each, and
  // they spread `{ ...value }` when they land. Spreading the value they
  // CLOSED OVER writes back every field as it was when the call started - so
  // a Retake pressed while a lookup was in flight had the late result restore
  // the very scan flags the Retake had cleared, putting a read-only number
  // field with the previous document's number on screen underneath a card
  // that was visibly still reading. Reachable in one press since Retake
  // started driving the reader directly; before that the agent had to clear
  // and re-initiate, which took longer than the calls did.
  const latest = useRef(value);
  latest.current = value;
  const idType = value.idType ?? 'QID';
  // verifyThenFetch is selector-led with NOTHING preselected (2026-10-04). A
  // QID default (2026-10-02) meant a Diplomatic ID, Passport or GCC ID presented
  // at the reader was read as a QID unless the agent noticed and switched first.
  // The agent now names the document type, and the scanner, the document read
  // and the MOI lookup all follow that type - each type its own flow.
  const typeChosen = !verifyThenFetch || Boolean(value.idType);
  /**
   * DEMO ONLY (2026-09-28, explicitly requested as such).
   *
   * Which card the demo links below the scanner say was put in the reader.
   * Null in the real flow, where the reader identifies the document itself.
   *
   * It exists because the four links must be able to produce a Passport or a
   * GCC ID - neither of which is in SCANNABLE_ID_TYPES, so without this the
   * scanner would unmount mid-demo and the "scanned" document would never be
   * shown. Kept OUT of the draft value: this is a property of the person
   * demonstrating the app, not of the order.
   */
  const [demoType, setDemoType] = useState<QidType | null>(null);
  /**
   * The ID type the agent selected, when the journey leads with a type selector (not the scan-first flow, where the reader
   * names the document). That selection is the type of the document in the reader and stays so through scanning, reading,
   * validation, retake and retry: nothing the reader returns may overwrite it - only the agent choosing another type
   * (handleIdTypeChange) or the journey being reset does.
   */
  const chosenType: QidType | undefined = !autoDetectIdType && !demoType ? idType : undefined;
  const scannable = typeChosen && SCANNABLE_ID_TYPES.has(idType);
  // Everything that asks "is there a reader on this screen" must accept a demo
  // scan too, or the capture disappears the moment a non-scannable type wins.
  const effectiveScannable = scannable || demoType !== null;

  const handleIdTypeChange = (nextType: QidType) => {
    // Re-clicking the type you are already on is a no-op, not a reset. These
    // are plain buttons rather than radios, so without this a stray second
    // click on the selected chip would wipe a number the agent had just typed.
    if (nextType === idType && typeChosen) return;
    setNotFound(false);
    // Clear the NUMBER, not just the MOI result. The two ID schemes have
    // nothing in common, so a number carried across a type switch is always
    // wrong for the field it now sits in - the reported case was a QID,
    // 28456701234, left sitting under a "Diplomatic ID Number" label whose
    // own placeholder reads "e.g. DIP-QA-004521". Fetch would then either miss
    // or, worse, resolve the OLD document and show demographics that have
    // nothing to do with the selected type.
    //
    // `email` needs no clearing here: GuidedContactStep re-derives it from
    // moiResult on every change. `altPhone` is deliberately kept - switching
    // type normally means the same walk-in presenting a different document,
    // and discarding a contact number the agent typed would be the bigger
    // loss.
    // qidScans clears with the rest: a scan belongs to the document that was
    // in the reader, so retaining it across a type switch would let a QID
    // scan satisfy a Passport journey.
    onChange({ ...value, idType: nextType, idNumber: '', moiResult: undefined, qidScans: undefined });
    // Attempts belong to the document that was being scanned, so a new type
    // starts from zero. Without this, switching away from an exhausted QID and
    // back would leave manual entry already unlocked for a fresh card.
    setScanAttempts(0);
    // The number field is now the outstanding one and typing it is the
    // unambiguous next action, so move the cursor there rather than leaving it
    // on the chip the agent just clicked.
    //
    // Synchronous, NOT wrapped in requestAnimationFrame. The input node
    // already exists and React reuses it across this re-render, so there is
    // nothing to wait for - and rAF never fires while the document is hidden,
    // so an agent returning to a backgrounded tab would have found the field
    // cleared but the cursor still on the chip.
    numberInputRef.current?.focus();
  };

  // Customer 360 context: the card drawn in the reader shows this customer.
  const [contextIdentity, setContextIdentity] = useState<SpecimenIdentity | undefined>();
  /** Set (to the customer's name, or the id) when the journey's customer has no identity document on file: nothing to draw in the reader. */
  const [contextNoDocument, setContextNoDocument] = useState<string | undefined>();
  /** The ID types the journey's customer DOES hold, when none of the chosen type is on file (so the panel can say what to pick instead). */
  const [contextHeldTypes, setContextHeldTypes] = useState<string[]>([]);
  const cardCustomerId = scanAsCustomerId ?? asCustomerId;
  useEffect(() => {
    setContextNoDocument(undefined);
    setContextHeldTypes([]);
    cardRestrictedRef.current = false;
    if (!cardCustomerId) {
      setContextIdentity(undefined);
      return;
    }
    let cancelled = false;
    void Promise.all([
      mockDataEngine.list<{ customerId: string; name: string; nationality: string; dob: string; segment?: string }>('customers'),
      mockDataEngine.list<{ customerId: string; documentType: string; documentNumber: string; expiryDate?: string }>('identity-documents'),
    ]).then(([customers, docs]) => {
      const c = customers.find((x) => x.customerId === cardCustomerId);
      if (cancelled) return;
      // The reader would draw THIS customer's own card (name, QID, nationality, date of birth): a protected one this role may not see is never drawn - only the restriction.
      cardRestrictedRef.current = Boolean(c && !canViewCustomerSegment(usePersonaStore.getState().activePersonaId, c.segment));
      if (cardRestrictedRef.current) {
        setContextIdentity(undefined);
        setContextNoDocument(undefined);
        setAccessRestricted(true);
        return;
      }
      const own = docs.filter((d) => d.customerId === cardCustomerId);
      // The card drawn is the one of the type the agent chose; a customer who does not hold that type has no card to read for it.
      const d = own.find((x) => x.documentType === idType);
      if (cancelled) return;
      if (c && !d && own.length > 0) {
        setContextIdentity(undefined);
        setContextNoDocument(c.name);
        setContextHeldTypes([...new Set(own.map((x) => x.documentType))]);
        return;
      }
      if (!c || !d) {
        // Never fall back to another customer's specimen card: say there is no document.
        setContextIdentity(undefined);
        setContextNoDocument(c?.name ?? cardCustomerId);
        return;
      }
      setContextIdentity({ name: c.name, idNo: d.documentNumber, nationality: c.nationality, dob: isoToDmy(c.dob), expiry: d.expiryDate ? isoToDmy(d.expiryDate) : '' });
    });
    return () => {
      cancelled = true;
    };
  }, [cardCustomerId, idType]);

  // New Customer journey (no customer on screen): the card drawn in the reader is the HRN demo person's, so the card's printed name, date of
  // birth and nationality are the ones MOI will return for the number the reader then reads. Reconciliation compares them.
  useEffect(() => {
    if (!asNewCustomer || cardCustomerId) return;
    let cancelled = false;
    void mockDataEngine.list<DemoNasRecord>('nas-records').then((nas) => {
      if (cancelled) return;
      const p = pickHrnDemoNas(nas, idType);
      setContextIdentity(p ? { name: p.name, idNo: p.documentNumber, nationality: p.nationality, dob: isoToDmy(p.dob), expiry: p.expiryDate ? isoToDmy(p.expiryDate) : '' } : undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [asNewCustomer, cardCustomerId, idType]);

  // ---- Failure handling ------------------------------------------------------
  // A lookup that cannot complete is UNRESOLVED: it never becomes "not found",
  // "new customer", "validated" or "eligible". The failure is held here, shown
  // with Retry while attempts remain, and a controlled recovery once they are
  // spent. `requestSeq` makes every result belong to exactly one request, so a
  // retry, a retake or an edited number can never be answered by an older call.
  const [failure, setFailure] = useState<IdLookupFailure | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[] | null>(null);
  const [expiredNotice, setExpiredNotice] = useState(false);
  const attemptsRef = useRef<{ number: string; n: number }>({ number: '', n: 0 });
  const requestSeq = useRef(0);

  // A different number is a different question: forget the old answer's trouble.
  useEffect(() => {
    setFailure(null);
    setDuplicates(null);
    setRetrying(false);
  }, [value.idNumber]);

  // A successful MOI validation does not last forever. Once it is older than the
  // TTL it is dropped (the identity fields clear with it) and the agent must
  // validate again - the journey never continues on a stale result.
  const validatedAt = value.moiResult?.moiUpdateTime;
  useEffect(() => {
    if (!validatedAt) return;
    const left = new Date(validatedAt).getTime() + VALIDATION_TTL_MS - Date.now();
    const drop = () => {
      setExpiredNotice(true);
      onChange({ ...latest.current, moiResult: undefined });
    };
    if (left <= 0) {
      drop();
      return;
    }
    const t = setTimeout(drop, left);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedAt]);
  useEffect(() => {
    if (value.moiResult) setExpiredNotice(false);
  }, [value.moiResult]);

  const runMoiValidation = async (opts: { forceCustomerId?: string; retry?: boolean } = {}) => {
    if (!value.idNumber) return;
    const requested = value.idNumber;
    const seq = ++requestSeq.current;
    const stale = () => seq !== requestSeq.current || latest.current.idNumber !== requested;
    if (attemptsRef.current.number !== requested) attemptsRef.current = { number: requested, n: 0 };
    setLoading(true);
    setNotFound(false);
    setReconciliation(undefined);
    setLinkProblem(undefined);
    setAccessRestricted(false);
    setOwnerMismatch(undefined);
    setDuplicates(null);
    setExpiredNotice(false);
    setRetrying(Boolean(opts.retry));
    if (!opts.retry) setFailure(null);
    try {
      // MOI: the identity document registry.
      const identityDocs = await callService('moi', () =>
        mockDataEngine.list<{ documentNumber: string; documentType: string; customerId: string; expiryDate?: string }>('identity-documents')
      );
      if (stale()) return;
      const docMatches = identityDocs.filter((d) => d.documentNumber === requested);
      const docMatch = docMatches[0];
      // NAS: the person may be known there without a customer record. In the New
      // Customer journey it is consulted even when a record exists.
      const nasRecord =
        docMatch && !asNewCustomer
          ? undefined
          : (
              await callService('nas', () =>
                mockDataEngine.list<{ documentNumber: string; linkedPassportNumber?: string; expiryDate?: string; name: string; firstName?: string; middleName?: string; lastName?: string; dob: string; nationality: string; gender?: string; email?: string; mobile?: string; occupation?: string; nationalAddress?: NationalAddress }>(
                  'nas-records'
                )
              )
            ).find((r) => r.documentNumber === requested);
      if (stale()) return;
      const match = docMatch ?? (nasRecord && { customerId: undefined, expiryDate: nasRecord.expiryDate });
      if (!match) {
        // Every system ANSWERED and none knows this number: a business result.
        setNotFound(true);
        return;
      }
      // ID reconciliation (verifyThenFetch: a scanned card, or its number and expiry typed after one): every attribute captured from the ID is
      // compared with what MOI returned and the result kept per attribute. Any disagreement stops the identity being accepted; an attribute
      // that was not captured (an upload reads only what the agent types) or that MOI cannot answer is recorded and does not block.
      const settle = (moiResult: NonNullable<IdLookupValue['moiResult']>) => {
        // What the reader printed is captured only while the reader read it: an upload, and the typed-entry pass after the reader failed, supply
        // just the number and expiry the agent typed.
        const card = captureMode === 'upload' ? undefined : latest.current.qidScans?.captured;
        const result = verifyThenFetch
          ? reconcileIdentity(
              { idNumber: requested, expiry: latest.current.scannedExpiry, name: card?.name, dob: card?.dob, nationality: card?.nationality },
              { idNumber: requested, expiry: match.expiryDate, name: moiResult.name, dob: moiResult.dob, nationality: moiResult.nationality }
            )
          : undefined;
        if (result && !reconciliationPasses(result)) {
          setReconciliation(result);
          return false;
        }
        onChange({ ...latest.current, manualEntry: fallbackUnlocked && !scanComplete, moiResult, idReconciliation: result });
        return true;
      };
      const customers = await callService('customer-lookup', () =>
        mockDataEngine.list<{ customerId: string; idType?: string; qid?: string; segment?: string; name: string; firstName?: string; middleName?: string; lastName?: string; dob: string; nationality: string; email?: string; gender?: string; companyName?: string; occupation?: string; phone?: string; preferredLanguage?: string }>(
          'customers'
        )
      );
      if (stale()) return;

      // More than one record for this ID: never pick one silently. (The Customer
      // 360 journey is already fixed to its customer, and an explicit choice from
      // the agent resolves it.)
      // The bound customer holding this very document settles which record it is.
      const boundHoldsIt = Boolean(explicitCustomerId && !asNewCustomer && docMatches.some((d) => d.customerId === explicitCustomerId));
      if (!opts.forceCustomerId && !boundHoldsIt) {
        const ids = [...new Set(docMatches.map((d) => d.customerId).filter(Boolean))];
        if (takeDuplicateFault('customer-lookup') && ids.length === 1) {
          const other = customers.find((c) => c.customerId !== ids[0]);
          if (other) ids.push(other.customerId);
        }
        if (ids.length > 1) {
          // A protected customer among the candidates: no candidate is listed (a list would name them), the identification is simply refused.
          if (ids.some((id) => !canViewCustomerSegment(usePersonaStore.getState().activePersonaId, customers.find((c) => c.customerId === id)?.segment))) {
            setAccessRestricted(true);
            return;
          }
          setDuplicates(
            ids
              .map((id) => customers.find((c) => c.customerId === id))
              .filter((c): c is NonNullable<typeof c> => Boolean(c))
              .map((c) => ({ customerId: c.customerId, name: c.name, dob: c.dob }))
          );
          return;
        }
      }

      const wantedId = opts.forceCustomerId ?? (boundHoldsIt ? explicitCustomerId : match.customerId);
      // A journey bound to a customer (opened from their Customer 360) cannot continue with someone else's document.
      if (explicitCustomerId && !asNewCustomer && !opts.forceCustomerId && !boundHoldsIt && match.customerId) {
        const bound = customers.find((c) => c.customerId === explicitCustomerId);
        // The customer the journey is bound to is itself protected from this role: the mismatch message would NAME them, so only the restriction is given.
        if (bound && !canViewCustomerSegment(usePersonaStore.getState().activePersonaId, bound.segment)) {
          setAccessRestricted(true);
          return;
        }
        setOwnerMismatch(bound?.name ?? explicitCustomerId);
        return;
      }
      // A QID known only to the registry (NAS): before this person is treated as new, look for the customer they already are - through the
      // Passport the registry links to the QID, else by name, date of birth and nationality (see idLinkModel). This applies in the New Customer
      // journey too: a person who is already a customer is never created a second time.
      let linked: LinkedIdUpdate | undefined;
      if (nasRecord && !docMatch && !wantedId) {
        const found = resolveExistingCustomer(
          { name: nasRecord.name, dob: nasRecord.dob, nationality: nasRecord.nationality, linkedPassportNumber: nasRecord.linkedPassportNumber },
          identityDocs,
          customers,
          requested,
          (c) => canViewCustomerSegment(usePersonaStore.getState().activePersonaId, c.segment)
        );
        if (found.kind === 'conflict') {
          setLinkProblem(found.message);
          return;
        }
        if (found.kind === 'linked') {
          // A journey bound to a customer cannot continue with someone else's QID.
          if (explicitCustomerId && found.customerId !== explicitCustomerId) {
            const bound = customers.find((c) => c.customerId === explicitCustomerId);
            if (bound && !canViewCustomerSegment(usePersonaStore.getState().activePersonaId, bound.segment)) {
              setAccessRestricted(true);
              return;
            }
            setOwnerMismatch(bound?.name ?? explicitCustomerId);
            return;
          }
          linked = { customerId: found.customerId, documentType: 'QID', documentNumber: requested, expiryDate: match.expiryDate, via: found.via, passportNumber: found.passportNumber };
        }
      }
      // A journey bound to a customer, and an ID that belongs to no customer at all (the registry knows it, nobody holds it): it is someone
      // else, never this customer and never a new one created inside their journey.
      if (explicitCustomerId && !asNewCustomer && !opts.forceCustomerId && nasRecord && !docMatch && !wantedId && !linked) {
        const bound = customers.find((c) => c.customerId === explicitCustomerId);
        if (bound && !canViewCustomerSegment(usePersonaStore.getState().activePersonaId, bound.segment)) {
          setAccessRestricted(true);
          return;
        }
        setOwnerMismatch(bound?.name ?? explicitCustomerId);
        return;
      }
      const customer = wantedId || linked ? customers.find((c) => c.customerId === (wantedId ?? linked?.customerId)) : undefined;
      // The record this ID points at is missing from the lookup: that is a
      // lookup failure, NOT evidence that the person is new.
      if ((wantedId || linked) && !customer) throw new ServiceError('customer-lookup', 'partial');
      // AUTHORISATION, before anything about this customer is kept or drawn: a protected segment the signed-in role may not see ends the lookup here -
      // no MOI result, no name, no eligibility. The journey cannot continue (there is no identified customer) and the agent is told why.
      if (customer && !canViewCustomerSegment(usePersonaStore.getState().activePersonaId, customer.segment)) {
        setAccessRestricted(true);
        onChange({ ...latest.current, moiResult: undefined });
        return;
      }

      if ((!customer && nasRecord) || (asNewCustomer && !linked && (nasRecord || customer))) {
        // NEW customer: identity and email come from NAS, not Siebel. In the New
        // Customer journey (asNewCustomer) an ID that also has a Siebel record is
        // still treated as new - its demographics are used only as the fallback
        // when NAS holds none, and no customerId is carried.
        const src = (nasRecord ?? customer)!;
        // An answer missing the details the journey is built on cannot be used.
        if (!src.name || !src.dob || !src.nationality) throw new ServiceError(nasRecord ? 'nas' : 'customer-lookup', 'partial');
        if (stale()) return;
        attemptsRef.current = { number: requested, n: 0 };
        settle({
            name: src.name,
            firstName: src.firstName,
            middleName: src.middleName,
            lastName: src.lastName,
            dob: src.dob,
            nationality: src.nationality,
            email: src.email,
            mobile: nasRecord?.mobile,
            emailSource: 'NAS',
            isNewCustomer: true,
            gender: src.gender,
            occupation: src.occupation,
            // The NAS's own address for this person: kept apart from the address the journey captures, and never shown.
            nationalAddress: nasRecord?.nationalAddress,
            expiryDate: match.expiryDate,
            moiUpdateTime: new Date().toISOString(),
        });
        return;
      }
      if (customer) {
        if (!customer.name || !customer.dob || !customer.nationality) throw new ServiceError('customer-lookup', 'partial');
        // Only for a customer who has an employer, so an ordinary consumer sale
        // costs no extra dataset read.
        let companyAccountId: string | undefined;
        if (customer.companyName) {
          const accounts = await callService('customer-lookup', () =>
            mockDataEngine.list<{ enterpriseAccountId: string; name: string }>('enterprise-accounts')
          );
          companyAccountId = accounts.find((a) => a.name === customer.companyName)?.enterpriseAccountId;
          // Left undefined when the employer is not in the registry, rather than
          // faked. The order still carries the name and still routes for
          // approval; the approver is the one who can see that the sponsoring
          // account does not exist yet, which is exactly the kind of thing they
          // are there to catch.
        }
        // Existing customer's email: the one on their Billing Profile, whenever the
        // account has one - also when the account carries several addresses (the
        // customer record, billing contact and so on). Where the Billing Profile has
        // none, the single address on file (the customer record's) is used.
        const [accountsAll, profilesAll] = await callService('customer-lookup', () =>
          Promise.all([
            mockDataEngine.list<{ accountId: string; customerId: string; billingProfileId?: string }>('accounts'),
            mockDataEngine.list<{ billingProfileId: string; billingContactEmail?: string }>('billing-profiles'),
          ])
        );
        const profileIds = new Set(accountsAll.filter((a) => a.customerId === customer.customerId).map((a) => a.billingProfileId));
        const billingEmail = profilesAll.find((p) => profileIds.has(p.billingProfileId) && p.billingContactEmail)?.billingContactEmail;
        // Superseded while in flight - the agent retook the scan, switched ID
        // type, or edited the number. Applying this now would attach one
        // document's demographics to another's number.
        if (stale()) return;
        attemptsRef.current = { number: requested, n: 0 };
        const accepted = settle({
            customerId: customer.customerId,
            name: customer.name,
            firstName: customer.firstName,
            middleName: customer.middleName,
            lastName: customer.lastName,
            dob: customer.dob,
            nationality: customer.nationality,
            email: billingEmail ?? customer.email,
            emailSource: billingEmail ? 'Billing Profile' : 'Siebel',
            gender: customer.gender,
            phone: customer.phone,
            preferredLanguage: customer.preferredLanguage,
            companyName: customer.companyName,
            companyAccountId,
            occupation: customer.occupation,
            linkedIdUpdate: linked,
            expiryDate: match.expiryDate,
            moiUpdateTime: new Date().toISOString(),
        });
        // MOI's latest answer updates the customer's ID details (ID Type, ID Number) - each change goes to the audit trail with the old value. The
        // identification itself does not depend on it, so a failed write does not undo an identity MOI confirmed.
        if (accepted && docMatch && !linked) {
          const patch = moiIdDetailsPatch(customer, docMatch, identityDocs);
          if (patch) {
            await useEntityStore.getState().updateRecord('customers', 'customerId', customer.customerId, patch, { how: MOI_UPDATE_BASIS, by: 'MOI' }).catch(() => undefined);
          }
        }
      }
    } catch (err) {
      if (stale()) return; // interrupted by a newer request: not this one's to report
      const e = err instanceof ServiceError ? err : new ServiceError('moi', 'unexpected');
      attemptsRef.current = { number: requested, n: attemptsRef.current.n + 1 };
      setFailure({ service: e.service, kind: e.kind, attempts: attemptsRef.current.n });
      // A failed check leaves the validation unresolved: drop any earlier result so the identity
      // details below never read as validated while the failure banner is showing.
      onChange({ ...latest.current, moiResult: undefined });
    } finally {
      if (seq === requestSeq.current) {
        setLoading(false);
        setRetrying(false);
      }
    }
  };

  // A completed scan IS the fetch trigger for a QID - the agent doesn't press
  // Fetch separately, and as of 2026-09-25 there is no Fetch button to press
  // in this state at all. If the auto-fetch finds no record, the recourse is
  // Retake scan, which is the right action anyway: a number the registry does
  // not recognise means the read was wrong or the document is not in MOI, and
  // neither is fixed by pressing the same lookup again on the same digits.
  // Once the scan budget is spent the field turns editable and Fetch returns
  // with it, so a bad read is never a dead end.
  //
  // Guarded by a ref keyed on the number that was fetched, not by a boolean,
  // because the effect re-runs on every keystroke in the number field. Without
  // the key, correcting a digit after a failed auto-fetch would never retry;
  // with a plain boolean it would fire on every render while the scan stayed
  // complete. `notFound` is deliberately NOT a dependency - re-running on it
  // would loop a failing lookup forever.
  const autoFetchedNumber = useRef<string | null>(null);
  // Both flags, even though one operation now sets them together: this is the
  // contract QidImageUpload's other three consumers also read, and checking
  // only one would quietly accept a half-written value.
  const scanComplete = Boolean(value.qidScans?.frontScanned && value.qidScans?.backScanned);

  // Scan attempts. Charged once per PASS OVER THE READER, which as of
  // 2026-09-26 includes a Retake: pressing it rescans there and then, so it is
  // a physical read and is counted like one. It was not counted while Retake
  // merely cleared the card and waited for a second press on Initiate, since
  // back then the gesture never touched the reader.
  //
  // The budget arithmetic is unchanged by that: the first scan on arrival is
  // attempt 1 and the three retakes after it are 2, 3 and 4, so three retakes
  // succeed - labelled (1), (2) and (3) on the button - and a fourth is the
  // fifth attempt, which fails and opens manual entry.
  //
  // Going past the budget is what unlocks manual number entry - the reference
  // asset's "Manual Fallback Entry". The exhausting attempt FAILS rather than
  // being blocked: a disabled scan button with a fallback appearing beside it
  // would tell the agent the app had decided to stop trying, where a failed
  // read tells them the document is the problem. It also means the simulated
  // reader is the thing that opens the fallback, which is how a real one
  // would.
  //
  // Local state, not draft state: an attempt count describes this sitting at
  // the counter, not the order. Re-entering the step should offer the scanner
  // again rather than resuming someone else's exhausted attempts.
  const [scanAttempts, setScanAttempts] = useState(0);
  /**
   * LATCHED, and deliberately separate from the attempt count.
   *
   * handleIdTypeChange resets scanAttempts to zero - correct, because a new
   * document deserves fresh attempts. But the fallback's whole purpose is to
   * let the agent pick a type by hand, so deriving its visibility from the
   * count meant the selector vanished the instant it was used. This latches
   * once the budget is spent and stays open for the rest of the sitting.
   */
  const [fallbackUnlocked, setFallbackUnlocked] = useState(false);
  /**
   * LATCHED: the scan attempts really were used up. Only this makes the reader read "unavailable" and shows "We could not read the
   * document after the permitted attempts" - manual entry can open for other reasons (the customer has no document to read) without
   * any attempt having been made.
   */
  const [scanBudgetSpent, setScanBudgetSpent] = useState(false);
  // No document to read for this customer: the reader cannot help, so manual entry is available straight away.
  useEffect(() => {
    if (contextNoDocument) setFallbackUnlocked(true);
  }, [contextNoDocument]);
  // Two for the scan-first flow, four for the journeys that still lead with a
  // type selector - see autoDetectIdType.
  // verifyThenFetch has no budget: each further pass is a retake, and from the third the agent types the fields (see CaptureMode).
  const maxScanAttempts = verifyThenFetch ? Number.POSITIVE_INFINITY : autoDetectIdType ? MAX_SCAN_ATTEMPTS : LEGACY_MAX_SCAN_ATTEMPTS;
  // How this capture's number and expiry came in - and so what the agent may change (see CaptureMode).
  const captureMode = verifyThenFetch && scanComplete ? captureModeOf(value.qidScans?.source === 'upload', scanAttempts) : undefined;
  // manualEntry: a keyboard device types the number straight away; the scanner stays available beside it.
  const manualEntryUnlocked = !effectiveScannable || fallbackUnlocked || manualEntry;

  /**
   * DEMO ONLY. Says which card was "inserted", then lets the normal scan run:
   * the reader animates, detection resolves that document, and the number and
   * type land exactly as they would from a real pass. Deliberately routed
   * through the same path rather than writing the result directly, so what the
   * demo shows is the real flow and not a parallel one.
   */
  const handleDemoScan = (type: QidType) => {
    setDemoType(type);
    setNotFound(false);
    // Clear any previous read so the new card resolves from scratch - without
    // this the effect sees an idNumber already present and never re-fetches.
    onChange({ ...latest.current, idType: type, idNumber: '', moiResult: undefined, qidScans: undefined });
  };

  // Returns whether this attempt read the card. QidImageUpload leaves its
  // value untouched on false, so a failed attempt keeps the insert prompt up.
  const handleScanAttempt = () => {
    const attempt = scanAttempts + 1;
    setScanAttempts(attempt);
    // The fallback is NOT opened merely because the budget is spent. A second
    // attempt that reads the card successfully must leave the agent on the
    // scanned path - manual entry is a fallback, never an alternative to a
    // successful scan. It opens in exactly two places:
    //   - here, when a pass is refused because the budget is gone
    //   - in the scan effect, when a completed pass identifies no document
    //     and no attempts remain
    if (attempt > maxScanAttempts) {
      setFallbackUnlocked(true);
      setScanBudgetSpent(true);
      return false;
    }
    return true;
  };

  // The barcode button (Retake 3 onwards): the demo reader scans the card's barcode and the number lands in the field. It resolves the same
  // document the OCR passes do, so the MOI lookup that follows finds the same person.
  const handleBarcodeScan = async () => {
    const scanned = await readDocumentFromScan();
    if (!scanned) return;
    setNotFound(false);
    setReconciliation(undefined);
    onChange({ ...latest.current, idNumber: scanned.documentNumber, moiResult: undefined });
  };

  // Simulated OCR. A real scanner reads the number off the card, which is the
  // only reason the number field can be locked at all - with no scanner and no
  // typing, nothing could ever be looked up.
  //
  // It resolves against the seeded identity documents rather than inventing a
  // literal, so it stays correct if the seed changes. DEMO LIMITATION, stated
  // plainly: it takes the first QID-type document, so every successful scan
  // resolves to the same customer. A real integration would return whatever
  // card is physically in the reader.
  const readDocumentFromScan = async (): Promise<{ documentType: QidType; documentNumber: string; expiryDate?: string } | undefined> => {
    if (cardRestrictedRef.current) return undefined;
    const docs = await mockDataEngine.list<{ documentType: string; documentNumber: string; expiryDate?: string }>(
      'identity-documents'
    );
    // AUTOMATIC DETECTION (2026-09-28). The reader identifies what was put in
    // it, so this no longer filters by a type the agent picked beforehand -
    // there is no such selection during the normal flow any more. It considers
    // every type this journey accepts AND can physically capture, and returns
    // the type along with the number so the caller can record what was found.
    // Auto-detect considers every type this journey accepts AND can capture.
    // Without it, the original behaviour stands: resolve a document of the
    // type the agent already selected, so a Diplomatic scan does not fall back
    // to the first QID on file.
    const detectable = demoType
      ? // A demo link names the card, so the "detection" resolves that one.
        [demoType]
      : autoDetectIdType
        ? (allowedIdTypes ?? [...SCANNABLE_ID_TYPES]).filter((t) => SCANNABLE_ID_TYPES.has(t))
        : [idType];
    // Journey started from Customer 360: the reader returns THAT customer's own
    // document, never another customer's. (Their QID where they hold one.)
    const ownDocs = cardCustomerId
      ? docs.filter((d) => (d as { customerId?: string }).customerId === cardCustomerId)
      : undefined;
    // New Customer journey: the reader returns the HRN demo person (a NAS identity), for the first detectable type that has one.
    if (asNewCustomer && !cardCustomerId) {
      const nas = await mockDataEngine.list<DemoNasRecord>('nas-records');
      for (const t of detectable) {
        const p = pickHrnDemoNas(nas, t);
        if (p) return { documentType: p.documentType as QidType, documentNumber: p.documentNumber, expiryDate: p.expiryDate };
      }
    }
    const candidates = selectScanCandidates({ docs, ownDocs, chosenType, detectable });
    // Prefers an UNEXPIRED document rather than simply the first match.
    //
    // Not cosmetic: two Diplomatic IDs are seeded and the first in file order
    // is deliberately expired (CUST-1006, the hard-stop fixture), so
    // first-match made that scan resolve to an expired card and the
    // direct-sale path could never be exercised. Depending on array order to
    // fix that would be worse - a reorder of the JSON would silently break it.
    //
    // The expired document is still reachable: it is the one the manual
    // fallback accepts once the scan budget is spent.
    const now = Date.now();
    const found =
      candidates.find((d) => !d.expiryDate || !isIdExpired(d.expiryDate, new Date(now))) ?? candidates[0];
    if (!found) return undefined;
    return { documentType: found.documentType as QidType, documentNumber: found.documentNumber, expiryDate: found.expiryDate };
  };


  useEffect(() => {
    if (!effectiveScannable || !scanComplete) {
      // Reset so re-scanning after a type switch or a cleared scan fetches again.
      autoFetchedNumber.current = null;
      return;
    }
    const number = value.idNumber?.trim();
    // Nothing typed (the field may well be locked), so the scan supplies it.
    // Setting idNumber re-runs this effect, which then fetches.
    if (!number) {
      if (value.moiResult || loading) return;
      // Deliberately blurred (2026-09-28 demo direction, gated by
      // autoDetectIdType below) - the reader captured something, but not
      // legibly enough to OCR. Not run through readDocumentFromScan at all:
      // this is not "no match found" (which counts toward the fallback
      // threshold below), it is "nothing was even attempted yet" - the agent
      // has to Retake, which arrives clear and re-runs this effect.
      if (value.qidScans?.clear === false && !verifyThenFetch) return;
      const typeAtStart = chosenType;
      // Uploaded, or the barcode passes: no number is read off the card - the agent types the expiry, and a barcode scan supplies the number.
      if (captureMode === 'upload' || captureMode === 'barcode') return;
      void readDocumentFromScan().then((scanned) => {
        const now = latest.current;
        // The agent switched type while the read was in flight: that read belongs to the document they walked away from.
        if (typeAtStart && (now.idType ?? 'QID') !== typeAtStart) return;
        // The scan this number was read off must still be the one on screen,
        // and nothing must have supplied a number meanwhile.
        const stillComplete = Boolean(now.qidScans?.frontScanned && now.qidScans?.backScanned);
        if (!scanned) {
          // The reader captured something it could not identify. That is an
          // unsuccessful attempt; once none remain, hand over to manual entry.
          if (scanAttempts >= maxScanAttempts) {
            setFallbackUnlocked(true);
            setScanBudgetSpent(true);
          }
          return;
        }
        if (!stillComplete || now.idNumber) return;
        // Records the DETECTED type alongside the number, so everything
        // downstream - the field label, the MOI lookup, the eligibility ID-type
        // check - keys off what was actually in the reader rather than off the
        // 'QID' default this step starts on.
        onChange({
          ...now,
          // The selected type stands; only the scan-first flow takes the type from the document.
          idType: typeAtStart ?? scanned.documentType,
          idNumber: scanned.documentNumber,
          // A clear read gets both right. Retake 2 reads the number only: the agent types the expiry.
          scannedExpiry: verifyThenFetch && captureMode === 'ocr-auto' && scanned.expiryDate ? isoToDmy(scanned.expiryDate) : undefined,
        });
      });
      return;
    }
    if (value.moiResult || loading) return;
    // verifyThenFetch: the agent types the expiry and presses Fetch - except for a clear read (first scan, Retake 1), which calls MOI itself.
    if (verifyThenFetch && captureMode !== 'ocr-auto') return;
    if (autoFetchedNumber.current === number) return;
    autoFetchedNumber.current = number;
    void runMoiValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idType, effectiveScannable, scanComplete, value.idNumber, value.moiResult, loading, value.qidScans?.clear]);

  // No registry knows this ID: for the ID types a customer can be created for, and a journey that is not bound to a customer, the agent may create one.
  const canCreateCustomer = notFound && allowNewCustomer && !explicitCustomerId && NEW_CUSTOMER_ID_TYPES.includes(idType);
  // Creating a customer the registries do not know: first make sure the typed person is not already a customer (same name, date of birth and
  // nationality, or the same Passport) - a duplicate is refused, with the existing customer named, rather than created.
  const createNewCustomer = async (moi: NewCustomerMoi) => {
    setLinkProblem(undefined);
    const [docs, customers] = await Promise.all([
      mockDataEngine.list<{ customerId: string; documentType: string; documentNumber: string; expiryDate?: string }>('identity-documents'),
      mockDataEngine.list<{ customerId: string; name: string; dob: string; nationality: string; segment?: string }>('customers'),
    ]);
    // A protected-segment match is refused without naming the customer, ID or QID to a role that may not see them.
    const personaId = usePersonaStore.getState().activePersonaId;
    const found = resolveExistingCustomer({ name: moi.name, dob: moi.dob, nationality: moi.nationality }, docs, customers, undefined, (c) => canViewCustomerSegment(personaId, c.segment));
    const matched = found.kind === 'linked' ? customers.find((c) => c.customerId === found.customerId) : undefined;
    const problem = duplicateCustomerMessage(found, !matched || canViewCustomerSegment(personaId, matched.segment));
    if (problem) {
      setLinkProblem(problem);
      return;
    }
    setNotFound(false);
    onChange({ ...latest.current, ...buildNewCustomerPatch(moi) });
  };

  const handleKeyDown = useEnterToSubmit(Boolean(value.idNumber) && !loading, runMoiValidation);

  return {
    loading,
    notFound,
    setNotFound,
    accessRestricted,
    linkProblem,
    reconciliation,
    clearReconciliation: () => setReconciliation(undefined),
    numberInputRef,
    latest,
    idType,
    typeChosen,
    demoType,
    effectiveScannable,
    handleIdTypeChange,
    contextIdentity,
    contextNoDocument,
    ownerMismatch,
    contextHeldTypes,
    captureMode,
    canCreateCustomer,
    createNewCustomer,
    failure,
    retrying,
    duplicates,
    expiredNotice,
    runMoiValidation,
    scanComplete,
    scanAttempts,
    fallbackUnlocked,
    scanBudgetSpent,
    manualEntryUnlocked,
    handleScanAttempt,
    handleDemoScan,
    handleBarcodeScan,
    handleKeyDown,
  };
}
