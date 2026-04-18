import type { DeterministicFinancialOutput } from '@/src/lib/types/contracts';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function Card({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      style={{
        flex: '1 1 180px',
        padding: '20px 16px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || '#1e293b' }}>{value}</div>
    </div>
  );
}

export default function FinancialCards({ data }: { data: DeterministicFinancialOutput }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Card label="Baseline Cost" value={formatEUR(data.baseline_cost_eur)} />
      <Card label="Expected Savings" value={formatEUR(data.expected_savings_eur)} color="#16a34a" />
      <Card label="Implementation Cost" value={formatEUR(data.implementation_cost_eur)} color="#dc2626" />
      <Card label="ROI" value={`${data.roi_percent}%`} color={data.roi_percent > 0 ? '#16a34a' : '#dc2626'} />
      <Card label="Payback Period" value={`${data.payback_months} months`} />
    </div>
  );
}
