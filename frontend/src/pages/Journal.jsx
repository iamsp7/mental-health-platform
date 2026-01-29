import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IS_DEMO } from "../config";

const API = "http://localhost:8080/api/journal";
const ML_API = "http://127.0.0.1:8000/analyze_text";
const TOAST_ID = "journal-toast";

/* ================= MOOD BADGES ================= */

function emotionBadge(label) {
  switch ((label || "").toUpperCase()) {
    case "SUICIDAL":
      return "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-400/30";
    case "DEPRESSION":
      return "bg-red-500/20 text-red-600 dark:text-red-300 border border-red-400/30";
    case "ANXIETY":
      return "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-400/30";
    case "EUPHORIC":
      return "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-400/30";
    case "POSITIVE":
      return "bg-green-500/20 text-green-600 dark:text-green-300 border border-green-400/30";
    default:
      return "bg-slate-500/20 text-slate-600 dark:text-slate-300 border border-slate-400/30";
  }
}

export default function Journal({ token }) {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const navigate = useNavigate();
  const toastLock = useRef(false);

  /* ================= LOAD JOURNAL ================= */

  useEffect(() => {
    if (IS_DEMO) {
      setEntries([
        {
          id: 1,
          content: "Today I felt calm and focused while working on my project.",
          label: "POSITIVE",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          content: "I felt a little anxious about deadlines, but managed it.",
          label: "ANXIETY",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
      return;
    }

    if (!token) return;

    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then((txt) => setEntries(txt ? JSON.parse(txt) : []))
      .catch(() =>
        toast.error("Failed to load journal", { id: TOAST_ID })
      );
  }, [token]);

  /* ================= SAVE ENTRY ================= */

  const saveEntry = async () => {
    if (!text.trim()) {
      toast("Write something before saving ✍️", { id: TOAST_ID });
      return;
    }

    if (loading || toastLock.current) return;

    toastLock.current = true;
    setLoading(true);

    try {
      if (!IS_DEMO) {
        const mlRes = await fetch(ML_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const ml = await mlRes.json();

        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: text,
            label: ml.label,
            suicidalScore: ml.suicidal_score,
          }),
        });

        if (ml.support_recommended) {
          toast("We recommend some support resources 💙", { id: TOAST_ID });
          setTimeout(() => navigate("/support"), 1500);
        }
      }

      setEntries((prev) => [
        {
          id: Date.now(),
          content: text,
          label: "POSITIVE",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setText("");
      toast.success("Journal entry saved 📝", { id: TOAST_ID });
    } catch {
      toast.error("Could not save entry", { id: TOAST_ID });
    } finally {
      setLoading(false);
      toastLock.current = false;
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
        transition-colors duration-300
      "
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Daily Journal
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-300">
            Write freely. Click past entries to expand and reflect.
          </p>
        </div>

        {/* Write Box */}
        <div
          className="
            relative rounded-2xl p-6 mb-14
            bg-white/80 dark:bg-white/10
            backdrop-blur-xl
            border border-gray-200 dark:border-white/20
            transition-all duration-300
            shadow-lg dark:shadow-[0_20px_45px_rgba(0,0,0,0.55)]
            hover:scale-[1.03]
          "
        >
          <textarea
            rows={6}
            className="
              w-full resize-none rounded-xl p-4 text-sm
              bg-white dark:bg-slate-900/80
              text-gray-800 dark:text-slate-200
              placeholder-gray-400 dark:placeholder-slate-400
              border border-gray-200 dark:border-white/10
              focus:ring-2 focus:ring-indigo-500/40 outline-none
            "
            placeholder="How are you feeling today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={saveEntry}
              disabled={loading}
              className="
                px-6 py-2 rounded-xl
                bg-indigo-600 text-white text-sm font-medium
                hover:bg-indigo-500 transition
                disabled:opacity-50
              "
            >
              {loading ? "Analyzing..." : "Save Entry"}
            </button>
          </div>
        </div>

        {/* Past Entries */}
        <h2 className="text-lg font-medium text-gray-700 dark:text-slate-200 mb-4">
          Past Entries
        </h2>

        <div className="space-y-4">
          {entries.slice(0, visibleCount).map((e) => {
            const isOpen = openId === e.id;

            return (
              <div
                key={e.id}
                onClick={() => setOpenId(isOpen ? null : e.id)}
                className="
                  cursor-pointer rounded-xl p-4
                  bg-white/80 dark:bg-white/10
                  backdrop-blur-xl
                  border border-gray-200 dark:border-white/20
                  transition-all duration-300
                  hover:scale-[1.02]
                "
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${emotionBadge(e.label)}`}>
                      {e.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-400">
                      {new Date(e.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-slate-300">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-gray-700 dark:text-slate-200 whitespace-pre-wrap">
                    {e.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {entries.length > visibleCount && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((v) => v + 5)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Load more entries
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
