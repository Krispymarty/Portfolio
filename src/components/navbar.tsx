"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Command } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="font-bold text-text-primary tracking-tight text-xl">
              Yashmit.
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#projects" className="text-text-secondary hover:text-text-primary transition-colors">Projects</Link>
            <Link href="#build-log" className="text-text-secondary hover:text-text-primary transition-colors">Build Log</Link>
            <Link href="#journey" className="text-text-secondary hover:text-text-primary transition-colors">Journey</Link>
            <Link href="#contact" className="text-text-secondary hover:text-text-primary transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                document.dispatchEvent(event);
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface border border-border rounded-md hover:text-text-primary hover:border-primary/50 transition-colors"
            >
              <Command size={14} /> <span>Ctrl+K</span>
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-text-secondary hover:text-text-primary rounded-md border border-border bg-surface transition-colors"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
