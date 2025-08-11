import OpenAI from "openai";

export async function summarizeTranscriptText(transcript) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are a precise meeting assistant. Produce:
- Executive summary in 5 tight bullets
- Action items as JSON array of {owner, task, due}
- Key decisions in 3 bullets
- Risks or blockers in 3 bullets
Keep it factual, neutral, concise. Transcript below:\n\n${transcript}`;
  const resp = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });
  return resp.choices?.[0]?.message?.content || "";
}
