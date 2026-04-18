import type { Metadata } from 'next';
import './globals.css';
import AppHeader from '@/src/components/AppHeader';

export const metadata: Metadata = {
  title: 'QUINTIA — Process Intelligence',
  description: 'Deterministic process intelligence platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />

        {/* ── Main Content Area ── */}
        <main
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '40px 32px 64px',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
