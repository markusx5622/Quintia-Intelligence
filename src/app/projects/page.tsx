import Link from 'next/link';
import { getStorage } from '@/src/lib/storage/factory';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const storage = getStorage();
  const projects = await storage.listProjects();

  return (
    <div className="q-page-content-enter">
      <div className="q-page-header">
        <div className="q-page-header-left">
          <h1 className="q-page-title">Projects</h1>
          <span className="q-page-subtitle">
            {projects.length === 0
              ? 'No analyses created yet'
              : `${projects.length} analysis project${projects.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        <Link href="/projects/new" className="q-btn q-btn-primary">
          + New Analysis
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="q-empty-state-refined q-animate-in">
          <div className="q-empty-state-refined-icon">📂</div>
          <div className="q-empty-state-refined-title">No projects yet</div>
          <div className="q-empty-state-refined-desc">
            Create your first analysis project to begin extracting structured
            process intelligence from operational narratives.
          </div>
          <Link href="/projects/new" className="q-btn q-btn-primary" style={{ fontSize: 14 }}>
            Start Your First Analysis
          </Link>
        </div>
      ) : (
        <div>
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={`q-project-card q-animate-in q-stagger-${Math.min(i + 1, 6)}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--q-white)', marginBottom: 4 }}>
                    {project.name}
                  </div>
                  {project.description && (
                    <div style={{ fontSize: 13, color: 'var(--q-slate-400)', marginBottom: 6, lineHeight: 1.5 }}>
                      {project.description}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 18, color: 'var(--q-slate-500)', flexShrink: 0, marginLeft: 12 }} aria-hidden="true">›</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--q-slate-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">📅</span>
                <span>Created {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
