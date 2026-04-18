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

  // Find the job associated with this project
  // For now, we'll look through storage (simple approach for memory adapter)
  // In production, this would be a proper query
  const allJobs = await findJobsForProject(projectId);

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

      {allJobs.length > 0 ? (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Pipeline Jobs</h2>
          {allJobs.map((job) => (
            <div
              key={job.id}
              style={{
                padding: '12px 16px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>Job {job.id.slice(0, 8)}...</span>
                <span
                  style={{
                    marginLeft: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: job.status === 'completed' ? '#dcfce7' : job.status === 'failed' ? '#fef2f2' : '#f1f5f9',
                    color: job.status === 'completed' ? '#16a34a' : job.status === 'failed' ? '#dc2626' : '#64748b',
                  }}
                >
                  {job.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  href={`/pipeline/${job.id}`}
                  style={{ fontSize: 13, color: '#1e40af', textDecoration: 'none' }}
                >
                  Status →
                </Link>
                {job.status === 'completed' && (
                  <Link
                    href={`/results/${job.id}`}
                    style={{ fontSize: 13, color: '#16a34a', textDecoration: 'none' }}
                  >
                    Results →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#64748b' }}>No pipeline jobs found.</p>
      )}
    </div>
  );
}

// Helper — in a real app this would be a proper storage query
async function findJobsForProject(projectId: string) {
  // Use the API to avoid tight coupling, but for server component
  // we directly use storage for simplicity
  const storage = getStorage();
  // MemoryAdapter doesn't have a listJobs method, so we'll check
  // by trying the job ID that was returned at creation time.
  // For the memory adapter, we work around this limitation.
  // This is acceptable for v1 demo mode.
  try {
    const projects = await storage.listProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return [];
    // We can't list jobs by project with current interface,
    // so return empty — the job link comes from the creation flow
    return [];
  } catch {
    return [];
  }
}
