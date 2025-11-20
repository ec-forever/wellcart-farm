import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/supabase/serverClient';

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const retailerId = formData.get('retailer_id');
  const name = formData.get('name');
  const price = formData.get('price');
  const unitSize = formData.get('unit_size');
  const category = formData.get('category');
  const image = formData.get('image');

  if (!retailerId || typeof retailerId !== 'string') {
    return NextResponse.json({ error: 'retailer_id is required' }, { status: 400 });
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const priceValue = typeof price === 'string' && price.trim().length > 0 ? Number(price) : null;

  if (typeof priceValue === 'number' && Number.isNaN(priceValue)) {
    return NextResponse.json({ error: 'price must be a valid number' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    let imageUrl: string | null = null;

    if (image instanceof File && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const path = `${retailerId}/${Date.now()}-${randomUUID()}-${image.name}`;

      const { error: storageError } = await supabase.storage
        .from('product-photos')
        .upload(path, Buffer.from(arrayBuffer), { contentType: image.type || 'application/octet-stream' });

      if (storageError) {
        throw storageError;
      }

      const { data: publicUrlData } = supabase.storage.from('product-photos').getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data: insertData, error: insertError } = await supabase
      .from('product_catalog_items')
      .insert({
        retailer_id: retailerId,
        name,
        price: priceValue,
        unit_size: typeof unitSize === 'string' && unitSize.length > 0 ? unitSize : null,
        category: typeof category === 'string' && category.length > 0 ? category : null,
        image_url: imageUrl,
        source: 'manual',
        raw_payload: null
      })
      .select('id, name, price, unit_size, category, image_url')
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ message: 'SKU saved', item: insertData }, { status: 201 });
  } catch (error) {
    console.error('Manual SKU creation failed', error);
    return NextResponse.json({ error: 'Failed to save SKU' }, { status: 500 });
  }
}
