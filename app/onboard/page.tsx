'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LogoUpload } from '@/components/LogoUpload';

type FormState = {
  store_name: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  logo_url: string;
  revenue: string;
  store_count: string;
  gmv: string;
  offers_ecommerce: boolean;
  offers_delivery: boolean;
  channel_partner: string;
  pos_system: string;
};

const initialState: FormState = {
  store_name: '',
  address: '',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  logo_url: '',
  revenue: '',
  store_count: '',
  gmv: '',
  offers_ecommerce: false,
  offers_delivery: false,
  channel_partner: '',
  pos_system: ''
};

export default function OnboardPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateField = (key: keyof FormState, value: FormState[typeof key]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      revenue: form.revenue ? Number(form.revenue) : null,
      store_count: form.store_count ? Number(form.store_count) : null,
      gmv: form.gmv ? Number(form.gmv) : null,
      logo_url: form.logo_url || null
    };

    try {
      const response = await fetch('/api/retailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to submit' }));
        throw new Error(data.error || 'Failed to submit');
      }

      const data = (await response.json()) as { id?: string };

      if (!data.id) {
        throw new Error('Missing retailer id');
      }

      router.push(`/upload?retailer_id=${data.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Onboarding</p>
        <h1 className="text-4xl font-semibold text-[#0F3D1C]">Retailer intake form</h1>
        <p className="text-lg text-emerald-900/80">
          Capture contact basics, eligibility signals, and brand assets so you can fast-track uploads
          after submission.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="grid gap-6 rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-6 md:grid-cols-[2fr,1fr] md:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0F3D1C]">Contact details</h2>
              <p className="text-sm text-emerald-900/80">Share the storefront and primary contact info.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
                Store name
                <input
                  required
                  type="text"
                  value={form.store_name}
                  onChange={(e) => updateField('store_name', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
                Contact name
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) => updateField('contact_name', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
                Contact email
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
                Contact phone
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C] md:col-span-1">
                Address
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-900/10">
            <p className="text-sm font-semibold text-[#0F3D1C]">Logo upload</p>
            <p className="text-sm text-emerald-900/70">Upload to the public logos bucket for immediate preview.</p>
            <LogoUpload bucket="logos" onChange={(url) => updateField('logo_url', url)} />
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm md:p-8">
          <div>
            <h2 className="text-xl font-semibold text-[#0F3D1C]">Business eligibility</h2>
            <p className="text-sm text-emerald-900/80">Signals that help qualify the retailer for distribution.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
              Annual revenue
              <input
                type="number"
                inputMode="decimal"
                value={form.revenue}
                onChange={(e) => updateField('revenue', e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-emerald-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
              Store count
              <input
                type="number"
                inputMode="numeric"
                value={form.store_count}
                onChange={(e) => updateField('store_count', e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-emerald-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
              GMV
              <input
                type="number"
                inputMode="decimal"
                value={form.gmv}
                onChange={(e) => updateField('gmv', e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-emerald-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-4">
              <p className="text-sm font-semibold text-[#0F3D1C]">Commerce channels</p>
              <label className="flex items-center gap-3 text-sm text-[#0F3D1C]">
                <input
                  type="checkbox"
                  checked={form.offers_ecommerce}
                  onChange={(e) => updateField('offers_ecommerce', e.target.checked)}
                  className="h-4 w-4 rounded border-emerald-900/40 text-[#0F3D1C] focus:ring-emerald-600"
                />
                Offers eCommerce
              </label>
              <label className="flex items-center gap-3 text-sm text-[#0F3D1C]">
                <input
                  type="checkbox"
                  checked={form.offers_delivery}
                  onChange={(e) => updateField('offers_delivery', e.target.checked)}
                  className="h-4 w-4 rounded border-emerald-900/40 text-[#0F3D1C] focus:ring-emerald-600"
                />
                Offers delivery
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
                Channel partner
                <input
                  type="text"
                  value={form.channel_partner}
                  onChange={(e) => updateField('channel_partner', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="space-y-1 text-sm font-medium text-[#0F3D1C]">
                POS system
                <input
                  type="text"
                  value={form.pos_system}
                  onChange={(e) => updateField('pos_system', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        {error && <p className="text-sm font-medium text-red-700">{error}</p>}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-[#0F3D1C] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:bg-emerald-900/50 disabled:shadow-none"
          >
            {submitting ? 'Submitting…' : 'Submit and continue to uploads'}
          </button>
          <Link href="/" className="text-sm font-semibold text-[#0F3D1C] underline-offset-4 hover:underline">
            Cancel and return home
          </Link>
        </div>
      </form>
    </div>
  );
}
