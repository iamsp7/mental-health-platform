
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API = "http://localhost:8080/api/appointments";

export default function BookAppointment({ token }) {

  const { state } = useLocation();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-slate-400">
        No doctor selected.
      </div>
    );
  }

  const submit = async () => {

    if (!date || !timeSlot) {
      toast.error("Please select date and time");
      return;
    }

    setLoading(true);

    try {

      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({

          doctorName: state.name,

          // 🔑 IMPORTANT
          doctorUsername: state.username,

          specialization: state.specialization,

          appointmentDate: date,

          timeSlot,

          note

        }),

      });

      toast.success("Appointment booked successfully 🗓️");

      navigate("/my-appointments");

    } catch {

      toast.error("Booking failed. Try again.");

    } finally {

      setLoading(false);

    }

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

      <div className="max-w-xl mx-auto">

        <div
          className="
            group relative rounded-2xl p-6
            backdrop-blur-xl
            bg-white/70 dark:bg-white/10
            border border-gray-200 dark:border-white/20
            shadow-[0_12px_30px_rgba(0,0,0,0.15)]
            dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          "
        >

          <div className="mb-6">

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Book Appointment
            </h2>

            <p className="text-sm text-gray-600 dark:text-slate-300">
              Schedule a consultation
            </p>

          </div>

          {/* Doctor info */}

          <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-400/20">

            <p className="font-medium text-indigo-700 dark:text-indigo-200">
              {state.name}
            </p>

            <p className="text-sm text-indigo-600 dark:text-indigo-300">
              {state.specialization}
            </p>

          </div>

          <div className="space-y-4">

            <div>

              <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                Appointment Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full px-4 py-2 rounded-xl
                  bg-white dark:bg-slate-900/70
                  border border-gray-300 dark:border-white/10
                "
              />

            </div>

            <div>

              <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                Time Slot
              </label>

              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="
                  w-full px-4 py-2 rounded-xl
                  bg-white dark:bg-slate-900/70
                  border border-gray-300 dark:border-white/10
                "
              >

                <option value="">Select a time</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>2:00 PM</option>
                <option>4:00 PM</option>

              </select>

            </div>

            <div>

              <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                Note (optional)
              </label>

              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything you'd like the doctor to know"
                className="
                  w-full px-4 py-2 rounded-xl resize-none
                  bg-white dark:bg-slate-900/70
                  border border-gray-300 dark:border-white/10
                "
              />

            </div>

          </div>

          <div className="mt-6 flex justify-end">

            <button
              onClick={submit}
              disabled={loading}
              className="
                px-6 py-2 rounded-xl
                bg-indigo-600 text-white
                hover:bg-indigo-500
                disabled:opacity-50
              "
            >

              {loading ? "Booking..." : "Confirm Appointment"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

