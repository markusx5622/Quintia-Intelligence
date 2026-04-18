'use client';

import { use, useState, useEffect, useCallback } from 'react';
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
    fetchStatus();
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
    return <div style={{ color: '#dc2626' }}>Error: {error}</div>;
  }

  if (!job) {
    return <div style={{ color: '#64748b' }}>Loading pipeline status...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Pipeline Status</h1>
      <p style={{ color: '#64748b', marginBottom: 20, fontSize: 13 }}>
        Job: {jobId}
      </p>

      {job.status === 'pending' && (
        <button
          onClick={handleStart}
          disabled={starting}
          style={{
            padding: '10px 24px',
            background: starting ? '#94a3b8' : '#1e40af',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: starting ? 'not-allowed' : 'pointer',
            marginBottom: 20,
          }}
        >
          {starting ? 'Starting...' : '▶ Start Analysis'}
        </button>
      )}

      <PipelineStatusPanel job={job} />

      {job.status === 'completed' && (
        <div style={{ marginTop: 24 }}>
          <Link
            href={`/results/${jobId}`}
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: '#16a34a',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            View Results →
          </Link>
        </div>
      )}
    </div>
  );
}
