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
  const initialized = useRef(false);

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
    if (!initialized.current) {
      initialized.current = true;
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
      <div
        className="q-animate-in"
        style={{
          padding: '20px 24px',
          background: 'rgba(220,38,38,0.08)',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 10,
          color: '#fca5a5',
          fontSize: 14,
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="q-animate-in" style={{ color: '#64748b', padding: '40px 0', textAlign: 'center' }}>
        <div
          style={{
            width: 24,
            height: 24,
            border: '2px solid rgba(6,182,212,0.3)',
            borderTopColor: '#06b6d4',
            borderRadius: '50%',
            animation: 'q-spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        Loading pipeline status…
      </div>
    );
  }

  return (
    <div className="q-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#06b6d4',
          }}
        >
          Workflow Monitor
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: '#f1f5f9',
            letterSpacing: '-0.01em',
          }}
        >
          Pipeline Status
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b', fontFamily: 'var(--q-font-mono)' }}>
          Job {jobId}
        </p>
      </div>

      {job.status === 'pending' && (
        <button
          onClick={handleStart}
          disabled={starting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            background: starting
              ? 'rgba(51,65,85,0.5)'
              : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: starting ? 'not-allowed' : 'pointer',
            marginBottom: 28,
            transition: 'opacity 150ms, transform 150ms',
            boxShadow: starting ? 'none' : '0 0 20px rgba(6, 182, 212, 0.15)',
            letterSpacing: '0.02em',
          }}
        >
          {starting ? (
            <>
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'q-spin 0.8s linear infinite',
                  display: 'inline-block',
                }}
              />
              Starting…
            </>
          ) : (
            <>▶ Start Analysis</>
          )}
        </button>
      )}

      <PipelineStatusPanel job={job} />

      {job.status === 'completed' && (
        <div className="q-animate-up" style={{ marginTop: 28 }}>
          <Link
            href={`/results/${jobId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.15)',
              transition: 'transform 150ms, box-shadow 150ms',
            }}
          >
            View Results
            <span style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
