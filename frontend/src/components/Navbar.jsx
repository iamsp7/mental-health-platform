
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

  const role = localStorage.getItem("role");

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
    <nav className="
      sticky top-0 z-50 w-full
      bg-white/80 dark:bg-slate-900/90
      backdrop-blur-md
      border-b border-gray-200 dark:border-white/10
    ">

      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          <Link
            to={loggedUser ? (role === "DOCTOR" ? "/doctor-dashboard" : "/dashboard") : "/login"}
            className="
              text-xl font-semibold tracking-wide
              text-indigo-600 dark:text-indigo-400
              hover:opacity-90 transition
            "
          >
            MindCare
          </Link>

          {/* USER MENU */}
          {loggedUser && role === "USER" && (
            <div className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-slate-300">
              <NavLink to="/journal" label="Journal" />
              <NavLink to="/mood-history" label="Mood" />
              <NavLink to="/doctors" label="Doctors" />
              <NavLink to="/my-appointments" label="Appointments" />
              <NavLink to="/support" label="Support" />
            </div>
          )}

          {/* DOCTOR MENU */}
          {loggedUser && role === "DOCTOR" && (
            <div className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-slate-300">
              <NavLink to="/doctor-dashboard" label="Doctor Dashboard" />
            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {loggedUser && (
            <span className="hidden sm:block text-sm text-gray-500 dark:text-slate-400">
              Hi <span className="font-medium">{loggedUser}</span>
            </span>
          )}

          {loggedUser && (
            <>
              {/* THEME SWITCH */}
              <div className="relative group">

                <button
                  onClick={toggleTheme}
                  className="
                    relative w-10 h-5 rounded-full
                    bg-gray-200 dark:bg-white/10
                    border border-gray-300 dark:border-white/20
                    flex items-center px-1
                    transition-all duration-300
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

                  <Sun className="w-3 h-3 text-yellow-500 absolute left-1"/>
                  <Moon className="w-3 h-3 text-slate-300 absolute right-1"/>

                </button>

                <div className="
                  absolute -bottom-9 left-1/2 -translate-x-1/2
                  whitespace-nowrap
                  rounded-md px-2 py-1 text-xs
                  bg-black text-white
                  opacity-0 group-hover:opacity-100
                  transition
                ">
                  {theme === "dark"
                    ? "Switch to Light mode ☀️"
                    : "Switch to Dark mode 🌙"}
                </div>

              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
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

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
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

      {loggedUser && open && role === "USER" && (
        <div className="
          md:hidden px-4 pb-4 pt-2
          bg-white/90 dark:bg-slate-900/95
          border-t border-gray-200 dark:border-white/10
        ">
          <MobileLink to="/journal" setOpen={setOpen}>Journal</MobileLink>
          <MobileLink to="/mood-history" setOpen={setOpen}>Mood</MobileLink>
          <MobileLink to="/doctors" setOpen={setOpen}>Doctors</MobileLink>
          <MobileLink to="/my-appointments" setOpen={setOpen}>Appointments</MobileLink>
          <MobileLink to="/support" setOpen={setOpen}>Support</MobileLink>
        </div>
      )}

      {loggedUser && open && role === "DOCTOR" && (
        <div className="
          md:hidden px-4 pb-4 pt-2
          bg-white/90 dark:bg-slate-900/95
          border-t border-gray-200 dark:border-white/10
        ">
          <MobileLink to="/doctor-dashboard" setOpen={setOpen}>
            Doctor Dashboard
          </MobileLink>
        </div>
      )}

    </nav>
  );
}

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

function MobileLink({ to, children, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="block px-2 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

const calmToastStyle = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.12)",
};

