const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_BASE_URL = process.env.AI_BASE_URL || "https://api.openai.com/v1";
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

export function getModel(): string {
  return AI_MODEL;
}

export async function chat(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  if (!AI_API_KEY) throw new Error("AI_API_KEY nije konfiguriran");

  const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI API greška: ${res.status} — ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
