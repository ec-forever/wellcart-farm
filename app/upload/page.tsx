import Link from 'next/link';

const uploadTypes = [
  {
    title: 'Photo uploads',
    description: 'Accept high-resolution lifestyle imagery and confirm storage before syncing to PDPs.',
    endpoint: '/api/upload/photo'
  },
  {
    title: 'CSV ingestion',
    description: 'Parse tabular SKU data for bulk price updates or catalog refreshes.',
    endpoint: '/api/upload/csv'
  },
  {
    title: 'Manual SKU entry',
    description: 'Provide a fallback editor for small tweaks without re-uploading entire files.',
    endpoint: '/api/sku/manual'
  }
];

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">operations</p>
        <h1 className="text-3xl font-semibold">Upload center</h1>
        <p className="mt-3 text-slate-200">
          Supabase storage plus edge functions make file workflows reliable. Use the cards below as a
          jumping-off point for wiring in the actual handlers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {uploadTypes.map((type) => (
          <article key={type.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">{type.title}</h2>
            <p className="text-sm text-slate-200">{type.description}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-emerald-300">Endpoint</p>
            <code className="text-sm text-slate-100">{type.endpoint}</code>
          </article>
        ))}
      </div>

      <Link href="/" className="text-sm font-medium text-emerald-300">
        ← Back to dashboard
      </Link>
    </div>
  );
}
