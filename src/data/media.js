import { supabase } from "../lib/supabase";

const BUCKET = "news-images";

export async function uploadImage(file) {
  const extension = file.type.split("/")[1];
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
