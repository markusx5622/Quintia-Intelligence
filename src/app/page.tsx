import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 60 }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
        QUINTIA
      </h1>
      <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto 32px' }}>
        Process intelligence platform. Transform operational narratives into structured
        process models, diagnostics, and deterministic financial projections.
      </p>
      <Link
        href="/projects"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: '#1e40af',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        View Projects →
      </Link>
    </div>
  );
}
