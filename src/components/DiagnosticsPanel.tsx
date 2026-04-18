import type { DiagnosticsOutput } from '@/src/lib/types/contracts';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
};

const SEVERITY_BG: Record<string, string> = {
  critical: 'rgba(239,68,68,0.06)',
  high: 'rgba(249,115,22,0.06)',
  medium: 'rgba(245,158,11,0.06)',
  low: 'rgba(59,130,246,0.06)',
};

const SEVERITY_ICONS: Record<string, string> = {
  critical: '⬢',
  high: '◆',
  medium: '▲',
  low: '●',
};

export default function DiagnosticsPanel({ data }: { data: DiagnosticsOutput }) {
  return (
    <div>
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
        {data.summary}
      </p>

      {/* Severity summary bar */}
      {data.issues.length > 0 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
            const count = data.issues.filter((i) => i.severity === sev).length;
            if (count === 0) return null;
            const color = SEVERITY_COLORS[sev];
            return (
              <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                  }}
                />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  <strong style={{ color }}>{count}</strong> {sev}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.issues.map((issue, i) => {
          const color = SEVERITY_COLORS[issue.severity] || '#64748b';
          const bg = SEVERITY_BG[issue.severity] || 'transparent';
          const icon = SEVERITY_ICONS[issue.severity] || '●';

          return (
            <div
              key={i}
              className={`q-animate-slide q-stagger-${Math.min(i + 1, 7)}`}
              style={{
                padding: '16px 18px',
                borderLeft: `3px solid ${color}`,
                background: bg,
                borderRadius: '0 10px 10px 0',
                border: `1px solid rgba(51,65,85,0.15)`,
                borderLeftWidth: 3,
                borderLeftColor: color,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 10, color }}>{icon}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${color}18`,
                    color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {issue.severity}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: '#e2e8f0',
                    fontSize: 14,
                  }}
                >
                  {issue.title}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  paddingLeft: 20,
                }}
              >
                {issue.evidence}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
