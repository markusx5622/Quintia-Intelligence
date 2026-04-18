'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import FinancialCards from '@/src/components/FinancialCards';
import ProcessGraphView from '@/src/components/ProcessGraphView';
import DiagnosticsPanel from '@/src/components/DiagnosticsPanel';
import ExecutiveSynthesisCard from '@/src/components/ExecutiveSynthesisCard';
import type { PipelineResult } from '@/src/lib/types/contracts';

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p
        style={{
          margin: '0 0 4px',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#06b6d4',
        }}
      >
        {label}
      </p>
      <h2
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: '#f1f5f9',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function DashboardPanel({ children, delay }: { children: React.ReactNode; delay?: number }) {
  return (
    <section
      className="q-animate-up"
      style={{
        marginBottom: 32,
        padding: '28px',
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(51,65,85,0.3)',
        borderRadius: 12,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </section>
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
      <div className="q-animate-in" style={{ color: '#64748b', padding: '60px 0', textAlign: 'center' }}>
        <div
          style={{
            width: 28,
            height: 28,
            border: '2px solid rgba(6,182,212,0.3)',
            borderTopColor: '#06b6d4',
            borderRadius: '50%',
            animation: 'q-spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        Loading analysis results…
      </div>
    );
  }

  if (error) {
    return (
      <div className="q-animate-in">
        <div
          style={{
            padding: '20px 24px',
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 10,
            color: '#fca5a5',
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
        <Link
          href={`/pipeline/${jobId}`}
          style={{ color: '#06b6d4', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
        >
          ← Back to Pipeline Status
        </Link>
      </div>
    );
  }

  if (!result) {
    return <div style={{ color: '#64748b' }}>No results available.</div>;
  }

  return (
    <div className="q-animate-in">
      {/* Dashboard Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 36,
        }}
      >
        <div>
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
            Executive Dashboard
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
            Analysis Results
          </h1>
        </div>
        <Link
          href={`/pipeline/${jobId}`}
          style={{
            color: '#64748b',
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 500,
            padding: '6px 12px',
            border: '1px solid rgba(51,65,85,0.3)',
            borderRadius: 6,
            transition: 'border-color 150ms, color 150ms',
          }}
        >
          ← Pipeline
        </Link>
      </div>

      {/* Financial Cards — LAW 4: deterministic output only */}
      {result.financials && (
        <DashboardPanel delay={0}>
          <SectionHeader label="Law 4 · Deterministic" title="Financial Projections" />
          <FinancialCards data={result.financials} />
        </DashboardPanel>
      )}

      {/* Executive Synthesis */}
      {result.synthesis && (
        <DashboardPanel delay={80}>
          <SectionHeader label="Strategic Overview" title="Executive Synthesis" />
          <ExecutiveSynthesisCard data={result.synthesis} />
        </DashboardPanel>
      )}

      {/* Diagnostics */}
      {result.diagnostics && (
        <DashboardPanel delay={160}>
          <SectionHeader label="Process Health" title="Diagnostics" />
          <DiagnosticsPanel data={result.diagnostics} />
        </DashboardPanel>
      )}

      {/* Process Graph */}
      {result.processGraph && (
        <DashboardPanel delay={240}>
          <SectionHeader label="Process Model" title="Process Graph" />
          <ProcessGraphView data={result.processGraph} />
        </DashboardPanel>
      )}

      {/* Critic / Confidence */}
      {result.critic && (
        <DashboardPanel delay={320}>
          <SectionHeader label="Quality Assurance" title="Analysis Confidence" />
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {/* Confidence Gauge */}
            <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: 140 }}>
              <div
                style={{
                  position: 'relative',
                  width: 120,
                  height: 120,
                  margin: '0 auto 12px',
                }}
              >
                <svg viewBox="0 0 120 120" width="120" height="120">
                  {/* Background ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(51,65,85,0.4)"
                    strokeWidth="8"
                  />
                  {/* Score arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={result.critic.confidence_score >= 60 ? '#22c55e' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.critic.confidence_score / 100) * (2 * Math.PI * 50)} ${2 * Math.PI * 50}`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: result.critic.confidence_score >= 60 ? '#22c55e' : '#ef4444',
                      lineHeight: 1,
                    }}
                  >
                    {result.critic.confidence_score}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginTop: 2 }}>
                    / 100
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: result.critic.confidence_score >= 80
                    ? '#22c55e'
                    : result.critic.confidence_score >= 60
                      ? '#f59e0b'
                      : '#ef4444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {result.critic.confidence_score >= 80
                  ? 'High Confidence'
                  : result.critic.confidence_score >= 60
                    ? 'Moderate'
                    : 'Low Confidence'}
              </div>
            </div>

            {/* Summary + Flags */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <p style={{ margin: '0 0 16px', color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
                {result.critic.summary}
              </p>
              {result.critic.flags.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.critic.flags.map((flag, i) => {
                    const flagColor =
                      flag.severity === 'critical'
                        ? '#ef4444'
                        : flag.severity === 'warning'
                          ? '#f59e0b'
                          : '#3b82f6';
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '10px 14px',
                          background: 'rgba(15,23,42,0.4)',
                          border: '1px solid rgba(51,65,85,0.2)',
                          borderLeft: `3px solid ${flagColor}`,
                          borderRadius: '0 8px 8px 0',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 3,
                            background: `${flagColor}20`,
                            color: flagColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {flag.severity}
                        </span>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                            {flag.area}
                          </span>
                          <span style={{ fontSize: 13, color: '#94a3b8' }}> — {flag.concern}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DashboardPanel>
      )}
    </div>
  );
}
