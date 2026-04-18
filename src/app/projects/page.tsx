import Link from 'next/link';
import { getStorage } from '@/src/lib/storage/factory';
import ProjectCard from '@/src/components/ProjectCard';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const storage = getStorage();
  const projects = await storage.listProjects();

  return (
    <div className="q-animate-in">
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              color: '#f1f5f9',
              letterSpacing: '-0.01em',
            }}
          >
            Projects
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} · Process intelligence analyses
          </p>
        </div>
        <Link
          href="/projects/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            transition: 'transform 150ms, box-shadow 150ms',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.12)',
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            padding: '64px 32px',
            textAlign: 'center',
            background: 'rgba(15,23,42,0.5)',
            border: '1px solid rgba(51,65,85,0.3)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>⬡</div>
          <p style={{ color: '#94a3b8', margin: '0 0 8px', fontWeight: 500 }}>
            No projects yet
          </p>
          <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>
            Create your first process intelligence analysis to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              createdAt={p.createdAt}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
