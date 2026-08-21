"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "No reply received." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: could not reach AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-3 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 text-white px-4 py-3 font-semibold flex justify-between items-center flex-shrink-0">
            <span className="text-sm">💬 Chat Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white/70 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-6">
                Say hello 👋
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white ml-auto"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-white text-gray-400 text-sm px-3 py-2 rounded-lg w-fit border border-gray-200 italic">
                Typing…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="p-2 border-t border-gray-200 flex gap-2 flex-shrink-0 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-teal-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="w-14 h-14 rounded-full bg-teal-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-teal-700 transition-colors"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
