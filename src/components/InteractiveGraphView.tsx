import type { LinkedGraphNode, LinkedGraphEdge, SelectionState } from '@/src/lib/types/view-models';

const NODE_META: Record<string, { color: string; bg: string; icon: string }> = {
  start: { color: 'var(--q-success-400)', bg: 'rgba(34,197,94,0.15)', icon: '▶' },
  end: { color: 'var(--q-danger-400)', bg: 'rgba(239,68,68,0.15)', icon: '■' },
  decision: { color: 'var(--q-warning-400)', bg: 'rgba(234,179,8,0.15)', icon: '◆' },
  review: { color: 'var(--q-purple-500)', bg: 'rgba(139,92,246,0.15)', icon: '◎' },
  escalation: { color: 'var(--q-pink-500)', bg: 'rgba(236,72,153,0.15)', icon: '⚡' },
  process: { color: 'var(--q-cyan-400)', bg: 'rgba(6,182,212,0.12)', icon: '●' },
};

function edgeKey(from: string, to: string): string {
  return `${from}->${to}`;
}

export default function InteractiveGraphView({
  nodes,
  edges,
  graphSummary,
  selection,
  onSelectNode,
}: {
  nodes: LinkedGraphNode[];
  edges: LinkedGraphEdge[];
  graphSummary: string;
  selection: SelectionState;
  onSelectNode: (id: string) => void;
}) {
  const hasSelection = selection.type !== null;

  return (
    <div>
      {/* Summary */}
      <div style={{
        background: 'var(--q-surface-3)',
        borderRadius: 'var(--q-radius-lg)',
        padding: '16px 20px',
        marginBottom: 24,
        border: '1px solid var(--q-border-subtle)'
      }}>
        <p style={{ color: 'var(--q-slate-300)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          {graphSummary}
        </p>
        {hasSelection && (
          <p style={{ color: 'var(--q-cyan-400)', fontSize: 12, marginTop: 8, margin: '8px 0 0' }}>
            Click a highlighted node for details · Click again to deselect
          </p>
        )}
      </div>

      {/* Process Flow */}
      <div className="q-card" style={{ marginBottom: 24 }}>
        <div className="q-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--q-slate-200)', letterSpacing: '0.02em' }}>
              Process Flow
            </div>
            <span className="q-badge q-badge-info" style={{ fontSize: 10 }}>
              {nodes.length} steps
            </span>
            {hasSelection && (
              <span className="q-badge" style={{
                fontSize: 10,
                background: 'rgba(6,182,212,0.15)',
                color: 'var(--q-cyan-400)',
                borderColor: 'rgba(6,182,212,0.3)'
              }}>
                {selection.highlightedNodeIds.length} linked
              </span>
            )}
          </div>
        </div>
        <div className="q-graph-container">
          {nodes.map((node, i) => {
            const meta = NODE_META[node.type || 'process'] || NODE_META.process;
            const isHighlighted = selection.highlightedNodeIds.includes(node.id);
            const isDimmed = hasSelection && !isHighlighted;
            const isSelected = selection.type === 'node' && selection.id === node.id;
            const hasIssues = node.relatedIssueIds.length > 0;

            return (
              <div key={node.id}>
                <div
                  className={`q-graph-node q-graph-node--interactive${isHighlighted ? ' q-graph-node--highlighted' : ''}${isDimmed ? ' q-graph-node--dimmed' : ''}${isSelected ? ' q-graph-node--selected' : ''}`}
                  onClick={() => onSelectNode(node.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectNode(node.id); }}
                >
                  <div className="q-graph-node-icon" style={{ background: meta.bg, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="q-graph-node-id">
                      {node.id}
                      {hasIssues && (
                        <span className="q-graph-node-issue-dot" title={`${node.relatedIssueIds.length} linked issue(s)`}>
                          ⚠
                        </span>
                      )}
                    </div>
                    <div className="q-graph-node-label">{node.label}</div>
                    {isSelected && node.relatedIssueIds.length > 0 && (
                      <div className="q-graph-node-links">
                        <span className="q-graph-node-links-label">Issues:</span> {node.relatedIssueIds.join(', ')}
                        {node.relatedScenarioIds.length > 0 && (
                          <> · <span className="q-graph-node-links-label">Scenarios:</span> {node.relatedScenarioIds.join(', ')}</>
                        )}
                      </div>
                    )}
                  </div>
                  {node.type && (
                    <span className="q-badge" style={{ background: meta.bg, color: meta.color, fontSize: 10 }}>
                      {node.type}
                    </span>
                  )}
                </div>
                {/* Connector */}
                {i < nodes.length - 1 && (() => {
                  const ek = edgeKey(node.id, nodes[i + 1].id);
                  const edgeHighlighted = selection.highlightedEdgeKeys.includes(ek);
                  const edgeDimmed = hasSelection && !edgeHighlighted;
                  return (
                    <div className={`q-graph-connector${edgeHighlighted ? ' q-graph-connector--highlighted' : ''}${edgeDimmed ? ' q-graph-connector--dimmed' : ''}`}>
                      <div className="q-graph-connector-line" />
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transitions */}
      {edges.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--q-slate-200)', marginBottom: 12, letterSpacing: '0.02em' }}>
            Transitions
          </div>
          <div className="q-edge-list">
            {edges.map((edge, i) => {
              const ek = edgeKey(edge.from, edge.to);
              const isHighlighted = selection.highlightedEdgeKeys.includes(ek);
              const isDimmed = hasSelection && !isHighlighted;
              return (
                <span
                  key={i}
                  className={`q-edge-tag${isHighlighted ? ' q-edge-tag--highlighted' : ''}${isDimmed ? ' q-edge-tag--dimmed' : ''}`}
                >
                  {edge.from} <span className="q-edge-arrow">→</span> {edge.to}
                  {edge.label ? ` (${edge.label})` : ''}
                  {edge.relatedIssueIds.length > 0 && (
                    <span className="q-edge-issue-count" title={`${edge.relatedIssueIds.length} linked issue(s)`}> ⚠{edge.relatedIssueIds.length}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
