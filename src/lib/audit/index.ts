import { getStorage } from '../storage/factory';
import type { PipelineStage } from '../types/contracts';

export async function logEvent(
  jobId: string,
  stage: PipelineStage | 'job',
  action: 'started' | 'completed' | 'failed' | 'retried',
  details?: string,
): Promise<void> {
  const storage = getStorage();
  await storage.logAuditEvent({
    id: crypto.randomUUID(),
    jobId,
    stage,
    action,
    timestamp: new Date().toISOString(),
    details,
  });
}
