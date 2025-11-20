import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/supabase/serverClient';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    store_name,
    address,
    contact_name,
    contact_phone,
    contact_email,
    logo_url,
    revenue,
    store_count,
    gmv,
    offers_ecommerce,
    offers_delivery,
    channel_partner,
    pos_system
  } = payload as Record<string, unknown>;

  if (!store_name || typeof store_name !== 'string') {
    return NextResponse.json({ error: 'store_name is required' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('retailer_profiles')
    .insert({
      name: store_name,
      address: typeof address === 'string' ? address : null,
      contact_name: typeof contact_name === 'string' ? contact_name : null,
      contact_phone: typeof contact_phone === 'string' ? contact_phone : null,
      contact_email: typeof contact_email === 'string' ? contact_email : null,
      logo_url: typeof logo_url === 'string' ? logo_url : null,
      revenue: typeof revenue === 'number' ? revenue : null,
      store_count: typeof store_count === 'number' ? store_count : null,
      gmv: typeof gmv === 'number' ? gmv : null,
      offers_ecommerce: typeof offers_ecommerce === 'boolean' ? offers_ecommerce : null,
      offers_delivery: typeof offers_delivery === 'boolean' ? offers_delivery : null,
      channel_partner: typeof channel_partner === 'string' ? channel_partner : null,
      pos_system: typeof pos_system === 'string' ? pos_system : null
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data?.id }, { status: 201 });
}
