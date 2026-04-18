import { describe, it, expect } from 'vitest';
import { buildIntelligenceModel } from '../../src/lib/analysis/intelligence-linker';
import { analyzeNarrative } from '../../src/lib/analysis/engine';
import { recalculate } from '../../src/lib/financial/recalculator';
import type { PipelineResult } from '../../src/lib/types/contracts';

const TEST_NARRATIVE = `
The IT service desk receives incidents reported through email and a shared inbox.
A helpdesk agent logs the ticket manually in the ticketing system and assigns a severity level.
Incidents are then reviewed by the service desk analyst who triages and categorizes them.
High severity incidents are escalated to the infrastructure team or network engineer.
Security-related incidents are forwarded to the security team for investigation.
The process involves multiple handoffs between teams, causing delays and unclear ownership.
Rework occurs frequently when tickets are incorrectly categorized.
There is a backlog of unresolved incidents due to manual processing.
SLA breaches happen regularly for critical incidents due to slow escalation.
The current process uses spreadsheets for tracking with no visibility into queue status.
`;

function buildTestResult(): PipelineResult {
  const engine = analyzeNarrative(TEST_NARRATIVE);
  const financials = recalculate({
    annual_process_volume: 2000,
    current_cost_per_unit_eur: 80,
    expected_cost_reduction_percent: 20,
    implementation_cost_eur: 50000,
  });

  return {
    jobId: 'test-job',
    projectId: 'test-project',
    ontology: engine.ontology,
    processGraph: engine.processGraph,
    diagnostics: engine.diagnostics,
    scenarios: engine.scenarios,
    financials,
    critic: null,
    synthesis: null,
  };
}

describe('Intelligence Linker', () => {
  it('builds a non-null model from valid pipeline result', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result);
    expect(model).not.toBeNull();
  });

  it('returns null when diagnostics are missing', () => {
    const result = buildTestResult();
    result.diagnostics = null;
    const model = buildIntelligenceModel(result);
    expect(model).toBeNull();
  });

  it('produces enriched issues with IDs', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    expect(model.issues.length).toBeGreaterThan(0);
    expect(model.issues[0].id).toMatch(/^issue-/);
  });

  it('links issues to graph nodes', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    // At least some issues should have affected nodes
    const issuesWithNodes = model.issues.filter((i) => i.affectedNodeIds.length > 0);
    expect(issuesWithNodes.length).toBeGreaterThan(0);
  });

  it('links issues to scenarios', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    const issuesWithScenarios = model.issues.filter((i) => i.linkedScenarioIds.length > 0);
    expect(issuesWithScenarios.length).toBeGreaterThan(0);
  });

  it('produces scenarios with deterministic financials (Law 4)', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    expect(model.scenarios.length).toBeGreaterThan(0);
    for (const s of model.scenarios) {
      expect(s.financials).toBeDefined();
      expect(typeof s.financials.roi_percent).toBe('number');
      expect(typeof s.financials.expected_savings_eur).toBe('number');
      expect(typeof s.financials.implementation_cost_eur).toBe('number');
      expect(typeof s.financials.payback_months).toBe('number');
    }
  });

  it('produces scenarios with linked issue IDs', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    const scenariosWithIssues = model.scenarios.filter((s) => s.linkedIssueIds.length > 0);
    expect(scenariosWithIssues.length).toBeGreaterThan(0);
  });

  it('enriches graph nodes with issue references', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    const nodesWithIssues = model.graphNodes.filter((n) => n.relatedIssueIds.length > 0);
    expect(nodesWithIssues.length).toBeGreaterThan(0);
  });

  it('computes confidence scores for issues', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    for (const issue of model.issues) {
      expect(issue.confidence).toBeGreaterThanOrEqual(0);
      expect(issue.confidence).toBeLessThanOrEqual(100);
    }
  });

  it('assigns tags to scenarios when multiple exist', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    if (model.scenarios.length > 1) {
      const scenariosWithTags = model.scenarios.filter((s) => s.tags.length > 0);
      expect(scenariosWithTags.length).toBeGreaterThan(0);
    }
  });

  it('preserves baseline financials from pipeline result', () => {
    const result = buildTestResult();
    const model = buildIntelligenceModel(result)!;
    expect(model.baselineFinancials).toEqual(result.financials);
  });
});
