'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import FinancialCards from '@/src/components/FinancialCards';
import ExecutiveSynthesisCard from '@/src/components/ExecutiveSynthesisCard';
import ScenarioComparisonPanel from '@/src/components/ScenarioComparisonPanel';
import EvidencePanel from '@/src/components/EvidencePanel';
import InteractiveGraphView from '@/src/components/InteractiveGraphView';
import { useIntelligenceLinker } from '@/src/components/useIntelligenceLinker';
import { buildIntelligenceModel } from '@/src/lib/analysis/intelligence-linker';
import type { PipelineResult } from '@/src/lib/types/contracts';

function ResultsLoadingSkeleton() {
  return (
    <div className="q-animate-in">
      <div style={{ marginBottom: 48 }}>
        <div className="q-skeleton q-skeleton-text-lg" style={{ width: '30%', marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="q-skeleton q-skeleton-card" style={{ height: 110 }} />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 48 }}>
        <div className="q-skeleton q-skeleton-text-lg" style={{ width: '25%', marginBottom: 20 }} />
        <div className="q-skeleton q-skeleton-card" style={{ height: 200 }} />
      </div>
      <div>
        <div className="q-skeleton q-skeleton-text-lg" style={{ width: '20%', marginBottom: 20 }} />
        <div className="q-skeleton q-skeleton-card" style={{ height: 180 }} />
      </div>
    </div>
  );
}

function ConfidenceRing({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'var(--q-success-400)' : score >= 40 ? 'var(--q-warning-400)' : 'var(--q-danger-400)';
  const label = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low';

  return (
    <div className="q-confidence-ring">
      <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`Confidence score: ${score}%`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--q-surface-3)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="q-confidence-value">
        <span className="q-confidence-number" style={{ color }}>{score}%</span>
        <span className="q-confidence-label">{label}</span>
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
        if (res.status === 404) throw new Error('Results not found — the analysis may not have completed yet.');
        if (!res.ok) throw new Error('Failed to load analysis results');
        return res.json() as Promise<PipelineResult>;
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unable to load results');
        setLoading(false);
      });

    return () => controller.abort();
  }, [jobId]);

  const intelligenceModel = useMemo(
    () => (result ? buildIntelligenceModel(result) : null),
    [result],
  );

  const linker = useIntelligenceLinker(intelligenceModel);

  if (loading) {
    return (
      <div className="q-page-content-enter">
        <div className="q-breadcrumb">
          <Link href="/projects">Projects</Link>
          <span className="q-breadcrumb-sep" />
          <Link href={`/pipeline/${jobId}`}>Pipeline</Link>
          <span className="q-breadcrumb-sep" />
          <span>Results</span>
        </div>
        <div className="q-page-header" style={{ marginBottom: 32 }}>
          <div className="q-page-header-left">
            <h1 className="q-page-title">Analysis Results</h1>
            <span className="q-page-subtitle">Loading intelligence output…</span>
          </div>
        </div>
        <ResultsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="q-page-content-enter">
        <div className="q-breadcrumb">
          <Link href="/projects">Projects</Link>
          <span className="q-breadcrumb-sep" />
          <Link href={`/pipeline/${jobId}`}>Pipeline</Link>
          <span className="q-breadcrumb-sep" />
          <span>Results</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <div className="q-error-banner" role="alert" style={{ marginBottom: 16 }}>⚠ {error}</div>
          <Link href={`/pipeline/${jobId}`} style={{ color: 'var(--q-cyan-400)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            ← Back to Pipeline Status
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="q-page-content-enter">
        <div className="q-empty-state-refined">
          <div className="q-empty-state-refined-icon">📊</div>
          <div className="q-empty-state-refined-title">No results available</div>
          <div className="q-empty-state-refined-desc">
            The analysis pipeline may still be running or results have not been generated.
          </div>
          <Link href={`/pipeline/${jobId}`} className="q-btn q-btn-ghost" style={{ fontSize: 13 }}>
            ← Check Pipeline Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="q-page-content-enter">
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
            Job {jobId.substring(0, 8)}…
          </span>
        </div>
        <Link href={`/pipeline/${jobId}`} className="q-btn q-btn-ghost">
          ← Pipeline
        </Link>
      </div>

      {linker.hasSelection && (
        <div className="q-selection-bar q-animate-in-scale">
          <span className="q-selection-bar-label">
            Selected {linker.selection.type}:
          </span>
          <span className="q-selection-bar-id">{linker.selection.id}</span>
          <span style={{ fontSize: 11, color: 'var(--q-slate-400)' }}>
            {linker.selection.highlightedNodeIds.length} node(s) ·
            {' '}{linker.selection.highlightedIssueIds.length} issue(s) ·
            {' '}{linker.selection.highlightedScenarioIds.length} scenario(s)
          </span>
          <button
            className="q-selection-bar-clear"
            onClick={linker.clearSelection}
            aria-label="Clear selection"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Financial Cards — LAW 4: deterministic output only */}
      {result.financials && (
        <section className="q-section q-animate-in">
          <h2 className="q-section-title">Financial Projections</h2>
          <FinancialCards data={result.financials} />
        </section>
      )}

      {result.synthesis && (
        <section className="q-section q-animate-in" style={{ animationDelay: '60ms' }}>
          <h2 className="q-section-title">Executive Synthesis</h2>
          <ExecutiveSynthesisCard data={result.synthesis} />
        </section>
      )}

      {intelligenceModel && intelligenceModel.scenarios.length > 0 && (
        <section className="q-section q-animate-in" style={{ animationDelay: '120ms' }}>
          <h2 className="q-section-title">Scenario Comparison</h2>
          <ScenarioComparisonPanel
            scenarios={intelligenceModel.scenarios}
            baselineFinancials={intelligenceModel.baselineFinancials}
            selection={linker.selection}
            onSelectScenario={linker.selectScenario}
          />
        </section>
      )}

      {intelligenceModel && intelligenceModel.issues.length > 0 && (
        <section className="q-section q-animate-in" style={{ animationDelay: '180ms' }}>
          <h2 className="q-section-title">Diagnostics &amp; Evidence</h2>
          <EvidencePanel
            issues={intelligenceModel.issues}
            selection={linker.selection}
            onSelectIssue={linker.selectIssue}
          />
        </section>
      )}

      {intelligenceModel && intelligenceModel.graphNodes.length > 0 && (
        <section className="q-section q-animate-in" style={{ animationDelay: '240ms' }}>
          <h2 className="q-section-title">Process Graph</h2>
          <InteractiveGraphView
            nodes={intelligenceModel.graphNodes}
            edges={intelligenceModel.graphEdges}
            graphSummary={intelligenceModel.graphSummary}
            selection={linker.selection}
            onSelectNode={linker.selectNode}
          />
        </section>
      )}

      {result.critic && (
        <section className="q-section q-animate-in" style={{ animationDelay: '300ms' }}>
          <h2 className="q-section-title">Analysis Confidence</h2>
          <div className="q-card">
            <div className="q-card-body">
              <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <ConfidenceRing score={result.critic.confidence_score} />
                <div style={{ flex: 1, minWidth: 240 }}>
                  <p style={{ color: 'var(--q-slate-300)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                    {result.critic.summary}
                  </p>
                  {result.critic.flags.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--q-slate-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                        Quality Flags
                      </div>
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
                            lineHeight: 1.5,
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
