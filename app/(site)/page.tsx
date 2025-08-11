import "./../../styles/home.css";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function schedule(formData: FormData) {
  "use server";
  const url = formData.get("url")?.toString() || "";
  const when = formData.get("when")?.toString() || "";
  if (!url) return { ok: false, error: "Missing meeting URL" };
  const startsAtISO = when ? new Date(when).toISOString() : undefined;
  const resp = await fetch(process.env.BASE_URL ? process.env.BASE_URL + "/api/schedule" : "/api/schedule", {
    method: "POST",
    body: JSON.stringify({ url, startsAtISO }),
    headers: { "Content-Type": "application/json" },
  });
  return await resp.json();
}

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="brand">Meeting Companion</div>
        <div className="tag">Send Meeting Scribe into Zoom, Meet, or Teams. Get clean summaries.</div>
      </section>
      <section className="card">
        <form action={schedule} className="space-y-3">
          <label>Meeting link</label>
          <input name="url" placeholder="Paste Zoom, Google Meet, or Teams URL" />
          <label style={{marginTop:8}}>Start time (UTC, optional)</label>
          <input name="when" type="datetime-local" />
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button>Send bot</button>
          </div>
          <small className="hint">Set BASE_URL in env after first deploy for server actions.</small>
        </form>
      </section>
      <footer>Meeting Companion • Private by design</footer>
    </main>
  );
}
