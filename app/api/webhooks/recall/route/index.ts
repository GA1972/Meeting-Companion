import { NextRequest, NextResponse } from "next/server";
import { fetchRecallTranscript } from "../../../../../lib/recall";
import { summarizeTranscriptText } from "../../../../../lib/summarize";
import { supabaseAdmin, uploadRecordingFromUrl } from "../../../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Only process on meeting end
    const eventType: string = payload.type || payload.event || "";
    if (eventType && !/end|ended|finish|finished|complete|completed/i.test(eventType)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const bot_id: string = payload.bot_id || payload.id || "";
    const transcript_url: string =
      payload.transcript_url ||
      payload.data?.transcript_url ||
      "";
    const meeting_url: string =
      payload.meeting_url ||
      payload.data?.meeting_url ||
      payload.room?.url ||
      "";
    const title: string =
      payload.title ||
      payload.data?.title ||
      payload.meeting_title ||
      "";
    const rawRecordingUrl: string =
      payload.recording_url ||
      payload.data?.recording_url ||
      "";

    // 1) Fetch transcript text
    const transcript: string = await fetchRecallTranscript({ bot_id, transcript_url });

    // 2) Summarize (Grok / OpenAI based on your lib)
    const summary: string = await summarizeTranscriptText(transcript);

    // 3) Save to Supabase
    const { data: meetingRow, error } = await supabaseAdmin
      .from("meetings")
      .insert({
        external_bot_id: bot_id || null,
        title: title || null,
        meeting_url: meeting_url || null,
        recording_url: rawRecordingUrl || null,
        transcript_text: transcript,
        summary_text: summary,
      })
      .select()
      .single();

    if (error) throw error;

    // 4) Optional: copy the recording to Supabase Storage
    if (rawRecordingUrl) {
      try {
        const publicUrl = await uploadRecordingFromUrl(meetingRow.id, rawRecordingUrl);
        await supabaseAdmin
          .from("meetings")
          .update({ recording_url: publicUrl })
          .eq("id", meetingRow.id);
      } catch (e) {
        console.warn("Recording copy failed:", e);
      }
    }

    return NextResponse.json({ ok: true, meeting_id: meetingRow.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: e.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
