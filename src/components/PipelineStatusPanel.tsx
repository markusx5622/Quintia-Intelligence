import type { PipelineJob, StageRecord } from '@/src/lib/types/contracts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#94a3b8',
  running: '#3b82f6',
  completed: '#22c55e',
  failed: '#ef4444',
};

function StageBadge({ record }: { record: StageRecord }) {
  const color = STATUS_COLORS[record.status] || '#94a3b8';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        borderLeft: `4px solid ${color}`,
        background: '#f8fafc',
        borderRadius: '0 6px 6px 0',
        marginBottom: 6,
      }}
    >
      <span style={{ fontWeight: 500, color: '#334155' }}>{record.stage}</span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color,
          textTransform: 'uppercase',
        }}
      >
        {record.status}
      </span>
    </div>
  );
}

export default function PipelineStatusPanel({ job }: { job: PipelineJob }) {
  const color = STATUS_COLORS[job.status] || '#94a3b8';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: color,
            color: '#fff',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {job.status}
        </span>
        {job.currentStage && (
          <span style={{ color: '#64748b', fontSize: 14 }}>
            Stage: <strong>{job.currentStage}</strong>
          </span>
        )}
      </div>

      {job.error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#991b1b', borderRadius: 6, marginBottom: 16, border: '1px solid #fecaca' }}>
          {job.error}
        </div>
      )}

      <div>
        {job.stages.map((s) => (
          <StageBadge key={s.stage} record={s} />
        ))}
      </div>
    </div>
  );
}
