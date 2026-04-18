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
    <div>
      <h1 style={{ marginBottom: 8 }}>{project.name}</h1>
      {project.description && (
        <p style={{ color: '#64748b', marginBottom: 16 }}>{project.description}</p>
      )}

      <div style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#64748b' }}>Process Narrative</h3>
        <p style={{ margin: 0, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {project.narrative}
        </p>
      </div>

      <p style={{ color: '#64748b', fontSize: 14 }}>
        Pipeline jobs are linked at creation time.{' '}
        <Link href="/projects" style={{ color: '#1e40af' }}>
          Back to projects
        </Link>
      </p>
    </div>
  );
}
