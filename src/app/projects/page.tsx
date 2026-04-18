import Link from 'next/link';
import { getStorage } from '@/src/lib/storage/factory';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const storage = getStorage();
  const projects = await storage.listProjects();

  return (
    <div>
      <div className="q-page-header">
        <div className="q-page-header-left">
          <h1 className="q-page-title">Projects</h1>
          <span className="q-page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} created</span>
        </div>
        <Link href="/projects/new" className="q-btn q-btn-primary">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="q-empty-state">
          <div className="q-empty-state-icon">📂</div>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--q-white)', marginBottom: 8 }}>
            No projects yet
          </p>
          <p style={{ fontSize: 14, color: 'var(--q-slate-400)', marginBottom: 20 }}>
            Create your first project to begin process analysis.
          </p>
          <Link href="/projects/new" className="q-btn q-btn-primary">
            Start New Analysis
          </Link>
        </div>
      ) : (
        <div>
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="q-project-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--q-white)', marginBottom: 4 }}>
                    {p.name}
                  </div>
                  {p.description && (
                    <div style={{ fontSize: 13, color: 'var(--q-slate-400)', marginBottom: 6 }}>
                      {p.description}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 18, color: 'var(--q-slate-500)' }}>›</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--q-slate-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📅</span> Created {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
