import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const sku = await request.json().catch(() => null);

  return NextResponse.json(
    {
      message: 'Manual SKU entry received.',
      sku
    },
    { status: 201 }
  );
}
