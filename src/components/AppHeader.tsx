'use client';

import Link from 'next/link';

export default function AppHeader() {
  return (
    <nav
      style={{
        background:
          'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(10,15,30,0.98) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(51,65,85,0.4)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        height: 56,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: '0.12em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 800,
            color: '#fff',
          }}
        >
          Q
        </span>
        QUINTIA
      </Link>

      <div
        style={{
          marginLeft: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Link
          href="/projects"
          style={{
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            padding: '8px 14px',
            borderRadius: 6,
            transition: 'color 150ms, background 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e2e8f0';
            e.currentTarget.style.background = 'rgba(51,65,85,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Projects
        </Link>
      </div>

      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#64748b',
            textTransform: 'uppercase',
            padding: '3px 8px',
            border: '1px solid rgba(100,116,139,0.3)',
            borderRadius: 4,
          }}
        >
          Process Intelligence
        </span>
      </div>
    </nav>
  );
}
