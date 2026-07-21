"use client";

import { useEffect, useRef, useState } from "react";

const chapters = [
  { id: "arrival", short: "Origin", layer: "Data" },
  { id: "journey", short: "Growth", layer: "Data" },
  { id: "capabilities", short: "Signals", layer: "Model" },
  { id: "work", short: "Systems", layer: "Explain" },
  { id: "experience", short: "Context", layer: "Product" },
  { id: "contact", short: "Channel", layer: "Impact" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

export function NarrativeSignal() {
  const [activeId, setActiveId] = useState<ChapterId>("arrival");
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));

    let frame = 0;
    let currentId: ChapterId | null = null;

    const updateSignal = () => {
      frame = 0;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0;
      progressRef.current?.style.setProperty("--signal-progress", String(progress));
      window.dispatchEvent(new CustomEvent("signal-progress", { detail: { progress } }));

      const marker = window.innerHeight * 0.38;
      const visible = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= marker) ?? sections[0];
      const next = (visible?.id ?? "arrival") as ChapterId;

      if (next !== currentId) {
        currentId = next;
        setActiveId(next);
        document.documentElement.dataset.chapter = next;
        const chapterIndex = chapters.findIndex((chapter) => chapter.id === next);
        window.dispatchEvent(new CustomEvent("signal-chapter", { detail: { id: next, index: chapterIndex } }));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateSignal);
    };

    updateSignal();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      delete document.documentElement.dataset.chapter;
    };
  }, []);

  const activeIndex = chapters.findIndex((chapter) => chapter.id === activeId);
  const active = chapters[activeIndex] ?? chapters[0];

  return (
    <aside className="signal-rail" aria-label="Portfolio chapter progress" ref={progressRef}>
      <div className="signal-rail__readout" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span>
        <strong>{active.short}</strong>
        <small>{active.layer}</small>
      </div>
      <div className="signal-rail__track" aria-hidden="true"><i /></div>
      <nav aria-label="Jump to a portfolio chapter">
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={`Chapter ${index + 1}: ${chapter.short}`}
            aria-current={chapter.id === activeId ? "location" : undefined}
          >
            <span>{chapter.short}</span>
          </a>
        ))}
      </nav>
      <div className="signal-rail__shortcuts">
        <a href="/resume.pdf" target="_blank" rel="noreferrer">CV</a>
        <a href="#contact">Contact</a>
      </div>
    </aside>
  );
}