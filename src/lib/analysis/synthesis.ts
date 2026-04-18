import type {
  SynthesisOutput,
  OntologyOutput,
  ProcessGraphOutput,
  DiagnosticsOutput,
  ScenarioOutput,
  CriticOutput,
  DeterministicFinancialOutput,
} from '../types/contracts';

/**
 * Generate structured synthesis from all prior pipeline outputs.
 */
export function generateSynthesis(inputs: {
  ontology: OntologyOutput;
  processGraph: ProcessGraphOutput;
  diagnostics: DiagnosticsOutput;
  scenarios: ScenarioOutput;
  financials: DeterministicFinancialOutput;
  critic: CriticOutput;
}): SynthesisOutput {
  const { ontology, processGraph, diagnostics, scenarios, financials, critic } = inputs;

  // -- Executive summary ---------------------------------------------------
  const criticalCount = diagnostics.issues.filter((i) => i.severity === 'critical').length;
  const highCount = diagnostics.issues.filter((i) => i.severity === 'high').length;
  const totalIssues = diagnostics.issues.length;

  const executive_summary = [
    `Analysis of the operational process identified ${ontology.entities.length} entities, ${ontology.roles.length} roles, and ${ontology.systems.length} systems.`,
    `The process graph contains ${processGraph.nodes.length} steps with ${processGraph.edges.length} transitions.`,
    totalIssues > 0
      ? `Diagnostics revealed ${totalIssues} issue(s) (${criticalCount} critical, ${highCount} high).`
      : 'No significant process issues were detected.',
    scenarios.interventions.length > 0
      ? `${scenarios.interventions.length} intervention scenario(s) have been proposed.`
      : '',
    financials.roi_percent > 0
      ? `Projected ROI is ${financials.roi_percent}% with a payback period of ${financials.payback_months} months.`
      : '',
    critic.confidence_score < 50
      ? `Note: Analysis confidence is low (${critic.confidence_score}%). Results should be reviewed carefully.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  // -- Current state -------------------------------------------------------
  const current_state = [
    `The process involves ${ontology.roles.length > 0 ? ontology.roles.join(', ') : 'unidentified roles'}.`,
    ontology.systems.length > 0
      ? `Key systems include ${ontology.systems.join(', ')}.`
      : 'No specific systems were identified.',
    ontology.bottleneck_candidates.length > 0
      ? `Potential bottlenecks: ${ontology.bottleneck_candidates.join(', ')}.`
      : '',
    `Current baseline cost is estimated at €${financials.baseline_cost_eur.toLocaleString('en')}.`,
  ]
    .filter(Boolean)
    .join(' ');

  // -- Recommendation ------------------------------------------------------
  const topInterventions = scenarios.interventions.slice(0, 3);
  const recommendation =
    topInterventions.length > 0
      ? `Priority interventions: ${topInterventions.map((i, idx) => `(${idx + 1}) ${i.title}`).join('; ')}. ` +
        `Expected annual savings: €${financials.expected_savings_eur.toLocaleString('en')} with implementation cost of €${financials.implementation_cost_eur.toLocaleString('en')}.`
      : 'No specific interventions recommended at this time. Consider refining the process narrative for deeper analysis.';

  // -- Roadmap -------------------------------------------------------------
  const roadmap =
    topInterventions.length > 0
      ? [
          'Phase 1 (0–3 months): Assessment and detailed design of priority interventions.',
          'Phase 2 (3–6 months): Pilot implementation of top-priority changes.',
          'Phase 3 (6–12 months): Full rollout, monitoring, and optimisation.',
          `Target: Achieve ${financials.expected_cost_reduction_percent ?? 'projected'}% cost reduction within 12 months.`,
        ].join(' ')
      : 'No roadmap generated — insufficient data for phased planning.';

  return { executive_summary, current_state, recommendation, roadmap };
}

// Helper to extract the reduction percent from financial output if available
// (not stored directly, but can be derived)
interface FinancialsWithMeta extends DeterministicFinancialOutput {
  expected_cost_reduction_percent?: number;
}

export function generateSynthesisWithMeta(
  inputs: Parameters<typeof generateSynthesis>[0] & {
    financials: FinancialsWithMeta;
  },
): SynthesisOutput {
  return generateSynthesis(inputs);
}
