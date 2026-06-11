"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, FolderGit2, FileText, Activity, Bot, Map, BookOpen } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (hash: string) => {
    setOpen(false);
    if (hash.startsWith("/")) {
      router.push(hash);
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[18vh]" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Menu" className="flex flex-col">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search size={16} className="text-text-secondary mr-3" />
            <Command.Input
              autoFocus
              placeholder="Search projects, pages, actions..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary"
            />
            <span className="text-[10px] border border-border px-1.5 py-0.5 rounded text-text-secondary font-mono">ESC</span>
          </div>

          <Command.List className="max-h-[320px] overflow-y-auto p-2">
            <Command.Empty className="p-6 text-center text-sm text-text-secondary">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest px-2 pt-3 pb-1">
              <Command.Item onSelect={() => go("#projects")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <FolderGit2 size={15} /> Projects
              </Command.Item>
              <Command.Item onSelect={() => go("#build-log")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <Activity size={15} /> Engineering Log
              </Command.Item>
              <Command.Item onSelect={() => go("#journey")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <Map size={15} /> Journey
              </Command.Item>
              <Command.Item onSelect={() => go("#learning")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <BookOpen size={15} /> Current Learning
              </Command.Item>
              <Command.Item onSelect={() => go("#github")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <FaGithub size={15} /> GitHub Activity
              </Command.Item>
              <Command.Item onSelect={() => go("#ai-assistant")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <Bot size={15} /> AI Assistant
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest px-2 pt-3 pb-1">
              <Command.Item onSelect={() => go("/resume.pdf")} className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors">
                <FileText size={15} /> Open Resume
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
