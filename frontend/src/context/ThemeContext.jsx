import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    // 🌗 Apply theme
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // 💾 Persist
    localStorage.setItem("theme", theme);

    // ✨ SMOOTH GLOBAL TRANSITION (THIS IS THE FIX)
    root.classList.add("theme-transition");

    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
