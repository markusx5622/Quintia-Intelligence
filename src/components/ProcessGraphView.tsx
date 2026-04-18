import type { ProcessGraphOutput } from '@/src/lib/types/contracts';

const NODE_META: Record<string, { color: string; bg: string; icon: string }> = {
  start: { color: 'var(--q-success-600)', bg: 'var(--q-success-100)', icon: '▶' },
  end: { color: 'var(--q-danger-600)', bg: 'var(--q-danger-100)', icon: '■' },
  decision: { color: 'var(--q-warning-600)', bg: 'var(--q-warning-100)', icon: '◆' },
  review: { color: 'var(--q-purple-600)', bg: '#ede9fe', icon: '◎' },
  escalation: { color: 'var(--q-pink-500)', bg: '#fce7f3', icon: '⚡' },
  process: { color: 'var(--q-accent-500)', bg: 'var(--q-accent-100)', icon: '●' },
};

export default function ProcessGraphView({ data }: { data: ProcessGraphOutput }) {
  return (
    <div>
      <p style={{ color: 'var(--q-slate-500)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        {data.graph_summary}
      </p>

      <div className="q-card" style={{ marginBottom: 24 }}>
        <div className="q-card-header">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--q-navy-800)', letterSpacing: '0.02em' }}>
            Process Flow — {data.nodes.length} Steps
          </div>
        </div>
        <div className="q-graph-container">
          {data.nodes.map((node, i) => {
            const meta = NODE_META[node.type || 'process'] || NODE_META.process;
            return (
              <div key={node.id}>
                <div className="q-graph-node">
                  <div className="q-graph-node-icon" style={{ background: meta.bg, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="q-graph-node-id">{node.id}</div>
                    <div className="q-graph-node-label">{node.label}</div>
                  </div>
                  {node.type && (
                    <span className="q-badge" style={{ background: meta.bg, color: meta.color, fontSize: 10 }}>
                      {node.type}
                    </span>
                  )}
                </div>
                {i < data.nodes.length - 1 && (
                  <div className="q-graph-connector">
                    <div className="q-graph-connector-line" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {data.edges.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--q-navy-800)', marginBottom: 12, letterSpacing: '0.02em' }}>
            Transitions
          </div>
          <div className="q-edge-list">
            {data.edges.map((edge, i) => (
              <span key={i} className="q-edge-tag">
                {edge.from} <span className="q-edge-arrow">→</span> {edge.to}
                {edge.label ? ` (${edge.label})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
