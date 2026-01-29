import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function VideoPage() {
  const toastShown = useRef(false);

  // gentle reassurance toast (ONCE)
  useEffect(() => {
    if (!toastShown.current) {
      toast("Take a moment. Follow along at your own pace 🌬️", {
        icon: "🧘",
        duration: 2500,
        id: "video-calm",
      });
      toastShown.current = true;
    }
  }, []);

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
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            Guided Videos
          </h2>
          <p className="mt-3 text-gray-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Simple breathing and meditation exercises to help you feel grounded.
          </p>
        </div>

        {/* Video Cards */}
        <div className="space-y-12">

          {/* Video 1 */}
          <div
            className="
              group relative p-5 rounded-2xl
              bg-white/80 dark:bg-white/10
              backdrop-blur-xl
              border border-gray-200 dark:border-white/20
              shadow-md dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
              transition-all duration-300
              hover:shadow-xl dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
              hover:scale-[1.03]
            "
          >
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">
                🌬️ Breathing Exercise (5 minutes)
              </h3>

              <div className="relative w-full overflow-hidden rounded-xl aspect-video border border-gray-200 dark:border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/odADwWzHR24"
                  title="Breathing Exercise"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
                Breathe slowly and gently. There’s no rush 🌱
              </p>
            </div>
          </div>

          {/* Video 2 */}
          <div
            className="
              group relative p-5 rounded-2xl
              bg-white/80 dark:bg-white/10
              backdrop-blur-xl
              border border-gray-200 dark:border-white/20
              shadow-md dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
              transition-all duration-300
              hover:shadow-xl dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
              hover:scale-[1.03]
            "
          >
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">
                🧘 Guided Meditation
              </h3>

              <div className="relative w-full overflow-hidden rounded-xl aspect-video border border-gray-200 dark:border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/inpok4MKVLM"
                  title="Guided Meditation"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
                Sit comfortably and allow thoughts to pass without judgment 🕊️
              </p>
            </div>
          </div>

        </div>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            Find a quiet place, relax your shoulders, and give yourself permission
            to pause for a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
