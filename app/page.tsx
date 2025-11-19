import Link from 'next/link';

const navLinks = [
  { href: '/onboard', label: 'Retailer onboarding' },
  { href: '/upload', label: 'Upload center' },
  { href: '/eligibility/example', label: 'Eligibility lookup' }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">wellcart</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Farm Partner Console</h1>
        <p className="text-lg text-slate-200">
          Lightweight scaffolding for onboarding retailers, managing SKU uploads, and responding to
          eligibility requests. Each section links to a dedicated workflow page so you can flesh out
          product logic quickly.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-lg font-medium transition hover:border-emerald-300/60 hover:bg-white/10"
          >
            {label}
          </Link>
        ))}
      </section>
    </div>
  );
}
