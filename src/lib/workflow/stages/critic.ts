import type {
  CriticOutput,
  CriticFlag,
  OntologyOutput,
  ProcessGraphOutput,
  DiagnosticsOutput,
  ScenarioOutput,
  DeterministicFinancialOutput,
} from '../../types/contracts';

/**
 * Critic stage — evaluate confidence and flag concerns in the analysis.
 *
 * Confidence is derived from:
 * - extraction richness (ontology)
 * - graph completeness
 * - issue severity distribution
 * - scenario coverage
 * - financial sanity
 */
export function runCriticStage(inputs: {
  ontology: OntologyOutput;
  processGraph: ProcessGraphOutput;
  diagnostics: DiagnosticsOutput;
  scenarios: ScenarioOutput;
  financials: DeterministicFinancialOutput;
}): CriticOutput {
  const { ontology, processGraph, diagnostics, scenarios, financials } = inputs;
  const flags: CriticFlag[] = [];
  let score = 90; // Start at 90, adjust based on analysis quality

  // -- Ontology richness ---------------------------------------------------
  if (ontology.entities.length < 2) {
    flags.push({ area: 'ontology', concern: 'Very few entities extracted — narrative may be too brief.', severity: 'warning' });
    score -= 15;
  }

  if (ontology.roles.length === 0) {
    flags.push({ area: 'ontology', concern: 'No roles identified — unclear who performs process steps.', severity: 'warning' });
    score -= 10;
  } else if (ontology.roles.length >= 2) {
    // Good extraction — slight confidence boost (capped via final clamp)
    score += 3;
  }

  if (ontology.systems.length === 0) {
    flags.push({ area: 'ontology', concern: 'No systems identified — process tooling landscape is unknown.', severity: 'info' });
    score -= 5;
  }

  // -- Graph quality -------------------------------------------------------
  if (processGraph.nodes.length < 3) {
    flags.push({ area: 'process-graph', concern: 'Process graph has fewer than 3 steps — analysis may be shallow.', severity: 'warning' });
    score -= 15;
  }

  const decisionNodes = processGraph.nodes.filter(
    (n) => n.type === 'decision' || n.type === 'escalation',
  );
  if (decisionNodes.length === 0 && processGraph.nodes.length >= 3) {
    flags.push({ area: 'process-graph', concern: 'No decision or branching points detected — graph may oversimplify the actual process.', severity: 'info' });
    score -= 3;
  }

  // -- Issue severity distribution -----------------------------------------
  const criticalCount = diagnostics.issues.filter((i) => i.severity === 'critical').length;
  const highCount = diagnostics.issues.filter((i) => i.severity === 'high').length;

  if (diagnostics.issues.length === 0) {
    flags.push({ area: 'diagnostics', concern: 'No issues detected — narrative may lack problem indicators.', severity: 'info' });
    score -= 5;
  }

  // Presence of critical/high issues reduces confidence in the PROCESS (not the analysis),
  // but importantly, it means the summary must NOT say "no significant concerns"
  if (criticalCount > 0) {
    flags.push({
      area: 'diagnostics',
      concern: `${criticalCount} critical issue(s) detected — significant operational risk present.`,
      severity: 'critical',
    });
    score -= criticalCount * 8;
  }

  if (highCount > 0) {
    flags.push({
      area: 'diagnostics',
      concern: `${highCount} high-severity issue(s) detected — material process deficiencies.`,
      severity: 'warning',
    });
    score -= highCount * 4;
  }

  // -- Scenario coverage ---------------------------------------------------
  if (scenarios.interventions.length === 0 && diagnostics.issues.length > 0) {
    flags.push({ area: 'scenarios', concern: 'Issues found but no interventions generated — template coverage gap.', severity: 'warning' });
    score -= 10;
  }

  // -- Financial sanity ----------------------------------------------------
  if (financials.roi_percent < 0) {
    flags.push({ area: 'financials', concern: 'Negative ROI — implementation cost exceeds projected savings.', severity: 'critical' });
    score -= 20;
  }

  if (financials.payback_months > 36) {
    flags.push({ area: 'financials', concern: 'Payback period exceeds 36 months — long time to value.', severity: 'warning' });
    score -= 10;
  }

  // Clamp score
  const confidence_score = Math.max(0, Math.min(100, score));

  // Build summary that is consistent with the actual flags
  const criticalFlags = flags.filter((f) => f.severity === 'critical');
  const warningFlags = flags.filter((f) => f.severity === 'warning');

  let summary: string;
  if (criticalFlags.length > 0) {
    summary = `Confidence: ${confidence_score}%. ${criticalFlags.length} critical concern(s) and ${warningFlags.length} warning(s) identified across the analysis.`;
  } else if (warningFlags.length > 0) {
    summary = `Confidence: ${confidence_score}%. ${warningFlags.length} warning(s) identified — review flagged areas before acting on recommendations.`;
  } else if (flags.length > 0) {
    summary = `Confidence: ${confidence_score}%. ${flags.length} informational note(s) — no blocking concerns.`;
  } else {
    summary = `Confidence: ${confidence_score}%. No significant concerns identified in the analysis.`;
  }

  return { confidence_score, flags, summary };
}
