import type { DiagnosticsOutput } from '@/src/lib/types/contracts';

const SEVERITY_META: Record<string, { color: string; bg: string; icon: string }> = {
  critical: { color: 'var(--q-danger-400)', bg: 'rgba(239,68,68,0.12)', icon: '🔴' },
  high: { color: 'var(--q-orange-400)', bg: 'rgba(249,115,22,0.12)', icon: '🟠' },
  medium: { color: 'var(--q-warning-400)', bg: 'rgba(234,179,8,0.12)', icon: '🟡' },
  low: { color: 'var(--q-accent-300)', bg: 'rgba(37,99,235,0.12)', icon: '🔵' },
};

export default function DiagnosticsPanel({ data }: { data: DiagnosticsOutput }) {
  return (
    <div>
      <div style={{
        background: 'var(--q-surface-3)',
        borderRadius: 'var(--q-radius-lg)',
        padding: '16px 20px',
        marginBottom: 24,
        border: '1px solid var(--q-border-subtle)'
      }}>
        <p style={{ color: 'var(--q-slate-300)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          {data.summary}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
          const count = data.issues.filter((i) => i.severity === sev).length;
          if (count === 0) return null;
          const meta = SEVERITY_META[sev];
          return (
            <span key={sev} className="q-badge" style={{ background: meta.bg, color: meta.color, borderColor: `${meta.color}33` }}>
              {meta.icon} {count} {sev}
            </span>
          );
        })}
      </div>

      {data.issues.map((issue, i) => {
        const meta = SEVERITY_META[issue.severity] || SEVERITY_META.low;
        return (
          <div key={i} className="q-diag-card" data-severity={issue.severity}>
            <div className="q-diag-severity-dot" style={{ background: meta.color }} title={issue.severity} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="q-diag-title">{issue.title}</span>
                <span className="q-badge" style={{ background: meta.bg, color: meta.color, fontSize: 10, borderColor: `${meta.color}33` }}>
                  {issue.severity}
                </span>
              </div>
              <div className="q-diag-evidence">{issue.evidence}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
