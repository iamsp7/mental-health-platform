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
      return "bg-green-50/80 border-green-200";
    case "ANXIETY":
      return "bg-orange-50/80 border-orange-200";
    case "DEPRESSION":
      return "bg-red-50/80 border-red-200";
    case "SUICIDAL":
      return "bg-rose-50/80 border-rose-300";
    default:
      return "bg-gray-50/80 border-gray-200";
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
    <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-200/70 mt-2 mb-4">
      {counts.POSITIVE > 0 && (
        <div className="bg-green-500" style={{ width: `${pct(counts.POSITIVE)}%` }} />
      )}
      {counts.ANXIETY > 0 && (
        <div className="bg-orange-400" style={{ width: `${pct(counts.ANXIETY)}%` }} />
      )}
      {counts.DEPRESSION > 0 && (
        <div className="bg-red-500" style={{ width: `${pct(counts.DEPRESSION)}%` }} />
      )}
      {counts.SUICIDAL > 0 && (
        <div className="bg-rose-700" style={{ width: `${pct(counts.SUICIDAL)}%` }} />
      )}
      {counts.NEUTRAL > 0 && (
        <div className="bg-gray-400" style={{ width: `${pct(counts.NEUTRAL)}%` }} />
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
    // 🟢 DEMO MODE
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

    // 🔵 REAL MODE
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

    // 🟢 DEMO MODE DELETE
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

    // 🔵 REAL MODE DELETE
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
      <div className="text-center py-12 text-gray-500">
        Loading mood history…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Mood History
        </h2>
        <p className="text-sm text-gray-500">
          Day-wise emotional patterns from your journal
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-8">
        <Legend color="bg-green-500" label="Positive" />
        <Legend color="bg-orange-400" label="Anxiety" />
        <Legend color="bg-red-500" label="Depression" />
        <Legend color="bg-rose-700" label="Suicidal" />
        <Legend color="bg-gray-400" label="Neutral" />
      </div>

      {/* Days */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([day, entries]) => (
          <div key={day}>
            <h3 className="text-lg font-medium text-indigo-600">
              {day}
            </h3>

            <MoodBar entries={entries} />

            <div className="grid sm:grid-cols-2 gap-4">
              {entries.map((e) => (
                <div
                  key={e.id}
                  className={`relative rounded-xl border p-4 backdrop-blur-sm hover:shadow-md transition ${moodStyle(
                    e.label
                  )}`}
                >
                  <button
                    onClick={() => setDeleteTarget(e)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    🗑
                  </button>

                  <div className="flex justify-between items-center mb-2 pr-8">
                    <span className="text-xs font-semibold uppercase text-gray-700">
                      {e.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(e.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete this entry?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= LEGEND ================= */

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}
