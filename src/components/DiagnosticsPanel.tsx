import type { DiagnosticsOutput } from '@/src/lib/types/contracts';

const SEVERITY_META: Record<string, { color: string; bg: string; icon: string }> = {
  critical: { color: 'var(--q-danger-600)', bg: 'var(--q-danger-50)', icon: '🔴' },
  high: { color: 'var(--q-orange-600)', bg: 'var(--q-orange-100)', icon: '🟠' },
  medium: { color: 'var(--q-warning-600)', bg: 'var(--q-warning-50)', icon: '🟡' },
  low: { color: 'var(--q-accent-500)', bg: 'var(--q-accent-50)', icon: '🔵' },
};

export default function DiagnosticsPanel({ data }: { data: DiagnosticsOutput }) {
  return (
    <div>
      <p style={{ color: 'var(--q-slate-500)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        {data.summary}
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
          const count = data.issues.filter((i) => i.severity === sev).length;
          if (count === 0) return null;
          const meta = SEVERITY_META[sev];
          return (
            <span key={sev} className="q-badge" style={{ background: meta.bg, color: meta.color }}>
              {meta.icon} {count} {sev}
            </span>
          );
        })}
      </div>

      {data.issues.map((issue, i) => {
        const meta = SEVERITY_META[issue.severity] || SEVERITY_META.low;
        return (
          <div key={i} className="q-diag-card">
            <div className="q-diag-severity-dot" style={{ background: meta.color }} title={issue.severity} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="q-diag-title">{issue.title}</span>
                <span className="q-badge" style={{ background: meta.bg, color: meta.color, fontSize: 10 }}>
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
