import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar({ loggedUser, onLogout }) {
  const [open, setOpen] = useState(false);

  function handleLogout() {
    toast.success("You have been logged out safely 👋");
    onLogout();
  }

  return (
    <nav
      className="
        sticky top-0 z-50 w-full
        bg-white/50 backdrop-blur-xl
        border-b border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link
            to={loggedUser ? "/dashboard" : "/login"}
            className="text-xl font-bold tracking-wide text-indigo-600 hover:opacity-90 transition"
          >
            MindCare
          </Link>

          {/* Desktop Menu */}
          {loggedUser && (
            <div className="hidden md:flex gap-6 text-sm text-gray-600">
              <NavLink to="/journal" label="Journal" />
              <NavLink to="/mood-history" label="Mood" />
              <NavLink to="/doctors" label="Doctors" />
              <NavLink to="/my-appointments" label="Appointments" />
              <NavLink to="/support" label="Support" />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {loggedUser ? (
            <>
              <span className="hidden sm:block text-sm text-gray-500">
                Hi, <span className="font-medium">{loggedUser}</span>
              </span>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="
                  px-3 py-1.5 text-sm rounded-lg
                  bg-red-500/10 text-red-600
                  hover:bg-red-500/20
                  hover:scale-[1.03]
                  transition-all
                  border border-red-500/20
                "
              >
                Logout
              </button>

              {/* Mobile Toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                title="Menu"
              >
                {open ? "✖" : "☰"}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="
                px-4 py-1.5 rounded-lg
                bg-indigo-600 text-white text-sm
                hover:bg-indigo-700 transition
              "
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {loggedUser && open && (
        <div
          className="
            md:hidden px-4 pb-4 pt-2
            bg-white/70 backdrop-blur-xl
            border-t border-white/40
            animate-slideDown
          "
        >
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <MobileLink to="/journal" setOpen={setOpen}>Journal</MobileLink>
            <MobileLink to="/mood-history" setOpen={setOpen}>Mood</MobileLink>
            <MobileLink to="/doctors" setOpen={setOpen}>Doctors</MobileLink>
            <MobileLink to="/my-appointments" setOpen={setOpen}>
              My Appointments
            </MobileLink>
            <MobileLink to="/support" setOpen={setOpen}>Support</MobileLink>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}

/* Desktop Nav Link */
function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="
        relative hover:text-indigo-600 transition
        after:absolute after:left-0 after:-bottom-1 after:h-[2px]
        after:w-0 after:bg-indigo-600
        hover:after:w-full after:transition-all
      "
    >
      {label}
    </Link>
  );
}

/* Mobile Nav Link */
function MobileLink({ to, children, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="px-2 py-2 rounded-lg hover:bg-indigo-50 transition"
    >
      {children}
    </Link>
  );
}
