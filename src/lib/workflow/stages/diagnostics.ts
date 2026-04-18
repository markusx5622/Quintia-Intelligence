import type { DiagnosticsOutput, OntologyOutput } from '../../types/contracts';
import { runDiagnostics } from '../../analysis/diagnostics';

export function runDiagnosticsStage(
  narrative: string,
  ontology: OntologyOutput,
): DiagnosticsOutput {
  return runDiagnostics(narrative, ontology);
}
