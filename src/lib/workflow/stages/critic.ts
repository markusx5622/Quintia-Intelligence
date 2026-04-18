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
  let score = 80; // Start at 80, adjust down for concerns

  // Check entity richness
  if (ontology.entities.length < 2) {
    flags.push({ area: 'ontology', concern: 'Very few entities extracted — narrative may be too brief.', severity: 'warning' });
    score -= 15;
  }

  if (ontology.roles.length === 0) {
    flags.push({ area: 'ontology', concern: 'No roles identified — unclear who performs process steps.', severity: 'warning' });
    score -= 10;
  }

  // Check graph quality
  if (processGraph.nodes.length < 3) {
    flags.push({ area: 'process-graph', concern: 'Process graph has fewer than 3 steps — analysis may be shallow.', severity: 'warning' });
    score -= 15;
  }

  // Check diagnostics
  if (diagnostics.issues.length === 0) {
    flags.push({ area: 'diagnostics', concern: 'No issues detected — narrative may lack problem indicators.', severity: 'info' });
    score -= 5;
  }

  // Check scenarios
  if (scenarios.interventions.length === 0 && diagnostics.issues.length > 0) {
    flags.push({ area: 'scenarios', concern: 'Issues found but no interventions generated — template coverage gap.', severity: 'warning' });
    score -= 10;
  }

  // Check financial sanity
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

  const summary =
    flags.length > 0
      ? `Confidence: ${confidence_score}%. Found ${flags.length} concern(s) across the analysis.`
      : `Confidence: ${confidence_score}%. No significant concerns identified.`;

  return { confidence_score, flags, summary };
}
