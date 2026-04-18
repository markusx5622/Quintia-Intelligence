import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'QUINTIA — Process Intelligence Platform',
  description: 'Deterministic process intelligence platform — transform operational narratives into structured insights, diagnostics, and financial projections.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="q-nav" role="navigation" aria-label="Main navigation">
          <div className="q-nav-inner">
            <Link href="/" className="q-nav-logo" aria-label="Quintia home">
              <span className="q-nav-logo-mark">Q</span>
              QUINTIA
            </Link>
            <div className="q-nav-separator" aria-hidden="true" />
            <Link href="/projects" className="q-nav-link">Projects</Link>
            <Link href="/projects/new" className="q-nav-link">New Analysis</Link>
            <div style={{ flex: 1 }} />
            <span className="q-nav-tag" aria-label="Platform type">Process Intelligence</span>
          </div>
        </nav>
        <main className="q-page-shell q-page-transition" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
