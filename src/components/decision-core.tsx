"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Group } from "three";
import type { ProjectSceneId, SceneQuality } from "./workspace-scene";

const WorkspaceScene = dynamic(
  () => import("./workspace-scene"),
  {
    ssr: false,
    loading: () => <div className="workspace-loading" aria-hidden="true" />,
  },
);

const chapterStates = [1, 1, 2, 3, 4, 5] as const;
const chapterIds = ["arrival", "journey", "capabilities", "work", "experience", "contact"] as const;
const chapterLabels = ["Initialize", "Journey", "Capabilities", "Projects", "Experience", "Contact"] as const;
const qualityOptions: Array<{ id: SceneQuality; label: string }> = [
  { id: "high", label: "High" },
  { id: "balanced", label: "Balanced" },
  { id: "lightweight", label: "Lite" },
];

function inferQuality(): SceneQuality {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (window.innerWidth <= 700 || memory <= 2 || cores <= 4) return "lightweight";
  if (window.innerWidth <= 1280 || memory <= 4 || cores <= 8) return "balanced";
  return "high";
}

function supportsWebGL() {
  return typeof window.WebGLRenderingContext !== "undefined";
}

export function DecisionCore() {
  const reducedMotion = useReducedMotion() ?? false;
  const [chapterIndex, setChapterIndex] = useState(0);
  const [projectId, setProjectId] = useState<ProjectSceneId>("fraud-detection");
  const [quality, setQuality] = useState<SceneQuality>("balanced");
  const [qualityOverride, setQualityOverride] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const chapter = chapterStates[chapterIndex] ?? chapterStates[0];

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      setQuality(inferQuality());
      setWebglAvailable(supportsWebGL());
      const activeChapter = document.documentElement.dataset.chapter;
      const activeIndex = chapterIds.findIndex((id) => id === activeChapter);
      if (activeIndex >= 0) setChapterIndex(activeIndex);
    }, 0);

    const handleResize = () => {
      if (!qualityOverride) setQuality(inferQuality());
    };
    const handleVisibility = () => setDocumentVisible(!document.hidden);
    const handleChapter = (event: Event) => {
      const index = (event as CustomEvent<{ index?: number }>).detail?.index;
      if (typeof index === "number") setChapterIndex(index);
    };
    const handleProject = (event: Event) => {
      const id = (event as CustomEvent<{ id?: ProjectSceneId }>).detail?.id;
      if (id) setProjectId(id);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("signal-chapter", handleChapter);
    window.addEventListener("signal-project", handleProject);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(initialize);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("signal-chapter", handleChapter);
      window.removeEventListener("signal-project", handleProject);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [qualityOverride]);

  const handleModelReady = useCallback((model: Group | null) => {
    if (model) setSceneReady(true);
  }, []);

  const status = useMemo(
    () => ({
      chapter: chapterLabels[chapterIndex] ?? chapterLabels[0],
      project:
        projectId === "fraud-detection"
          ? "Fraud"
          : projectId === "weapon-detection"
            ? "Vision"
            : "LifeXP",
    }),
    [chapterIndex, projectId],
  );

  const showCanvas = webglAvailable && !reducedMotion;

  return (
    <aside
      className="workspace-experience"
      data-scene-ready={sceneReady ? "true" : "false"}
      data-quality={quality}
      data-static={!showCanvas ? "true" : "false"}
      aria-label="Computational workstation display controls"
    >
      <div className="workspace-fallback" aria-hidden="true">
        <i /><i /><i /><i />
        <span />
      </div>

      {showCanvas && (
        <div className="workspace-model" aria-hidden="true">
          <WorkspaceScene
            chapter={chapter}
            projectId={projectId}
            quality={quality}
            paused={!documentVisible}
            reducedMotion={false}
            onModelReady={handleModelReady}
          />
        </div>
      )}

      <div className="workspace-status" aria-hidden="true">
        <span>{status.chapter}</span>
        <strong>{chapterIndex === 3 ? status.project : "System"}</strong>
      </div>

      <div className="quality-control" role="group" aria-label="3D scene quality">
        {qualityOptions.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={quality === option.id}
            onClick={() => {
              setQualityOverride(true);
              setQuality(option.id);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </aside>
  );
}