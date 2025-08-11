import { NextRequest, NextResponse } from "next/server";
import { summarizeTranscriptText } from "../../../lib/summarize";
import { supabaseAdmin } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const meeting_id: string | undefined = body.meeting_id;
    const upsert: boolean = body.upsert !== false; // default true
    let transcript: string = body.transcript?.toString?.() || "";

    if (!transcript && meeting_id) {
      const { data, error } = await supabaseAdmin
        .from("meetings")
        .select("transcript_text")
        .eq("id", meeting_id)
        .single();
      if (error) throw error;
      transcript = data?.transcript_text || "";
    }

    if (!transcript) {
      return NextResponse.json(
        { ok: false, error: "No transcript provided or found" },
        { status: 400 }
      );
    }

    const summary = await summarizeTranscriptText(transcript);

    if (meeting_id && upsert) {
      await supabaseAdmin
        .from("meetings")
        .update({ summary_text: summary })
        .eq("id", meeting_id);
    }

    return NextResponse.json({ ok: true, summary });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Failed" },
      { status: 500 }
    );
  }
}
