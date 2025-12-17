import { useEffect } from "react";
import toast from "react-hot-toast";

export default function VideoPage() {

  // gentle reassurance toast (once)
  useEffect(() => {
    toast("Take a moment. Follow along at your own pace 🌬️", {
      icon: "🧘",
      duration: 2500,
    });
  }, []);

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Guided Videos
          </h2>
          <p className="mt-2 text-gray-500 text-sm md:text-base">
            Simple breathing and meditation exercises to help you feel grounded.
          </p>
        </div>

        {/* Video Cards */}
        <div className="space-y-10">

          {/* Video 1 */}
          <div
            className="
              bg-white/80 backdrop-blur-xl
              rounded-2xl border border-gray-100
              shadow-sm hover:shadow-xl
              transition-all duration-300
              p-5
            "
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              🌬️ Breathing Exercise (5 minutes)
            </h3>

            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/odADwWzHR24"
                title="Breathing Exercise"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Breathe slowly and gently. There’s no rush 🌱
            </p>
          </div>

          {/* Video 2 */}
          <div
            className="
              bg-white/80 backdrop-blur-xl
              rounded-2xl border border-gray-100
              shadow-sm hover:shadow-xl
              transition-all duration-300
              p-5
            "
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              🧘 Guided Meditation
            </h3>

            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/inpok4MKVLM"
                title="Guided Meditation"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Sit comfortably and allow thoughts to pass without judgment 🕊️
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-14 text-center">
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Find a quiet place, relax your shoulders, and give yourself permission
            to pause for a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
