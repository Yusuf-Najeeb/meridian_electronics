"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat";
import { sendChatMessage } from "@/lib/chat";

export default function Chat() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const submit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    setLoading(true);
    setInput("");

    try {
      const res = await sendChatMessage({
        message: trimmed,
        history,
      });
      setHistory(res.history);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [history, input, loading]);

  return (
    <div className="drop-shadow-lg flex h-[min(720px,calc(100vh-5rem))] min-h[500px] w-full max-w-4xl flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <header className="border-b border-neutral-100 px-5 py-4">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
          Meridian assistant
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Get help with your orders and products faster than ever.
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {history.length === 0 && !loading && (
          <p className="text-sm text-neutral-400">
            Say hello or ask about products.</p>
        )}
        {history.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-100 bg-neutral-50 text-neutral-900"
              }`}
            >
              <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide opacity-70">
                {m.role === "user" ? "You" : "Assistant"}
              </span>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <footer className="border-t border-neutral-100 p-4">
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder="Message… (Enter to send, Shift+Enter for newline)"
            disabled={loading}
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-neutral-900/10 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void submit()}
            disabled={loading || !input.trim()}
            className="shrink-0 self-end rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
