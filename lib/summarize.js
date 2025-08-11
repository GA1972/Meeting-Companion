import OpenAI from "openai";

// xAI Grok via OpenAI-compatible API
const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: process.env.XAI_BASE_URL || "https://api.x.ai/v1"
});

const MODEL = process.env.XAI_MODEL || "grok-2";

export async function summarizeTranscriptText(transcript) {
  const prompt = `You are a precise meeting assistant. Produce:
- Executive summary in 5 tight bullets
- Action items as JSON array of {owner, task, due}
- Key decisions in 3 bullets
- Risks or blockers in 3 bullets
Keep it factual, neutral, concise.

Transcript:
${transcript}`;

  const resp = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return resp.choices?.[0]?.message?.content?.trim() || "";
}
