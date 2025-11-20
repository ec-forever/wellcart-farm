import Link from 'next/link';
import { notFound } from 'next/navigation';

type EligibilityPageProps = {
  params: { id: string };
};

async function getEligibility(id: string) {
  return {
    id,
    status: id === 'example' ? 'approved' : 'pending-review',
    notes:
      id === 'example'
        ? 'Retailer passed the latest compliance and credit checks.'
        : 'Hook up Supabase RPC to resolve eligibility dynamically.'
  };
}

export default async function EligibilityPage({ params }: EligibilityPageProps) {
  if (!params?.id) {
    notFound();
  }

  const details = await getEligibility(params.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">eligibility</p>
        <h1 className="text-3xl font-semibold">Request #{details.id}</h1>
        <p className="mt-3 text-slate-200">{details.notes}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-slate-200">Status</p>
        <p className="text-2xl font-semibold capitalize">{details.status.replace('-', ' ')}</p>
      </div>

      <Link href="/" className="text-sm font-medium text-emerald-300">
        ← Back to dashboard
      </Link>
    </div>
  );
}
