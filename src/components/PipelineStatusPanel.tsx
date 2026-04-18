import type { PipelineJob, StageRecord } from '@/src/lib/types/contracts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#64748b',
  running: '#06b6d4',
  completed: '#22c55e',
  failed: '#ef4444',
};

const STATUS_BG: Record<string, string> = {
  pending: 'rgba(100,116,139,0.08)',
  running: 'rgba(6,182,212,0.08)',
  completed: 'rgba(34,197,94,0.08)',
  failed: 'rgba(239,68,68,0.08)',
};

function StageRow({ record, index }: { record: StageRecord; index: number }) {
  const color = STATUS_COLORS[record.status] || '#64748b';
  const bg = STATUS_BG[record.status] || 'transparent';
  const isRunning = record.status === 'running';

  return (
    <div
      className={`q-animate-slide q-stagger-${Math.min(index + 1, 7)}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 18px',
        borderLeft: `3px solid ${color}`,
        background: bg,
        borderRadius: '0 8px 8px 0',
        marginBottom: 6,
        transition: 'background 200ms',
        animation: isRunning ? 'q-pulse-glow 2s ease-in-out infinite' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Stage indicator dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
            boxShadow: isRunning ? `0 0 6px ${color}` : 'none',
          }}
        />
        <span style={{ fontWeight: 500, color: '#cbd5e1', fontSize: 14 }}>
          {record.stage}
        </span>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: 4,
          background: `${color}15`,
        }}
      >
        {isRunning && (
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              border: '1.5px solid transparent',
              borderTopColor: color,
              borderRadius: '50%',
              animation: 'q-spin 0.8s linear infinite',
              marginRight: 6,
              verticalAlign: 'middle',
            }}
          />
        )}
        {record.status}
      </span>
    </div>
  );
}

export default function PipelineStatusPanel({ job }: { job: PipelineJob }) {
  const color = STATUS_COLORS[job.status] || '#64748b';

  // Calculate progress
  const completedCount = job.stages.filter((s) => s.status === 'completed').length;
  const totalCount = job.stages.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      {/* Status header + progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            background: `${color}18`,
            color,
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: `1px solid ${color}30`,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
              boxShadow: job.status === 'running' ? `0 0 6px ${color}` : 'none',
            }}
          />
          {job.status}
        </span>
        {job.currentStage && (
          <span style={{ color: '#94a3b8', fontSize: 13 }}>
            Stage: <strong style={{ color: '#e2e8f0' }}>{job.currentStage}</strong>
          </span>
        )}
        <span style={{ color: '#64748b', fontSize: 12, marginLeft: 'auto' }}>
          {completedCount}/{totalCount} stages
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 3,
          background: 'rgba(51,65,85,0.3)',
          borderRadius: 2,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: job.status === 'failed'
              ? '#ef4444'
              : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
            borderRadius: 2,
            transition: 'width 500ms ease-out',
            ...(job.status === 'running'
              ? {
                  backgroundSize: '200% 100%',
                  animation: 'q-progress-shimmer 2s linear infinite',
                  backgroundImage:
                    'linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4, #3b82f6)',
                }
              : {}),
          }}
        />
      </div>

      {job.error && (
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(239,68,68,0.08)',
            color: '#fca5a5',
            borderRadius: 8,
            marginBottom: 16,
            border: '1px solid rgba(239,68,68,0.2)',
            fontSize: 13,
          }}
        >
          {job.error}
        </div>
      )}

      <div>
        {job.stages.map((s, i) => (
          <StageRow key={s.stage} record={s} index={i} />
        ))}
      </div>
    </div>
  );
}
