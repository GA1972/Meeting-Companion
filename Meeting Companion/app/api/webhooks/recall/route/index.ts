import { NextRequest, NextResponse } from "next/server";
import { fetchRecallTranscript } from "@/lib/recall";
import { summarizeTranscriptText } from "@/lib/summarize";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const bot_id = payload.bot_id || payload.id || "";
    const transcript_url = payload.transcript_url || payload.data?.transcript_url || "";
    const eventType = payload.type || payload.event || "";
    if (eventType && !/end|finished|completed/i.test(eventType)) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    const transcript = await fetchRecallTranscript({ bot_id, transcript_url });
    const summary = await summarizeTranscriptText(transcript);
    console.log("SUMMARY:\n", summary);
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message || "Webhook failed" }, { status: 500 });
  }
}
