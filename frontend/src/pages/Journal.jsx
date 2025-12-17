import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IS_DEMO } from "../config";

const API = "http://localhost:8080/api/journal";
const ML_API = "http://127.0.0.1:8000/analyze_text";

/* ================= MOOD BADGES ================= */

function emotionBadge(label) {
  switch ((label || "").toUpperCase()) {
    case "SUICIDAL":
      return "bg-rose-100 text-rose-800 border border-rose-200";
    case "DEPRESSION":
      return "bg-red-100 text-red-700 border border-red-200";
    case "ANXIETY":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "EUPHORIC":
      return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    case "POSITIVE":
      return "bg-green-100 text-green-700 border border-green-200";
    case "NEUTRAL":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

export default function Journal({ token }) {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const navigate = useNavigate();

  /* ================= LOAD JOURNAL ================= */

  useEffect(() => {
    // 🟢 DEMO MODE
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
      .catch(() => toast.error("Failed to load journal"));
  }, [token]);

  /* ================= SAVE ENTRY ================= */

  const saveEntry = async () => {
    if (!text.trim()) {
      toast("Write something before saving ✍️");
      return;
    }

    // 🟢 DEMO MODE SAVE
    if (IS_DEMO) {
      const fakeEntry = {
        id: Date.now(),
        content: text,
        label: "POSITIVE",
        createdAt: new Date().toISOString(),
      };

      setEntries((prev) => [fakeEntry, ...prev]);
      setText("");
      toast.success("Journal entry saved (Demo Mode)");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Analyze text (ML)
      const mlRes = await fetch(ML_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const ml = await mlRes.json();

      // 2️⃣ Save journal entry
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

      toast.success("Journal entry saved 📝");
      setText("");
      setOpenId(null);

      // 3️⃣ Reload entries
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const txt = await res.text();
      setEntries(txt ? JSON.parse(txt) : []);

      // 4️⃣ Redirect if support recommended
      if (ml.support_recommended) {
        toast("We recommend some support resources 💙");
        setTimeout(() => navigate("/support"), 1500);
      }
    } catch {
      toast.error("Could not save entry");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Daily Journal
        </h1>
        <p className="text-sm text-gray-500">
          Express your thoughts freely. This space is private and safe.
        </p>
      </div>

      {/* Write Box */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 p-6 mb-12">
        <textarea
          rows={6}
          className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="How are you feeling today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={saveEntry}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Save Entry"}
          </button>
        </div>
      </div>

      {/* Past Entries */}
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Past Entries
      </h2>

      <div className="space-y-4">
        {entries.slice(0, visibleCount).map((e) => {
          const label = (e.label || "NEUTRAL").toUpperCase();

          return (
            <div
              key={e.id}
              className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setOpenId(openId === e.id ? null : e.id)}
              >
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${emotionBadge(
                    label
                  )}`}
                >
                  {label}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>

              {openId === e.id && (
                <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {e.content}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {entries.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((v) => v + 5)}
            className="text-sm text-indigo-600 hover:underline"
          >
            Load more entries
          </button>
        </div>
      )}
    </div>
  );
}
