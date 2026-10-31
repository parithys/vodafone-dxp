import type { KeyboardEvent } from 'react';

// Attach the returned handler to a section's onKeyDown so pressing Enter in
// any of its fields triggers that section's primary action (Continue/Go/
// Search/Save/Login/Next) once its mandatory fields are satisfied - the same
// gate that already disables the primary button, passed in as `canSubmit`.
//
// Deliberately no-ops for:
// - `e.defaultPrevented` - a child already handled this Enter itself (e.g.
//   the custom Select listbox committing its highlighted option), so this
//   section's primary action must not also fire in the same keystroke.
// - `<textarea>` - real newlines, never a submit trigger.
// - `<button>` - already activates on Enter natively; re-routing that to a
//   different action would override whatever button the user is focused on.
export function useEnterToSubmit(canSubmit: boolean, submit: () => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' || e.defaultPrevented) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'TEXTAREA' || tag === 'BUTTON') return;
    if (!canSubmit) return;
    e.preventDefault();
    submit();
  };
}
