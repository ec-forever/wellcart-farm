import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/supabase/serverClient';

type RetailerPayload = {
  store_name: string;
  address?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  logo_url?: string | null;
  revenue?: number | null;
  store_count?: number | null;
  gmv?: number | null;
  offers_ecommerce?: boolean | null;
  offers_delivery?: boolean | null;
  channel_partner?: string | null;
  pos_system?: string | null;
};

function isValidRetailerPayload(body: unknown): body is RetailerPayload {
  if (typeof body !== 'object' || body === null) return false;

  const payload = body as Record<string, unknown>;

  if (typeof payload.store_name !== 'string' || !payload.store_name.trim()) {
    return false;
  }

  const stringFields = [
    'address',
    'contact_name',
    'contact_phone',
    'contact_email',
    'logo_url',
    'channel_partner',
    'pos_system'
  ];

  const numberFields = ['revenue', 'store_count', 'gmv'];
  const booleanFields = ['offers_ecommerce', 'offers_delivery'];

  for (const field of stringFields) {
    if (field in payload && payload[field] !== null && typeof payload[field] !== 'string') {
      return false;
    }
  }

  for (const field of numberFields) {
    if (field in payload && payload[field] !== null && typeof payload[field] !== 'number') {
      return false;
    }
  }

  for (const field of booleanFields) {
    if (field in payload && payload[field] !== null && typeof payload[field] !== 'boolean') {
      return false;
    }
  }

  return true;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!isValidRetailerPayload(payload)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('retailer_profiles')
      .insert({
        name: payload.store_name,
        address: payload.address ?? null,
        contact_name: payload.contact_name ?? null,
        contact_phone: payload.contact_phone ?? null,
        contact_email: payload.contact_email ?? null,
        logo_url: payload.logo_url ?? null,
        revenue: payload.revenue ?? null,
        store_count: payload.store_count ?? null,
        gmv: payload.gmv ?? null,
        offers_ecommerce: payload.offers_ecommerce ?? null,
        offers_delivery: payload.offers_delivery ?? null,
        channel_partner: payload.channel_partner ?? null,
        pos_system: payload.pos_system ?? null
      })
      .select('id')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Failed to create retailer' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
