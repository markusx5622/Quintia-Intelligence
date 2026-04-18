import type { ScenarioOutput, Intervention, DiagnosticsOutput } from '../types/contracts';

// ---------------------------------------------------------------------------
// Intervention templates — matched by diagnostic issue title keywords
// ---------------------------------------------------------------------------

interface InterventionTemplate {
  matchKeywords: string[];
  title: string;
  rationale: string;
  assumptions: string[];
}

const TEMPLATES: InterventionTemplate[] = [
  {
    matchKeywords: ['manual'],
    title: 'Automate manual processing steps',
    rationale: 'Replace manual data entry and processing with automated workflows to reduce errors and cycle time.',
    assumptions: [
      'Current manual steps can be codified into rules',
      'Integration with existing systems is feasible',
      'Staff can be retrained within 2–4 weeks',
    ],
  },
  {
    matchKeywords: ['delay', 'slow', 'waiting'],
    title: 'Introduce parallel processing paths',
    rationale: 'Reduce sequential dependencies by enabling concurrent execution of independent process stages.',
    assumptions: [
      'Some sequential stages are actually independent',
      'System infrastructure supports concurrent execution',
      'Quality controls remain effective in parallel mode',
    ],
  },
  {
    matchKeywords: ['approval', 'bottleneck'],
    title: 'Streamline approval workflows',
    rationale: 'Reduce approval gates by implementing threshold-based auto-approval and delegation rules.',
    assumptions: [
      'Risk-based thresholds can be defined',
      'Audit trail requirements are maintained',
      'Delegated authority policies are acceptable to compliance',
    ],
  },
  {
    matchKeywords: ['escalation'],
    title: 'Implement tiered resolution framework',
    rationale: 'Structure escalation into clear tiers with time-bound SLAs and decision criteria.',
    assumptions: [
      'Escalation criteria can be formally defined',
      'Team capacity exists for each tier',
      'SLA targets are agreed upon by stakeholders',
    ],
  },
  {
    matchKeywords: ['rework', 'error', 'correction'],
    title: 'Add upstream quality checks',
    rationale: 'Introduce validation checks at earlier stages to prevent downstream rework loops.',
    assumptions: [
      'Root causes of errors are identifiable',
      'Validation rules can be automated',
      'Upstream teams have capacity for additional checks',
    ],
  },
  {
    matchKeywords: ['backlog', 'queue'],
    title: 'Capacity rebalancing and load levelling',
    rationale: 'Address demand/capacity mismatch through workload redistribution and dynamic resource allocation.',
    assumptions: [
      'Workload data is available for analysis',
      'Cross-training enables flexible resource allocation',
      'Peak demand patterns are predictable',
    ],
  },
  {
    matchKeywords: ['handoff', 'hand-off', 'transfer'],
    title: 'Reduce handoff points',
    rationale: 'Consolidate process ownership to reduce handoffs, information loss, and wait times.',
    assumptions: [
      'Some handoffs are organizationally rather than technically necessary',
      'Cross-functional roles can be created',
      'Knowledge transfer between teams is achievable',
    ],
  },
  {
    matchKeywords: ['duplicate', 'redundant'],
    title: 'Eliminate duplicate activities',
    rationale: 'Remove redundant process steps through process consolidation and shared data repositories.',
    assumptions: [
      'Duplicate steps serve no unique compliance purpose',
      'Shared data sources can replace separate data collection',
      'Teams agree on single source of truth',
    ],
  },
  {
    matchKeywords: ['email', 'spreadsheet', 'excel', 'informal'],
    title: 'Adopt structured workflow tooling',
    rationale: 'Replace informal tools (email, spreadsheets) with a structured workflow management system.',
    assumptions: [
      'A suitable workflow tool exists or can be procured',
      'Migration from informal tools is achievable in 3–6 months',
      'User adoption can be achieved with training programme',
    ],
  },
  {
    matchKeywords: ['overdue', 'sla', 'deadline'],
    title: 'Implement SLA monitoring and alerting',
    rationale: 'Deploy real-time SLA tracking with proactive alerts before breaches occur.',
    assumptions: [
      'SLA targets are formally defined',
      'Monitoring infrastructure is available',
      'Escalation paths for at-risk items are agreed',
    ],
  },
  {
    matchKeywords: ['exception', 'workaround', 'special case'],
    title: 'Standardise exception handling',
    rationale: 'Define formal exception handling procedures to reduce ad-hoc workarounds.',
    assumptions: [
      'Common exception types can be catalogued',
      'Standard responses can be defined for each type',
      'Exception frequency will decrease with better standard process',
    ],
  },
  {
    matchKeywords: ['visibility', 'tracking', 'unclear'],
    title: 'Deploy process visibility dashboard',
    rationale: 'Provide real-time process status visibility to reduce inquiry overhead and enable proactive management.',
    assumptions: [
      'Data sources for process tracking exist or can be created',
      'Dashboard tool is available',
      'Stakeholders will adopt the dashboard over manual status checks',
    ],
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateScenarios(diagnostics: DiagnosticsOutput): ScenarioOutput {
  const interventions: Intervention[] = [];

  for (const issue of diagnostics.issues) {
    const lower = issue.title.toLowerCase();
    for (const tmpl of TEMPLATES) {
      const matches = tmpl.matchKeywords.some((kw) => lower.includes(kw));
      if (matches) {
        // Avoid duplicates
        if (!interventions.some((i) => i.title === tmpl.title)) {
          interventions.push({
            title: tmpl.title,
            rationale: tmpl.rationale,
            assumptions: [...tmpl.assumptions],
          });
        }
      }
    }
  }

  const summary =
    interventions.length > 0
      ? `Generated ${interventions.length} intervention scenario(s) addressing identified process issues.`
      : 'No intervention scenarios generated — no actionable diagnostics found.';

  return { interventions, summary };
}
