import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function GET() {
  try {
    // Simple read; safe even if table is empty
    const { data, error } = await supabaseAdmin
      .from("meetings")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json({ ok: false, where: "select", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, sample: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "unknown" }, { status: 500 });
  }
}
