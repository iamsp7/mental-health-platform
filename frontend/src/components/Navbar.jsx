// import { Link } from "react-router-dom";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function Navbar({ loggedUser, onLogout }) {
//   const [open, setOpen] = useState(false);

//   function handleLogout() {
//     toast.success("You have been logged out safely 👋");
//     onLogout();
//   }

//   return (
//     <nav
//       className="
//         sticky top-0 z-50 w-full
//         bg-white/50 backdrop-blur-xl
//         border-b border-white/40
//         shadow-[0_8px_30px_rgba(0,0,0,0.05)]
//       "
//     >
//       <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

//         {/* LEFT */}
//         <div className="flex items-center gap-6">
//           <Link
//             to={loggedUser ? "/dashboard" : "/login"}
//             className="text-xl font-bold tracking-wide text-indigo-600 hover:opacity-90 transition"
//           >
//             MindCare
//           </Link>

//           {/* Desktop Menu */}
//           {loggedUser && (
//             <div className="hidden md:flex gap-6 text-sm text-gray-600">
//               <NavLink to="/journal" label="Journal" />
//               <NavLink to="/mood-history" label="Mood" />
//               <NavLink to="/doctors" label="Doctors" />
//               <NavLink to="/my-appointments" label="Appointments" />
//               <NavLink to="/support" label="Support" />
//             </div>
//           )}
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           {loggedUser ? (
//             <>
//               <span className="hidden sm:block text-sm text-gray-500">
//                 Hi, <span className="font-medium">{loggedUser}</span>
//               </span>

//               {/* LOGOUT BUTTON */}
//               <button
//                 onClick={handleLogout}
//                 title="Logout"
//                 className="
//                   px-3 py-1.5 text-sm rounded-lg
//                   bg-red-500/10 text-red-600
//                   hover:bg-red-500/20
//                   hover:scale-[1.03]
//                   transition-all
//                   border border-red-500/20
//                 "
//               >
//                 Logout
//               </button>

//               {/* Mobile Toggle */}
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//                 title="Menu"
//               >
//                 {open ? "✖" : "☰"}
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               className="
//                 px-4 py-1.5 rounded-lg
//                 bg-indigo-600 text-white text-sm
//                 hover:bg-indigo-700 transition
//               "
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {loggedUser && open && (
//         <div
//           className="
//             md:hidden px-4 pb-4 pt-2
//             bg-white/70 backdrop-blur-xl
//             border-t border-white/40
//             animate-slideDown
//           "
//         >
//           <div className="flex flex-col gap-3 text-sm text-gray-700">
//             <MobileLink to="/journal" setOpen={setOpen}>Journal</MobileLink>
//             <MobileLink to="/mood-history" setOpen={setOpen}>Mood</MobileLink>
//             <MobileLink to="/doctors" setOpen={setOpen}>Doctors</MobileLink>
//             <MobileLink to="/my-appointments" setOpen={setOpen}>
//               My Appointments
//             </MobileLink>
//             <MobileLink to="/support" setOpen={setOpen}>Support</MobileLink>
//           </div>
//         </div>
//       )}

//       {/* Animations */}
//       <style>{`
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </nav>
//   );
// }

// /* Desktop Nav Link */
// function NavLink({ to, label }) {
//   return (
//     <Link
//       to={to}
//       className="
//         relative hover:text-indigo-600 transition
//         after:absolute after:left-0 after:-bottom-1 after:h-[2px]
//         after:w-0 after:bg-indigo-600
//         hover:after:w-full after:transition-all
//       "
//     >
//       {label}
//     </Link>
//   );
// }

// /* Mobile Nav Link */
// function MobileLink({ to, children, setOpen }) {
//   return (
//     <Link
//       to={to}
//       onClick={() => setOpen(false)}
//       className="px-2 py-2 rounded-lg hover:bg-indigo-50 transition"
//     >
//       {children}
//     </Link>
//   );
// }
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const TOAST_ID = "logout-toast";

export default function Navbar({ loggedUser, onLogout }) {
  const [open, setOpen] = useState(false);
  const logoutToastLock = useRef(false);
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    if (logoutToastLock.current) return;

    logoutToastLock.current = true;
    toast.dismiss(TOAST_ID);

    toast.success("You have been logged out safely", {
      id: TOAST_ID,
      style: calmToastStyle,
    });

    onLogout();

    setTimeout(() => {
      logoutToastLock.current = false;
    }, 800);
  }

  return (
    <nav
      className="
        sticky top-0 z-50 w-full
        bg-white/80 dark:bg-slate-900/90
        backdrop-blur-md
        border-b border-gray-200 dark:border-white/10
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link
            to={loggedUser ? "/dashboard" : "/login"}
            className="
              text-xl font-semibold tracking-wide
              text-indigo-600 dark:text-indigo-400
              hover:opacity-90 transition
            "
          >
            MindCare
          </Link>

          {loggedUser && (
            <div className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-slate-300">
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

          {loggedUser && (
            <span className="hidden sm:block text-sm text-gray-500 dark:text-slate-400">
              Hi,{" "}
              <span className="font-medium text-gray-800 dark:text-slate-200">
                {loggedUser}
              </span>
            </span>
          )}

          {loggedUser && (
            <>
              {/* 🌗 THEME TOGGLE (LEFT OF LOGOUT) */}
              <div className="relative group">
                <button
                  onClick={toggleTheme}
                  className="
                    relative w-10 h-5 rounded-full
                    bg-gray-200 dark:bg-white/10
                    border border-gray-300 dark:border-white/20
                    flex items-center px-1
                    transition-all duration-300
                    hover:scale-105
                  "
                >
                  <span
                    className={`
                      absolute top-[2px]
                      w-4 h-4 rounded-full
                      bg-indigo-600 dark:bg-indigo-400
                      transition-transform duration-300
                      ${theme === "dark" ? "translate-x-5" : "translate-x-0"}
                    `}
                  />
                  <Sun className="w-3 h-3 text-yellow-500 absolute left-1" />
                  <Moon className="w-3 h-3 text-slate-300 absolute right-1" />
                </button>

                {/* Tooltip */}
                <div
                  className="
                    absolute -bottom-9 left-1/2 -translate-x-1/2
                    whitespace-nowrap
                    rounded-md px-2 py-1 text-xs
                    bg-black text-white
                    opacity-0 group-hover:opacity-100
                    transition pointer-events-none
                  "
                >
                  {theme === "dark"
                    ? "Switch to Light mode ☀️"
                    : "Switch to Dark mode 🌙"}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="
                  px-3 py-1.5 text-sm rounded-lg
                  bg-red-500/10 text-red-600
                  hover:bg-red-500/20
                  transition
                  border border-red-500/20
                "
              >
                Logout
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="
                  md:hidden p-2 rounded-lg
                  hover:bg-gray-100 dark:hover:bg-white/10
                  transition
                "
                title="Menu"
              >
                {open ? "✖" : "☰"}
              </button>
            </>
          )}

          {!loggedUser && (
            <Link
              to="/login"
              className="
                px-4 py-1.5 rounded-lg
                bg-indigo-600 text-white text-sm
                hover:bg-indigo-500 transition
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
            bg-white/90 dark:bg-slate-900/95
            backdrop-blur-md
            border-t border-gray-200 dark:border-white/10
            animate-slideDown
          "
        >
          <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-slate-300">
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

      <style>{`
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
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
        relative hover:text-indigo-600 dark:hover:text-indigo-300 transition
        after:absolute after:left-0 after:-bottom-1 after:h-[2px]
        after:w-0 after:bg-indigo-500
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
      className="
        px-2 py-2 rounded-lg
        hover:bg-indigo-50 dark:hover:bg-white/10
        transition
      "
    >
      {children}
    </Link>
  );
}

/* ---------------- CALM TOAST STYLE ---------------- */

const calmToastStyle = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.12)",
};
