// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Server only client. Uses your project URL and Service Role key from Vercel env vars.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

/**
 * Optional helper
 * Copies a remote recording URL into your Supabase bucket named "recordings"
 * Returns a public URL (or switch to a signed URL if you keep the bucket private)
 */
export async function uploadRecordingFromUrl(meetingId, sourceUrl, ext = "mp3") {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const path = `${meetingId}.${ext}`;

  const { error } = await supabaseAdmin
    .storage
    .from("recordings")
    .upload(path, buffer, {
      contentType: ext === "m4a" ? "audio/m4a" : "audio/mpeg",
      upsert: true
    });
  if (error) throw error;

  // If your bucket is private and you want time-limited links, use a signed URL instead:
  // const { data: signed } = await supabaseAdmin.storage.from("recordings").createSignedUrl(path, 3600);
  // return signed?.signedUrl;

  const { data } = supabaseAdmin.storage.from("recordings").getPublicUrl(path);
  return data.publicUrl;
}
