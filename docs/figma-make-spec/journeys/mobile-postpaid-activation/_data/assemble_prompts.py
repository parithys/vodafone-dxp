#!/usr/bin/env python3
"""Phase 17 - assemble figma-make-prompts.md from the same verified _data/*.md
sources used for the .docx. Derived only from the verified document; invents
no content. Run from this _data directory."""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
JOURNEY_DIR = os.path.dirname(HERE)
OUT_PATH = os.path.join(JOURNEY_DIR, 'figma-make-prompts.md')

def read(name):
    with open(os.path.join(HERE, name), 'r') as f:
        return f.read()

def word_count(text):
    return len(re.findall(r'\S+', text))

def strip_h1(md):
    lines = md.split('\n')
    if lines and lines[0].startswith('# '):
        return '\n'.join(lines[1:]).strip()
    return md.strip()

def extract_section(md, heading_substr, own_level=None):
    """Return the markdown slice starting at a heading containing
    heading_substr, up to the next heading of the same or lower level number."""
    lines = md.split('\n')
    start = None
    level = None
    for i, line in enumerate(lines):
        m = re.match(r'^(#+)\s+(.*)$', line.strip())
        if m and heading_substr.lower() in m.group(2).lower():
            start = i
            level = len(m.group(1))
            break
    if start is None:
        return ''
    end = len(lines)
    for i in range(start + 1, len(lines)):
        m = re.match(r'^(#+)\s+(.*)$', lines[i].strip())
        if m and len(m.group(1)) <= level:
            end = i
            break
    return '\n'.join(lines[start:end]).strip()

SCREEN_FILES = [
    'screen-01-contact.md', 'screen-02-address.md', 'screen-03-billing-profile.md',
    'screen-04-plan-addons.md', 'screen-05-number-selection.md', 'screen-06-sim-type.md',
    'screen-07-checkout.md', 'screen-08-caf-signature.md', 'screen-09-payment.md',
    'screen-10-confirmation.md', 'screen-11-abandon-modal.md', 'screen-12-eligibility-drawer.md',
    'screen-13-billing-setup-drawer.md', 'screen-14-signature-pad-drawer.md',
    'screen-15-plan-details-drawer.md',
]

out = []
out.append('# Mobile Postpaid Activation — Figma Make Prompt Pack\n')
out.append('Derived only from the verified specification (`Mobile_Postpaid_Activation_Complete_Functional_UX_Specification.docx`) and its `_data/*.md` sources. Paste order: Prompt 0, Prompt 1, then Prompts 2 through 16 in the order listed, then the Scenario prompts, then the Final prompt.\n')

# ---------------- Prompt 0 ----------------
out.append('## Prompt 0 — Apply the design system')
out.append('''
Apply this Figma Make file's own design system tokens (color, type, spacing, radii) to everything built from these prompts. Do not introduce one-off colors, spacing, or type sizes — every element below is described by semantic role and behavior, never by a current color/pixel value, so that it maps cleanly onto whatever component set this file already has.

Before building any screen, map each semantic role below to this file's own equivalent component. If an exact equivalent does not exist, build it as a reusable component in this file's own component library — not as a one-off inside a single screen.

**Semantic component role list** (map each to this file's own design system):

| Semantic role | Behavior |
|---|---|
| Primary action button | Solid/filled, one per view, advances the flow |
| Secondary / ghost action | Outlined or text-only, secondary weight |
| Destructive / abandon action | Text-only, muted by default, warns on hover; triggers a confirmation before acting |
| Text field (single line) | Label above, helper/error text below, error state = distinct border color + inline message |
| Read-only / registry-sourced field | Visually distinct from an editable field (e.g. recessed fill), removed from the keyboard tab order, but still announced by assistive tech |
| Disabled field/button | Lower-contrast, not focusable, not announced as an actionable control |
| Select / dropdown | Combobox pattern: closed value display, opens a listbox on activation |
| Selectable radio card | A card-shaped radio option; selected state shows a distinct border/fill |
| Checkbox (optional flag) | Never gates a primary action's enabled state in this journey |
| Status chip / badge | Small pill, color-coded by semantic status (success/danger/warning/info/neutral) |
| Stepper / step rail | Numbered vertical list of steps; current step highlighted, completed steps checked, unreached steps unclickable |
| Modal (short confirmation) | Centered overlay, dismissible via backdrop click and Escape |
| Drawer (form / multi-field panel) | Side-anchored panel, dismissible via backdrop click and Escape |
| Toast / transient notification | Auto-dismissing, positioned consistently, distinguishes error from success/info by both color and (for screen readers) an alert vs. status role |
| Error banner (persistent) | Stays visible until the underlying error is resolved, not auto-dismissed |
| Tabs | Horizontal or vertical, one active tab at a time |
| Data table with sorting | Header row, click-to-sort columns, row click/link to detail |
| Signature capture | A draw surface plus Clear/Done actions |
| File/image upload | A trigger control plus inline validation messaging (size/type) |
| Tooltip | Hover/focus-triggered contextual text |
| Loading indicator | A spinner or equivalent, shown only while an async mock call is pending |

Nothing above should be built as a new one-off widget if this file's design system already has an equivalent — reuse it.
''')

