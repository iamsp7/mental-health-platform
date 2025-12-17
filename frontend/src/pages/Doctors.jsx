import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const doctors = [
  {
    name: "Dr. Ananya Sharma",
    specialization: "Psychiatrist",
  },
  {
    name: "Dr. Rahul Mehta",
    specialization: "Clinical Psychologist",
  },
  {
    name: "Dr. Neha Verma",
    specialization: "Counselor",
  },
];

export default function Doctors() {
  const navigate = useNavigate();

  const handleBook = (doctor) => {
    toast("Redirecting to booking…", {
      icon: "🩺",
    });
    setTimeout(() => {
      navigate("/book-appointment", { state: doctor });
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Available Doctors
        </h2>
        <p className="text-sm text-gray-500">
          Choose a professional to book your appointment
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d, i) => (
          <div
            key={i}
            className="
              bg-white/80 backdrop-blur-xl
              rounded-2xl border border-gray-100
              shadow-sm hover:shadow-xl
              p-6 flex flex-col justify-between
              transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.02]
            "
          >
            <div>
              <div className="text-3xl mb-3">🩺</div>

              <h3 className="text-lg font-semibold text-gray-800">
                {d.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {d.specialization}
              </p>
            </div>

            <button
              onClick={() => handleBook(d)}
              title="Book an appointment"
              className="
                mt-6 w-full py-2.5 rounded-xl
                bg-gradient-to-r from-indigo-600 to-purple-600
                text-white text-sm font-medium
                hover:from-indigo-700 hover:to-purple-700
                transition-all
              "
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
