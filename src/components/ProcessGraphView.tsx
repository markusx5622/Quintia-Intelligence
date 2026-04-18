import type { ProcessGraphOutput } from '@/src/lib/types/contracts';

const NODE_META: Record<string, { color: string; bg: string; icon: string }> = {
  start: { color: 'var(--q-success-400)', bg: 'rgba(34,197,94,0.15)', icon: '▶' },
  end: { color: 'var(--q-danger-400)', bg: 'rgba(239,68,68,0.15)', icon: '■' },
  decision: { color: 'var(--q-warning-400)', bg: 'rgba(234,179,8,0.15)', icon: '◆' },
  review: { color: 'var(--q-purple-500)', bg: 'rgba(139,92,246,0.15)', icon: '◎' },
  escalation: { color: 'var(--q-pink-500)', bg: 'rgba(236,72,153,0.15)', icon: '⚡' },
  process: { color: 'var(--q-cyan-400)', bg: 'rgba(6,182,212,0.12)', icon: '●' },
};

export default function ProcessGraphView({ data }: { data: ProcessGraphOutput }) {
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
          {data.graph_summary}
        </p>
      </div>

      <div className="q-card" style={{ marginBottom: 24 }}>
        <div className="q-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--q-slate-200)', letterSpacing: '0.02em' }}>
              Process Flow
            </div>
            <span className="q-badge q-badge-info" style={{ fontSize: 10 }}>
              {data.nodes.length} steps
            </span>
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
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--q-slate-200)', marginBottom: 12, letterSpacing: '0.02em' }}>
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
