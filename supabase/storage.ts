import { getSupabaseServerClient } from './serverClient';

export async function getSignedUploadUrl(bucket: string, filePath: string, expiresInSeconds = 300) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(filePath, expiresInSeconds);

  if (error) {
    throw error;
  }

  return data;
}
