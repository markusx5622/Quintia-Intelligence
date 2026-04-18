import type { StorageAdapter, AuditEvent } from './types';
import type {
  Project,
  PipelineJob,
  PipelineResult,
  PipelineStage,
} from '../types/contracts';

/**
 * In-memory storage adapter — zero-setup dev / demo mode.
 * Data lives only for the lifetime of the process.
 */
export class MemoryAdapter implements StorageAdapter {
  private projects = new Map<string, Project>();
  private jobs = new Map<string, PipelineJob>();
  private stageResults = new Map<string, unknown>(); // key = `${jobId}:${stage}`
  private auditEvents: AuditEvent[] = [];

  // -- Projects --------------------------------------------------------------

  async createProject(project: Project): Promise<Project> {
    this.projects.set(project.id, { ...project });
    return { ...project };
  }

  async getProject(id: string): Promise<Project | null> {
    const p = this.projects.get(id);
    return p ? { ...p } : null;
  }

  async listProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).map((p) => ({ ...p }));
  }

  // -- Jobs ------------------------------------------------------------------

  async createJob(job: PipelineJob): Promise<PipelineJob> {
    this.jobs.set(job.id, { ...job, stages: job.stages.map((s) => ({ ...s })) });
    return { ...job, stages: job.stages.map((s) => ({ ...s })) };
  }

  async getJob(id: string): Promise<PipelineJob | null> {
    const j = this.jobs.get(id);
    return j ? { ...j, stages: j.stages.map((s) => ({ ...s })) } : null;
  }

  async updateJob(id: string, updates: Partial<PipelineJob>): Promise<PipelineJob> {
    const existing = this.jobs.get(id);
    if (!existing) throw new Error(`Job not found: ${id}`);
    const updated: PipelineJob = {
      ...existing,
      ...updates,
      stages: updates.stages
        ? updates.stages.map((s) => ({ ...s }))
        : existing.stages.map((s) => ({ ...s })),
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(id, updated);
    return { ...updated, stages: updated.stages.map((s) => ({ ...s })) };
  }

  // -- Stage Results ---------------------------------------------------------

  async saveStageResult(
    jobId: string,
    stage: PipelineStage,
    result: unknown,
  ): Promise<void> {
    this.stageResults.set(`${jobId}:${stage}`, JSON.parse(JSON.stringify(result)));
  }

  async getStageResult(jobId: string, stage: PipelineStage): Promise<unknown | null> {
    const r = this.stageResults.get(`${jobId}:${stage}`);
    return r !== undefined ? JSON.parse(JSON.stringify(r)) : null;
  }

  async getFullResult(jobId: string): Promise<PipelineResult | null> {
    const job = await this.getJob(jobId);
    if (!job) return null;

    return {
      jobId,
      projectId: job.projectId,
      ontology: (await this.getStageResult(jobId, 'ontology')) as PipelineResult['ontology'],
      processGraph: (await this.getStageResult(jobId, 'process-graph')) as PipelineResult['processGraph'],
      diagnostics: (await this.getStageResult(jobId, 'diagnostics')) as PipelineResult['diagnostics'],
      scenarios: (await this.getStageResult(jobId, 'scenarios')) as PipelineResult['scenarios'],
      financials: (await this.getStageResult(jobId, 'recalculation')) as PipelineResult['financials'],
      critic: (await this.getStageResult(jobId, 'critic')) as PipelineResult['critic'],
      synthesis: (await this.getStageResult(jobId, 'synthesis')) as PipelineResult['synthesis'],
    };
  }

  // -- Audit -----------------------------------------------------------------

  async logAuditEvent(event: AuditEvent): Promise<void> {
    this.auditEvents.push({ ...event });
  }

  async getAuditLog(jobId: string): Promise<AuditEvent[]> {
    return this.auditEvents
      .filter((e) => e.jobId === jobId)
      .map((e) => ({ ...e }));
  }
}
