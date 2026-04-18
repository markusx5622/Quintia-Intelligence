'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import PipelineStatusPanel from '@/src/components/PipelineStatusPanel';
import type { PipelineJob } from '@/src/lib/types/contracts';

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
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = await res.json();
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
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
        throw new Error(data.error || 'Failed to start');
      }
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start pipeline');
    } finally {
      setStarting(false);
    }
  }

  if (error && !job) {
    return (
      <div className="q-error-banner">⚠ Error: {error}</div>
    );
  }

  if (!job) {
    return (
      <div className="q-loading">
        <div className="q-loading-spinner" />
        Loading pipeline status...
      </div>
    );
  }

  return (
    <div>
      <div className="q-breadcrumb">
        <Link href="/projects">Projects</Link>
        <span className="q-breadcrumb-sep" />
        <span>Pipeline</span>
      </div>

      <div className="q-page-header" style={{ marginBottom: 24 }}>
        <div className="q-page-header-left">
          <h1 className="q-page-title">Pipeline Status</h1>
          <span className="q-page-subtitle" style={{ fontFamily: 'var(--q-font-mono)', fontSize: 12 }}>
            Job: {jobId}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {job.status === 'pending' && (
            <button
              onClick={handleStart}
              disabled={starting}
              className="q-btn q-btn-primary"
            >
              {starting ? 'Starting...' : '▶ Start Analysis'}
            </button>
          )}

          {job.status === 'completed' && (
            <Link href={`/results/${jobId}`} className="q-btn q-btn-success">
              View Results →
            </Link>
          )}
        </div>
      </div>

      <PipelineStatusPanel job={job} />
    </div>
  );
}
