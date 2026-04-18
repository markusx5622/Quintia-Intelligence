import type { DiagnosticsOutput } from '@/src/lib/types/contracts';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#3b82f6',
};

export default function DiagnosticsPanel({ data }: { data: DiagnosticsOutput }) {
  return (
    <div>
      <p style={{ color: '#64748b', marginBottom: 16 }}>{data.summary}</p>

      {data.issues.map((issue, i) => (
        <div
          key={i}
          style={{
            padding: '12px 16px',
            borderLeft: `4px solid ${SEVERITY_COLORS[issue.severity] || '#94a3b8'}`,
            background: '#f8fafc',
            borderRadius: '0 6px 6px 0',
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                background: SEVERITY_COLORS[issue.severity] || '#94a3b8',
                color: '#fff',
                textTransform: 'uppercase',
              }}
            >
              {issue.severity}
            </span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{issue.title}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{issue.evidence}</p>
        </div>
      ))}
    </div>
  );
}
