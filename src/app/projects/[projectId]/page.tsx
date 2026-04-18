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
    <div className="q-animate-in">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/projects"
          style={{
            fontSize: 12,
            color: '#64748b',
            textDecoration: 'none',
            transition: 'color 150ms',
          }}
        >
          ← Back to Projects
        </Link>
      </div>

      <h1
        style={{
          margin: '0 0 8px',
          fontSize: 24,
          fontWeight: 700,
          color: '#f1f5f9',
          letterSpacing: '-0.01em',
        }}
      >
        {project.name}
      </h1>
      {project.description && (
        <p style={{ color: '#94a3b8', margin: '0 0 24px', fontSize: 14 }}>
          {project.description}
        </p>
      )}

      {/* Narrative Panel */}
      <div
        style={{
          padding: '24px',
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(51,65,85,0.3)',
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            margin: '0 0 12px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#64748b',
          }}
        >
          Process Narrative
        </h3>
        <p
          style={{
            margin: 0,
            color: '#cbd5e1',
            lineHeight: 1.7,
            fontSize: 14,
            whiteSpace: 'pre-wrap',
          }}
        >
          {project.narrative}
        </p>
      </div>

      <p style={{ color: '#64748b', fontSize: 13 }}>
        Pipeline jobs are linked at creation time.
      </p>
    </div>
  );
}
