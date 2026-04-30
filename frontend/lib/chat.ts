export type ChatMessage = {
  role: string;
  content: string;
};

export type ChatRequest = {
  message: string;
  history: ChatMessage[];
};

export type ChatResponse = {
  reply: string;
  history: ChatMessage[];
};

const CHAT_PATH = "/api-proxy/api/v1/customer-agent/chat/";

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(CHAT_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : text || res.statusText;
    throw new Error(detail);
  }

  return data as ChatResponse;
}
