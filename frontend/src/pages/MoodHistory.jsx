import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { IS_DEMO } from "../config";

const API = "http://localhost:8080/api/journal";

/* ================= HELPERS ================= */

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function moodStyle(label) {
  switch ((label || "").toUpperCase()) {
    case "POSITIVE":
      return "border-green-400/30";
    case "ANXIETY":
      return "border-amber-400/30";
    case "DEPRESSION":
      return "border-red-400/30";
    case "SUICIDAL":
      return "border-rose-400/40";
    default:
      return "border-slate-400/30";
  }
}

/* ================= MOOD STATS ================= */

function calculateMoodStats(entries) {
  const counts = {
    POSITIVE: 0,
    ANXIETY: 0,
    DEPRESSION: 0,
    SUICIDAL: 0,
    NEUTRAL: 0,
  };

  entries.forEach((e) => {
    const label = (e.label || "NEUTRAL").toUpperCase();
    counts[label] = (counts[label] || 0) + 1;
  });

  const total =
    Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return { counts, total };
}

/* ================= MOOD BAR ================= */

function MoodBar({ entries }) {
  const { counts, total } = calculateMoodStats(entries);
  const pct = (n) => Math.round((n / total) * 100);

  return (
    <div
      className="
        w-full h-4 rounded-full overflow-hidden flex mt-3 mb-6
        bg-gray-200 border border-gray-300
        dark:bg-white/10 dark:border-white/20
      "
    >
      {counts.POSITIVE > 0 && (
        <div className="bg-green-500" style={{ width: `${pct(counts.POSITIVE)}%` }} />
      )}
      {counts.ANXIETY > 0 && (
        <div className="bg-amber-400" style={{ width: `${pct(counts.ANXIETY)}%` }} />
      )}
      {counts.DEPRESSION > 0 && (
        <div className="bg-red-500" style={{ width: `${pct(counts.DEPRESSION)}%` }} />
      )}
      {counts.SUICIDAL > 0 && (
        <div className="bg-rose-600" style={{ width: `${pct(counts.SUICIDAL)}%` }} />
      )}
      {counts.NEUTRAL > 0 && (
        <div className="bg-slate-400" style={{ width: `${pct(counts.NEUTRAL)}%` }} />
      )}
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function MoodHistory({ token }) {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= LOAD HISTORY ================= */

  const loadHistory = useCallback(async () => {
    if (IS_DEMO) {
      const demoEntries = [
        {
          id: 1,
          content: "Felt calm and productive today.",
          label: "POSITIVE",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          content: "A bit anxious before presentation.",
          label: "ANXIETY",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          content: "Low mood in the evening.",
          label: "DEPRESSION",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      const byDay = {};
      demoEntries.forEach((e) => {
        const day = getDayName(e.createdAt);
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(e);
      });

      setGrouped(byDay);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const txt = await res.text();
      const entries = txt ? JSON.parse(txt) : [];

      const byDay = {};
      entries.forEach((e) => {
        const day = getDayName(e.createdAt);
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(e);
      });

      setGrouped(byDay);
    } catch {
      toast.error("Failed to load mood history");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /* ================= DELETE ENTRY ================= */

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (IS_DEMO) {
      setGrouped((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((day) => {
          updated[day] = updated[day].filter(
            (e) => e.id !== deleteTarget.id
          );
          if (updated[day].length === 0) delete updated[day];
        });
        return updated;
      });

      toast.success("Entry removed (Demo Mode)");
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${API}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      toast.success("Journal entry deleted 🗑️");
      setDeleteTarget(null);
      loadHistory();
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-slate-400">
        Loading mood history…
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
      "
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Mood History
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Day-wise emotional patterns from your journal
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-slate-300 mb-10">
          <Legend color="bg-green-500" label="Positive" />
          <Legend color="bg-amber-400" label="Anxiety" />
          <Legend color="bg-red-500" label="Depression" />
          <Legend color="bg-rose-600" label="Suicidal" />
          <Legend color="bg-slate-400" label="Neutral" />
        </div>

        {/* Days */}
        <div className="space-y-12">
          {Object.entries(grouped).map(([day, entries]) => (
            <div key={day}>
              <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                {day}
              </h3>

              <MoodBar entries={entries} />

              <div className="grid sm:grid-cols-2 gap-5">
                {entries.map((e) => (
                  <div
                    key={e.id}
                    className={`
                      group relative rounded-2xl p-5
                      bg-white/70 dark:bg-white/10 backdrop-blur-xl
                      border ${moodStyle(e.label)}
                      transition-all duration-300
                      shadow-[0_12px_30px_rgba(0,0,0,0.15)]
                      dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]
                      hover:shadow-[0_28px_65px_rgba(0,0,0,0.35)]
                      dark:hover:shadow-[0_28px_65px_rgba(0,0,0,0.65)]
                      hover:scale-[1.03]
                    `}
                  >
                    {/* Glow */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(e)}
                      className="
                        absolute top-2 right-2
                        w-10 h-10
                        flex items-center justify-center
                        rounded-full
                        text-gray-500 dark:text-slate-400
                        hover:text-rose-500
                        hover:bg-rose-500/10
                        transition
                      "
                    >
                      🗑
                    </button>

                    <div className="relative z-10 flex justify-between items-center mb-2 pr-10">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-slate-200">
                        {e.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        {new Date(e.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="relative z-10 text-sm text-gray-700 dark:text-slate-300 line-clamp-3">
                      {e.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CONFIRM DELETE */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="
              bg-white dark:bg-slate-900
              rounded-2xl p-6 w-full max-w-sm
              border border-gray-200 dark:border-white/10
              shadow-xl
            ">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Delete this entry?
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="
                    px-4 py-2 text-sm rounded-lg
                    border border-gray-300 dark:border-white/20
                    text-gray-700 dark:text-slate-300
                    hover:bg-gray-100 dark:hover:bg-white/10
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="
                    px-4 py-2 text-sm rounded-lg
                    bg-rose-600 text-white
                    hover:bg-rose-500
                    disabled:opacity-50
                  "
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= LEGEND ================= */

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </span>
  );
}

