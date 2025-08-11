import { NextRequest, NextResponse } from "next/server";
import { createRecallBot } from "../../../../lib/recall";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url, startsAtISO } = await req.json();

    if (!process.env.RECALL_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing RECALL_API_KEY" },
        { status: 500 }
      );
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing meeting url" },
        { status: 400 }
      );
    }

    const bot = await createRecallBot({ url, startsAtISO });
    return NextResponse.json({ ok: true, bot });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Failed" },
      { status: 500 }
    );
  }
}
