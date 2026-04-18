import type { ScenarioComparison, SelectionState } from '@/src/lib/types/view-models';
import type { DeterministicFinancialOutput } from '@/src/lib/types/contracts';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

const DIFFICULTY_META: Record<string, { color: string; bg: string; label: string }> = {
  low: { color: 'var(--q-success-400)', bg: 'rgba(34,197,94,0.12)', label: 'Low' },
  medium: { color: 'var(--q-warning-400)', bg: 'rgba(234,179,8,0.12)', label: 'Medium' },
  high: { color: 'var(--q-danger-400)', bg: 'rgba(239,68,68,0.12)', label: 'High' },
};

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  'best value': { color: 'var(--q-success-400)', bg: 'rgba(34,197,94,0.15)' },
  'fastest win': { color: 'var(--q-cyan-400)', bg: 'rgba(6,182,212,0.15)' },
  'highest impact': { color: 'var(--q-orange-400)', bg: 'rgba(249,115,22,0.15)' },
  'quick implementation': { color: 'var(--q-purple-500)', bg: 'rgba(139,92,246,0.15)' },
};

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="q-scenario-bar-track">
      <div className="q-scenario-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function ScenarioCard({
  scenario,
  isHighlighted,
  isDimmed,
  onSelect,
}: {
  scenario: ScenarioComparison;
  isHighlighted: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}) {
  const diffMeta = DIFFICULTY_META[scenario.difficulty] || DIFFICULTY_META.medium;

  return (
    <div
      className={`q-scenario-card${isHighlighted ? ' q-scenario-card--highlighted' : ''}${isDimmed ? ' q-scenario-card--dimmed' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
    >
      {/* Tags */}
      {scenario.tags.length > 0 && (
        <div className="q-scenario-tags">
          {scenario.tags.map((tag) => {
            const tc = TAG_COLORS[tag] || { color: 'var(--q-slate-300)', bg: 'var(--q-surface-3)' };
            return (
              <span key={tag} className="q-badge" style={{ background: tc.bg, color: tc.color, fontSize: 10, borderColor: `${tc.color}33` }}>
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Title */}
      <h4 className="q-scenario-title">{scenario.title}</h4>
      <p className="q-scenario-summary">{scenario.interventionSummary}</p>

      {/* Financial KPIs */}
      <div className="q-scenario-kpi-row">
        <div className="q-scenario-kpi">
          <span className="q-scenario-kpi-label">Savings</span>
          <span className="q-scenario-kpi-value" style={{ color: 'var(--q-success-400)' }}>
            {formatEUR(scenario.financials.expected_savings_eur)}
          </span>
        </div>
        <div className="q-scenario-kpi">
          <span className="q-scenario-kpi-label">Cost</span>
          <span className="q-scenario-kpi-value">
            {formatEUR(scenario.financials.implementation_cost_eur)}
          </span>
        </div>
        <div className="q-scenario-kpi">
          <span className="q-scenario-kpi-label">ROI</span>
          <span className="q-scenario-kpi-value" style={{ color: scenario.financials.roi_percent > 0 ? 'var(--q-success-400)' : 'var(--q-danger-400)' }}>
            {scenario.financials.roi_percent}%
          </span>
        </div>
        <div className="q-scenario-kpi">
          <span className="q-scenario-kpi-label">Payback</span>
          <span className="q-scenario-kpi-value">{scenario.financials.payback_months} mo</span>
        </div>
      </div>

      {/* Operational Dimensions */}
      <div className="q-scenario-dims">
        <div className="q-scenario-dim">
          <div className="q-scenario-dim-header">
            <span className="q-scenario-dim-label">Difficulty</span>
            <span className="q-badge" style={{ background: diffMeta.bg, color: diffMeta.color, fontSize: 10, borderColor: `${diffMeta.color}33` }}>
              {diffMeta.label}
            </span>
          </div>
        </div>
        <div className="q-scenario-dim">
          <div className="q-scenario-dim-header">
            <span className="q-scenario-dim-label">Risk Reduction</span>
            <span className="q-scenario-dim-value">{scenario.riskReduction}%</span>
          </div>
          <MiniBar value={scenario.riskReduction} max={100} color="var(--q-success-400)" />
        </div>
        <div className="q-scenario-dim">
          <div className="q-scenario-dim-header">
            <span className="q-scenario-dim-label">Operational Clarity</span>
            <span className="q-scenario-dim-value">{scenario.operationalClarity}%</span>
          </div>
          <MiniBar value={scenario.operationalClarity} max={100} color="var(--q-cyan-400)" />
        </div>
        <div className="q-scenario-dim">
          <div className="q-scenario-dim-header">
            <span className="q-scenario-dim-label">Timeline</span>
            <span className="q-scenario-dim-value">{scenario.implementationMonths} months</span>
          </div>
        </div>
      </div>

      {/* Linked issues */}
      {scenario.linkedIssueIds.length > 0 && (
        <div className="q-scenario-linked">
          <span className="q-scenario-linked-label">Addresses {scenario.linkedIssueIds.length} issue(s)</span>
        </div>
      )}

      {/* Assumptions */}
      <details className="q-scenario-assumptions">
        <summary className="q-scenario-assumptions-toggle">Assumptions ({scenario.assumptions.length})</summary>
        <ul className="q-scenario-assumptions-list">
          {scenario.assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default function ScenarioComparisonPanel({
  scenarios,
  baselineFinancials,
  selection,
  onSelectScenario,
}: {
  scenarios: ScenarioComparison[];
  baselineFinancials: DeterministicFinancialOutput;
  selection: SelectionState;
  onSelectScenario: (id: string) => void;
}) {
  if (scenarios.length === 0) return null;

  const hasSelection = selection.type !== null;

  return (
    <div>
      {/* Baseline context */}
      <div className="q-scenario-baseline">
        <div className="q-scenario-baseline-item">
          <span className="q-scenario-baseline-label">Current Baseline</span>
          <span className="q-scenario-baseline-value">{formatEUR(baselineFinancials.baseline_cost_eur)}/yr</span>
        </div>
        <div className="q-scenario-baseline-divider" />
        <div className="q-scenario-baseline-item">
          <span className="q-scenario-baseline-label">Scenarios</span>
          <span className="q-scenario-baseline-value">{scenarios.length}</span>
        </div>
      </div>

      {/* Scenario grid */}
      <div className="q-scenario-grid">
        {scenarios.map((s) => {
          const isHighlighted = selection.highlightedScenarioIds.includes(s.id);
          const isDimmed = hasSelection && !isHighlighted;
          return (
            <ScenarioCard
              key={s.id}
              scenario={s}
              isHighlighted={isHighlighted}
              isDimmed={isDimmed}
              onSelect={() => onSelectScenario(s.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
