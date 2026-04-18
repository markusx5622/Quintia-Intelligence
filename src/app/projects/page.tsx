import Link from 'next/link';
import { getStorage } from '@/src/lib/storage/factory';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const storage = getStorage();
  const projects = await storage.listProjects();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Projects</h1>
        <Link
          href="/projects/new"
          style={{
            padding: '8px 20px',
            background: '#1e40af',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p style={{ color: '#64748b' }}>No projects yet. Create your first one.</p>
      ) : (
        <div>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              style={{
                display: 'block',
                padding: '16px 20px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                marginBottom: 8,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              {p.description && <div style={{ fontSize: 13, color: '#64748b' }}>{p.description}</div>}
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Created: {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
