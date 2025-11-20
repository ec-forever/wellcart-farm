import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/supabase/serverClient';

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const retailerId = formData.get('retailer_id');
  const csvFile = formData.get('file');

  if (!retailerId || typeof retailerId !== 'string') {
    return NextResponse.json({ error: 'retailer_id is required' }, { status: 400 });
  }

  if (!(csvFile instanceof File)) {
    return NextResponse.json({ error: 'A CSV file is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const arrayBuffer = await csvFile.arrayBuffer();
    const csvContent = await csvFile.text();
    const path = `${retailerId}/${Date.now()}-${randomUUID()}-${csvFile.name || 'catalog.csv'}`;

    const { error: storageError } = await supabase.storage
      .from('sku-csv-uploads')
      .upload(path, Buffer.from(arrayBuffer), { contentType: 'text/csv' });

    if (storageError) {
      throw storageError;
    }

    const { data: insertData, error: insertError } = await supabase
      .from('product_catalog_items')
      .insert({
        retailer_id: retailerId,
        name: null,
        price: null,
        unit_size: null,
        category: null,
        image_url: null,
        source: 'csv',
        raw_payload: csvContent
      })
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      {
        message: 'CSV uploaded to storage and catalog entry logged.',
        item: insertData
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('CSV upload failed', error);
    return NextResponse.json({ error: 'Failed to upload CSV' }, { status: 500 });
  }
}
