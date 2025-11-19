import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ rows: [] }));

  return NextResponse.json(
    {
      message: 'CSV payload received.',
      rows: body.rows ?? []
    },
    { status: 200 }
  );
}
