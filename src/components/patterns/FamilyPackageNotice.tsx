import { useEffect } from 'react';
import type { FamilyStartCheck } from '../../engines/familyPackage';

/**
 * What a selected Family Plan, or a chosen connection type, means for the order, on the plan page: the order starts a Family Package as its Primary Line 1 on
 * that plan (nothing is said: the activation just goes on), or joins the customer's package as the line named and takes the package's plan, or it cannot
 * (the reason is the engine's own). Nothing is shown for a plan that is not a Family Plan.
 */
export function FamilyPackageNotice({ check, planName }: { check: FamilyStartCheck; planName: string | undefined }) {
  if (!check.applies) return null;
  // A customer with no Family Package who has cleared eligibility starts a new one with nothing said: no notice, the activation simply goes on.
  if (check.ok && !check.additional) return null;
  // "This customer already has a Family Package" is said by the plan page's FamilyPackageActiveGate, once its dialog is closed, and nowhere else.
  if (!check.ok && check.kind === 'package') return null;
  // An additional connection still to be given a plan: the plan picker under the heading is the prompt.
  if (check.ok && check.additional?.pending) return null;
  const plan = planName ?? 'the package plan';
  return check.ok ? (
    <p role="status" className="notice-neutral pad-row mb-6">
      This connection is {check.lineLabel} of the customer&apos;s Family Package, on {plan}.
    </p>
  ) : (
    <p role="alert" className="notice-danger pad-row mb-6">
      {check.reason}
    </p>
  );
}

/**
 * Invisible: puts the plan a line added to a package must be on into the order (Primary Line 2: the package's), so it is never chosen again. An additional line's plan is the
 * agent's selection: one that is not (or is no longer) eligible is taken out, so a stale choice cannot be carried forward. Renders nothing.
 */
export function FamilyPlanApplier({ check, productId, additionalContext = false, setValue }: { check: FamilyStartCheck; productId: string | undefined; /** The journey adds a connection to an existing package (not a new one). */ additionalContext?: boolean; setValue: (field: string, value: unknown) => void }) {
  const additional = check.applies && check.ok && check.additional;
  const planId = check.applies && check.ok ? check.planId : undefined;
  // A selection the package no longer accepts (its entitlement ran out, or the package changed) is refused by the check; it is taken out rather than carried forward.
  const refused = additionalContext && check.applies && !check.ok;
  useEffect(() => {
    if (refused && productId) {
      setValue('productId', undefined);
      return;
    }
    if (!additional) return;
    if (planId && productId !== planId) setValue('productId', planId);
    if (!planId && productId) setValue('productId', undefined);
  }, [additional, refused, planId, productId, setValue]);
  return null;
}

/**
 * Invisible: a line added to a Family Package is billed under the package's one billing account, so that account is the selection and stays it (the automatic
 * account resolution that runs beside it cannot replace it). Renders nothing; does nothing when the package's account is not known.
 */
export function FamilyBillingApplier({ target, selectedProfileId, resolvedFor, setValue }: { target: string | undefined; selectedProfileId: string | undefined; resolvedFor: string | undefined; setValue: (field: string, value: unknown) => void }) {
  useEffect(() => {
    if (target && selectedProfileId !== target) setValue('billingAccount', { selectedProfileId: target, autoResolvedFor: resolvedFor });
  }, [target, selectedProfileId, resolvedFor, setValue]);
  return null;
}
