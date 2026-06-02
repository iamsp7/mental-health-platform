import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:8000";

const calmToastStyle = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.12)",
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm here to listen. 💙 You can share how you're feeling — everything stays between us.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      toast.error("Couldn't reach the assistant. Please try again.", {
        style: calmToastStyle,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        content: "Hi again 💙 I'm here whenever you're ready to talk.",
      },
    ]);
    toast.success("Chat cleared.", { style: calmToastStyle, duration: 1500 });
  }

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-gradient-to-br from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              🤖 AI Support Chat
            </h1>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">
              {/* Powered by Groq · Not a substitute for professional care */}
            </p>
          </div>
          <button
            onClick={clearChat}
            className="
              text-xs px-3 py-1.5 rounded-lg
              bg-gray-100 dark:bg-white/10
              text-gray-500 dark:text-slate-300
              hover:bg-gray-200 dark:hover:bg-white/20
              transition
            "
          >
            Clear chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-end gap-2">
              <Avatar assistant />
              <div
                className="
                  px-4 py-3 rounded-2xl rounded-bl-sm
                  bg-white/80 dark:bg-white/10
                  border border-gray-200 dark:border-white/15
                  backdrop-blur-xl text-sm
                "
              >
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind…"
            className="
              flex-grow resize-none rounded-2xl px-4 py-3
              bg-white/80 dark:bg-white/10
              border border-gray-200 dark:border-white/20
              backdrop-blur-xl
              text-gray-800 dark:text-slate-100
              placeholder-gray-400 dark:placeholder-slate-500
              text-sm focus:outline-none focus:ring-2
              focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
              transition max-h-40 overflow-y-auto
            "
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="
              shrink-0 w-11 h-11 rounded-2xl
              bg-indigo-500 hover:bg-indigo-600
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white flex items-center justify-center
              transition shadow-lg shadow-indigo-500/30
            "
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-2">
          If you're in crisis, call{" "}
          <span className="font-medium text-rose-400">800-599-0019</span>  or your
          local emergency number.
        </p>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar assistant={!isUser} />
      <div
        className={`
          max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-indigo-500 text-white rounded-br-sm shadow-lg shadow-indigo-500/20"
              : "bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/15 backdrop-blur-xl text-gray-800 dark:text-slate-100 rounded-bl-sm"
          }
        `}
      >
        {msg.content}
      </div>
    </div>
  );
}

function Avatar({ assistant }) {
  return (
    <div
      className={`
        shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm
        ${
          assistant
            ? "bg-indigo-500/20 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300"
            : "bg-purple-500/20 dark:bg-purple-500/30 text-purple-600 dark:text-purple-300"
        }
      `}
    >
      {assistant ? "🤖" : "🧑"}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1 items-center h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-300 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );
}