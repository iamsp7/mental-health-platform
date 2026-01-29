import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function MusicPage() {
  const toastShown = useRef(false);

  // gentle reassurance toast (ONCE)
  useEffect(() => {
    if (!toastShown.current) {
      toast("Take a slow breath. You’re in a safe space 🎧", {
        duration: 2500,
        icon: "🌿",
        id: "music-calm",
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
            Calming Music
          </h2>
          <p className="mt-3 text-gray-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Gentle sounds to help your mind slow down and relax.
          </p>
        </div>

        {/* Music Cards */}
        <div className="space-y-12">

          {/* Track 1 */}
          <div
            className="
              group relative rounded-2xl p-5
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
                🎹 Relaxing Piano Music
              </h3>

              <div className="relative w-full overflow-hidden rounded-xl aspect-video border border-gray-200 dark:border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/1ZYbU82GVz4"
                  title="Relaxing Piano Music"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
                Best enjoyed with headphones 🎧
              </p>
            </div>
          </div>

          {/* Track 2 */}
          <div
            className="
              group relative rounded-2xl p-5
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
                🌊 Stress Relief & Deep Relaxation
              </h3>

              <div className="relative w-full overflow-hidden rounded-xl aspect-video border border-gray-200 dark:border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/4fY9CXdIoU4"
                  title="Stress Relief Music"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
                Try slow breathing while listening 🌬️
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            Sit comfortably, relax your shoulders, and focus only on the sound.
            There’s nothing else you need to do right now.
          </p>
        </div>
      </div>
    </div>
  );
}
