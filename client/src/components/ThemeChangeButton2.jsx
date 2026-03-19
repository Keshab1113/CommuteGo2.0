// frontend/src/components/ui/ThemeChangeButton.jsx
import React, { useState, useEffect } from "react";
import { applyTheme, setStoredTheme, getStoredTheme } from "../lib/utils";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeChangeButton2 = () => {
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
    <motion.button
      onClick={toggleTheme}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-24 right-4 z-50 p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600" />
      )}
    </motion.button>
  );
};

export default ThemeChangeButton2;