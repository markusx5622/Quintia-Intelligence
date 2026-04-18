import type { DiagnosticsOutput, DiagnosticIssue, OntologyOutput } from '../types/contracts';

// ---------------------------------------------------------------------------
// Diagnostic rules — keyword → issue mapping
// ---------------------------------------------------------------------------

interface DiagnosticRule {
  keywords: string[];
  title: string;
  baseSeverity: DiagnosticIssue['severity'];
  evidenceTemplate: string;
}

const RULES: DiagnosticRule[] = [
  {
    keywords: ['manual', 'manually', 'by hand'],
    title: 'Manual processing detected',
    baseSeverity: 'medium',
    evidenceTemplate: 'The narrative references manual processing, which is error-prone and slow.',
  },
  {
    keywords: ['delay', 'delayed', 'slow', 'lag', 'waiting'],
    title: 'Process delays identified',
    baseSeverity: 'high',
    evidenceTemplate: 'The narrative references delays or slow processing, indicating throughput issues.',
  },
  {
    keywords: ['approval', 'approve', 'sign-off', 'authorization'],
    title: 'Approval bottleneck risk',
    baseSeverity: 'medium',
    evidenceTemplate: 'Approval gates may cause queuing and throughput reduction.',
  },
  {
    keywords: ['escalation', 'escalate', 'escalated'],
    title: 'Escalation path complexity',
    baseSeverity: 'high',
    evidenceTemplate: 'Escalation paths add latency and may indicate unclear initial handling.',
  },
  {
    keywords: ['rework', 'redo', 'correction', 'fix', 'error'],
    title: 'Rework and error loops',
    baseSeverity: 'high',
    evidenceTemplate: 'Rework loops indicate quality issues in upstream stages.',
  },
  {
    keywords: ['backlog', 'queue', 'pile', 'accumulate'],
    title: 'Work backlog accumulation',
    baseSeverity: 'critical',
    evidenceTemplate: 'Backlogs indicate capacity/demand mismatch.',
  },
  {
    keywords: ['handoff', 'hand-off', 'transfer', 'forward'],
    title: 'Excessive handoffs',
    baseSeverity: 'medium',
    evidenceTemplate: 'Multiple handoffs increase cycle time and information loss risk.',
  },
  {
    keywords: ['duplicate', 'redundant', 'twice', 'again'],
    title: 'Duplicate effort detected',
    baseSeverity: 'medium',
    evidenceTemplate: 'Duplicate activities waste resources and suggest process fragmentation.',
  },
  {
    keywords: ['email', 'spreadsheet', 'excel', 'paper'],
    title: 'Informal tooling reliance',
    baseSeverity: 'low',
    evidenceTemplate: 'Reliance on email/spreadsheets indicates lack of structured workflow tooling.',
  },
  {
    keywords: ['overdue', 'missed deadline', 'sla', 'breach'],
    title: 'SLA / deadline risk',
    baseSeverity: 'critical',
    evidenceTemplate: 'References to overdue items or SLA breaches indicate chronic timing failures.',
  },
  {
    keywords: ['exception', 'special case', 'workaround'],
    title: 'Exception handling overhead',
    baseSeverity: 'medium',
    evidenceTemplate: 'Frequent exceptions suggest the standard process does not cover real needs.',
  },
  {
    keywords: ['no visibility', 'unclear', 'unknown status', 'lack of tracking'],
    title: 'Lack of process visibility',
    baseSeverity: 'high',
    evidenceTemplate: 'Inability to track work status leads to delays and duplicate effort.',
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
// Public API
// ---------------------------------------------------------------------------

export function runDiagnostics(
  narrative: string,
  ontology: OntologyOutput,
): DiagnosticsOutput {
  const lower = narrative.toLowerCase();
  const issues: DiagnosticIssue[] = [];

  for (const rule of RULES) {
    const matchCount = rule.keywords.reduce(
      (count, kw) => count + (lower.split(kw.toLowerCase()).length - 1),
      0,
    );

    if (matchCount > 0) {
      issues.push({
        title: rule.title,
        severity: escalateSeverity(rule.baseSeverity, matchCount),
        evidence: rule.evidenceTemplate,
      });
    }
  }

  // Boost severity if bottleneck candidates were found in ontology
  if (ontology.bottleneck_candidates.length > 3) {
    for (const issue of issues) {
      if (issue.severity === 'low') issue.severity = 'medium';
    }
  }

  const summary =
    issues.length > 0
      ? `Identified ${issues.length} diagnostic issue(s): ${issues.filter((i) => i.severity === 'critical').length} critical, ${issues.filter((i) => i.severity === 'high').length} high, ${issues.filter((i) => i.severity === 'medium').length} medium, ${issues.filter((i) => i.severity === 'low').length} low.`
      : 'No significant issues detected in the process narrative.';

  return { issues, summary };
}
