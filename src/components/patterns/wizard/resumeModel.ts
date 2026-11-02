/**
 * A resumed draft opens on ID verification and must pass it again: what the earlier verification produced (the registry result, the scans and
 * their comparison) is dropped, the ID type and number stay to start from. Everything else the agent entered is kept for after the check.
 */
export function withoutIdVerification(values: Record<string, unknown>): Record<string, unknown> {
  const contact = values.contact as Record<string, unknown> | undefined;
  if (!contact) return values;
  const { moiResult: _moi, idReconciliation: _recon, qidScans: _scans, scannedExpiry: _expiry, ...kept } = contact;
  return { ...values, contact: kept };
}
