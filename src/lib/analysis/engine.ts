import type {
  OntologyOutput,
  ProcessGraphOutput,
  DiagnosticsOutput,
  ScenarioOutput,
} from '../types/contracts';

import { extractOntology } from './extractors';
import { buildProcessGraph } from './graph-builder';
import { runDiagnostics } from './diagnostics';
import { generateScenarios } from './scenarios';

/**
 * Internal semantic engine entry point.
 *
 * Rule-based / heuristic analysis — NO external LLM dependency.
 * Returns intermediate structured outputs for the pipeline.
 */
export interface EngineOutput {
  ontology: OntologyOutput;
  processGraph: ProcessGraphOutput;
  diagnostics: DiagnosticsOutput;
  scenarios: ScenarioOutput;
}

export function analyzeNarrative(narrative: string): EngineOutput {
  const ontology = extractOntology(narrative);
  const processGraph = buildProcessGraph(narrative);
  const diagnostics = runDiagnostics(narrative, ontology);
  const scenarios = generateScenarios(diagnostics);

  return { ontology, processGraph, diagnostics, scenarios };
}
