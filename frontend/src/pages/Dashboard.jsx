import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Dashboard({ username }) {
  const navigate = useNavigate();

  // subtle welcome toast (fires once)
  useEffect(() => {
    if (username) {
      toast.success(`Welcome back, ${username} 👋`, {
        duration: 2000,
      });
    }
  }, [username]);

  const Card = ({ icon, title, desc, onClick, tooltip }) => (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl 
      bg-white/70 backdrop-blur-xl border border-white/40 
      shadow-md hover:shadow-xl 
      p-6 transition-all duration-300
      hover:-translate-y-1 hover:scale-[1.02]"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-gray-800 text-lg">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-2">
        {desc}
      </p>

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute top-2 right-3 
        text-xs bg-black text-white px-2 py-1 rounded-md 
        opacity-0 group-hover:opacity-100 transition"
      >
        {tooltip}
      </span>
    </div>
  );

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Welcome back{username ? `, ${username}` : ""} 👋
          </h1>
          <p className="mt-2 text-gray-500 text-sm md:text-base">
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
            className="relative rounded-2xl p-6 
            bg-red-50 border border-red-200
            shadow-inner"
          >
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="font-semibold text-red-700 text-lg">
              Emergency Support
            </h3>
            <p className="text-sm text-red-600 mt-2">
              If you feel unsafe, please reach out to local emergency services
              or a trusted person immediately.
            </p>

            <span className="absolute top-2 right-3 text-xs text-red-500">
              Priority
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
