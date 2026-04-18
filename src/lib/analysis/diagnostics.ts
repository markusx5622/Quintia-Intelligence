import type { DiagnosticsOutput, DiagnosticIssue, OntologyOutput } from '../types/contracts';

// ---------------------------------------------------------------------------
// Diagnostic rules — keyword → issue mapping
// ---------------------------------------------------------------------------

interface DiagnosticRule {
  keywords: string[];
  title: string;
  baseSeverity: DiagnosticIssue['severity'];
  /** Template with {matches} placeholder replaced by actual matched keywords */
  evidenceTemplate: string;
}

const RULES: DiagnosticRule[] = [
  {
    keywords: ['manual', 'manually', 'by hand'],
    title: 'Manual processing detected',
    baseSeverity: 'medium',
    evidenceTemplate: 'The narrative references manual processing ({matches}), indicating error-prone and slow operations that are candidates for automation.',
  },
  {
    keywords: ['delay', 'delayed', 'slow', 'lag', 'waiting', 'causes delays'],
    title: 'Process delays identified',
    baseSeverity: 'high',
    evidenceTemplate: 'Delay indicators found ({matches}), suggesting throughput constraints that directly extend cycle times.',
  },
  {
    keywords: ['approval', 'approve', 'sign-off', 'authorization'],
    title: 'Approval bottleneck risk',
    baseSeverity: 'medium',
    evidenceTemplate: 'Approval steps ({matches}) create sequential gates that may cause queuing when approvers are unavailable.',
  },
  {
    keywords: ['escalation', 'escalate', 'escalated'],
    title: 'Escalation path complexity',
    baseSeverity: 'high',
    evidenceTemplate: 'Escalation references ({matches}) indicate multi-tier routing that adds latency and may signal unclear initial handling criteria.',
  },
  {
    keywords: ['rework', 'redo', 'correction', 'fix', 'error'],
    title: 'Rework and error loops',
    baseSeverity: 'high',
    evidenceTemplate: 'Rework indicators ({matches}) suggest quality defects in earlier stages that cascade into repeated effort downstream.',
  },
  {
    keywords: ['backlog', 'queue', 'pile', 'accumulate'],
    title: 'Work backlog accumulation',
    baseSeverity: 'critical',
    evidenceTemplate: 'Backlog references ({matches}) indicate sustained demand/capacity mismatch requiring workload redistribution.',
  },
  {
    keywords: ['handoff', 'hand-off', 'transfer', 'forward'],
    title: 'Excessive handoffs',
    baseSeverity: 'medium',
    evidenceTemplate: 'Handoff references ({matches}) indicate information passes between teams, increasing cycle time and risk of context loss.',
  },
  {
    keywords: ['duplicate', 'duplicated', 'redundant', 'twice', 'again', 'duplicated work'],
    title: 'Duplicate effort detected',
    baseSeverity: 'medium',
    evidenceTemplate: 'Duplication indicators ({matches}) point to repeated activities across teams, wasting effort and suggesting process fragmentation.',
  },
  {
    keywords: ['email', 'spreadsheet', 'excel', 'paper', 'shared inbox'],
    title: 'Informal tooling reliance',
    baseSeverity: 'low',
    evidenceTemplate: 'Informal tools ({matches}) are used for process coordination, lacking audit trails and structured workflow enforcement.',
  },
  {
    keywords: ['overdue', 'missed deadline', 'sla', 'breach', 'missed sla'],
    title: 'SLA / deadline risk',
    baseSeverity: 'critical',
    evidenceTemplate: 'SLA/deadline concerns ({matches}) indicate chronic timing failures that expose the organization to service-level penalties.',
  },
  {
    keywords: ['exception', 'special case', 'workaround'],
    title: 'Exception handling overhead',
    baseSeverity: 'medium',
    evidenceTemplate: 'Exception indicators ({matches}) suggest the standard process does not cover real operational scenarios.',
  },
  {
    keywords: ['no visibility', 'unclear', 'unknown status', 'lack of tracking', 'unclear ownership', 'incomplete'],
    title: 'Lack of process visibility and ownership',
    baseSeverity: 'high',
    evidenceTemplate: 'Visibility gaps ({matches}) prevent stakeholders from tracking work status, leading to reactive management and ownership ambiguity.',
  },
  {
    keywords: ['unclear ownership', 'no owner', 'ownership after'],
    title: 'Ownership ambiguity after handoff',
    baseSeverity: 'high',
    evidenceTemplate: 'Ownership concerns ({matches}) indicate that responsibility is not clearly assigned after key transitions, causing work to stall or be duplicated.',
  },
];

// ---------------------------------------------------------------------------
// Severity escalation based on frequency
// ---------------------------------------------------------------------------

function escalateSeverity(
  base: DiagnosticIssue['severity'],
  matchCount: number,
): DiagnosticIssue['severity'] {
  if (matchCount >= 4) return 'critical';
  if (matchCount >= 2 && (base === 'low' || base === 'medium')) return 'high';
  return base;
}

// ---------------------------------------------------------------------------
// Evidence generation from matched keywords
// ---------------------------------------------------------------------------

function buildEvidence(template: string, matchedKeywords: string[]): string {
  const uniqueMatches = Array.from(new Set(matchedKeywords));
  const matchText = uniqueMatches.map((kw) => `"${kw}"`).join(', ');
  return template.replace('{matches}', matchText);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function runDiagnostics(
  narrative: string,
  ontology: OntologyOutput,
): DiagnosticsOutput {
  const lower = narrative.toLowerCase();
  const issues: DiagnosticIssue[] = [];
  const seenTitles = new Set<string>();

  for (const rule of RULES) {
    const matched: string[] = [];
    let matchCount = 0;

    for (const kw of rule.keywords) {
      const kwLower = kw.toLowerCase();
      const occurrences = lower.split(kwLower).length - 1;
      if (occurrences > 0) {
        matchCount += occurrences;
        matched.push(kw);
      }
    }

    if (matchCount > 0 && !seenTitles.has(rule.title)) {
      seenTitles.add(rule.title);
      issues.push({
        title: rule.title,
        severity: escalateSeverity(rule.baseSeverity, matchCount),
        evidence: buildEvidence(rule.evidenceTemplate, matched),
      });
    }
  }

  // Boost severity if bottleneck candidates were found in ontology
  if (ontology.bottleneck_candidates.length > 3) {
    for (const issue of issues) {
      if (issue.severity === 'low') issue.severity = 'medium';
    }
  }

  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const issue of issues) {
    counts[issue.severity]++;
  }

  const summary =
    issues.length > 0
      ? `Identified ${issues.length} diagnostic issue(s): ${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low.`
      : 'No significant issues detected in the process narrative.';

  return { issues, summary };
}
