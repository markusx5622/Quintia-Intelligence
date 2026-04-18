import { describe, it, expect } from 'vitest';
import { analyzeNarrative } from '@/src/lib/analysis/engine';

const PROCUREMENT_NARRATIVE = `
Our procurement process starts when a department submits a purchase request form.
The request goes to the department manager for approval. If the amount exceeds €5,000,
it requires additional VP approval. The procurement team then reviews vendor options
and sends out requests for quotation. Once quotes are received, the procurement officer
evaluates them in a spreadsheet and selects the best vendor. A purchase order is created
in the ERP system and sent to the vendor. The process often suffers from delays due to
manual data entry and approval backlogs. Email is used for most communication, leading
to lost messages and duplicate work.
`;

describe('Semantic Engine — Contract Shape', () => {
  const result = analyzeNarrative(PROCUREMENT_NARRATIVE);

  it('returns OntologyOutput with correct shape', () => {
    expect(Array.isArray(result.ontology.entities)).toBe(true);
    expect(Array.isArray(result.ontology.roles)).toBe(true);
    expect(Array.isArray(result.ontology.systems)).toBe(true);
    expect(Array.isArray(result.ontology.artifacts)).toBe(true);
    expect(Array.isArray(result.ontology.bottleneck_candidates)).toBe(true);
  });

  it('returns ProcessGraphOutput with correct shape', () => {
    expect(Array.isArray(result.processGraph.nodes)).toBe(true);
    expect(Array.isArray(result.processGraph.edges)).toBe(true);
    expect(typeof result.processGraph.graph_summary).toBe('string');
    if (result.processGraph.nodes.length > 0) {
      expect(result.processGraph.nodes[0]).toHaveProperty('id');
      expect(result.processGraph.nodes[0]).toHaveProperty('label');
    }
  });

  it('returns DiagnosticsOutput with correct shape', () => {
    expect(Array.isArray(result.diagnostics.issues)).toBe(true);
    expect(typeof result.diagnostics.summary).toBe('string');
    if (result.diagnostics.issues.length > 0) {
      expect(result.diagnostics.issues[0]).toHaveProperty('title');
      expect(result.diagnostics.issues[0]).toHaveProperty('severity');
      expect(result.diagnostics.issues[0]).toHaveProperty('evidence');
    }
  });

  it('returns ScenarioOutput with correct shape', () => {
    expect(Array.isArray(result.scenarios.interventions)).toBe(true);
    expect(typeof result.scenarios.summary).toBe('string');
    if (result.scenarios.interventions.length > 0) {
      expect(result.scenarios.interventions[0]).toHaveProperty('title');
      expect(result.scenarios.interventions[0]).toHaveProperty('rationale');
      expect(result.scenarios.interventions[0]).toHaveProperty('assumptions');
    }
  });

  it('produces meaningful output for procurement narrative', () => {
    expect(result.ontology.roles.length).toBeGreaterThan(0);
    expect(result.ontology.bottleneck_candidates.length).toBeGreaterThan(0);
    expect(result.processGraph.nodes.length).toBeGreaterThan(2);
    expect(result.diagnostics.issues.length).toBeGreaterThan(0);
  });
});
