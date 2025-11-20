import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/supabase/serverClient';

type EligibilityResult = {
  eligible: boolean;
  reasons: string[];
};

type RetailerRecord = {
  id: string;
  revenue: number | null;
  gmv: number | null;
  store_count: number | null;
  pos_system: string | null;
};

function buildEligibility(retailer: RetailerRecord, catalogCount: number): EligibilityResult {
  const reasons: string[] = [];

  if (retailer.revenue === null || retailer.revenue < 5000) {
    reasons.push('Revenue below required minimum');
  }

  if (retailer.gmv === null || retailer.gmv < 5000) {
    reasons.push('GMV too low');
  }

  if (retailer.store_count === null || retailer.store_count < 1) {
    reasons.push('Store count too low');
  }

  if (!retailer.pos_system) {
    reasons.push('No POS system');
  }

  if (catalogCount < 1) {
    reasons.push('No SKUs uploaded');
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const retailerId = searchParams.get('retailerId');

  if (!retailerId) {
    return NextResponse.json({ error: 'Missing retailerId' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: retailer, error: retailerError } = await supabase
      .from('retailer_profiles')
      .select('id, revenue, gmv, store_count, pos_system')
      .eq('id', retailerId)
      .single();

    if (retailerError) {
      const status = retailerError.code === 'PGRST116' ? 404 : 500;
      const message = status === 404 ? 'Retailer not found' : retailerError.message;
      return NextResponse.json({ error: message }, { status });
    }

    if (!retailer) {
      return NextResponse.json({ error: 'Retailer not found' }, { status: 404 });
    }

    const { count, error: countError } = await supabase
      .from('product_catalog_items')
      .select('id', { count: 'exact', head: true })
      .eq('retailer_id', retailerId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const evaluation = buildEligibility(retailer as RetailerRecord, count ?? 0);

    return NextResponse.json(evaluation, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
