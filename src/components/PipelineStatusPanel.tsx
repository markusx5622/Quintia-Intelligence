import type { PipelineJob, StageRecord } from '@/src/lib/types/contracts';

const STATUS_META: Record<string, { color: string; dotIcon: string; labelClass: string }> = {
  pending: { color: 'var(--q-slate-400)', dotIcon: '', labelClass: 'q-badge-neutral' },
  running: { color: 'var(--q-accent-500)', dotIcon: '●', labelClass: 'q-badge-info' },
  completed: { color: 'var(--q-success-500)', dotIcon: '✓', labelClass: 'q-badge-success' },
  failed: { color: 'var(--q-danger-500)', dotIcon: '✕', labelClass: 'q-badge-danger' },
};

function formatStageName(stage: string): string {
  return stage
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function StageBadge({ record, isLast }: { record: StageRecord; isLast: boolean }) {
  const meta = STATUS_META[record.status] || STATUS_META.pending;
  return (
    <div className="q-pipeline-stage">
      <div className="q-pipeline-dot" data-status={record.status}>
        {meta.dotIcon}
      </div>
      <span className="q-pipeline-stage-name">{formatStageName(record.stage)}</span>
      <span className={`q-badge ${meta.labelClass}`}>
        {record.status}
      </span>
      {!isLast && <style>{``}</style>}
    </div>
  );
}

export default function PipelineStatusPanel({ job }: { job: PipelineJob }) {
  const meta = STATUS_META[job.status] || STATUS_META.pending;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <span
          className={`q-badge ${meta.labelClass}`}
          style={{ fontSize: 12, padding: '5px 14px' }}
        >
          {job.status === 'running' && '● '}{job.status}
        </span>
        {job.currentStage && (
          <span style={{ color: 'var(--q-slate-500)', fontSize: 14 }}>
            Stage: <strong style={{ color: 'var(--q-navy-800)' }}>{formatStageName(job.currentStage)}</strong>
          </span>
        )}
      </div>

      {job.error && (
        <div className="q-error-banner" style={{ marginBottom: 20 }}>
          ⚠ {job.error}
        </div>
      )}

      <div className="q-card">
        <div className="q-card-header">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--q-navy-800)', letterSpacing: '0.02em' }}>
            Pipeline Stages
          </div>
        </div>
        <div style={{ padding: 'var(--q-space-4) 0' }}>
          <div className="q-pipeline-track">
            {job.stages.map((s, i) => (
              <StageBadge key={s.stage} record={s} isLast={i === job.stages.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
