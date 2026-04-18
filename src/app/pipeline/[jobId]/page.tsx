'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import PipelineStatusPanel from '@/src/components/PipelineStatusPanel';
import type { PipelineJob } from '@/src/lib/types/contracts';

function PipelineLoadingSkeleton() {
  return (
    <div className="q-animate-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="q-skeleton" style={{ height: 48, borderRadius: 'var(--q-radius-lg)', width: '60%' }} />
        <div className="q-skeleton" style={{ height: 16, borderRadius: 'var(--q-radius-sm)', width: '40%' }} />
      </div>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="q-skeleton q-skeleton-card" style={{ height: 80 }} />
        <div className="q-skeleton q-skeleton-card" style={{ height: 280 }} />
      </div>
    </div>
  );
}

export default function PipelinePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [job, setJob] = useState<PipelineJob | null>(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const initialFetchDone = useRef(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/pipeline/${jobId}/status`);
      if (!res.ok) throw new Error('Failed to fetch pipeline status');
      const data = await res.json();
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load pipeline status');
    }
  }, [jobId]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchStatus();
    }
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  async function handleStart() {
    setStarting(true);
    try {
      const res = await fetch(`/api/pipeline/${jobId}/start`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start pipeline');
      }
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start analysis pipeline');
    } finally {
      setStarting(false);
    }
  }

  if (error && !job) {
    return (
      <div className="q-page-content-enter">
        <div className="q-breadcrumb">
          <Link href="/projects">Projects</Link>
          <span className="q-breadcrumb-sep" />
          <span>Pipeline</span>
        </div>
        <div className="q-error-banner" role="alert" style={{ marginTop: 16 }}>
          ⚠ {error}
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/projects" style={{ color: 'var(--q-cyan-400)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="q-page-content-enter">
        <div className="q-breadcrumb">
          <Link href="/projects">Projects</Link>
          <span className="q-breadcrumb-sep" />
          <span>Pipeline</span>
        </div>
        <PipelineLoadingSkeleton />
      </div>
    );
  }

  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';
  const isPending = job.status === 'pending';
  const isRunning = job.status === 'running';

  return (
    <div className="q-page-content-enter">
      <div className="q-breadcrumb">
        <Link href="/projects">Projects</Link>
        <span className="q-breadcrumb-sep" />
        <span>Pipeline</span>
      </div>

      <div className="q-page-header" style={{ marginBottom: 24 }}>
        <div className="q-page-header-left">
          <h1 className="q-page-title">
            {isCompleted ? 'Analysis Complete' : isFailed ? 'Pipeline Failed' : isRunning ? 'Analysis in Progress' : 'Pipeline Ready'}
          </h1>
          <span className="q-page-subtitle" style={{ fontFamily: 'var(--q-font-mono)', fontSize: 12 }}>
            Job {jobId.substring(0, 8)}…
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {isPending && (
            <button
              onClick={handleStart}
              disabled={starting}
              className="q-btn q-btn-primary"
              style={{ minWidth: 160 }}
            >
              {starting ? (
                <>
                  <span className="q-loading-spinner" style={{ width: 14, height: 14, borderWidth: '1.5px' }} />
                  Starting…
                </>
              ) : (
                'Start Analysis'
              )}
            </button>
          )}

          {isCompleted && (
            <Link href={`/results/${jobId}`} className="q-btn q-btn-success">
              View Results →
            </Link>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="q-pipeline-completed-banner q-animate-in" style={{ marginBottom: 20 }}>
          <span className="q-pipeline-completed-banner-icon">✓</span>
          <span className="q-pipeline-completed-banner-text">
            All pipeline stages completed successfully. Results are ready for review.
          </span>
        </div>
      )}

      {isFailed && job.error && (
        <div className="q-error-banner" role="alert" style={{ marginBottom: 20 }}>
          ⚠ Pipeline failed: {job.error}
        </div>
      )}

      <PipelineStatusPanel job={job} />
    </div>
  );
}
