import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QUINTIA — Process Intelligence',
  description: 'Deterministic process intelligence platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1e293b', background: '#f8fafc' }}>
        <nav style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>
            QUINTIA
          </a>
          <a href="/projects" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 14 }}>
            Projects
          </a>
        </nav>
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
