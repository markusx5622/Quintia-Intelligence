import Link from 'next/link';
import { getStorage } from '@/src/lib/storage/factory';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const storage = getStorage();
  const project = await storage.getProject(projectId);

  if (!project) return notFound();

  return (
    <div className="q-page-content-enter">
      <div className="q-breadcrumb">
        <Link href="/projects">Projects</Link>
        <span className="q-breadcrumb-sep" />
        <span>{project.name}</span>
      </div>

      <div className="q-page-header" style={{ marginBottom: 32 }}>
        <div className="q-page-header-left">
          <h1 className="q-page-title">{project.name}</h1>
          {project.description && (
            <span className="q-page-subtitle">{project.description}</span>
          )}
        </div>
      </div>

      <div className="q-card q-animate-in" style={{ marginBottom: 32 }}>
        <div className="q-card-header">
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--q-slate-200)', letterSpacing: '0.02em' }}>
            📄 Process Narrative
          </div>
        </div>
        <div className="q-card-body">
          <div className="q-narrative-block">
            {project.narrative}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/projects" className="q-btn q-btn-ghost" style={{ fontSize: 13 }}>
          ← Back to Projects
        </Link>
        <span style={{ color: 'var(--q-slate-500)', fontSize: 12 }}>
          Created {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
