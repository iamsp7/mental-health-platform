
import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const doctors = [
  {
    name: "Dr. Ananya Sharma",
    username: "ananya",          // doctor login username
    specialization: "Psychiatrist",
  },
  {
    name: "Dr. Rahul Mehta",
    username: "rahul",
    specialization: "Clinical Psychologist",
  },
  {
    name: "Dr. Neha Verma",
    username: "neha",
    specialization: "Counselor",
  },
];

export default function Doctors() {

  const navigate = useNavigate();

  const handleBook = (doctor) => {

    toast("Redirecting to booking…", {
      id: "book-doctor",
      icon: "🩺",
    });

    setTimeout(() => {

      navigate("/book-appointment", {
        state: doctor,
      });

    }, 500);

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

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Available Doctors
          </h2>

          <p className="text-sm text-gray-600 dark:text-slate-300">
            Choose a professional to book your appointment
          </p>

        </div>

        {/* Doctors Grid */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {doctors.map((d, i) => (

            <div
              key={i}
              className="
                group relative
                rounded-2xl p-6 flex flex-col justify-between
                backdrop-blur-xl
                bg-white/70 dark:bg-white/10
                border border-gray-200 dark:border-white/20
                shadow-[0_12px_30px_rgba(0,0,0,0.15)]
                dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)]
                transition-all duration-300
                hover:shadow-[0_28px_65px_rgba(0,0,0,0.35)]
                dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
                hover:scale-[1.04]
              "
            >

              {/* Glow */}

              <div
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  bg-gradient-to-br from-indigo-400/15 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                "
              />

              <div className="relative z-10">

                <div
                  className="
                    w-12 h-12 rounded-full
                    bg-indigo-500/20
                    flex items-center justify-center
                    text-2xl mb-4
                  "
                >
                  🩺
                </div>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                  {d.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  {d.specialization}
                </p>

              </div>

              <button
                onClick={() => handleBook(d)}
                title="Book an appointment"
                className="
                  relative z-10 mt-6 w-full py-2.5 rounded-xl
                  bg-indigo-600 text-white text-sm font-medium
                  hover:bg-indigo-500 transition
                "
              >
                Book Appointment
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

