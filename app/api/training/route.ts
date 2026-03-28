import { NextRequest, NextResponse } from 'next/server';

interface TrainingRecord {
  id: number;
  region: string;
  year: number;
  r2: number;
  created_at: string;
  dataset?: unknown;
}

const memoryStore: TrainingRecord[] = [];

export async function GET(_req: NextRequest) {
  return NextResponse.json({ success: true, records: memoryStore });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { region, year, r2, dataset } = body;

    if (!region || typeof year !== 'number' || typeof r2 !== 'number' || !Array.isArray(dataset)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    memoryStore.unshift({
      id: memoryStore.length + 1,
      region,
      year,
      r2,
      created_at: new Date().toISOString(),
      dataset,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
