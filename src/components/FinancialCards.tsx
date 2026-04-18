import type { DeterministicFinancialOutput } from '@/src/lib/types/contracts';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

const KPI_CONFIG: { key: keyof DeterministicFinancialOutput; label: string; icon: string; accent: string; format: (v: number) => string; colorFn?: (v: number) => string }[] = [
  { key: 'baseline_cost_eur', label: 'Baseline Cost', icon: '💰', accent: 'blue', format: formatEUR },
  { key: 'expected_savings_eur', label: 'Expected Savings', icon: '📈', accent: 'green', format: formatEUR, colorFn: () => 'var(--q-success-400)' },
  { key: 'implementation_cost_eur', label: 'Implementation Cost', icon: '🔧', accent: 'red', format: formatEUR },
  { key: 'roi_percent', label: 'Return on Investment', icon: '📊', accent: 'green', format: (v) => `${v.toFixed(0)}%`, colorFn: (v) => v > 0 ? 'var(--q-success-400)' : 'var(--q-danger-400)' },
  { key: 'payback_months', label: 'Payback Period', icon: '⏱️', accent: 'neutral', format: (v) => `${v.toFixed(1)} mo` },
];

export default function FinancialCards({ data }: { data: DeterministicFinancialOutput }) {
  return (
    <div className="q-kpi-grid">
      {KPI_CONFIG.map(({ key, label, icon, accent, format, colorFn }, index) => {
        const value = data[key];
        return (
          <div
            key={key}
            className={`q-kpi-card q-animate-in q-stagger-${index + 1}`}
            data-accent={accent}
          >
            <span className="q-kpi-icon" aria-hidden="true">{icon}</span>
            <div className="q-kpi-label">{label}</div>
            <div className="q-kpi-value" style={{ color: colorFn ? colorFn(value) : 'var(--q-white)' }}>
              {format(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
