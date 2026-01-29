import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IS_DEMO } from "../config";

const API = "http://localhost:8080/api/appointments";

/* ================= HELPERS ================= */

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAppointmentDateTime(dateStr, timeSlot) {
  const date = new Date(dateStr);
  if (!timeSlot) return date;

  const [time, meridian] = timeSlot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);
  return date;
}

export default function MyAppointments({ token }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    if (IS_DEMO) {
      setAppointments([
        {
          id: 1,
          doctorName: "Ananya Sharma",
          specialization: "Psychiatrist",
          appointmentDate: new Date().toISOString().slice(0, 10),
          timeSlot: "11:00 AM",
          note: "Initial consultation",
        },
        {
          id: 2,
          doctorName: "Rahul Mehta",
          specialization: "Clinical Psychologist",
          appointmentDate: new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10),
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
    (a) => getAppointmentDateTime(a.appointmentDate, a.timeSlot) >= now
  );

  const past = appointments.filter(
    (a) => getAppointmentDateTime(a.appointmentDate, a.timeSlot) < now
  );

  /* ================= DELETE / CANCEL ================= */

  const confirmAction = async () => {
    if (!confirm) return;
    setDeleting(true);

    if (IS_DEMO) {
      setAppointments((prev) => prev.filter((a) => a.id !== confirm.id));
      toast.success(
        confirm.type === "cancel"
          ? "Appointment cancelled (Demo)"
          : "Past entry deleted (Demo)"
      );
      setConfirm(null);
      setDeleting(false);
      return;
    }

    try {
      await fetch(`${API}/${confirm.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) => prev.filter((a) => a.id !== confirm.id));

      toast.success(
        confirm.type === "cancel"
          ? "Appointment cancelled"
          : "Past entry deleted"
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-slate-400">
        Loading appointments…
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
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            My Appointments
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Manage upcoming and past consultations
          </p>
        </div>

        {/* UPCOMING */}
        <section className="mb-14">
          <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-4">
            Upcoming
          </h3>

          {upcoming.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              No upcoming appointments.
            </p>
          )}

          <div className="space-y-5">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="
                  rounded-2xl p-6
                  bg-white/70 dark:bg-white/10
                  border border-gray-200 dark:border-white/20
                  shadow-md dark:shadow-lg
                "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Dr. {a.doctorName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      {a.specialization}
                    </p>
                  </div>

                  <span className="text-sm text-indigo-600 dark:text-indigo-400">
                    {formatDate(a.appointmentDate)} · {a.timeSlot}
                  </span>
                </div>

                {a.note && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                    Note: {a.note}
                  </p>
                )}

                <div className="mt-4 text-right">
                  <button
                    onClick={() =>
                      setConfirm({ id: a.id, type: "cancel" })
                    }
                    className="
                      px-5 py-2 text-sm rounded-lg
                      bg-rose-600/15 text-rose-600
                      dark:text-rose-400
                      hover:bg-rose-600/25 transition
                    "
                  >
                    Cancel appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAST */}
        <section>
          <h3 className="text-lg font-medium text-gray-500 dark:text-slate-400 mb-4">
            Past
          </h3>

          {past.length === 0 && (
            <p className="text-gray-500 dark:text-slate-500 text-sm">
              No past appointments.
            </p>
          )}

          <div className="space-y-3">
            {past.map((a) => (
              <div
                key={a.id}
                className="
                  flex justify-between items-center
                  rounded-xl p-4
                  bg-white/50 dark:bg-white/5
                  border border-gray-200 dark:border-white/10
                "
              >
                <div>
                  <p className="text-sm text-gray-800 dark:text-slate-200">
                    Dr. {a.doctorName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {formatDate(a.appointmentDate)} · {a.timeSlot}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setConfirm({ id: a.id, type: "delete" })
                  }
                  className="
                    px-4 py-2 text-xs rounded-lg
                    bg-gray-200 dark:bg-slate-700/40
                    text-gray-700 dark:text-slate-300
                    hover:bg-rose-600/25 hover:text-rose-500 transition
                  "
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CONFIRM MODAL */}
        {confirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {confirm.type === "cancel"
                  ? "Cancel appointment?"
                  : "Delete past entry?"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirm(null)}
                  disabled={deleting}
                  className="
                    px-4 py-2 text-sm rounded-lg
                    border border-gray-300 dark:border-white/20
                    text-gray-600 dark:text-slate-300
                    hover:bg-gray-100 dark:hover:bg-white/10
                  "
                >
                  Keep
                </button>
                <button
                  onClick={confirmAction}
                  disabled={deleting}
                  className="
                    px-4 py-2 text-sm rounded-lg
                    bg-rose-600 text-white
                    disabled:opacity-50
                  "
                >
                  {deleting ? "Processing…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
