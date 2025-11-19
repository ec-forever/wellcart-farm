'use client';

import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/supabase/clientClient';

type LogoUploadProps = {
  bucket?: string;
  onChange?: (publicUrl: string) => void;
};

export function LogoUpload({ bucket = 'logos', onChange }: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);
      setUploading(true);
      const tempPreview = URL.createObjectURL(file);
      setPreviewUrl(tempPreview);

      const extension = file.name.split('.').pop();
      const filePath = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension ?? 'png'}`;

      try {
        const supabase = getSupabaseBrowserClient();
        const { error: uploadError, data } = await supabase.storage.from(bucket).upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
        setPreviewUrl(publicUrl);
        onChange?.(publicUrl);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
        setPreviewUrl(null);
      } finally {
        setUploading(false);
      }
    },
    [bucket, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-4 shadow-sm">
        <label className="flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-emerald-300 bg-white/80 px-5 py-8 text-center transition hover:border-emerald-400">
          {previewUrl ? (
            <div className="relative h-32 w-full max-w-[12rem] overflow-hidden rounded-lg bg-white shadow">
              <Image alt="Retailer logo preview" src={previewUrl} fill className="object-contain" sizes="192px" />
            </div>
          ) : (
            <div className="space-y-1 text-sm text-emerald-900">
              <p className="font-semibold">Upload your logo</p>
              <p className="text-emerald-800/70">PNG or JPG, square works best.</p>
            </div>
          )}
          <div className="rounded-full bg-[#0F3D1C] px-4 py-2 text-sm font-semibold text-white shadow-md">
            {uploading ? 'Uploading…' : 'Choose file'}
          </div>
          <input
            aria-label="Upload logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
