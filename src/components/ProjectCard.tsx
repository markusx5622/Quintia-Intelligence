'use client';

import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  index: number;
}

export default function ProjectCard({ id, name, description, createdAt, index }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${id}`}
      className={`q-animate-slide q-stagger-${Math.min(index + 1, 7)}`}
      style={{
        display: 'block',
        padding: '20px 24px',
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(51,65,85,0.3)',
        borderRadius: 10,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 200ms, box-shadow 200ms, background 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.06)';
        e.currentTarget.style.background = 'rgba(15,23,42,0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(51,65,85,0.3)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'rgba(15,23,42,0.6)';
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: '#e2e8f0',
          marginBottom: 4,
        }}
      >
        {name}
      </div>
      {description && (
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
          {description}
        </div>
      )}
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
        Created{' '}
        {new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </Link>
  );
}
