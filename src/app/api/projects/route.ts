import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/src/lib/storage/factory';
import { generateId } from '@/src/lib/utils/id';
import type { Project, PipelineJob, StageRecord } from '@/src/lib/types/contracts';
import { PIPELINE_STAGES } from '@/src/lib/types/contracts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, narrative } = body;

    if (!name || !narrative) {
      return NextResponse.json(
        { error: 'name and narrative are required' },
        { status: 400 },
      );
    }

    const storage = getStorage();
    const now = new Date().toISOString();

    // Create project
    const project: Project = {
      id: generateId(),
      name,
      description: description || '',
      narrative,
      createdAt: now,
      updatedAt: now,
    };
    await storage.createProject(project);

    // Create pending pipeline job
    const stages: StageRecord[] = PIPELINE_STAGES.map((s) => ({
      stage: s,
      status: 'pending' as const,
      startedAt: null,
      completedAt: null,
      error: null,
    }));

    const job: PipelineJob = {
      id: generateId(),
      projectId: project.id,
      status: 'pending',
      currentStage: null,
      stages,
      error: null,
      createdAt: now,
      updatedAt: now,
    };
    await storage.createJob(job);

    return NextResponse.json({ projectId: project.id, jobId: job.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const storage = getStorage();
    const projects = await storage.listProjects();
    return NextResponse.json(projects);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
