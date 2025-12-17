import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:8080/api/appointments";

export default function BookAppointment({ token }) {
  const { state } = useLocation(); // doctor info
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="text-center py-10 text-gray-500">
        No doctor selected.
      </div>
    );
  }

  const submit = async () => {
    if (!date || !timeSlot) return;

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
          specialization: state.specialization,
          appointmentDate: date,
          timeSlot,
          note,
        }),
      });

      navigate("/my-appointments");
    } catch (err) {
      console.error("Booking failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Book Appointment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Schedule a consultation
          </p>
        </div>

        {/* Doctor info */}
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <p className="font-medium text-indigo-700">
            {state.name}
          </p>
          <p className="text-sm text-indigo-600">
            {state.specialization}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Appointment Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select a time</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>2:00 PM</option>
              <option>4:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Note (optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Anything you'd like the doctor to know"
            />
          </div>
        </div>

        {/* Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
