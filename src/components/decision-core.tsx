"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { Group } from "three";

const WorkspaceScene = dynamic(
  () => import("./workspace-scene"),
  { ssr: false },
);

const chapterStates = [2, 1, 2, 3, 4, 5] as const;

export function DecisionCore() {
  const reducedMotion = useReducedMotion() ?? false;
  const [chapter, setChapter] = useState<number>(chapterStates[0]);
  const handleModelReady = useCallback((_model: Group | null) => {}, []);

  useEffect(() => {
    const handleChapter = (event: Event) => {
      const index = (event as CustomEvent<{ index?: number }>).detail?.index;
      if (typeof index === "number") setChapter(chapterStates[index] ?? chapterStates[0]);
    };

    window.addEventListener("signal-chapter", handleChapter);
    return () => window.removeEventListener("signal-chapter", handleChapter);
  }, []);

  return (
    <div className="workspace-model" data-scene-chapter={chapter} aria-hidden="true">
      <WorkspaceScene
        chapter={chapter}
        reducedMotion={reducedMotion}
        onModelReady={handleModelReady}
      />
    </div>
  );
}