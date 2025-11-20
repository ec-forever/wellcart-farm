import Link from 'next/link';
import { notFound } from 'next/navigation';

const fallbackBaseUrl = 'http://localhost:3000';

async function fetchEligibility(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : fallbackBaseUrl);
  const res = await fetch(`${baseUrl}/api/eligibility?retailerId=${id}`, {
    cache: 'no-store'
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Failed to load eligibility');
  }

  return res.json() as Promise<{ eligible: boolean; reasons: string[] }>;
}

type EligibilityPageProps = {
  params: { id: string };
};

export default async function EligibilityPage({ params }: EligibilityPageProps) {
  if (!params?.id) {
    notFound();
  }

  const result = await fetchEligibility(params.id);

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F3D1C]/70">Eligibility</p>
        <h1 className="text-3xl font-semibold text-[#0F3D1C]">Eligibility review</h1>
        <p className="text-base text-[#0F3D1C]/80">
          We evaluate your catalog depth, revenue signals, and operational readiness to confirm Instacart
          onboarding. Refresh this page after uploading products or updating your profile details.
        </p>
      </div>

      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          result.eligible
            ? 'border-emerald-200 bg-emerald-50 text-[#0F3D1C]'
            : 'border-red-200 bg-red-50 text-red-900'
        }`}
      >
        {result.eligible ? (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Eligible</p>
            <h2 className="mt-2 text-2xl font-semibold">Your farm meets Instacart&apos;s onboarding criteria.</h2>
            <p className="mt-3 text-emerald-800">
              Keep uploading SKUs and we&apos;ll notify you once the integration is finalized.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-red-700">Not eligible yet</p>
            <h2 className="mt-2 text-2xl font-semibold">We found a few items to complete first.</h2>
            <ul className="mt-4 space-y-2 text-red-800">
              {result.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-400" aria-hidden />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-red-800">
              Upload SKUs, add revenue details, or update your POS setup to move forward.
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/upload"
          className="inline-flex items-center justify-center rounded-lg bg-[#0F3D1C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2d15]"
        >
          Go to uploads
        </Link>
        <Link
          href="/onboard"
          className="inline-flex items-center justify-center rounded-lg border border-[#0F3D1C]/30 px-4 py-2 text-sm font-semibold text-[#0F3D1C] transition hover:border-[#0F3D1C]"
        >
          Update profile
        </Link>
      </div>
    </div>
  );
}
