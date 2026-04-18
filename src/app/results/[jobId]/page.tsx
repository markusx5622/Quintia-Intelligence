import Link from 'next/link';
import { getStorage } from '@/src/lib/storage/factory';
import { notFound } from 'next/navigation';
import FinancialCards from '@/src/components/FinancialCards';
import ProcessGraphView from '@/src/components/ProcessGraphView';
import DiagnosticsPanel from '@/src/components/DiagnosticsPanel';
import ExecutiveSynthesisCard from '@/src/components/ExecutiveSynthesisCard';
import type { PipelineResult } from '@/src/lib/types/contracts';

export const dynamic = 'force-dynamic';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const storage = getStorage();
  const result: PipelineResult | null = await storage.getFullResult(jobId);

  if (!result) return notFound();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Analysis Results</h1>
        <Link
          href={`/pipeline/${jobId}`}
          style={{ color: '#1e40af', textDecoration: 'none', fontSize: 14 }}
        >
          ← Pipeline Status
        </Link>
      </div>

      {/* Financial Cards — LAW 4: deterministic output only */}
      {result.financials && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Financial Projections</h2>
          <FinancialCards data={result.financials} />
        </section>
      )}

      {/* Executive Synthesis */}
      {result.synthesis && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Executive Synthesis</h2>
          <ExecutiveSynthesisCard data={result.synthesis} />
        </section>
      )}

      {/* Diagnostics */}
      {result.diagnostics && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Diagnostics</h2>
          <DiagnosticsPanel data={result.diagnostics} />
        </section>
      )}

      {/* Process Graph */}
      {result.processGraph && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Process Graph</h2>
          <ProcessGraphView data={result.processGraph} />
        </section>
      )}

      {/* Critic */}
      {result.critic && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Analysis Confidence</h2>
          <div style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: result.critic.confidence_score >= 60 ? '#16a34a' : '#dc2626', marginBottom: 8 }}>
              {result.critic.confidence_score}%
            </div>
            <p style={{ margin: '0 0 12px', color: '#64748b' }}>{result.critic.summary}</p>
            {result.critic.flags.length > 0 && (
              <div>
                {result.critic.flags.map((flag, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                    <strong style={{ color: flag.severity === 'critical' ? '#dc2626' : flag.severity === 'warning' ? '#d97706' : '#64748b' }}>
                      [{flag.severity}]
                    </strong>{' '}
                    {flag.area}: {flag.concern}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
