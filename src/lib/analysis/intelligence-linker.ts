// ============================================================================
// QUINTIA — Intelligence Linker
// Builds cross-references between graph nodes, diagnostic issues, and scenarios.
// Produces the unified IntelligenceModel consumed by the results UI.
// ============================================================================

import type {
  PipelineResult,
  DiagnosticIssue,
  ProcessGraphNode,
  Intervention,
  DeterministicFinancialOutput,
  FinancialAssumptions,
} from '../types/contracts';

import type {
  IntelligenceModel,
  EnrichedDiagnosticIssue,
  ScenarioComparison,
  LinkedGraphNode,
  LinkedGraphEdge,
  ScenarioDifficulty,
} from '../types/view-models';

import { recalculate } from '../financial/recalculator';

// ---------------------------------------------------------------------------
// Keyword → graph node matching
// ---------------------------------------------------------------------------

function extractKeywordsFromEvidence(evidence: string): string[] {
  const match = evidence.match(/\(([^)]+)\)/);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((s) => s.replace(/"/g, '').trim().toLowerCase())
    .filter(Boolean);
}

function nodeMatchesKeywords(node: ProcessGraphNode, keywords: string[]): boolean {
  const label = node.label.toLowerCase();
  return keywords.some((kw) => label.includes(kw));
}

function nodeMatchesIssueTitle(node: ProcessGraphNode, title: string): boolean {
  const label = node.label.toLowerCase();
  const titleLower = title.toLowerCase();
  // Check for key terms from the issue title
  const terms = titleLower.split(/\s+/).filter((t) => t.length > 3);
  return terms.some((term) => label.includes(term));
}

// ---------------------------------------------------------------------------
// Issue → Intervention matching
// ---------------------------------------------------------------------------

const INTERVENTION_ISSUE_MAP: Record<string, string[]> = {
  'automate manual processing steps': ['manual'],
  'introduce parallel processing paths': ['delay', 'slow', 'waiting'],
  'streamline approval workflows': ['approval', 'bottleneck'],
  'implement tiered resolution framework': ['escalation'],
  'add upstream quality checks': ['rework', 'error', 'correction'],
  'capacity rebalancing and load levelling': ['backlog', 'queue'],
  'reduce handoff points': ['handoff', 'hand-off', 'transfer'],
  'eliminate duplicate activities': ['duplicate', 'redundant'],
  'adopt structured workflow tooling': ['email', 'spreadsheet', 'excel', 'informal'],
  'implement sla monitoring and alerting': ['overdue', 'sla', 'deadline'],
  'standardise exception handling': ['exception', 'workaround', 'special case'],
  'deploy process visibility dashboard': ['visibility', 'tracking', 'unclear'],
};

function issueMatchesIntervention(issue: DiagnosticIssue, intervention: Intervention): boolean {
  const keywords = INTERVENTION_ISSUE_MAP[intervention.title.toLowerCase()] || [];
  const titleLower = issue.title.toLowerCase();
  return keywords.some((kw) => titleLower.includes(kw));
}

// ---------------------------------------------------------------------------
// Confidence heuristic
// ---------------------------------------------------------------------------

function computeConfidence(issue: DiagnosticIssue, matchedKeywords: string[]): number {
  const base = issue.severity === 'critical' ? 90
    : issue.severity === 'high' ? 75
    : issue.severity === 'medium' ? 60
    : 45;
  const keywordBoost = Math.min(matchedKeywords.length * 5, 15);
  return Math.min(100, base + keywordBoost);
}

// ---------------------------------------------------------------------------
// Scenario financial projection (deterministic — LAW 4)
// ---------------------------------------------------------------------------

function computeScenarioFinancials(
  issueCount: number,
  severity: 'critical' | 'high' | 'medium' | 'low',
  interventionIndex: number,
): DeterministicFinancialOutput {
  // Each scenario gets its own deterministic financial projection
  const severityMultiplier = severity === 'critical' ? 1.5
    : severity === 'high' ? 1.2
    : severity === 'medium' ? 1.0
    : 0.7;

  const assumptions: FinancialAssumptions = {
    annual_process_volume: 800 + issueCount * 300,
    current_cost_per_unit_eur: 40 + Math.round(30 * severityMultiplier),
    expected_cost_reduction_percent: Math.min(
      8 + Math.round(7 * severityMultiplier),
      35,
    ),
    implementation_cost_eur:
      8000 + Math.round(12000 * severityMultiplier) + interventionIndex * 5000,
  };

  return recalculate(assumptions);
}

function computeDifficulty(intervention: Intervention): ScenarioDifficulty {
  const title = intervention.title.toLowerCase();
  if (title.includes('automate') || title.includes('framework') || title.includes('adopt'))
    return 'high';
  if (title.includes('streamline') || title.includes('quality') || title.includes('rebalancing'))
    return 'medium';
  return 'low';
}

function computeImplementationMonths(difficulty: ScenarioDifficulty): number {
  return difficulty === 'high' ? 6 : difficulty === 'medium' ? 4 : 2;
}

function computeRiskReduction(linkedIssueCount: number, maxSeverity: string): number {
  const base = maxSeverity === 'critical' ? 40
    : maxSeverity === 'high' ? 30
    : maxSeverity === 'medium' ? 20
    : 10;
  return Math.min(95, base + linkedIssueCount * 10);
}

function computeOperationalClarity(intervention: Intervention): number {
  const title = intervention.title.toLowerCase();
  if (title.includes('visibility') || title.includes('dashboard') || title.includes('monitoring'))
    return 90;
  if (title.includes('streamline') || title.includes('standardise'))
    return 75;
  if (title.includes('automate') || title.includes('eliminate'))
    return 70;
  return 60;
}

function computeTags(
  scenario: { financials: DeterministicFinancialOutput; difficulty: ScenarioDifficulty; riskReduction: number },
  allScenarios: { financials: DeterministicFinancialOutput; difficulty: ScenarioDifficulty; riskReduction: number }[],
): string[] {
  const tags: string[] = [];
  const bestROI = Math.max(...allScenarios.map((s) => s.financials.roi_percent));
  const fastestPayback = Math.min(...allScenarios.map((s) => s.financials.payback_months));
  const highestRisk = Math.max(...allScenarios.map((s) => s.riskReduction));

  if (scenario.financials.roi_percent === bestROI && allScenarios.length > 1) tags.push('best value');
  if (scenario.financials.payback_months === fastestPayback && allScenarios.length > 1) tags.push('fastest win');
  if (scenario.riskReduction === highestRisk && allScenarios.length > 1) tags.push('highest impact');
  if (scenario.difficulty === 'low') tags.push('quick implementation');

  return tags;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildIntelligenceModel(result: PipelineResult): IntelligenceModel | null {
  if (!result.diagnostics || !result.processGraph || !result.scenarios || !result.financials) {
    return null;
  }

  const { diagnostics, processGraph, scenarios, financials, ontology } = result;
  const issues = diagnostics.issues;
  const nodes = processGraph.nodes;
  const edges = processGraph.edges;
  const interventions = scenarios.interventions;

  // ── Step 1: Enrich diagnostic issues ──────────────────────────────────
  const enrichedIssues: EnrichedDiagnosticIssue[] = issues.map((issue, idx) => {
    const id = `issue-${idx + 1}`;
    const matchedKeywords = extractKeywordsFromEvidence(issue.evidence);

    // Find affected graph nodes
    const affectedNodeIds = nodes
      .filter((n) => nodeMatchesKeywords(n, matchedKeywords) || nodeMatchesIssueTitle(n, issue.title))
      .map((n) => n.id);

    // Find linked scenarios
    const linkedScenarioIds = interventions
      .filter((interv) => issueMatchesIntervention(issue, interv))
      .map((_, i) => `scenario-${i + 1}`);

    // Ontology-based context
    const relatedRoles = ontology
      ? ontology.roles.filter((r) => issue.evidence.toLowerCase().includes(r.toLowerCase()))
      : [];
    const relatedSystems = ontology
      ? ontology.systems.filter((s) => issue.evidence.toLowerCase().includes(s.toLowerCase()))
      : [];
    const relatedArtifacts = ontology
      ? ontology.artifacts.filter((a) => issue.evidence.toLowerCase().includes(a.toLowerCase()))
      : [];

    return {
      id,
      title: issue.title,
      severity: issue.severity,
      evidence: issue.evidence,
      matchedKeywords,
      relatedRoles,
      relatedSystems,
      relatedArtifacts,
      affectedNodeIds,
      linkedScenarioIds,
      confidence: computeConfidence(issue, matchedKeywords),
    };
  });

  // ── Step 2: Build scenario comparisons ────────────────────────────────
  const rawScenarios: Omit<ScenarioComparison, 'tags'>[] = interventions.map((interv, idx) => {
    const id = `scenario-${idx + 1}`;

    // Find linked issues
    const linkedIssueIds = enrichedIssues
      .filter((ei) => ei.linkedScenarioIds.includes(id))
      .map((ei) => ei.id);

    const linkedIssues = enrichedIssues.filter((ei) => linkedIssueIds.includes(ei.id));
    const maxSeverity = linkedIssues.length > 0
      ? linkedIssues.reduce((max, i) => {
          const order = { critical: 4, high: 3, medium: 2, low: 1 };
          return order[i.severity] > order[max.severity] ? i : max;
        }).severity
      : 'low';

    const difficulty = computeDifficulty(interv);

    return {
      id,
      title: interv.title,
      interventionSummary: interv.rationale,
      rationale: interv.rationale,
      assumptions: interv.assumptions,
      linkedIssueIds,
      financials: computeScenarioFinancials(linkedIssues.length, maxSeverity, idx),
      difficulty,
      implementationMonths: computeImplementationMonths(difficulty),
      riskReduction: computeRiskReduction(linkedIssues.length, maxSeverity),
      operationalClarity: computeOperationalClarity(interv),
    };
  });

  // Compute tags (needs all scenarios for comparison)
  const scenarioComparisons: ScenarioComparison[] = rawScenarios.map((s) => ({
    ...s,
    tags: computeTags(s, rawScenarios),
  }));

  // ── Step 3: Link graph nodes ──────────────────────────────────────────
  const linkedNodes: LinkedGraphNode[] = nodes.map((node) => {
    const relatedIssueIds = enrichedIssues
      .filter((ei) => ei.affectedNodeIds.includes(node.id))
      .map((ei) => ei.id);

    const relatedScenarioIds = [
      ...new Set(
        enrichedIssues
          .filter((ei) => ei.affectedNodeIds.includes(node.id))
          .flatMap((ei) => ei.linkedScenarioIds),
      ),
    ];

    return { ...node, relatedIssueIds, relatedScenarioIds };
  });

  // ── Step 4: Link graph edges ──────────────────────────────────────────
  const linkedEdges: LinkedGraphEdge[] = edges.map((edge) => {
    // An edge is related to an issue if either its source or target node is affected
    const relatedIssueIds = [
      ...new Set(
        enrichedIssues
          .filter(
            (ei) =>
              ei.affectedNodeIds.includes(edge.from) ||
              ei.affectedNodeIds.includes(edge.to),
          )
          .map((ei) => ei.id),
      ),
    ];

    return { ...edge, relatedIssueIds };
  });

  return {
    issues: enrichedIssues,
    scenarios: scenarioComparisons,
    graphNodes: linkedNodes,
    graphEdges: linkedEdges,
    baselineFinancials: financials,
    graphSummary: processGraph.graph_summary,
  };
}
