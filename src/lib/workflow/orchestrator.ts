import { getStorage } from '../storage/factory';
import { logEvent } from '../audit/index';
import type {
  PipelineStage,
  StageRecord,
  OntologyOutput,
  ProcessGraphOutput,
  DiagnosticsOutput,
  ScenarioOutput,
  DeterministicFinancialOutput,
  CriticOutput,
} from '../types/contracts';
import { PIPELINE_STAGES } from '../types/contracts';

import { runOntologyStage } from './stages/ontology';
import { runProcessGraphStage } from './stages/process-graph';
import { runDiagnosticsStage } from './stages/diagnostics';
import { runScenariosStage } from './stages/scenarios';
import { runRecalculationStage } from './stages/recalculation';
import { runCriticStage } from './stages/critic';
import { runSynthesisStage } from './stages/synthesis';

/**
 * Run the full 7-stage pipeline for a given job.
 *
 * Executes sequentially. Each stage:
 *  1. Updates job status to show current stage
 *  2. Logs audit event (started)
 *  3. Runs the stage logic
 *  4. Persists stage output
 *  5. Logs audit event (completed)
 *  6. On failure: marks stage + job as failed, logs error, stops
 */
export async function runPipeline(jobId: string): Promise<void> {
  const storage = getStorage();

  const job = await storage.getJob(jobId);
  if (!job) throw new Error(`Job not found: ${jobId}`);

  const project = await storage.getProject(job.projectId);
  if (!project) throw new Error(`Project not found: ${job.projectId}`);

  const narrative = project.narrative;

  // Initialise stage records
  const stages: StageRecord[] = PIPELINE_STAGES.map((s) => ({
    stage: s,
    status: 'pending' as const,
    startedAt: null,
    completedAt: null,
    error: null,
  }));

  await storage.updateJob(jobId, { status: 'running', stages });
  await logEvent(jobId, 'job', 'started');

  // Accumulated outputs for cross-stage dependencies
  let ontology: OntologyOutput | null = null;
  let processGraph: ProcessGraphOutput | null = null;
  let diagnostics: DiagnosticsOutput | null = null;
  let scenarios: ScenarioOutput | null = null;
  let financials: DeterministicFinancialOutput | null = null;
  let critic: CriticOutput | null = null;

  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stageName: PipelineStage = PIPELINE_STAGES[i];

    // Mark stage as running
    stages[i] = { ...stages[i], status: 'running', startedAt: new Date().toISOString() };
    await storage.updateJob(jobId, { currentStage: stageName, stages: [...stages] });
    await logEvent(jobId, stageName, 'started');

    try {
      let result: unknown;

      switch (stageName) {
        case 'ontology':
          ontology = runOntologyStage(narrative);
          result = ontology;
          break;
        case 'process-graph':
          processGraph = runProcessGraphStage(narrative);
          result = processGraph;
          break;
        case 'diagnostics':
          diagnostics = runDiagnosticsStage(narrative, ontology!);
          result = diagnostics;
          break;
        case 'scenarios':
          scenarios = runScenariosStage(diagnostics!);
          result = scenarios;
          break;
        case 'recalculation':
          financials = runRecalculationStage(diagnostics!, scenarios!);
          result = financials;
          break;
        case 'critic':
          critic = runCriticStage({
            ontology: ontology!,
            processGraph: processGraph!,
            diagnostics: diagnostics!,
            scenarios: scenarios!,
            financials: financials!,
          });
          result = critic;
          break;
        case 'synthesis':
          result = runSynthesisStage({
            ontology: ontology!,
            processGraph: processGraph!,
            diagnostics: diagnostics!,
            scenarios: scenarios!,
            financials: financials!,
            critic: critic!,
          });
          break;
      }

      // Persist stage output
      await storage.saveStageResult(jobId, stageName, result);

      // Mark stage completed
      stages[i] = { ...stages[i], status: 'completed', completedAt: new Date().toISOString() };
      await storage.updateJob(jobId, { stages: [...stages] });
      await logEvent(jobId, stageName, 'completed');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      stages[i] = {
        ...stages[i],
        status: 'failed',
        completedAt: new Date().toISOString(),
        error: errorMsg,
      };
      await storage.updateJob(jobId, {
        status: 'failed',
        stages: [...stages],
        error: `Stage ${stageName} failed: ${errorMsg}`,
      });
      await logEvent(jobId, stageName, 'failed', errorMsg);
      return; // Stop pipeline on failure
    }
  }

  // All stages completed
  await storage.updateJob(jobId, { status: 'completed', currentStage: null });
  await logEvent(jobId, 'job', 'completed');
}
