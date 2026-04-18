import type { DeterministicFinancialOutput } from '@/src/lib/types/contracts';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function KPICard({
  label,
  value,
  accent,
  icon,
  delay,
}: {
  label: string;
  value: string;
  accent?: string;
  icon: string;
  delay: number;
}) {
  const accentColor = accent || '#e2e8f0';
  return (
    <div
      className="q-animate-up"
      style={{
        flex: '1 1 180px',
        padding: '20px 18px',
        background: 'rgba(15,23,42,0.4)',
        border: '1px solid rgba(51,65,85,0.25)',
        borderTop: `2px solid ${accentColor}`,
        borderRadius: 10,
        animationDelay: `${delay}ms`,
        transition: 'border-color 200ms, box-shadow 200ms',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 14, opacity: 0.5 }}>{icon}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#94a3b8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accentColor,
          fontFamily: 'var(--q-font-mono)',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function FinancialCards({ data }: { data: DeterministicFinancialOutput }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <KPICard
        label="Baseline Cost"
        value={formatEUR(data.baseline_cost_eur)}
        icon="◈"
        delay={0}
      />
      <KPICard
        label="Expected Savings"
        value={formatEUR(data.expected_savings_eur)}
        accent="#22c55e"
        icon="▲"
        delay={60}
      />
      <KPICard
        label="Implementation Cost"
        value={formatEUR(data.implementation_cost_eur)}
        accent="#f59e0b"
        icon="◆"
        delay={120}
      />
      <KPICard
        label="ROI"
        value={`${data.roi_percent}%`}
        accent={data.roi_percent > 0 ? '#22c55e' : '#ef4444'}
        icon="●"
        delay={180}
      />
      <KPICard
        label="Payback Period"
        value={`${data.payback_months} mo`}
        accent="#06b6d4"
        icon="◎"
        delay={240}
      />
    </div>
  );
}
