import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const files = formData
    ? formData.getAll('files').map((value) => (value instanceof File ? value.name : String(value)))
    : [];

  return NextResponse.json(
    {
      message: 'Photo upload request accepted.',
      files
    },
    { status: 202 }
  );
}
