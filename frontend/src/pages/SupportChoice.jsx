import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SupportChoice() {
  const navigate = useNavigate();

  const handleNavigate = (path, message, icon) => {
    toast(message, {
      id: "support-choice",
      icon,
      duration: 2500,
    });
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div
      className="
        min-h-screen px-4 grid place-items-center
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
      "
    >
      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            How would you like support right now?
          </h2>
          <p className="mt-3 text-gray-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Choose what feels right for you. You don’t have to go through this alone.
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
              group relative text-left p-6 rounded-2xl
              bg-white/80 dark:bg-white/10
              backdrop-blur-xl
              border border-gray-200 dark:border-white/20
              shadow-md dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)]
              transition-all duration-300
              hover:shadow-xl dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
              hover:scale-[1.04]
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                Music for Calm
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                Relaxing sounds and music to help you feel grounded.
              </p>
            </div>
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
              group relative text-left p-6 rounded-2xl
              bg-white/80 dark:bg-white/10
              backdrop-blur-xl
              border border-gray-200 dark:border-white/20
              shadow-md dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)]
              transition-all duration-300
              hover:shadow-xl dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
              hover:scale-[1.04]
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                Helpful Videos
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                Short videos for breathing, motivation, and reassurance.
              </p>
            </div>
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
              group relative text-left p-6 rounded-2xl
              bg-white/80 dark:bg-white/10
              backdrop-blur-xl
              border border-gray-200 dark:border-white/20
              shadow-md dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)]
              transition-all duration-300
              hover:shadow-xl dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
              hover:scale-[1.04]
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                Talk to a Doctor
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                Connect with a mental health professional.
              </p>
            </div>
          </button>

        </div>

        {/* Footer note */}
        <p className="mt-14 text-center text-xs text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
          If you’re in immediate danger, please contact local emergency services or a trusted person.
        </p>
      </div>
    </div>
  );
}
