import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IS_DEMO } from "../config";

const API = "http://localhost:8080/api/appointments";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyAppointments({ token }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= LOAD APPOINTMENTS ================= */

  useEffect(() => {
    // 🟢 DEMO MODE
    if (IS_DEMO) {
      setAppointments([
        {
          id: 1,
          doctorName: "Ananya Sharma",
          specialization: "Psychiatrist",
          appointmentDate: new Date(Date.now() + 86400000).toISOString(),
          timeSlot: "10:30 AM",
          note: "Initial consultation",
        },
        {
          id: 2,
          doctorName: "Rahul Mehta",
          specialization: "Clinical Psychologist",
          appointmentDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          timeSlot: "04:00 PM",
        },
      ]);
      setLoading(false);
      return;
    }

    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch(API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const txt = await res.text();
        setAppointments(txt ? JSON.parse(txt) : []);
      } catch {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  /* ================= FILTER ================= */

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.appointmentDate) >= now
  );
  const past = appointments.filter(
    (a) => new Date(a.appointmentDate) < now
  );

  /* ================= CANCEL ================= */

  const openCancelDialog = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    if (!selectedId) return;
    setDeleting(true);

    // 🟢 DEMO MODE
    if (IS_DEMO) {
      setAppointments((prev) => prev.filter((a) => a.id !== selectedId));
      toast.success("Appointment cancelled (Demo Mode)");
      setShowConfirm(false);
      setSelectedId(null);
      setDeleting(false);
      return;
    }

    // 🔵 REAL MODE
    try {
      const res = await fetch(`${API}/${selectedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setAppointments((prev) =>
        prev.filter((a) => a.id !== selectedId)
      );

      toast.success("Appointment cancelled");
    } catch {
      toast.error("Could not cancel appointment");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          My Appointments
        </h2>
        <p className="text-sm text-gray-500">
          Your scheduled and past doctor consultations
        </p>
      </div>

      {/* UPCOMING */}
      <section className="mb-12">
        <h3 className="text-lg font-medium text-indigo-600 mb-4">
          Upcoming
        </h3>

        {upcoming.length === 0 && (
          <p className="text-gray-500 text-sm">
            No upcoming appointments.
          </p>
        )}

        <div className="space-y-4">
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-sm p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Dr. {a.doctorName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {a.specialization}
                  </p>
                </div>

                <span className="text-sm font-medium text-indigo-600">
                  {formatDate(a.appointmentDate)}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                Time: <strong>{a.timeSlot}</strong>
              </div>

              {a.note && (
                <div className="mt-3 text-sm text-gray-500">
                  Note: {a.note}
                </div>
              )}

              <div className="mt-4 text-right">
                <button
                  onClick={() => openCancelDialog(a.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  🗑 Cancel appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAST */}
      <section>
        <h3 className="text-lg font-medium text-gray-500 mb-4">
          Past
        </h3>

        {past.length === 0 && (
          <p className="text-gray-400 text-sm">
            No past appointments.
          </p>
        )}

        <div className="space-y-3">
          {past.map((a) => (
            <div
              key={a.id}
              className="bg-gray-50 rounded-xl p-4 border"
            >
              <h4 className="text-sm font-medium text-gray-700">
                Dr. {a.doctorName}
              </h4>
              <p className="text-xs text-gray-500">
                {a.specialization}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(a.appointmentDate)} · {a.timeSlot}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cancel this appointment?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              You can always book another appointment later.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Keep
              </button>
              <button
                onClick={confirmCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white disabled:opacity-50"
              >
                {deleting ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
