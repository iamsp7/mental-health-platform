import { useEffect } from "react";
import toast from "react-hot-toast";

export default function MusicPage() {

  // gentle reassurance toast (once)
  useEffect(() => {
    toast("Take a slow breath. You’re in a safe space 🎧", {
      duration: 2500,
      icon: "🌿",
    });
  }, []);

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Calming Music
          </h2>
          <p className="mt-2 text-gray-500 text-sm md:text-base">
            Gentle sounds to help your mind slow down and relax.
          </p>
        </div>

        {/* Music Cards */}
        <div className="space-y-10">

          {/* Track 1 */}
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
              🎹 Relaxing Piano Music
            </h3>

            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/1ZYbU82GVz4"
                title="Relaxing Piano Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Best enjoyed with headphones 🎧
            </p>
          </div>

          {/* Track 2 */}
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
              🌊 Stress Relief & Deep Relaxation
            </h3>

            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/4fY9CXdIoU4"
                title="Stress Relief Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Try slow breathing while listening 🌬️
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-14 text-center">
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Tip: Sit comfortably, relax your shoulders, and focus only on the sound.
            There’s nothing else you need to do right now.
          </p>
        </div>
      </div>
    </div>
  );
}
