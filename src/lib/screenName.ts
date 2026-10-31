// The catalogue's screenName is requirement-document text ("Bulk Adjustment Portal (DXP, Target State)", "Siebel Excel
// Export (Uncontrolled)"). Agents should read what the screen is, not which system or project phase it came from, so
// every surface that names a screen - breadcrumb, search result, module list, page title - goes through this one function
// and cannot disagree. The catalogue itself is left as evidence.

// A bracketed remark is dropped when it speaks about the project or the legacy tooling rather than the screen:
// phase ("Target State"), vendor/tool names, or an editorial note. Brackets that expand an abbreviation, "(SOA)" or
// "(Customer Application Form)", stay.
const INTERNAL_REMARK = /target state|current state|\bdxp\b|siebel|excel|powerapps|grafana|macro|uncontrolled|external|\bagent\b|public notes|bell icon|single-scroll|prototype|test\b/i;
const LEGACY_PREFIX = /^(?:DXP|Siebel|PowerApps)\s+/;

export function screenDisplayName(screenName: string): string {
  const cleaned = screenName
    .replace(/\s*\(([^()]*)\)/g, (whole, inner: string) => (INTERNAL_REMARK.test(inner) ? '' : whole))
    .replace(LEGACY_PREFIX, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return cleaned || screenName;
}
