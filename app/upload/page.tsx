'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Status = { variant: 'success' | 'error'; message: string } | null;

export default function UploadPage() {
  const [retailerId, setRetailerId] = useState('');

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoStatus, setPhotoStatus] = useState<Status>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvStatus, setCsvStatus] = useState<Status>(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const [manualStatus, setManualStatus] = useState<Status>(null);
  const [manualUploading, setManualUploading] = useState(false);
  const [manualImage, setManualImage] = useState<File | null>(null);
  const [manualPayload, setManualPayload] = useState({
    name: '',
    price: '',
    unitSize: '',
    category: ''
  });

  const photoPreviews = useMemo(
    () => photoFiles.map((file) => ({ url: URL.createObjectURL(file), name: file.name })),
    [photoFiles]
  );

  async function submitPhotos() {
    if (!retailerId) {
      setPhotoStatus({ variant: 'error', message: 'Retailer ID is required before uploading photos.' });
      return;
    }

    if (!photoFiles.length) {
      setPhotoStatus({ variant: 'error', message: 'Choose at least one image to upload.' });
      return;
    }

    setUploadingPhotos(true);
    setPhotoStatus(null);

    const formData = new FormData();
    formData.append('retailer_id', retailerId);
    photoFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('/api/upload/photo', { method: 'POST', body: formData });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to upload photos');
      }

      setPhotoStatus({ variant: 'success', message: `Uploaded ${payload.items?.length ?? 0} photos.` });
      setPhotoFiles([]);
    } catch (error) {
      setPhotoStatus({ variant: 'error', message: error instanceof Error ? error.message : 'Upload failed' });
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function submitCsv() {
    if (!retailerId) {
      setCsvStatus({ variant: 'error', message: 'Retailer ID is required before uploading CSVs.' });
      return;
    }

    if (!csvFile) {
      setCsvStatus({ variant: 'error', message: 'Select a CSV file to upload.' });
      return;
    }

    setUploadingCsv(true);
    setCsvStatus(null);

    const formData = new FormData();
    formData.append('retailer_id', retailerId);
    formData.append('file', csvFile);

    try {
      const response = await fetch('/api/upload/csv', { method: 'POST', body: formData });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to upload CSV');
      }

      setCsvStatus({ variant: 'success', message: payload.message ?? 'CSV uploaded.' });
      setCsvFile(null);
    } catch (error) {
      setCsvStatus({ variant: 'error', message: error instanceof Error ? error.message : 'Upload failed' });
    } finally {
      setUploadingCsv(false);
    }
  }

  async function submitManualSku() {
    if (!retailerId) {
      setManualStatus({ variant: 'error', message: 'Retailer ID is required before adding SKUs.' });
      return;
    }

    if (!manualPayload.name.trim()) {
      setManualStatus({ variant: 'error', message: 'Name is required for manual SKU entries.' });
      return;
    }

    setManualUploading(true);
    setManualStatus(null);

    const formData = new FormData();
    formData.append('retailer_id', retailerId);
    formData.append('name', manualPayload.name);
    formData.append('price', manualPayload.price);
    formData.append('unit_size', manualPayload.unitSize);
    formData.append('category', manualPayload.category);

    if (manualImage) {
      formData.append('image', manualImage);
    }

    try {
      const response = await fetch('/api/sku/manual', { method: 'POST', body: formData });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to create SKU');
      }

      setManualStatus({ variant: 'success', message: 'Manual SKU saved.' });
      setManualPayload({ name: '', price: '', unitSize: '', category: '' });
      setManualImage(null);
    } catch (error) {
      setManualStatus({ variant: 'error', message: error instanceof Error ? error.message : 'Save failed' });
    } finally {
      setManualUploading(false);
    }
  }

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F3D1C]/70">Operations</p>
        <h1 className="text-4xl font-semibold">Upload center</h1>
        <p className="text-lg text-[#0F3D1C]/80">
          Drag assets, drop CSVs, and create manual SKUs—all wired to Supabase storage and catalog tables.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[#0F3D1C]/5 p-4">
          <label className="text-sm font-medium" htmlFor="retailerId">
            Retailer ID
          </label>
          <input
            id="retailerId"
            value={retailerId}
            onChange={(event) => setRetailerId(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0F3D1C] focus:outline-none"
            placeholder="Paste the retailer UUID"
          />
          <span className="text-xs text-[#0F3D1C]/70">
            Every upload and SKU will be associated with this retailer profile.
          </span>
        </div>
      </div>

      <section className="grid gap-10 lg:grid-cols-2">
        <article className="rounded-3xl border border-[#0F3D1C]/10 bg-white p-6 shadow-sm">
          <header className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0F3D1C]/70">Sprint 5A</p>
              <h2 className="text-2xl font-semibold">Photo upload tool</h2>
              <p className="text-sm text-[#0F3D1C]/70">Drag-and-drop multiple images, preview, and ship to product photos.</p>
            </div>
            <span className="rounded-full bg-[#0F3D1C]/10 px-3 py-1 text-xs font-semibold text-[#0F3D1C]">
              /api/upload/photo
            </span>
          </header>

          <div className="mt-6 rounded-2xl border border-dashed border-[#0F3D1C]/30 bg-[#0F3D1C]/5 p-6">
            <label
              className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm text-[#0F3D1C]/70"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
                setPhotoFiles(files);
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const files = event.target.files ? Array.from(event.target.files) : [];
                  setPhotoFiles(files);
                }}
              />
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0F3D1C]">Drag & drop</div>
              <p>Upload lifestyle imagery or pack shots. PNG, JPG, or HEIC.</p>
              <p className="text-xs text-[#0F3D1C]/60">We will push each file to Supabase storage and record the catalog entry.</p>
            </label>

            {photoPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photoPreviews.map((preview) => (
                  <figure key={preview.url} className="overflow-hidden rounded-xl border border-[#0F3D1C]/10 bg-white">
                    <Image src={preview.url} alt={preview.name} width={160} height={160} className="h-28 w-full object-cover" />
                    <figcaption className="truncate px-2 py-1 text-xs text-[#0F3D1C]/70">{preview.name}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            {photoStatus && (
              <p
                className={`mt-3 text-sm ${photoStatus.variant === 'success' ? 'text-emerald-700' : 'text-red-600'}`}
                role="status"
              >
                {photoStatus.message}
              </p>
            )}

            <button
              type="button"
              onClick={submitPhotos}
              disabled={uploadingPhotos}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0F3D1C] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploadingPhotos ? 'Uploading…' : 'Upload photos'}
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-[#0F3D1C]/10 bg-white p-6 shadow-sm">
          <header className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0F3D1C]/70">Sprint 5B</p>
              <h2 className="text-2xl font-semibold">CSV upload tool</h2>
              <p className="text-sm text-[#0F3D1C]/70">Push CSV catalog files to Supabase storage and archive the raw payload.</p>
            </div>
            <span className="rounded-full bg-[#0F3D1C]/10 px-3 py-1 text-xs font-semibold text-[#0F3D1C]">/api/upload/csv</span>
          </header>

          <div className="mt-6 space-y-3 rounded-2xl border border-dashed border-[#0F3D1C]/30 bg-[#0F3D1C]/5 p-6">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm"
            />
            {csvFile && <p className="text-sm text-[#0F3D1C]/80">Selected: {csvFile.name}</p>}
            {csvStatus && (
              <p className={`text-sm ${csvStatus.variant === 'success' ? 'text-emerald-700' : 'text-red-600'}`} role="status">
                {csvStatus.message}
              </p>
            )}
            <button
              type="button"
              onClick={submitCsv}
              disabled={uploadingCsv}
              className="inline-flex items-center justify-center rounded-xl bg-[#0F3D1C] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploadingCsv ? 'Uploading…' : 'Upload CSV'}
            </button>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-[#0F3D1C]/10 bg-white p-6 shadow-sm">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0F3D1C]/70">Sprint 5C</p>
            <h2 className="text-2xl font-semibold">Manual SKU input</h2>
            <p className="text-sm text-[#0F3D1C]/70">Add one-off items with optional photo uploads.</p>
          </div>
          <span className="rounded-full bg-[#0F3D1C]/10 px-3 py-1 text-xs font-semibold text-[#0F3D1C]">/api/sku/manual</span>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-[#0F3D1C]">
            Name
            <input
              type="text"
              value={manualPayload.name}
              onChange={(event) => setManualPayload((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0F3D1C] focus:outline-none"
              placeholder="Organic Heirloom Tomato"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-[#0F3D1C]">
            Price
            <input
              type="number"
              step="0.01"
              value={manualPayload.price}
              onChange={(event) => setManualPayload((prev) => ({ ...prev, price: event.target.value }))}
              className="rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0F3D1C] focus:outline-none"
              placeholder="9.99"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-[#0F3D1C]">
            Unit size
            <input
              type="text"
              value={manualPayload.unitSize}
              onChange={(event) => setManualPayload((prev) => ({ ...prev, unitSize: event.target.value }))}
              className="rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0F3D1C] focus:outline-none"
              placeholder="1 lb clamshell"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-[#0F3D1C]">
            Category
            <input
              type="text"
              value={manualPayload.category}
              onChange={(event) => setManualPayload((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0F3D1C] focus:outline-none"
              placeholder="Produce"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-[#0F3D1C]/30 bg-[#0F3D1C]/5 p-4">
          <label className="text-sm font-medium text-[#0F3D1C]">Optional image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setManualImage(event.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-[#0F3D1C]/20 bg-white px-3 py-2 text-sm"
          />
          {manualImage && <p className="text-sm text-[#0F3D1C]/80">Selected: {manualImage.name}</p>}
        </div>

        {manualStatus && (
          <p className={`mt-3 text-sm ${manualStatus.variant === 'success' ? 'text-emerald-700' : 'text-red-600'}`} role="status">
            {manualStatus.message}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={submitManualSku}
            disabled={manualUploading}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F3D1C] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {manualUploading ? 'Saving…' : 'Save SKU'}
          </button>
          <Link href="/" className="text-sm font-medium text-[#0F3D1C] underline underline-offset-4">
            ← Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
