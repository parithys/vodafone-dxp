// Placeholder password policy - the Agent 360 BRSD leaves the real policy as
// an open item (OI-AGN-04, "provide detailed password policy") and every
// password-related data field's Length is "TBD" in Annex_01. Shared between
// the Forgot Password flow and Change Password so both enforce the same
// rule rather than drifting; swap this one function for the real policy
// once VFQ Security confirms it.
export function passwordPolicyError(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password)) return 'Password must include at least one letter.';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
  return null;
}
