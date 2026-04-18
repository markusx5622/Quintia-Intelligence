import type { EnrichedDiagnosticIssue, SelectionState } from '@/src/lib/types/view-models';

const SEVERITY_META: Record<string, { color: string; bg: string; icon: string }> = {
  critical: { color: 'var(--q-danger-400)', bg: 'rgba(239,68,68,0.12)', icon: '🔴' },
  high: { color: 'var(--q-orange-400)', bg: 'rgba(249,115,22,0.12)', icon: '🟠' },
  medium: { color: 'var(--q-warning-400)', bg: 'rgba(234,179,8,0.12)', icon: '🟡' },
  low: { color: 'var(--q-accent-300)', bg: 'rgba(37,99,235,0.12)', icon: '🔵' },
};

function ConfidenceDot({ value }: { value: number }) {
  const color = value >= 80 ? 'var(--q-success-400)'
    : value >= 60 ? 'var(--q-warning-400)'
    : 'var(--q-danger-400)';
  return (
    <span className="q-evidence-confidence" style={{ color }}>
      {value}%
    </span>
  );
}

function EvidenceCard({
  issue,
  isHighlighted,
  isDimmed,
  isExpanded,
  onSelect,
}: {
  issue: EnrichedDiagnosticIssue;
  isHighlighted: boolean;
  isDimmed: boolean;
  isExpanded: boolean;
  onSelect: () => void;
}) {
  const meta = SEVERITY_META[issue.severity] || SEVERITY_META.low;

  return (
    <div
      className={`q-evidence-card${isHighlighted ? ' q-evidence-card--highlighted' : ''}${isDimmed ? ' q-evidence-card--dimmed' : ''}`}
      data-severity={issue.severity}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      {/* Header row */}
      <div className="q-evidence-header">
        <div className="q-evidence-severity-dot" style={{ background: meta.color }} title={issue.severity} />
        <div className="q-evidence-title-group">
          <span className="q-evidence-title">{issue.title}</span>
          <div className="q-evidence-meta-row">
            <span className="q-badge" style={{ background: meta.bg, color: meta.color, fontSize: 10, borderColor: `${meta.color}33` }}>
              {issue.severity}
            </span>
            <ConfidenceDot value={issue.confidence} />
            {issue.affectedNodeIds.length > 0 && (
              <span className="q-evidence-link-count" title="Linked process steps">
                🔗 {issue.affectedNodeIds.length} step(s)
              </span>
            )}
            {issue.linkedScenarioIds.length > 0 && (
              <span className="q-evidence-link-count" title="Linked scenarios">
                💡 {issue.linkedScenarioIds.length} scenario(s)
              </span>
            )}
          </div>
        </div>
        <div className="q-evidence-expand-icon">{isExpanded ? '▾' : '▸'}</div>
      </div>

      {/* Evidence text — always visible */}
      <div className="q-evidence-text">{issue.evidence}</div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="q-evidence-detail">
          {/* Matched keywords */}
          {issue.matchedKeywords.length > 0 && (
            <div className="q-evidence-section">
              <span className="q-evidence-section-label">Matched Keywords</span>
              <div className="q-evidence-keyword-list">
                {issue.matchedKeywords.map((kw, i) => (
                  <span key={i} className="q-evidence-keyword">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Related roles */}
          {issue.relatedRoles.length > 0 && (
            <div className="q-evidence-section">
              <span className="q-evidence-section-label">Related Roles</span>
              <div className="q-evidence-keyword-list">
                {issue.relatedRoles.map((r, i) => (
                  <span key={i} className="q-evidence-tag q-evidence-tag--role">{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Related systems */}
          {issue.relatedSystems.length > 0 && (
            <div className="q-evidence-section">
              <span className="q-evidence-section-label">Related Systems</span>
              <div className="q-evidence-keyword-list">
                {issue.relatedSystems.map((s, i) => (
                  <span key={i} className="q-evidence-tag q-evidence-tag--system">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Related artifacts */}
          {issue.relatedArtifacts.length > 0 && (
            <div className="q-evidence-section">
              <span className="q-evidence-section-label">Related Artifacts</span>
              <div className="q-evidence-keyword-list">
                {issue.relatedArtifacts.map((a, i) => (
                  <span key={i} className="q-evidence-tag q-evidence-tag--artifact">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Affected process steps */}
          {issue.affectedNodeIds.length > 0 && (
            <div className="q-evidence-section">
              <span className="q-evidence-section-label">Affected Process Steps</span>
              <div className="q-evidence-keyword-list">
                {issue.affectedNodeIds.map((nid) => (
                  <span key={nid} className="q-evidence-tag q-evidence-tag--node">{nid}</span>
                ))}
              </div>
            </div>
          )}

          {/* Linked scenarios */}
          {issue.linkedScenarioIds.length > 0 && (
            <div className="q-evidence-section">
              <span className="q-evidence-section-label">Linked Interventions</span>
              <div className="q-evidence-keyword-list">
                {issue.linkedScenarioIds.map((sid) => (
                  <span key={sid} className="q-evidence-tag q-evidence-tag--scenario">{sid}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EvidencePanel({
  issues,
  selection,
  onSelectIssue,
}: {
  issues: EnrichedDiagnosticIssue[];
  selection: SelectionState;
  onSelectIssue: (id: string) => void;
}) {
  if (issues.length === 0) {
    return (
      <div className="q-empty-state-refined q-animate-in">
        <div className="q-empty-state-refined-icon">🔍</div>
        <div className="q-empty-state-refined-title">No diagnostics detected</div>
        <div className="q-empty-state-refined-desc">
          The analysis did not identify any process issues in the provided narrative.
        </div>
      </div>
    );
  }

  const hasSelection = selection.type !== null;

  // Summary badges
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const issue of issues) {
    counts[issue.severity]++;
  }

  return (
    <div>
      {/* Severity summary */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
          if (counts[sev] === 0) return null;
          const meta = SEVERITY_META[sev];
          return (
            <span key={sev} className="q-badge" style={{ background: meta.bg, color: meta.color, borderColor: `${meta.color}33` }}>
              {meta.icon} {counts[sev]} {sev}
            </span>
          );
        })}
        <span className="q-badge q-badge-neutral" style={{ fontSize: 10 }}>
          {issues.length} total
        </span>
      </div>

      {/* Issue cards */}
      {issues.map((issue) => {
        const isHighlighted = selection.highlightedIssueIds.includes(issue.id);
        const isDimmed = hasSelection && !isHighlighted;
        const isExpanded = selection.type === 'issue' && selection.id === issue.id;

        return (
          <EvidenceCard
            key={issue.id}
            issue={issue}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
            isExpanded={isExpanded}
            onSelect={() => onSelectIssue(issue.id)}
          />
        );
      })}
    </div>
  );
}
