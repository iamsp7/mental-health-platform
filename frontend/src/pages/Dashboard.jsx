import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const TOAST_ID = "dashboard-welcome";

export default function Dashboard({ username }) {
  const navigate = useNavigate();
  const welcomeToastShown = useRef(false);

  // 🔒 Welcome toast (fires once)
  useEffect(() => {
    if (username && !welcomeToastShown.current) {
      toast.success(`Welcome back, ${username}`, {
        id: TOAST_ID,
        duration: 2000,
        style: calmToastStyle,
      });
      welcomeToastShown.current = true;
    }
  }, [username]);

  const Card = ({ icon, title, desc, onClick, tooltip }) => (
    <div
      onClick={onClick}
      className="
        group relative cursor-pointer rounded-2xl
        bg-white/80 dark:bg-white/10
        backdrop-blur-xl
        border border-gray-200 dark:border-white/20
        p-6
        transition-all duration-300 ease-out
        shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        hover:shadow-xl dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]
        hover:scale-[1.04]
      "
    >
      {/* Glow layer */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-br from-indigo-400/15 via-purple-400/10 to-transparent
        "
      />

      <div className="relative z-10">
        <div className="text-3xl mb-4">{icon}</div>

        <h3 className="font-medium text-gray-800 dark:text-slate-100 text-lg">
          {title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-slate-300 mt-2">
          {desc}
        </p>
      </div>

      {/* Tooltip */}
      <span
        className="
          pointer-events-none absolute top-2 right-3
          text-xs bg-slate-800 text-slate-200
          px-2 py-1 rounded-md
          opacity-0 group-hover:opacity-100
          transition-opacity
        "
      >
        {tooltip}
      </span>
    </div>
  );

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
        transition-colors duration-300
      "
    >
      {/* MAIN CONTENT */}
      <div className="flex-grow px-4 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Welcome */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
              Welcome back{username ? `, ${username}` : ""}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-slate-300 text-sm md:text-base">
              How are you feeling today? Choose where you’d like to begin.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Card
              icon="📔"
              title="Write Journal"
              desc="Express your thoughts privately and safely."
              tooltip="Daily journaling"
              onClick={() => navigate("/journal")}
            />

            <Card
              icon="📊"
              title="Mood History"
              desc="Track how your emotions change over time."
              tooltip="View mood trends"
              onClick={() => navigate("/mood-history")}
            />

            <Card
              icon="🫂"
              title="Get Support"
              desc="Music, videos, or professional help."
              tooltip="Support resources"
              onClick={() => navigate("/support")}
            />

            <Card
              icon="🩺"
              title="Doctors"
              desc="Find and book mental health professionals."
              tooltip="Consult experts"
              onClick={() => navigate("/doctors")}
            />

            <Card
              icon="📅"
              title="My Appointments"
              desc="View upcoming and past sessions."
              tooltip="Your bookings"
              onClick={() => navigate("/my-appointments")}
            />

            {/* Emergency */}
            <div
              className="
                relative rounded-2xl p-6
                bg-rose-500/10
                border border-rose-400/30
                transition-all duration-300
                shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                hover:shadow-xl dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)]
                hover:scale-[1.03]
              "
            >
              <div
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  opacity-0 hover:opacity-100
                  transition-opacity
                  bg-gradient-to-br from-rose-400/20 to-transparent
                "
              />

              <div className="relative z-10">
                <div className="text-3xl mb-4">🚨</div>

                <h3 className="font-medium text-rose-600 dark:text-rose-300 text-lg">
                  Emergency Support
                </h3>

                <p className="text-sm text-rose-500 dark:text-rose-200 mt-2">
                  If you feel unsafe, please contact local emergency services
                  or a trusted person immediately.
                </p>
              </div>

              <span className="absolute top-2 right-3 text-xs text-rose-500 dark:text-rose-300">
                Priority
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-white/10 py-6 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
          <span>© {new Date().getFullYear()} MindCare</span>
          <span className="text-gray-400 dark:text-slate-500">
            Your mental well-being matters
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- CALM TOAST STYLE ---------------- */

const calmToastStyle = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.12)",
};
