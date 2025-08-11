export async function createRecallBot({ url, startsAtISO }) {
  const body = {
    url,
    name: "Meeting Scribe",
    start_time: startsAtISO || undefined
  };
  const resp = await fetch("https://api.recall.ai/api/v1/bot", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RECALL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error("Recall create bot failed: " + t);
  }
  return resp.json();
}

export async function fetchRecallTranscript({ bot_id, transcript_url }) {
  if (transcript_url) {
    const resp = await fetch(transcript_url, {
      headers: { "Authorization": `Bearer ${process.env.RECALL_API_KEY}` }
    });
    if (!resp.ok) throw new Error("Fetch transcript_url failed");
    return await resp.text();
  }
  const resp = await fetch("https://api.recall.ai/api/v1/transcript?bot_id=" + encodeURIComponent(bot_id), {
    headers: { "Authorization": `Bearer ${process.env.RECALL_API_KEY}` }
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error("Recall transcript fetch failed: " + t);
  }
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await resp.json();
    const words = Array.isArray(data) ? data.map(w => w.words).join(" ") : JSON.stringify(data);
    return words;
  }
  return await resp.text();
}
