// app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { summarizeTranscriptText } from "@/lib/summarize";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { transcript, meeting_id, upsert = true } = await req.json();

    let text = transcript?.toString() || "";
    if (!text && meeting_id) {
      const { data, error } = await supabaseAdmin
        .from("meetings")
        .select("transcript_text")
        .eq("id", meeting_id)
        .single();
      if (error) throw error;
      text = data?.transcript_text || "";
    }

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "No transcript provided or found" },
        { status: 400 }
      );
    }

    const summary = await summarizeTranscriptText(text);

    if (meeting_id && upsert) {
      await supabaseAdmin
        .from("meetings")
        .update({ summary_text: summary })
        .eq("id", meeting_id);
    }

    return NextResponse.json({ ok: true, summary });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Failed" }, { status: 500 });
  }
}
