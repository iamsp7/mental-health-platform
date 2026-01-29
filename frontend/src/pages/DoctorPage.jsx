import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function DoctorPage() {
  const toastShown = useRef(false);

  // gentle reassurance toast (ONCE)
  useEffect(() => {
    if (!toastShown.current) {
      toast("Professional help is a positive step 🩺", {
        icon: "🩺",
        duration: 2500,
        id: "doctor-support",
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
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            Doctors Near You
          </h2>
          <p className="mt-3 text-gray-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Find licensed mental health professionals in your area.
          </p>
        </div>

        {/* Map Card */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            bg-white/80 dark:bg-white/10
            backdrop-blur-xl
            border border-gray-200 dark:border-white/20
            shadow-md dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
            transition-all duration-300
            hover:shadow-xl dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]
            hover:scale-[1.02]
          "
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative w-full h-[420px] z-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
            <iframe
              title="Doctors Near Me"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?q=psychiatrist+near+me&output=embed"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="
            mt-10 rounded-xl p-5
            bg-amber-100/80 dark:bg-amber-500/10
            border border-amber-300 dark:border-amber-400/30
          "
        >
          <p className="text-sm text-amber-700 dark:text-amber-200 leading-relaxed text-center">
            <strong>Disclaimer:</strong> This app does not provide medical advice.
            Please consult a licensed mental health professional for diagnosis
            and treatment.
          </p>
        </div>

      </div>
    </div>
  );
}
