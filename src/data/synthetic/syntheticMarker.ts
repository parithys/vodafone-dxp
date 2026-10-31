import { SHOW_DEMO_FLAG } from '../../lib/buildEnv';
// The one place that says "this is synthetic". Anything the app shows that is NOT customer data -
// demo values derived to fill a field the records have no data for, labelled simulators, sample ID
// cards, "Fetched from Siebel" notes - is marked with this, so it can be switched off everywhere by one flag
// (index.css `.demo-only`; it no longer changes the text colour).
//
//   SHOW_DEMO_CONTENT   master switch (false: marked content is hidden, demo values read "-")
//   Synthetic<T>        a value that carries `isSynthetic: true`
//   SyntheticValue      (SyntheticValue.tsx) renders a Synthetic value tagged with the demo-only marker
//   SYNTHETIC_CLASS     the class to put on any other synthetic element (simulators, previews)
// When adding demo-specific UI, use SYNTHETIC_CLASS (or SyntheticValue) - nothing else.

// On unless a build sets VITE_SHOW_DEMO=false (see .env.example) - the demo scanner simulators and sample cards
// stay for the prototype, and a production build can switch them off without a code change.
export const SHOW_DEMO_CONTENT = SHOW_DEMO_FLAG !== 'false';

export function applyDemoContentSetting() {
  document.documentElement.classList.toggle('hide-demo', !SHOW_DEMO_CONTENT);
}

/** The CSS class that lets `hide-demo` hide an element (see index.css). */
export const SYNTHETIC_CLASS = 'demo-only';

/** A value that is not customer data. `isSynthetic` marks it as demo data. */
export interface Synthetic<T> {
  value: T;
  isSynthetic: true;
}

export const synthetic = <T,>(value: T): Synthetic<T> => ({ value, isSynthetic: true });
