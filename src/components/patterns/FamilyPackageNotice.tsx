import { useEffect } from 'react';
import type { FamilyStartCheck } from '../../engines/familyPackage';

/**
 * What a selected Family Plan, or a chosen connection type, means for the order, on the plan page: the order starts a Family Package as its Primary Line 1 on
 * that plan, or joins the customer's package as the line named and takes the package's plan, or it cannot (the reason is the engine's own). Nothing is shown
 * for a plan that is not a Family Plan.
 */
export function FamilyPackageNotice({ check, planName }: { check: FamilyStartCheck; planName: string | undefined }) {
  if (!check.applies) return null;
  const plan = planName ?? 'the package plan';
  return check.ok ? (
    <p role="status" className="notice-neutral pad-row mb-6">
      {check.additional
        ? check.additional.role === 'Secondary'
          ? `This connection is ${check.lineLabel} of the customer's Family Package. Choose its Secondary plan.`
          : `This connection is ${check.lineLabel} of the customer's Family Package, on ${plan}.`
        : `This connection is ${check.lineLabel} of a new Family Package. ${planName ? `${planName} is` : 'The selected plan is'} the plan of the whole package.`}
    </p>
  ) : (
    <p role="alert" className="notice-danger pad-row mb-6">
      {check.reason}
    </p>
  );
}

/**
 * Invisible: puts the plan a line added to a package must be on into the order (Second Primary: the package's; Supplementary: the Supplementary plan), so
 * it is never chosen again. A Secondary line's plan is the agent's choice, so only a plan that is not one of the Secondary plans is taken out. Renders nothing.
 */
export function FamilyPlanApplier({ check, productId, setValue }: { check: FamilyStartCheck; productId: string | undefined; setValue: (field: string, value: unknown) => void }) {
  const additional = check.applies && check.ok && check.additional;
  const planId = check.applies && check.ok ? check.planId : undefined;
  useEffect(() => {
    if (!additional) return;
    if (planId && productId !== planId) setValue('productId', planId);
    if (!planId && productId) setValue('productId', undefined);
  }, [additional, planId, productId, setValue]);
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
