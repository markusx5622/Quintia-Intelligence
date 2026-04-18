import type { ProcessGraphOutput } from '@/src/lib/types/contracts';

const TYPE_COLORS: Record<string, string> = {
  start: '#22c55e',
  end: '#ef4444',
  decision: '#f59e0b',
  review: '#8b5cf6',
  escalation: '#ec4899',
  process: '#3b82f6',
};

export default function ProcessGraphView({ data }: { data: ProcessGraphOutput }) {
  return (
    <div>
      <p style={{ color: '#64748b', marginBottom: 16 }}>{data.graph_summary}</p>

      <div style={{ marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>Steps</h4>
        {data.nodes.map((node) => (
          <div
            key={node.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderLeft: `4px solid ${TYPE_COLORS[node.type || 'process'] || '#94a3b8'}`,
              background: '#f8fafc',
              borderRadius: '0 6px 6px 0',
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', minWidth: 50 }}>
              {node.id}
            </span>
            {node.type && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: TYPE_COLORS[node.type] || '#94a3b8',
                  color: '#fff',
                  textTransform: 'uppercase',
                }}
              >
                {node.type}
              </span>
            )}
            <span style={{ color: '#334155', fontSize: 14 }}>{node.label}</span>
          </div>
        ))}
      </div>

      {data.edges.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>Transitions</h4>
          {data.edges.map((edge, i) => (
            <div key={i} style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
              {edge.from} → {edge.to}
              {edge.label ? ` (${edge.label})` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
