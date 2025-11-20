import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/supabase/serverClient';

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const retailerId = formData.get('retailer_id');
  const files = formData.getAll('files').filter((value): value is File => value instanceof File);

  if (!retailerId || typeof retailerId !== 'string') {
    return NextResponse.json({ error: 'retailer_id is required' }, { status: 400 });
  }

  if (!files.length) {
    return NextResponse.json({ error: 'At least one image file is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const uploadedItems = [] as { id: string; image_url: string | null }[];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const path = `${retailerId}/${Date.now()}-${randomUUID()}-${file.name}`;

      const { error: storageError } = await supabase.storage.from('product-photos').upload(path, Buffer.from(arrayBuffer), {
        contentType: file.type || 'application/octet-stream'
      });

      if (storageError) {
        throw storageError;
      }

      const { data: publicUrlData } = supabase.storage.from('product-photos').getPublicUrl(path);
      const imageUrl = publicUrlData.publicUrl;

      const { data: insertData, error: insertError } = await supabase
        .from('product_catalog_items')
        .insert({
          retailer_id: retailerId,
          image_url: imageUrl,
          source: 'photo',
          raw_payload: null
        })
        .select('id, image_url')
        .single();

      if (insertError) {
        throw insertError;
      }

      uploadedItems.push(insertData);
    }

    return NextResponse.json({ message: 'Uploaded product photos', items: uploadedItems }, { status: 201 });
  } catch (error) {
    console.error('Photo upload failed', error);
    return NextResponse.json({ error: 'Failed to upload photos' }, { status: 500 });
  }
}
