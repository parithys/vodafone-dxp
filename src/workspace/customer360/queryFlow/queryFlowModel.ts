import { useEffect, useState } from 'react';
import { loadConfigFile } from '../../../engines/configEngine';
import type { CustomerService } from '../../../engines/customerServicesEngine';

export interface QueryIssue {
  id: string;
  name: string;
  /** Absent until the issue-to-category mapping is supplied. */
  category?: string;
  /** The issue's default Query Service Type - decides Complaints vs Requests. Absent = Complaints. */
  serviceType?: string;
  /** The matching real Siebel VFQA_TT_ACTUAL_ISSUE value, where one exists. */
  ticketActualIssue?: string;
  /** Ticket classification from the categorization workbook. */
  summary?: string;
  subSummary?: string;
  area?: string;
  subArea?: string;
  routing?: 'onshore-offshore' | 'collections' | 'number-management' | 'outlet';
  /** Primary severity from the workbook (BAU, Critical, Minor, Network, Non-Critical). */
  severity?: string;
  severityComment?: string;
  keywords?: string[];
}

/** Which Details fields the Preview shows for one Query Category + Query Service Type, in order. */
export interface PreviewColumn {
  category: string;
  serviceType: string;
  fields: string[];
}

export interface QueryIssueCatalogue {
  examples: string[];
  issues: QueryIssue[];
  preview: PreviewColumn[];
}

/** The six choices offered when no MSISDN is selected. */
export const QUERY_SERVICE_TYPES = [
  'Mobile Complaints',
  'Fixed/5G Complaints',
  'Mobile/Fixed/5G Complaints',
  'Mobile Requests',
  'Fixed/5G Requests',
  'Any',
] as const;

let loaded: Promise<QueryIssueCatalogue | undefined> | undefined;
export function useQueryIssueCatalogue(): QueryIssueCatalogue | undefined {
  const [cat, setCat] = useState<QueryIssueCatalogue | undefined>();
  useEffect(() => {
    loaded ??= loadConfigFile<QueryIssueCatalogue>('query-issues.json').catch(() => undefined);
    let cancelled = false;
    void loaded.then((c) => !cancelled && setCat(c));
    return () => {
      cancelled = true;
    };
  }, []);
  return cat;
}

/** The agent's input as keywords: split on whitespace (and '+' / ','), extra spaces and edges ignored, case-insensitive. */
export const queryKeywords = (term: string): string[] =>
  // '+' and ',' separate keywords like a space does; a token with no letter or digit (a stray '+', '-', '&') is dropped.
  term.toLowerCase().split(/[\s+,]+/).filter((k) => /[a-z0-9]/.test(k));

/** Start index of every word in the text (a word starts after any non-alphanumeric character). */
const wordStarts = (lower: string): number[] => {
  const out: number[] = [];
  for (let i = 0; i < lower.length; i++) if (/[a-z0-9]/.test(lower[i]) && (i === 0 || !/[a-z0-9]/.test(lower[i - 1]))) out.push(i);
  return out;
};

/**
 * Character ranges of `text` matched by the keywords, or undefined when any keyword is missing. A keyword matches the
 * beginning of a word ("incorr" matches "Incorrect"); each keyword may sit anywhere and in any order.
 */
export function matchRanges(text: string, keywords: string[]): [number, number][] | undefined {
  if (keywords.length === 0) return undefined;
  const lower = text.toLowerCase();
  const starts = wordStarts(lower);
  const ranges: [number, number][] = [];
  for (const k of keywords) {
    const at = starts.find((i) => lower.startsWith(k, i));
    if (at === undefined) return undefined;
    ranges.push([at, at + k.length]);
  }
  // Merge overlaps so every character is marked once.
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  return merged;
}

/** Query Issues whose name contains every keyword (see matchRanges). */
export const searchQueryIssues = (issues: QueryIssue[], term: string): QueryIssue[] => {
  const keywords = queryKeywords(term);
  return keywords.length === 0 ? [] : issues.filter((i) => matchRanges(i.name, keywords));
};

/**
 * Query Service Type from a selected MSISDN: the line decides Mobile vs Fixed/5G, the issue's own default service type
 * decides Complaints vs Requests. Undefined when the line is neither (nothing to derive from).
 */
export function deriveQueryServiceType(issue: QueryIssue, service: CustomerService | undefined): string | undefined {
  if (!service) return undefined;
  const line = service.tab === 'mobile' ? 'Mobile' : service.tab === 'fibre' ? 'Fixed/5G' : undefined;
  if (!line) return undefined;
  return `${line} ${/request/i.test(issue.serviceType ?? '') ? 'Requests' : 'Complaints'}`;
}

/**
 * The Details fields for a category + service type. Exact match first; then the category's "Any" column; then a
 * column of the same category on the same line (Mobile / Fixed); then the category's first column.
 */
export function previewFieldsFor(catalogue: QueryIssueCatalogue, category: string | undefined, serviceType: string): string[] {
  const cols = catalogue.preview.filter((c) => c.category === category);
  if (cols.length === 0) return ['Account Number', 'MSISDN', 'Plan Name'];
  const line = /fixed/i.test(serviceType) ? /fixed/i : /mobile/i;
  const hit = cols.find((c) => c.serviceType === serviceType) ?? cols.find((c) => c.serviceType === 'Any') ?? cols.find((c) => line.test(c.serviceType)) ?? cols[0];
  return hit.fields;
}

export interface TicketRouting {
  /** The queue to pre-select; absent when the workbook leaves the choice to the team / outlet. */
  queue?: string;
  /** Why, in the agent's words. */
  basis: string;
}

const ONSHORE_SEGMENT = /vvip|vip|black|public|government|large/i;

/**
 * Queue routing from the categorization workbook. Collections and Number Management issues go to their own queues.
 * "Onshore / Offshore" issues follow the workbook's rule: Qatari, Arabic-speaking, and VVIP / VIP / Black / Public /
 * Government / Large customers are ONSHORE; expat, non-Arabic and SME / SOHO / other customers are OFFSHORE. The
 * workbook lists both sets without saying which wins when they overlap, so a priority segment is checked first, then
 * Qatari or Arabic (onshore), else offshore. Issues routed "based on outlet ID/team" have no queue to derive.
 */
export function routeTicket(issue: QueryIssue, customer: { segment?: string; nationality?: string } | undefined, language: string | undefined): TicketRouting | undefined {
  switch (issue.routing) {
    case 'collections':
      return { queue: 'Collections Queue', basis: 'Collections issues are routed to the Collections Queue.' };
    case 'number-management':
      return { queue: 'Number Management Queue', basis: 'Number requests are routed to the Number Management Queue.' };
    case 'outlet':
      return { basis: 'This issue is routed by the outlet ID / team - choose the queue.' };
    case 'onshore-offshore': {
      const segment = customer?.segment ?? '';
      const onshore = ONSHORE_SEGMENT.test(segment) || customer?.nationality === 'Qatari' || /arabic/i.test(language ?? '');
      const why = ONSHORE_SEGMENT.test(segment) ? `${segment} segment` : customer?.nationality === 'Qatari' ? 'Qatari customer' : /arabic/i.test(language ?? '') ? 'Arabic-speaking customer' : 'expat / non-Arabic customer';
      return { queue: onshore ? 'Onshore Queue' : 'Offshore Queue', basis: `${onshore ? 'Onshore' : 'Offshore'} routing: ${why}.` };
    }
    default:
      return undefined;
  }
}

/** How a service type reads on a tag: the workbook's "Any" is shown as "Others". */
export const serviceTypeLabel = (t: string): string => (t === 'Any' ? 'Others' : t);
