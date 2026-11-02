import { useEffect, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { Badge } from '../../../components/primitives/Badge';
import * as mockDataEngine from '../../../engines/mockDataEngine';
import { SearchField } from '../../../components/primitives/SearchField';

interface SmsTemplate {
  templateId: string;
  keyword: string;
  ttSource: string | null;
  ttCategory: string | null;
  ttArea: string | null;
  ttSubArea: string | null;
  bodyEn: string | null;
}

// Screen 10 (Customer Communication) - Screens 8-13/15 gap-fix pass. Only
// template search + send are built here, against the real (partial)
// Automatic SMS template set now in public/mock-data/sms-templates.json (10
// of the source's 12 rows - see that file's own _note). Deliberately NOT
// built, and not simulated with a placeholder either - genuinely absent:
// consent-gate, role-based template editing, and an "Interaction History"
// view. The Phase 1 build plan named all four as "fully specified"; none of
// the other three have any evidenced mechanic in this corpus to build
// against, so they stay a documented gap rather than an invented one.
//
// Real TT Category/Area/Sub Area values are shown as metadata only, not
// mapped onto this module's own 9-category ISSUE_TYPES taxonomy - research
// confirmed the two taxonomies don't line up (this sheet's real categories
// are e.g. "Fixed_QA"/"Requests"/"Account Management", not "Mobile
// Complaints"/"Disconnection" etc.), so no join is invented here.
export function TicketCommunicationTab({ ticketId, onSend }: { ticketId: string; onSend: (smsText: string) => Promise<unknown> }) {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SmsTemplate | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    mockDataEngine.list<SmsTemplate>('sms-templates').then(setTemplates);
  }, []);

  const q = search.trim().toLowerCase();
  const matches = q
    ? templates.filter((t) =>
        t.keyword.toLowerCase().includes(q) ||
        (t.ttCategory ?? '').toLowerCase().includes(q) ||
        (t.ttArea ?? '').toLowerCase().includes(q) ||
        (t.ttSubArea ?? '').toLowerCase().includes(q)
      )
    : templates;

  // Real merge-field syntax from the source workbook - [Service Request.SR
  // Number]/[Service Request.Serial Number], not a {customerName}-style
  // placeholder. This app's Ticket record has no MSISDN/serial field, so
  // customerId stands in for Serial Number - the closest identifier this
  // mock app actually has, not a sourced mapping.
  const resolveBody = (body: string | null) =>
    body?.replace(/\[Service Request\.SR Number\]/g, ticketId).replace(/\[Service Request\.Serial Number\]/g, ticketId);

  const send = async () => {
    if (!selected) return;
    const body = resolveBody(selected.bodyEn) ?? `(${selected.keyword} - no English body available in source)`;
    setSending(true);
    try {
      await onSend(body);
      setSelected(null);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fields md:grid-cols-2">
      <div>
        <SearchField
          aria-label="Search templates"
          placeholder="Search by keyword, category, area…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          wrapperClassName="mb-2"
        />
        <div className="space-y-1 max-h-72 overflow-y-auto">
          {matches.length === 0 && <p className="text-secondary">No matching templates.</p>}
          {matches.map((t) => (
            <button
              key={t.templateId}
              type="button"
              aria-pressed={selected?.templateId === t.templateId}
              onClick={() => setSelected(t)}
              className={`w-full text-left card-frame p-2 text-[length:var(--fs-body)] ${
                selected?.templateId === t.templateId ? 'border-[var(--field-card-selected)] bg-[var(--field-card-selected-bg)] shadow-[var(--shadow-selected-ring)]' : 'border-[var(--field-card-border)] bg-bg hover:bg-[var(--field-card-hover-bg)]'
              }`}
            >
              <div className="text-fg">{t.keyword}</div>
              <div className="flex gap-1 mt-1">
                {t.ttCategory && <Badge variant="filled-neutral">{t.ttCategory}</Badge>}
                {t.ttArea && <Badge variant="filled-neutral">{t.ttArea}</Badge>}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="card p-3">
        {!selected && <p className="text-secondary">Select a template to preview.</p>}
        {selected && (
          <div className="space-y-2">
            <div className="text-fg font-medium">{selected.keyword}</div>
            <p className="text-secondary">
              {resolveBody(selected.bodyEn) ?? <span className="italic text-muted">No English body populated in the source workbook for this template.</span>}
            </p>
            <Button variant="primary" onClick={send} disabled={sending || !selected.bodyEn}>
              {sending ? 'Sending…' : 'Send'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
