import Link from 'next/link';
import { LogoUpload } from '@/components/LogoUpload';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-emerald-900/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-emerald-50" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-emerald-200/60 via-white to-white" />

      <div className="relative grid gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-16">
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0F3D1C]">
            wellcart
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-[#0F3D1C] sm:text-5xl">
              Wellcart Farm Connect
            </h1>
            <p className="max-w-2xl text-lg text-emerald-900/80">
              Manage retailer onboarding, logo uploads, and eligibility checks in one place. Build the flow now and
              wire up Supabase when your credentials are ready.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/eligibility/example"
              className="rounded-full bg-[#0F3D1C] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D1C]"
            >
              Check Instacart Edibility
            </Link>
            <Link
              href="/upload"
              className="rounded-full border border-[#0F3D1C] px-6 py-3 text-sm font-semibold text-[#0F3D1C] transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D1C]"
            >
              Go to uploads
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-emerald-200 blur-3xl" />
          <div className="absolute -right-6 bottom-10 h-20 w-20 rounded-full bg-emerald-100 blur-2xl" />
          <div className="relative rounded-3xl border border-emerald-900/10 bg-white/80 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between gap-3 border-b border-emerald-900/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/70">Logo upload</p>
                <p className="text-sm text-emerald-900/70">Preview immediately after sending to Supabase.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#0F3D1C]">Live</span>
            </div>
            <div className="pt-5">
              <LogoUpload onChange={(url) => console.log('Logo uploaded to:', url)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
