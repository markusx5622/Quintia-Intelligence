import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/src/lib/storage/factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;
    const storage = getStorage();
    const result = await storage.getFullResult(jobId);

    if (!result) {
      return NextResponse.json({ error: 'Results not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
