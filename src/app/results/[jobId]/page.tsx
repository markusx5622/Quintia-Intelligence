'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import FinancialCards from '@/src/components/FinancialCards';
import ProcessGraphView from '@/src/components/ProcessGraphView';
import DiagnosticsPanel from '@/src/components/DiagnosticsPanel';
import ExecutiveSynthesisCard from '@/src/components/ExecutiveSynthesisCard';
import type { PipelineResult } from '@/src/lib/types/contracts';

function ConfidenceRing({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'var(--q-success-400)' : score >= 40 ? 'var(--q-warning-400)' : 'var(--q-danger-400)';

  return (
    <div className="q-confidence-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--q-surface-3)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="q-confidence-value">
        <span className="q-confidence-number" style={{ color }}>{score}%</span>
        <span className="q-confidence-label">Score</span>
      </div>
    </div>
  );
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/results/${jobId}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 404) throw new Error('Results not found');
        if (!res.ok) throw new Error('Failed to load results');
        return res.json() as Promise<PipelineResult>;
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load results');
        setLoading(false);
      });

    return () => controller.abort();
  }, [jobId]);

  if (loading) {
    return (
      <div className="q-loading">
        <div className="q-loading-spinner" />
        Loading results...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="q-error-banner" style={{ marginBottom: 16 }}>⚠ Error: {error}</div>
        <Link href={`/pipeline/${jobId}`} style={{ color: 'var(--q-cyan-400)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          ← Back to Pipeline Status
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="q-empty-state">
        <div className="q-empty-state-icon">📊</div>
        <p>No results available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="q-breadcrumb">
        <Link href="/projects">Projects</Link>
        <span className="q-breadcrumb-sep" />
        <Link href={`/pipeline/${jobId}`}>Pipeline</Link>
        <span className="q-breadcrumb-sep" />
        <span>Results</span>
      </div>

      <div className="q-page-header">
        <div className="q-page-header-left">
          <h1 className="q-page-title">Analysis Results</h1>
          <span className="q-page-subtitle" style={{ fontFamily: 'var(--q-font-mono)', fontSize: 12 }}>
            Job: {jobId}
          </span>
        </div>
        <Link href={`/pipeline/${jobId}`} className="q-btn q-btn-ghost">
          ← Pipeline Status
        </Link>
      </div>

      {/* Financial Cards — LAW 4: deterministic output only */}
      {result.financials && (
        <section className="q-section">
          <h2 className="q-section-title">Financial Projections</h2>
          <FinancialCards data={result.financials} />
        </section>
      )}

      {/* Executive Synthesis */}
      {result.synthesis && (
        <section className="q-section">
          <h2 className="q-section-title">Executive Synthesis</h2>
          <ExecutiveSynthesisCard data={result.synthesis} />
        </section>
      )}

      {/* Diagnostics */}
      {result.diagnostics && (
        <section className="q-section">
          <h2 className="q-section-title">Diagnostics</h2>
          <DiagnosticsPanel data={result.diagnostics} />
        </section>
      )}

      {/* Process Graph */}
      {result.processGraph && (
        <section className="q-section">
          <h2 className="q-section-title">Process Graph</h2>
          <ProcessGraphView data={result.processGraph} />
        </section>
      )}

      {/* Critic / Confidence */}
      {result.critic && (
        <section className="q-section">
          <h2 className="q-section-title">Analysis Confidence</h2>
          <div className="q-card">
            <div className="q-card-body">
              <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <ConfidenceRing score={result.critic.confidence_score} />
                <div style={{ flex: 1, minWidth: 240 }}>
                  <p style={{ color: 'var(--q-slate-300)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                    {result.critic.summary}
                  </p>
                  {result.critic.flags.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {result.critic.flags.map((flag, i) => {
                        const badgeClass = flag.severity === 'critical' ? 'q-badge-danger'
                          : flag.severity === 'warning' ? 'q-badge-warning'
                          : 'q-badge-info';
                        return (
                          <div key={i} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            fontSize: 13,
                            padding: '10px 14px',
                            background: 'var(--q-surface-3)',
                            borderRadius: 'var(--q-radius-md)',
                            border: '1px solid var(--q-border-subtle)',
                          }}>
                            <span className={`q-badge ${badgeClass}`} style={{ flexShrink: 0, marginTop: 1 }}>
                              {flag.severity}
                            </span>
                            <span style={{ color: 'var(--q-slate-300)' }}>
                              <strong style={{ color: 'var(--q-white)' }}>{flag.area}:</strong> {flag.concern}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
