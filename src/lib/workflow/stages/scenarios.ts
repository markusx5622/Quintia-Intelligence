import type { ScenarioOutput, DiagnosticsOutput } from '../../types/contracts';
import { generateScenarios } from '../../analysis/scenarios';

export function runScenariosStage(diagnostics: DiagnosticsOutput): ScenarioOutput {
  return generateScenarios(diagnostics);
}
