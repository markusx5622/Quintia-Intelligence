import type {
  Project,
  PipelineJob,
  PipelineResult,
  PipelineStage,
} from '../types/contracts';

// ---------------------------------------------------------------------------
// Audit Event
// ---------------------------------------------------------------------------

export interface AuditEvent {
  id: string;
  jobId: string;
  stage: PipelineStage | 'job';
  action: 'started' | 'completed' | 'failed' | 'retried';
  timestamp: string;
  details?: string;
}

// ---------------------------------------------------------------------------
// Storage Adapter Interface
// ---------------------------------------------------------------------------

export interface StorageAdapter {
  // Projects
  createProject(project: Project): Promise<Project>;
  getProject(id: string): Promise<Project | null>;
  listProjects(): Promise<Project[]>;

  // Jobs
  createJob(job: PipelineJob): Promise<PipelineJob>;
  getJob(id: string): Promise<PipelineJob | null>;
  updateJob(id: string, updates: Partial<PipelineJob>): Promise<PipelineJob>;

  // Stage Results
  saveStageResult(jobId: string, stage: PipelineStage, result: unknown): Promise<void>;
  getStageResult(jobId: string, stage: PipelineStage): Promise<unknown | null>;
  getFullResult(jobId: string): Promise<PipelineResult | null>;

  // Audit
  logAuditEvent(event: AuditEvent): Promise<void>;
  getAuditLog(jobId: string): Promise<AuditEvent[]>;
}
