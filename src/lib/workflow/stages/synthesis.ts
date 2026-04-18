import type {
  SynthesisOutput,
  OntologyOutput,
  ProcessGraphOutput,
  DiagnosticsOutput,
  ScenarioOutput,
  DeterministicFinancialOutput,
  CriticOutput,
} from '../../types/contracts';
import { generateSynthesis } from '../../analysis/synthesis';

export function runSynthesisStage(inputs: {
  ontology: OntologyOutput;
  processGraph: ProcessGraphOutput;
  diagnostics: DiagnosticsOutput;
  scenarios: ScenarioOutput;
  financials: DeterministicFinancialOutput;
  critic: CriticOutput;
}): SynthesisOutput {
  return generateSynthesis(inputs);
}
