import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="q-animate-up"
      style={{
        textAlign: 'center',
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      {/* Product Mark */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          borderRadius: 16,
          marginBottom: 32,
          boxShadow: '0 0 40px rgba(6, 182, 212, 0.2)',
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>Q</span>
      </div>

      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#f1f5f9',
          marginBottom: 8,
          letterSpacing: '0.04em',
        }}
      >
        QUINTIA
      </h1>

      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: '#06b6d4',
          textTransform: 'uppercase',
          marginTop: 0,
          marginBottom: 32,
        }}
      >
        Process Intelligence Platform
      </p>

      <p
        style={{
          fontSize: 16,
          color: '#94a3b8',
          maxWidth: 520,
          margin: '0 auto 48px',
          lineHeight: 1.7,
        }}
      >
        Transform operational narratives into structured process models,
        diagnostics, and deterministic financial projections.
      </p>

      <Link
        href="/projects"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 36px',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: '0.02em',
          transition: 'transform 150ms, box-shadow 150ms',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)',
        }}
      >
        Open Dashboard
        <span style={{ fontSize: 16 }}>→</span>
      </Link>

      {/* Capability Indicators */}
      <div
        className="q-animate-in q-stagger-3"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          marginTop: 72,
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Process Extraction', icon: '⬡' },
          { label: 'Diagnostic Analysis', icon: '◆' },
          { label: 'Financial Modeling', icon: '▲' },
          { label: 'Executive Synthesis', icon: '●' },
        ].map((cap) => (
          <div key={cap.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 20,
                color: '#334155',
                marginBottom: 8,
              }}
            >
              {cap.icon}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#64748b',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {cap.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
