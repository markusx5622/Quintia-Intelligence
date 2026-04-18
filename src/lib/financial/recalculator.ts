import type {
  FinancialAssumptions,
  DeterministicFinancialOutput,
} from '../types/contracts';

/**
 * Deterministic financial recalculator — LAW 4 enforcement.
 *
 * All financial outputs shown to users MUST originate from this module.
 * No AI / semantic engine layer may directly author final ROI, savings,
 * payback, or implementation-cost outputs.
 */
export function recalculate(
  assumptions: FinancialAssumptions,
): DeterministicFinancialOutput {
  const baseline_cost_eur =
    assumptions.annual_process_volume * assumptions.current_cost_per_unit_eur;

  const expected_savings_eur =
    baseline_cost_eur * (assumptions.expected_cost_reduction_percent / 100);

  const implementation_cost_eur = assumptions.implementation_cost_eur;

  const net_benefit = expected_savings_eur - implementation_cost_eur;

  const roi_percent =
    implementation_cost_eur > 0
      ? Number(((net_benefit / implementation_cost_eur) * 100).toFixed(2))
      : 0;

  const payback_months =
    expected_savings_eur > 0
      ? Number(((implementation_cost_eur / expected_savings_eur) * 12).toFixed(1))
      : 0;

  return {
    baseline_cost_eur,
    expected_savings_eur,
    implementation_cost_eur,
    roi_percent,
    payback_months,
  };
}
