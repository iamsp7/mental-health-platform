
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = "http://localhost:8080/api/doctor";

export default function DoctorDashboard({ token }) {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {

    try {

      const res = await fetch(`${API}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setAppointments(data || []);

    } catch {

      toast.error("Failed to load appointments");

    }

  };

  useEffect(() => {
    if (token) loadAppointments();
  }, [token]);

  const accept = async (id) => {

    try {

      setLoading(true);

      const res = await fetch(`${API}/appointments/${id}/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      toast.success("Appointment accepted");

      loadAppointments();

    } catch {

      toast.error("Failed to accept appointment");

    } finally {

      setLoading(false);

    }

  };

  const reject = async (id) => {

    try {

      setLoading(true);

      const res = await fetch(`${API}/appointments/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      toast.success("Appointment rejected");

      loadAppointments();

    } catch {

      toast.error("Failed to reject appointment");

    } finally {

      setLoading(false);

    }

  };

  const startCall = (link) => {

    if (!link) {
      toast.error("Meeting link not available");
      return;
    }

    window.open(link, "_blank");

  };

  return (

    <div
      className="
        min-h-screen px-4 py-10
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
      "
    >

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Doctor Dashboard
          </h2>

          <p className="text-sm text-gray-600 dark:text-slate-300">
            Manage your appointments
          </p>

        </div>

        {appointments.length === 0 && (

          <div className="text-center text-gray-500 dark:text-slate-400 mt-20">
            No appointments yet
          </div>

        )}

        <div className="grid gap-6">

          {appointments.map((a) => (

            <div
              key={a.id}
              className="
                rounded-2xl p-6
                backdrop-blur-xl
                bg-white/70 dark:bg-white/10
                border border-gray-200 dark:border-white/20
                shadow-lg
                flex flex-col md:flex-row md:items-center md:justify-between
                gap-4
              "
            >

              <div>

                <p className="font-semibold text-gray-800 dark:text-white">
                  Patient ID: {a.userId}
                </p>

                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {a.appointmentDate} • {a.timeSlot}
                </p>

                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {a.note}
                </p>

                <p className="mt-2 text-xs font-medium">
                  Status:
                  <span className="ml-1 text-indigo-600">
                    {a.status}
                  </span>
                </p>

              </div>

              <div className="flex gap-3">

                {a.status === "PENDING" && (
                  <>
                    <button
                      disabled={loading}
                      onClick={() => accept(a.id)}
                      className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-500 disabled:opacity-50"
                    >
                      Accept
                    </button>

                    <button
                      disabled={loading}
                      onClick={() => reject(a.id)}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-500 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {a.status === "ACCEPTED" && (
                  <button
                    onClick={() => startCall(a.meetingLink)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500"
                  >
                    Start Call
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

