// ============================================================================
// QUINTIA — Derived View Models
// UI-facing structures for Scenario Comparison, Evidence Panel, and Graph Linking.
// These do NOT replace canonical contracts — they extend them for the UI layer.
// ============================================================================

import type {
  DiagnosticIssue,
  ProcessGraphNode,
  ProcessGraphEdge,
  DeterministicFinancialOutput,
} from './contracts';

// ---------------------------------------------------------------------------
// Evidence / Why Panel
// ---------------------------------------------------------------------------

/** Extended diagnostic issue with structured evidence for the Why panel. */
export interface EnrichedDiagnosticIssue {
  id: string;
  title: string;
  severity: DiagnosticIssue['severity'];
  evidence: string;
  matchedKeywords: string[];
  relatedRoles: string[];
  relatedSystems: string[];
  relatedArtifacts: string[];
  affectedNodeIds: string[];
  linkedScenarioIds: string[];
  confidence: number; // 0–100 strength of match
}

// ---------------------------------------------------------------------------
// Scenario Comparison
// ---------------------------------------------------------------------------

export type ScenarioDifficulty = 'low' | 'medium' | 'high';

export interface ScenarioComparison {
  id: string;
  title: string;
  interventionSummary: string;
  rationale: string;
  assumptions: string[];
  linkedIssueIds: string[];
  /** Deterministic financial projection — LAW 4 compliant */
  financials: DeterministicFinancialOutput;
  difficulty: ScenarioDifficulty;
  implementationMonths: number;
  riskReduction: number;        // 0–100
  operationalClarity: number;   // 0–100
  tags: string[];               // e.g. "fastest win", "highest impact", "best value"
}

// ---------------------------------------------------------------------------
// Interactive Graph Linking
// ---------------------------------------------------------------------------

/** Graph node enriched with cross-references for interactive selection. */
export interface LinkedGraphNode extends ProcessGraphNode {
  relatedIssueIds: string[];
  relatedScenarioIds: string[];
}

export interface LinkedGraphEdge extends ProcessGraphEdge {
  relatedIssueIds: string[];
}

// ---------------------------------------------------------------------------
// Unified Intelligence Model — assembled for the results page
// ---------------------------------------------------------------------------

export interface IntelligenceModel {
  issues: EnrichedDiagnosticIssue[];
  scenarios: ScenarioComparison[];
  graphNodes: LinkedGraphNode[];
  graphEdges: LinkedGraphEdge[];
  baselineFinancials: DeterministicFinancialOutput;
  graphSummary: string;
}

// ---------------------------------------------------------------------------
// Selection state for interactive linking
// ---------------------------------------------------------------------------

export type SelectionType = 'node' | 'issue' | 'scenario' | null;

export interface SelectionState {
  type: SelectionType;
  id: string | null;
  highlightedNodeIds: string[];
  highlightedIssueIds: string[];
  highlightedScenarioIds: string[];
  highlightedEdgeKeys: string[];
}

export const EMPTY_SELECTION: SelectionState = {
  type: null,
  id: null,
  highlightedNodeIds: [],
  highlightedIssueIds: [],
  highlightedScenarioIds: [],
  highlightedEdgeKeys: [],
};
