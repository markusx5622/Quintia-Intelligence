import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="q-hero">
      <div className="q-hero-tagline">Deterministic Process Intelligence</div>
      <h1 className="q-hero-title">QUINTIA</h1>
      <p className="q-hero-subtitle">
        Transform operational narratives into structured process models,
        diagnostics, and deterministic financial projections.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/projects/new" className="q-btn q-btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
          Start New Analysis
        </Link>
        <Link href="/projects" className="q-btn q-btn-ghost" style={{ fontSize: 16, padding: '16px 40px' }}>
          View Projects
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 80, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          { icon: '⚙️', label: 'Process Modelling', desc: 'Structured graph extraction' },
          { icon: '🔍', label: 'Diagnostics', desc: 'Issue detection & severity' },
          { icon: '📊', label: 'Financial Projections', desc: 'Deterministic ROI analysis' },
          { icon: '📋', label: 'Executive Synthesis', desc: 'Decision-ready reporting' },
        ].map((f) => (
          <div key={f.label} className="q-feature-card">
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--q-white)', marginBottom: 6 }}>{f.label}</div>
            <div style={{ fontSize: 12, color: 'var(--q-slate-400)', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
