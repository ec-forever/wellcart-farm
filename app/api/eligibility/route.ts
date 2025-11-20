import { NextResponse } from 'next/server';

const mockEligibility = [
  { id: 'example', status: 'approved' },
  { id: 'pending-1', status: 'pending-review' }
];

export async function GET() {
  return NextResponse.json({ items: mockEligibility }, { status: 200 });
}
