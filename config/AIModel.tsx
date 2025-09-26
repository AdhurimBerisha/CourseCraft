// config/AIModel.tsx
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

function getApiKey() {
  return process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;
}

export async function generateTopic(topic: string) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Missing OpenRouter API key");

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "x-ai/grok-4-fast:free",
      messages: [
        {
          role: "user",
          content: `Learn ${topic}:
As you are a coaching teacher:
- Generate 5–7 short course titles
- Output as a strict JSON array of strings only. Example: ["Intro to JS", "Advanced JS"]`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();

  let text = data.choices?.[0]?.message?.content || "[]";

  try {
    // some models wrap JSON in code fences → strip them
    text = text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("Parse error, raw output:", text);
    return [];
  }
}
