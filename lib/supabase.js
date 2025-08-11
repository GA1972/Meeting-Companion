// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

// Optional helper: copy a remote recording into Supabase Storage
export async function uploadRecordingFromUrl(meetingId, sourceUrl) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error("Failed to download recording");
  const buf = Buffer.from(await res.arrayBuffer());

  const path = `${meetingId}.mp3`; // change extension if needed
  const { error } = await supabaseAdmin.storage
    .from("recordings")
    .upload(path, buf, { contentType: "audio/mpeg", upsert: true });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from("recordings").getPublicUrl(path);
  return data.publicUrl;
}
