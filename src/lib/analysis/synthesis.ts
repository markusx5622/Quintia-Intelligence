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
 * Grounded in actual detected structure — avoids generic template language.
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

  const criticalCount = diagnostics.issues.filter((i) => i.severity === 'critical').length;
  const highCount = diagnostics.issues.filter((i) => i.severity === 'high').length;
  const totalIssues = diagnostics.issues.length;

  // -- Executive summary ---------------------------------------------------
  const execParts: string[] = [];

  // Opening — grounded in what was actually found
  if (ontology.roles.length > 0 && ontology.systems.length > 0) {
    execParts.push(
      `The analysed process involves ${ontology.roles.length} identified role(s) (${ontology.roles.slice(0, 3).join(', ')}${ontology.roles.length > 3 ? ', and others' : ''}) operating across ${ontology.systems.length} system(s) (${ontology.systems.slice(0, 3).join(', ')}${ontology.systems.length > 3 ? ', and others' : ''}).`,
    );
  } else if (ontology.roles.length > 0) {
    execParts.push(
      `The analysed process involves ${ontology.roles.length} identified role(s) including ${ontology.roles.slice(0, 3).join(', ')}.`,
    );
  } else {
    execParts.push(
      `Analysis of the operational process identified ${ontology.entities.length} entities.`,
    );
  }

  // Graph structure
  const decisionNodes = processGraph.nodes.filter(
    (n) => n.type === 'decision' || n.type === 'escalation',
  );
  if (decisionNodes.length > 0) {
    execParts.push(
      `The process graph maps ${processGraph.nodes.length} operational steps with ${decisionNodes.length} decision/escalation point(s), indicating conditional routing in the workflow.`,
    );
  } else {
    execParts.push(
      `The process graph maps ${processGraph.nodes.length} operational steps with ${processGraph.edges.length} transitions.`,
    );
  }

  // Issues — specific, not just counts
  if (totalIssues > 0) {
    const topIssues = diagnostics.issues.slice(0, 3).map((i) => i.title.toLowerCase());
    execParts.push(
      `Diagnostics identified ${totalIssues} issue(s) (${criticalCount} critical, ${highCount} high), including ${topIssues.join(', ')}.`,
    );
  } else {
    execParts.push('No significant process issues were detected.');
  }

  if (scenarios.interventions.length > 0) {
    execParts.push(
      `${scenarios.interventions.length} targeted intervention(s) have been proposed to address the detected issues.`,
    );
  }

  if (financials.roi_percent > 0) {
    execParts.push(
      `Projected ROI is ${financials.roi_percent}% with a ${financials.payback_months}-month payback period.`,
    );
  }

  if (critic.confidence_score < 50) {
    execParts.push(
      `Analysis confidence is low (${critic.confidence_score}%) — results should be reviewed carefully before acting.`,
    );
  }

  const executive_summary = execParts.join(' ');

  // -- Current state -------------------------------------------------------
  const stateParts: string[] = [];

  if (ontology.roles.length > 0) {
    stateParts.push(`Key roles: ${ontology.roles.join(', ')}.`);
  } else {
    stateParts.push('No specific roles were identified in the narrative.');
  }

  if (ontology.systems.length > 0) {
    stateParts.push(`Systems in use: ${ontology.systems.join(', ')}.`);
  }

  if (ontology.bottleneck_candidates.length > 0) {
    stateParts.push(
      `Detected bottleneck indicators: ${ontology.bottleneck_candidates.join(', ')}.`,
    );
  }

  // Reference specific high/critical issues
  const severeIssues = diagnostics.issues.filter(
    (i) => i.severity === 'critical' || i.severity === 'high',
  );
  if (severeIssues.length > 0) {
    stateParts.push(
      `Primary concerns: ${severeIssues.map((i) => i.title.toLowerCase()).join('; ')}.`,
    );
  }

  stateParts.push(
    `Estimated baseline cost: €${financials.baseline_cost_eur.toLocaleString('en')}/year.`,
  );

  const current_state = stateParts.join(' ');

  // -- Recommendation ------------------------------------------------------
  const topInterventions = scenarios.interventions.slice(0, 3);
  let recommendation: string;

  if (topInterventions.length > 0) {
    const interventionDetails = topInterventions.map((interv, idx) => {
      return `(${idx + 1}) ${interv.title} — ${interv.rationale.split('.')[0]}.`;
    });
    recommendation =
      `Priority interventions: ${interventionDetails.join(' ')} ` +
      `Expected annual savings: €${financials.expected_savings_eur.toLocaleString('en')} ` +
      `against an implementation investment of €${financials.implementation_cost_eur.toLocaleString('en')}.`;
  } else {
    recommendation =
      'No specific interventions recommended at this time. Consider providing a more detailed process narrative for deeper analysis.';
  }

  // -- Roadmap -------------------------------------------------------------
  let roadmap: string;

  if (topInterventions.length > 0) {
    const phase1Items = topInterventions
      .filter((_, i) => i === 0)
      .map((i) => i.title.toLowerCase());
    const phase2Items = topInterventions
      .filter((_, i) => i > 0)
      .map((i) => i.title.toLowerCase());

    const roadmapParts = [
      `Phase 1 (0–3 months): Detailed assessment and pilot of ${phase1Items.join(', ')}.`,
    ];

    if (phase2Items.length > 0) {
      roadmapParts.push(
        `Phase 2 (3–6 months): Implement ${phase2Items.join(', ')}.`,
      );
    } else {
      roadmapParts.push('Phase 2 (3–6 months): Expand pilot scope and measure impact.');
    }

    roadmapParts.push(
      `Phase 3 (6–12 months): Full rollout, performance monitoring, and continuous improvement.`,
    );

    if (severeIssues.length > 0) {
      roadmapParts.push(
        `Priority: Address ${severeIssues[0].title.toLowerCase()} first given its ${severeIssues[0].severity} severity.`,
      );
    }

    roadmap = roadmapParts.join(' ');
  } else {
    roadmap = 'No roadmap generated — insufficient data for phased planning.';
  }

  return { executive_summary, current_state, recommendation, roadmap };
}