# ---------------- Prompt 1 ----------------
shell = strip_h1(read('00-wizard-shell.md'))
nav = strip_h1(read('phase7-navigation.md'))
out.append('## Prompt 1 — Journey shell')
out.append('''
Build the shell every one of this journey's 9 steps renders inside. This is shared chrome, not any one screen's content.
''')
out.append(shell)
out.append('### Save & Exit, Resume, session behavior (for the shell)')
out.append(nav)
out.append('''
### Scenario switcher (for this Figma Make build only — not part of the production behavior)
Since there is no live backend, add a lightweight, clearly-labeled dev-only control (e.g. a small panel or menu, visually distinct from the product UI) that lets a reviewer jump straight to a given mock customer/scenario without re-driving the whole Contact step by hand each time. At minimum it should let the reviewer pick: the happy-path customer, a customer that produces the malformed-email/phone validation state, and the Abandon-modal trigger — the three states actually verified in Phase 13 (see the specification's Section 10). Do not present this switcher as if it were part of the real agent-facing product.
''')

# ---------------- Prompts 2-16: per screen ----------------
prompt_num = 2
screen_prompt_number = {}
for fname in SCREEN_FILES:
    screen_prompt_number[fname] = prompt_num
    raw = read(fname)
    lines = raw.split('\n')
    title = lines[0].lstrip('#').strip() if lines[0].startswith('#') else fname
    body = strip_h1(raw)
    wc = word_count(body)
    out.append(f'## Prompt {prompt_num} — {title}')
    if wc <= 1300:
        out.append(body)
    else:
        # split roughly in half at a heading boundary
        headings = [i for i, l in enumerate(lines) if l.strip().startswith('## ')]
        mid_idx = headings[len(headings)//2] if headings else len(lines)//2
        part_a = '\n'.join(lines[1:mid_idx]).strip()
        part_b = '\n'.join(lines[mid_idx:]).strip()
        out.append(part_a)
        out.append(f'## Prompt {prompt_num}b — {title} (continued)')
        out.append(part_b)
    prompt_num += 1

# ---------------- Scenario prompts ----------------
scenarios_full = strip_h1(read('phase8-scenarios.md'))
out.append(f'## Prompt {prompt_num} — Scenario wiring: alternative and failure paths')
out.append('''
The screens above describe each step's own default/happy behavior. Wire the following alternative, edge-case and failure paths to the same screens using the scenario switcher from Prompt 1 (or the equivalent mock-data condition), rather than building them as separate screens. Every scenario ID below cites its screen(s) and the exact trigger condition already specified in those screens' prompts — do not invent trigger conditions beyond what is stated.
''')
out.append(scenarios_full)
prompt_num += 1

# ---------------- Final prompt ----------------
final_prompt_body = '''
Wire the full journey together:

1. **Navigation.** Back moves to the previous reached step (never past a locked step — see the CAF & Signature prompt's `locksAfter` behavior). Continue is disabled until the current step's own validity condition (stated in that step's prompt) is met, and advances to the next step, or submits on the last step (Payment).
2. **Save & Exit / Resume.** Wire per Prompt 1's navigation section: Save & Exit persists the current step and all entered values and exits; a resumed session restores both.
3. **Abandon.** Available on every step up to (not including) Payment. Confirms via the Abandon modal (Prompt {abandon_num}) before discarding all entered values.
4. **Modals and drawers.** Abandon confirmation (Prompt {abandon_num}), Eligibility checks (Prompt {elig_num}), Billing Profile setup (Prompt {billing_setup_num}), Signature pad (Prompt {sigpad_num}), and Plan details (Prompt {plandetails_num}) all overlay the current step without navigating away from it, and all dismiss via backdrop click and Escape.
5. **Toasts.** Any success/error toast named in a screen's own prompt uses the toast component from Prompt 0's role list, positioned consistently across every step.
6. **Customer-facing mode.** On the CAF & Signature step specifically, while awaiting signature, hide the step rail and all agent-only chrome (Save & Exit, Abandon, Back/Continue) per that step's own prompt — render only that step's own content.

**Verification checklist** (cross-check against Appendix I of the specification document):

- [ ] Every business rule and validation named in each screen's prompt is enforced exactly as stated (no simplification, no invented default).
- [ ] Every conditional-display rule fires on the exact condition stated, not on an approximation of it.
- [ ] Auto-populated vs. editable vs. locked fields are visually distinguishable, matching the distinction each screen's prompt makes.
- [ ] The step rail correctly marks completed / current / unreached / locked steps.
- [ ] Save & Exit and Abandon behave per Prompt 1 and this prompt's item 2-3.
- [ ] Every scenario in the Scenario wiring prompt reproduces the exact screen state its trigger condition describes.
- [ ] No screen exposes a color, spacing, or type value outside this file's own design system tokens.
- [ ] The dev-only scenario switcher (Prompt 1) is visually distinct from the product UI and does not appear in any exported/handed-off view of the product screens themselves.
'''.format(
    abandon_num=screen_prompt_number['screen-11-abandon-modal.md'],
    elig_num=screen_prompt_number['screen-12-eligibility-drawer.md'],
    billing_setup_num=screen_prompt_number['screen-13-billing-setup-drawer.md'],
    sigpad_num=screen_prompt_number['screen-14-signature-pad-drawer.md'],
    plandetails_num=screen_prompt_number['screen-15-plan-details-drawer.md'],
)
out.append(f'## Prompt {prompt_num} — Final: end-to-end wiring and verification checklist')
out.append(final_prompt_body)

with open(OUT_PATH, 'w') as f:
    f.write('\n\n'.join(out) + '\n')

print(f'Wrote {OUT_PATH}')
print(f'Total prompts: 0, 1, 2-16 (screens), {prompt_num-1} (scenarios), {prompt_num} (final)')
