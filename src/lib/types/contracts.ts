// ============================================================================
// QUINTIA — Canonical Contracts
// All pipeline stage types. JSON-serializable. Vendor-independent.
// ============================================================================

// ---------------------------------------------------------------------------
// Job / Pipeline
// ---------------------------------------------------------------------------

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export type PipelineStage =
  | 'ontology'
  | 'process-graph'
  | 'diagnostics'
  | 'scenarios'
  | 'recalculation'
  | 'critic'
  | 'synthesis';

export const PIPELINE_STAGES: PipelineStage[] = [
  'ontology',
  'process-graph',
  'diagnostics',
  'scenarios',
  'recalculation',
  'critic',
  'synthesis',
];

export interface Project {
  id: string;
  name: string;
  description: string;
  narrative: string;
  createdAt: string;
  updatedAt: string;
}

export interface StageRecord {
  stage: PipelineStage;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
}

export interface PipelineJob {
  id: string;
  projectId: string;
  status: JobStatus;
  currentStage: PipelineStage | null;
  stages: StageRecord[];
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Ontology
// ---------------------------------------------------------------------------

export interface OntologyOutput {
  entities: string[];
  roles: string[];
  systems: string[];
  artifacts: string[];
  bottleneck_candidates: string[];
}

// ---------------------------------------------------------------------------
// Process Graph
// ---------------------------------------------------------------------------

export interface ProcessGraphNode {
  id: string;
  label: string;
  type?: string;
}

export interface ProcessGraphEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ProcessGraphOutput {
  nodes: ProcessGraphNode[];
  edges: ProcessGraphEdge[];
  graph_summary: string;
}

// ---------------------------------------------------------------------------
// Diagnostics
// ---------------------------------------------------------------------------

export interface DiagnosticIssue {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence: string;
}

export interface DiagnosticsOutput {
  issues: DiagnosticIssue[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

export interface Intervention {
  title: string;
  rationale: string;
  assumptions: string[];
}

export interface ScenarioOutput {
  interventions: Intervention[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Synthesis
// ---------------------------------------------------------------------------

export interface SynthesisOutput {
  executive_summary: string;
  current_state: string;
  recommendation: string;
  roadmap: string;
}

// ---------------------------------------------------------------------------
// Deterministic Financial — LAW 4
// No AI layer may author these values. Computed in src/lib/financial only.
// ---------------------------------------------------------------------------

export interface FinancialAssumptions {
  annual_process_volume: number;
  current_cost_per_unit_eur: number;
  expected_cost_reduction_percent: number;
  implementation_cost_eur: number;
}

export interface DeterministicFinancialOutput {
  baseline_cost_eur: number;
  expected_savings_eur: number;
  implementation_cost_eur: number;
  roi_percent: number;
  payback_months: number;
}

// ---------------------------------------------------------------------------
// Critic
// ---------------------------------------------------------------------------

export interface CriticFlag {
  area: string;
  concern: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface CriticOutput {
  confidence_score: number;
  flags: CriticFlag[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Complete Pipeline Result
// ---------------------------------------------------------------------------

export interface PipelineResult {
  jobId: string;
  projectId: string;
  ontology: OntologyOutput | null;
  processGraph: ProcessGraphOutput | null;
  diagnostics: DiagnosticsOutput | null;
  scenarios: ScenarioOutput | null;
  financials: DeterministicFinancialOutput | null;
  critic: CriticOutput | null;
  synthesis: SynthesisOutput | null;
}
