import Link from 'next/link';

const steps = [
  {
    title: 'Collect retailer basics',
    description:
      'Gather contact information, primary locations, distribution regions, and certifications needed for your marketplace.'
  },
  {
    title: 'Configure supply profile',
    description:
      'Define lead times, catalog size, shipping constraints, and payment preferences using Supabase tables.'
  },
  {
    title: 'Review & activate',
    description:
      'Surface actionable next steps for the ops team and provide the retailer a shareable onboarding receipt.'
  }
];

export default function OnboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">workflow</p>
        <h1 className="text-3xl font-semibold">Retailer onboarding</h1>
        <p className="mt-3 text-slate-200">
          Use this page as the canvas for your onboarding wizard. Each step card highlights the
          expected data collection phases and links back to the home dashboard for quick navigation.
        </p>
      </div>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-emerald-300">Step {index + 1}</p>
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="text-sm text-slate-200">{step.description}</p>
          </li>
        ))}
      </ol>

      <Link href="/" className="text-sm font-medium text-emerald-300">
        ← Back to dashboard
      </Link>
    </div>
  );
}
