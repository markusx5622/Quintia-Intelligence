import { describe, it, expect } from 'vitest';
import { recalculate } from '@/src/lib/financial/recalculator';
import type { FinancialAssumptions } from '@/src/lib/types/contracts';

describe('Deterministic Financial Recalculator (LAW 4)', () => {
  const baseAssumptions: FinancialAssumptions = {
    annual_process_volume: 10000,
    current_cost_per_unit_eur: 50,
    expected_cost_reduction_percent: 20,
    implementation_cost_eur: 50000,
  };

  it('computes baseline cost correctly', () => {
    const result = recalculate(baseAssumptions);
    expect(result.baseline_cost_eur).toBe(500000); // 10000 * 50
  });

  it('computes expected savings correctly', () => {
    const result = recalculate(baseAssumptions);
    expect(result.expected_savings_eur).toBe(100000); // 500000 * 0.20
  });

  it('passes through implementation cost', () => {
    const result = recalculate(baseAssumptions);
    expect(result.implementation_cost_eur).toBe(50000);
  });

  it('computes ROI correctly', () => {
    const result = recalculate(baseAssumptions);
    // net_benefit = 100000 - 50000 = 50000
    // roi = (50000 / 50000) * 100 = 100%
    expect(result.roi_percent).toBe(100);
  });

  it('computes payback months correctly', () => {
    const result = recalculate(baseAssumptions);
    // payback = (50000 / 100000) * 12 = 6 months
    expect(result.payback_months).toBe(6);
  });

  it('handles zero volume', () => {
    const result = recalculate({ ...baseAssumptions, annual_process_volume: 0 });
    expect(result.baseline_cost_eur).toBe(0);
    expect(result.expected_savings_eur).toBe(0);
    expect(result.payback_months).toBe(0);
  });

  it('handles zero implementation cost', () => {
    const result = recalculate({ ...baseAssumptions, implementation_cost_eur: 0 });
    expect(result.implementation_cost_eur).toBe(0);
    expect(result.roi_percent).toBe(0);
    expect(result.payback_months).toBe(0);
  });

  it('handles negative ROI scenario', () => {
    const result = recalculate({
      ...baseAssumptions,
      expected_cost_reduction_percent: 1,
      implementation_cost_eur: 100000,
    });
    // savings = 500000 * 0.01 = 5000
    // net = 5000 - 100000 = -95000
    // roi = (-95000 / 100000) * 100 = -95%
    expect(result.roi_percent).toBe(-95);
  });

  it('is deterministic — same inputs produce same outputs', () => {
    const a = recalculate(baseAssumptions);
    const b = recalculate(baseAssumptions);
    expect(a).toEqual(b);
  });
});
