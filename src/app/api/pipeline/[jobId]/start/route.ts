import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/src/lib/storage/factory';
import { runPipeline } from '@/src/lib/workflow/orchestrator';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;
    const storage = getStorage();
    const job = await storage.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status !== 'pending') {
      return NextResponse.json(
        { error: `Job is already ${job.status}` },
        { status: 409 },
      );
    }

    // Fire-and-forget: don't await the pipeline
    runPipeline(jobId).catch(async (err) => {
      const message = err instanceof Error ? err.message : String(err);
      try {
        await storage.updateJob(jobId, { status: 'failed', error: message });
      } catch {
        // Best-effort error recording
      }
    });

    return NextResponse.json({ started: true, jobId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
