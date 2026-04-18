import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify CRON_SECRET if configured
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Stub: future job polling endpoint
  return NextResponse.json({
    checked: true,
    timestamp: new Date().toISOString(),
    message: 'Cron job endpoint — no pending jobs to process.',
  });
}
