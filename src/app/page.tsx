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
        <Link href="/projects/new" className="q-btn q-btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
          Start New Analysis
        </Link>
        <Link href="/projects" className="q-btn q-btn-ghost" style={{ fontSize: 16, padding: '14px 36px' }}>
          View Projects
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
        {[
          { icon: '⚙️', label: 'Process Modelling', desc: 'Structured graph extraction' },
          { icon: '🔍', label: 'Diagnostics', desc: 'Issue detection & severity' },
          { icon: '📊', label: 'Financial Projections', desc: 'Deterministic ROI analysis' },
          { icon: '📋', label: 'Executive Synthesis', desc: 'Decision-ready reporting' },
        ].map((f) => (
          <div key={f.label} style={{ textAlign: 'center', maxWidth: 160 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--q-navy-800)', marginBottom: 4 }}>{f.label}</div>
            <div style={{ fontSize: 12, color: 'var(--q-slate-500)' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
