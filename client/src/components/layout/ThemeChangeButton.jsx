import React, { useState, useEffect } from "react";
import { applyTheme, setStoredTheme, getStoredTheme } from "../../lib/utils";
import { Sun, Moon } from "lucide-react";

const ThemeChangeButton = () => {
  const [theme, setTheme] = useState(getStoredTheme() || "system");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };
  return (
    <button
      onClick={toggleTheme}
      className="w-fit p-3 cursor-pointer fixed top-24 right-4 rounded-xl bg-gray-200/60 dark:bg-slate-800/60 hover:bg-gray-300/80 dark:hover:bg-slate-700/80 border border-gray-300 dark:border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 dark:text-slate-300 font-medium"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
};

export default ThemeChangeButton;
