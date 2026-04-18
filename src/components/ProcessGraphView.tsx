import type { ProcessGraphOutput } from '@/src/lib/types/contracts';

const TYPE_COLORS: Record<string, string> = {
  start: '#22c55e',
  end: '#ef4444',
  decision: '#f59e0b',
  review: '#8b5cf6',
  escalation: '#ec4899',
  process: '#3b82f6',
};

const TYPE_SHAPES: Record<string, string> = {
  start: '◉',
  end: '◉',
  decision: '◇',
  review: '□',
  escalation: '△',
  process: '○',
};

export default function ProcessGraphView({ data }: { data: ProcessGraphOutput }) {
  return (
    <div>
      <p style={{ color: '#94a3b8', margin: '0 0 24px', fontSize: 14, lineHeight: 1.6 }}>
        {data.graph_summary}
      </p>

      {/* Visual flow */}
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Vertical connector line */}
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 16,
            bottom: 16,
            width: 2,
            background: 'linear-gradient(180deg, rgba(6,182,212,0.3), rgba(59,130,246,0.1))',
            borderRadius: 1,
          }}
        />

        {data.nodes.map((node, i) => {
          const color = TYPE_COLORS[node.type || 'process'] || '#3b82f6';
          const shape = TYPE_SHAPES[node.type || 'process'] || '○';
          const isStart = node.type === 'start';
          const isEnd = node.type === 'end';
          const isDecision = node.type === 'decision';

          // Find outgoing edges for this node
          const outEdges = data.edges.filter((e) => e.from === node.id);

          return (
            <div
              key={node.id}
              className={`q-animate-slide q-stagger-${Math.min(i + 1, 7)}`}
              style={{ marginBottom: i < data.nodes.length - 1 ? 4 : 0 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: isDecision
                    ? 'rgba(245,158,11,0.04)'
                    : isStart || isEnd
                      ? `${color}08`
                      : 'rgba(15,23,42,0.3)',
                  border: `1px solid ${color}20`,
                  borderRadius: 10,
                  position: 'relative',
                  transition: 'background 200ms, border-color 200ms',
                }}
              >
                {/* Node dot on the connector line */}
                <div
                  style={{
                    position: 'absolute',
                    left: -21,
                    top: '50%',
                    width: 12,
                    height: 12,
                    borderRadius: isDecision ? 2 : '50%',
                    background: color,
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 8px ${color}30`,
                    transform: `translateY(-50%)${isDecision ? ' rotate(45deg)' : ''}`,
                  }}
                />

                {/* Shape icon */}
                <span style={{ fontSize: 14, color, flexShrink: 0, width: 20, textAlign: 'center' }}>
                  {shape}
                </span>

                {/* ID badge */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#64748b',
                    fontFamily: 'var(--q-font-mono)',
                    minWidth: 32,
                    flexShrink: 0,
                  }}
                >
                  {node.id}
                </span>

                {/* Type badge */}
                {node.type && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: `${color}15`,
                      color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      flexShrink: 0,
                    }}
                  >
                    {node.type}
                  </span>
                )}

                {/* Label */}
                <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 500 }}>
                  {node.label}
                </span>
              </div>

              {/* Edge labels */}
              {outEdges.length > 0 && (
                <div style={{ paddingLeft: 10, paddingTop: 2, paddingBottom: 2 }}>
                  {outEdges.map((edge, ei) => (
                    <div
                      key={ei}
                      style={{
                        fontSize: 11,
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        paddingLeft: 20,
                      }}
                    >
                      <span style={{ color: '#475569', fontSize: 10 }}>↓</span>
                      <span style={{ fontFamily: 'var(--q-font-mono)', fontSize: 10 }}>
                        → {edge.to}
                      </span>
                      {edge.label && (
                        <span
                          style={{
                            fontSize: 10,
                            color: '#94a3b8',
                            fontStyle: 'italic',
                          }}
                        >
                          ({edge.label})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid rgba(51,65,85,0.2)',
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: type === 'decision' ? 1 : '50%',
                background: color,
                transform: type === 'decision' ? 'rotate(45deg)' : undefined,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: '#64748b',
                textTransform: 'capitalize',
                fontWeight: 500,
              }}
            >
              {type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
