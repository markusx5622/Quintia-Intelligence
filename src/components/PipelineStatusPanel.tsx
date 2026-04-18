import { useState, useEffect, useRef } from 'react';
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

function StageRow({ record, index, visibleCount }: { record: StageRecord; index: number; visibleCount: number }) {
  const meta = STATUS_META[record.status] || STATUS_META.pending;
  const isVisible = index < visibleCount;
  const isActive = record.status === 'running';
  const isCompleted = record.status === 'completed';
  const isFailed = record.status === 'failed';

  return (
    <div
      className={`q-pipeline-stage ${isActive ? 'q-pipeline-stage--active' : ''} ${isCompleted ? 'q-pipeline-stage--completed' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
      }}
    >
      {/* Connector line to previous stage */}
      <div className="q-pipeline-stage-connector">
        <div
          className="q-pipeline-connector-line"
          data-status={isCompleted ? 'completed' : isActive ? 'running' : isFailed ? 'failed' : 'pending'}
        />
      </div>

      {/* Stage dot */}
      <div className={`q-pipeline-dot-wrap ${isActive ? 'q-pipeline-dot-wrap--active' : ''}`}>
        <div className="q-pipeline-dot" data-status={record.status}>
          {meta.dotIcon}
        </div>
        {isActive && <div className="q-pipeline-dot-ring" />}
      </div>

      {/* Stage content */}
      <div className="q-pipeline-stage-content">
        <span className="q-pipeline-stage-name">
          {formatStageName(record.stage)}
        </span>
        <span className={`q-badge ${meta.labelClass}`} style={{ fontSize: 10, padding: '3px 10px' }}>
          {record.status}
        </span>
      </div>

      {/* Progress shimmer for running stage */}
      {isActive && <div className="q-pipeline-stage-shimmer" />}
    </div>
  );
}

function OverallProgress({ stages }: { stages: StageRecord[] }) {
  const completed = stages.filter((s) => s.status === 'completed').length;
  const total = stages.length;
  const running = stages.some((s) => s.status === 'running');
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="q-pipeline-progress-bar">
      <div className="q-pipeline-progress-header">
        <span className="q-pipeline-progress-label">Overall Progress</span>
        <span className="q-pipeline-progress-pct">{pct}%</span>
      </div>
      <div className="q-pipeline-progress-track">
        <div
          className={`q-pipeline-progress-fill ${running ? 'q-pipeline-progress-fill--active' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="q-pipeline-progress-count">
        {completed} of {total} stages completed
      </span>
    </div>
  );
}

export default function PipelineStatusPanel({ job }: { job: PipelineJob }) {
  const meta = STATUS_META[job.status] || STATUS_META.pending;
  const [visibleCount, setVisibleCount] = useState(0);
  const prevStagesRef = useRef<string>('');

  useEffect(() => {
    const stagesKey = job.stages.map((s) => `${s.stage}:${s.status}`).join('|');
    if (stagesKey !== prevStagesRef.current) {
      prevStagesRef.current = stagesKey;
      // Reveal stages progressively
      setVisibleCount(0);
      const timer = setTimeout(() => setVisibleCount(job.stages.length), 50);
      return () => clearTimeout(timer);
    }
  }, [job.stages]);

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
          <span style={{ color: 'var(--q-slate-400)', fontSize: 14 }}>
            Stage: <strong style={{ color: 'var(--q-white)' }}>{formatStageName(job.currentStage)}</strong>
          </span>
        )}
      </div>

      {job.error && (
        <div className="q-error-banner" style={{ marginBottom: 20 }}>
          ⚠ {job.error}
        </div>
      )}

      {/* Overall progress bar */}
      <OverallProgress stages={job.stages} />

      <div className="q-card" style={{ marginTop: 20 }}>
        <div className="q-card-header">
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--q-slate-200)', letterSpacing: '0.02em' }}>
            Pipeline Stages
          </div>
        </div>
        <div style={{ padding: 'var(--q-space-4) 0' }}>
          <div className="q-pipeline-track">
            {job.stages.map((s, i) => (
              <StageRow key={s.stage} record={s} index={i} visibleCount={visibleCount} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
