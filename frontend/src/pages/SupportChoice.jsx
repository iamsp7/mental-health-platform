import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SupportChoice() {
  const navigate = useNavigate();

  const handleNavigate = (path, message, icon) => {
    toast(message, {
      icon,
      duration: 2500,
    });
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="max-w-3xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            How would you like support right now?
          </h2>
          <p className="mt-2 text-gray-500 text-sm md:text-base">
            Choose an option that feels right for you. You’re not alone.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Music */}
          <button
            onClick={() =>
              handleNavigate(
                "/support/music",
                "Let’s find something calming 🎵",
                "🎵"
              )
            }
            className="
              group bg-white/80 backdrop-blur-xl
              rounded-2xl border border-gray-100
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.02]
              p-6 text-left
            "
          >
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
              Music for Calm
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Relaxing sounds and music to help you feel grounded.
            </p>
          </button>

          {/* Videos */}
          <button
            onClick={() =>
              handleNavigate(
                "/support/videos",
                "Some gentle guidance can help 💬",
                "🎥"
              )
            }
            className="
              group bg-white/80 backdrop-blur-xl
              rounded-2xl border border-gray-100
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.02]
              p-6 text-left
            "
          >
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
              Helpful Videos
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Short videos for motivation, breathing, and reassurance.
            </p>
          </button>

          {/* Doctor */}
          <button
            onClick={() =>
              handleNavigate(
                "/support/doctors",
                "Talking to a professional can really help 🩺",
                "🩺"
              )
            }
            className="
              group bg-white/80 backdrop-blur-xl
              rounded-2xl border border-gray-100
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.02]
              p-6 text-left
            "
          >
            <div className="text-4xl mb-4">🩺</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
              Talk to a Doctor
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Connect with a mental health professional.
            </p>
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-xs text-gray-400">
          If you’re in immediate danger, please contact local emergency services.
        </p>
      </div>
    </div>
  );
}
