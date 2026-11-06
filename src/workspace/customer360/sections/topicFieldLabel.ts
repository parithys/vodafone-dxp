/** The requirement text behind a field is the lookup key; what the agent reads is its name without the long
 * explanatory remark in brackets (kept when the bracket is a short qualifier such as "(Y/N)"). */
export function fieldLabel(details: string): string {
  const open = details.indexOf(' (');
  if (open < 0) return details;
  const tail = details.slice(open);
  return tail.length > 32 || /\b(should|including|based on|It )\b/i.test(tail) ? details.slice(0, open) : details;
}
