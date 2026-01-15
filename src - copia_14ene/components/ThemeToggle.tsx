import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // íconos modernos (ya incluidos si usas lucide-react)

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-3 py-2 rounded-lg text-sm text-white dark:text-black hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">
        {isDark ? "Claro" : "Oscuro"}
      </span>
    </button>
  );
}
