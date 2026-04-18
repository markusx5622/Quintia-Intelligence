import { describe, it, expect, beforeEach } from 'vitest';
import { getStorage, resetStorage } from '@/src/lib/storage/factory';
import { runPipeline } from '@/src/lib/workflow/orchestrator';
import { PIPELINE_STAGES } from '@/src/lib/types/contracts';
import type { PipelineJob, StageRecord } from '@/src/lib/types/contracts';

describe('Pipeline Workflow Integration', () => {
  beforeEach(() => {
    resetStorage();
  });

  it('runs full pipeline successfully', async () => {
    const storage = getStorage();
    const now = new Date().toISOString();

    await storage.createProject({
      id: 'proj-1',
      name: 'Test',
      description: '',
      narrative:
        'The procurement team receives a purchase request. The manager reviews and approves it. If over $5000, VP approval is needed. The procurement officer sends RFQs to vendors. Quotes are evaluated manually in a spreadsheet. A purchase order is created in the ERP system. Delays occur due to manual approval backlogs and email communication.',
      createdAt: now,
      updatedAt: now,
    });

    const stages: StageRecord[] = PIPELINE_STAGES.map((s) => ({
      stage: s,
      status: 'pending' as const,
      startedAt: null,
      completedAt: null,
      error: null,
    }));

    const job: PipelineJob = {
      id: 'job-1',
      projectId: 'proj-1',
      status: 'pending',
      currentStage: null,
      stages,
      error: null,
      createdAt: now,
      updatedAt: now,
    };
    await storage.createJob(job);

    await runPipeline('job-1');

    const updated = await storage.getJob('job-1');
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('completed');
  });

  it('persists all stage results', async () => {
    const storage = getStorage();
    const now = new Date().toISOString();

    await storage.createProject({
      id: 'proj-2',
      name: 'Test 2',
      description: '',
      narrative: 'Customer submits a complaint via email. Support agent logs the ticket in the helpdesk system. The agent investigates the issue. If high severity, escalation to team lead is required. Resolution is documented.',
      createdAt: now,
      updatedAt: now,
    });

    const stages: StageRecord[] = PIPELINE_STAGES.map((s) => ({
      stage: s,
      status: 'pending' as const,
      startedAt: null,
      completedAt: null,
      error: null,
    }));

    await storage.createJob({
      id: 'job-2',
      projectId: 'proj-2',
      status: 'pending',
      currentStage: null,
      stages,
      error: null,
      createdAt: now,
      updatedAt: now,
    });

    await runPipeline('job-2');

    const result = await storage.getFullResult('job-2');
    expect(result).not.toBeNull();
    expect(result!.ontology).not.toBeNull();
    expect(result!.processGraph).not.toBeNull();
    expect(result!.diagnostics).not.toBeNull();
    expect(result!.scenarios).not.toBeNull();
    expect(result!.financials).not.toBeNull();
    expect(result!.critic).not.toBeNull();
    expect(result!.synthesis).not.toBeNull();
  });

  it('records audit events for all stages', async () => {
    const storage = getStorage();
    const now = new Date().toISOString();

    await storage.createProject({
      id: 'proj-3',
      name: 'Test 3',
      description: '',
      narrative: 'IT incident is reported. The operator logs the incident. Technician investigates. Resolution is applied.',
      createdAt: now,
      updatedAt: now,
    });

    const stages: StageRecord[] = PIPELINE_STAGES.map((s) => ({
      stage: s,
      status: 'pending' as const,
      startedAt: null,
      completedAt: null,
      error: null,
    }));

    await storage.createJob({
      id: 'job-3',
      projectId: 'proj-3',
      status: 'pending',
      currentStage: null,
      stages,
      error: null,
      createdAt: now,
      updatedAt: now,
    });

    await runPipeline('job-3');

    const auditLog = await storage.getAuditLog('job-3');
    // Job started + 7 stages * (started + completed) + job completed = 16
    expect(auditLog.length).toBe(16);
  });
});
