import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'QUINTIA — Process Intelligence',
  description: 'Deterministic process intelligence platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="q-nav">
          <div className="q-nav-inner">
            <Link href="/" className="q-nav-logo">
              <span className="q-nav-logo-mark">Q</span>
              QUINTIA
            </Link>
            <div className="q-nav-separator" />
            <Link href="/projects" className="q-nav-link">Projects</Link>
            <Link href="/projects/new" className="q-nav-link">New Analysis</Link>
            <div style={{ flex: 1 }} />
            <span className="q-nav-tag">Process Intelligence</span>
          </div>
        </nav>
        <main className="q-page-shell">
          {children}
        </main>
      </body>
    </html>
  );
}
