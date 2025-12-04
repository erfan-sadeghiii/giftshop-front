"use client";
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
     
      // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const prefersDark = true
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // Update DOM + localStorage when toggled
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return [isDark, toggleDarkMode];
}
