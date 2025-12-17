import { useEffect } from "react";
import toast from "react-hot-toast";

export default function DoctorPage() {

  // gentle reassurance toast (once)
  useEffect(() => {
    toast("Professional help is a positive step 🩺", {
      icon: "🩺",
      duration: 2500,
    });
  }, []);

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Doctors Near You
          </h2>
          <p className="mt-2 text-gray-500 text-sm md:text-base">
            Find licensed mental health professionals in your area.
          </p>
        </div>

        {/* Map Card */}
        <div
          className="
            bg-white/80 backdrop-blur-xl
            rounded-2xl border border-gray-100
            shadow-sm hover:shadow-xl
            transition-all duration-300
            overflow-hidden
          "
        >
          <div className="relative w-full h-[420px]">
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
            mt-8 bg-yellow-50/80
            border border-yellow-200
            rounded-xl p-4
          "
        >
          <p className="text-sm text-yellow-700 leading-relaxed">
            <strong>Disclaimer:</strong> This app does not provide medical advice.
            Please consult a licensed mental health professional for diagnosis
            and treatment.
          </p>
        </div>

      </div>
    </div>
  );
}
