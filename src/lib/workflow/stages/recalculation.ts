import type {
  DeterministicFinancialOutput,
  FinancialAssumptions,
  DiagnosticsOutput,
  ScenarioOutput,
} from '../../types/contracts';
import { recalculate } from '../../financial/recalculator';

/**
 * Derive financial assumptions from diagnostics heuristics,
 * then compute deterministic financial output via LAW 4 recalculator.
 */
export function runRecalculationStage(
  diagnostics: DiagnosticsOutput,
  scenarios: ScenarioOutput,
): DeterministicFinancialOutput {
  const assumptions = deriveAssumptions(diagnostics, scenarios);
  return recalculate(assumptions);
}

function deriveAssumptions(
  diagnostics: DiagnosticsOutput,
  scenarios: ScenarioOutput,
): FinancialAssumptions {
  const issueCount = diagnostics.issues.length;
  const criticalCount = diagnostics.issues.filter((i) => i.severity === 'critical').length;
  const highCount = diagnostics.issues.filter((i) => i.severity === 'high').length;
  const interventionCount = scenarios.interventions.length;

  // Heuristic: more issues / interventions → larger process, higher costs
  const annual_process_volume = 1000 + issueCount * 500 + interventionCount * 200;
  const current_cost_per_unit_eur = 50 + criticalCount * 30 + highCount * 15;

  // Heuristic: more interventions → higher expected reduction, capped at 40%
  const expected_cost_reduction_percent = Math.min(
    5 + interventionCount * 5 + criticalCount * 3,
    40,
  );

  // Heuristic: implementation cost scales with interventions
  const implementation_cost_eur =
    10000 + interventionCount * 15000 + criticalCount * 10000;

  return {
    annual_process_volume,
    current_cost_per_unit_eur,
    expected_cost_reduction_percent,
    implementation_cost_eur,
  };
}
