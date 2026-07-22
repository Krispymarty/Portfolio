"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Group } from "three";
import { portfolio } from "@/data/portfolio";
import type { ProjectSceneId, SceneQuality, WorkspaceObjectId } from "./workspace-scene";

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

const workspaceObjects: Array<{
  id: WorkspaceObjectId;
  label: string;
  domain: string;
  title: string;
  summary: string;
  facts: string[];
  href: string;
  action: string;
}> = [
  {
    id: "monitor",
    label: "Monitor",
    domain: "Projects",
    title: "Systems built around real decisions.",
    summary: "Inspect the fraud, computer-vision, and LifeXP work without leaving the guided portfolio.",
    facts: portfolio.projects.map((project) => project.name),
    href: "#work",
    action: "Open project case studies",
  },
  {
    id: "server",
    label: "Server",
    domain: "Backend & engineering",
    title: "The application boundary behind the models.",
    summary: "APIs, inference paths, storage, and deployment connect model output to usable product behavior.",
    facts: ["FastAPI and REST APIs", "PostgreSQL and SQL", "Docker and local model deployment"],
    href: "#capabilities",
    action: "Inspect engineering skills",
  },
  {
    id: "notebook",
    label: "Notebook",
    domain: "Education & learning",
    title: "Foundations that keep expanding.",
    summary: portfolio.education[0].qualification + " at " + portfolio.education[0].institution + ".",
    facts: ["Programming and algorithms", "Data analysis and model fundamentals", "AI agents, retrieval systems, and local LLMs"],
    href: "#experience",
    action: "Read education and experience",
  },
  {
    id: "frame",
    label: "Frame",
    domain: "Capability relationships",
    title: "Skills connected to evidence.",
    summary: "The frame groups technologies by what they enable and ties them back to demonstrated work.",
    facts: portfolio.capabilityGroups.map((group) => group.label),
    href: "#capabilities",
    action: "Trace the capability map",
  },
  {
    id: "lamp",
    label: "Lamp",
    domain: "Current focus",
    title: "Curiosity, kept practical.",
    summary: "Current exploration is clearly separated from finished expertise and tested through product architecture.",
    facts: ["RAG systems", "AI agents", "Vector databases and local LLMs"],
    href: "#journey",
    action: "Follow the learning journey",
  },
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

type DecisionCoreProps = {
  initialMode?: "guided" | "explore";
  onExit?: () => void;
};

export function DecisionCore({ initialMode = "guided", onExit }: DecisionCoreProps = {}) {
  const reducedMotion = useReducedMotion() ?? false;
  const experienceRef = useRef<HTMLElement>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [projectId, setProjectId] = useState<ProjectSceneId>("fraud-detection");
  const [quality, setQuality] = useState<SceneQuality>("balanced");
  const [qualityOverride, setQualityOverride] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [sceneInView, setSceneInView] = useState(true);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [booted, setBooted] = useState(initialMode === "explore");
  const [startupStage, setStartupStage] = useState(initialMode === "explore" ? 5 : 0);
  const [mode, setMode] = useState<"guided" | "explore">(initialMode);
  const [selectedObject, setSelectedObject] = useState<WorkspaceObjectId>("monitor");
  const [allowRotation, setAllowRotation] = useState(true);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [hasExplored, setHasExplored] = useState(false);
  const [visitedObjects, setVisitedObjects] = useState<Set<WorkspaceObjectId>>(() => new Set(["monitor"]));
  const chapter = booted ? (chapterStates[chapterIndex] ?? chapterStates[0]) : 0;
  const selectedDetail = workspaceObjects.find((item) => item.id === selectedObject) ?? workspaceObjects[0];
  const visitedCount = visitedObjects.size;

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      if (!qualityOverride) setQuality(inferQuality());
      setWebglAvailable(supportsWebGL());
      setAllowRotation(window.innerWidth > 700);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setBooted(true);
      const activeChapter = document.documentElement.dataset.chapter;
      const activeIndex = chapterIds.findIndex((id) => id === activeChapter);
      if (activeIndex >= 0) setChapterIndex(activeIndex);
    }, 0);

    const handleResize = () => {
      if (!qualityOverride) setQuality(inferQuality());
      setAllowRotation(window.innerWidth > 700);
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
    const handleIntro = (event: Event) => {
      const detail = (event as CustomEvent<{ complete?: boolean; stage?: number }>).detail;
      if (typeof detail?.stage === "number") setStartupStage(detail.stage);
      if (detail?.complete) {
        setStartupStage(5);
        setBooted(true);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMode("guided");
        onExit?.();
      }
    };

    const observer = new IntersectionObserver(([entry]) => setSceneInView(entry.isIntersecting), { threshold: 0.01 });
    if (experienceRef.current) observer.observe(experienceRef.current);

    window.addEventListener("resize", handleResize);
    window.addEventListener("signal-chapter", handleChapter);
    window.addEventListener("signal-project", handleProject);
    window.addEventListener("workspace-intro", handleIntro);
    window.addEventListener("keydown", handleEscape);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(initialize);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("signal-chapter", handleChapter);
      window.removeEventListener("signal-project", handleProject);
      window.removeEventListener("workspace-intro", handleIntro);
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [onExit, qualityOverride]);

  const handleModelReady = useCallback((model: Group | null) => {
    if (model) setSceneReady(true);
  }, []);

  const handleObjectSelect = useCallback((id: WorkspaceObjectId) => {
    setSelectedObject(id);
    setMode("explore");
    setHasExplored(true);
    setVisitedObjects((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  const selectRelativeObject = useCallback((direction: -1 | 1) => {
    const index = workspaceObjects.findIndex((item) => item.id === selectedObject);
    const next = workspaceObjects[(index + direction + workspaceObjects.length) % workspaceObjects.length].id;
    handleObjectSelect(next);
  }, [handleObjectSelect, selectedObject]);

  useEffect(() => {
    if (mode !== "explore") return;
    const handleExploreKeys = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [role='tablist']")) return;
      const previous = event.key === "ArrowLeft" || event.key.toLowerCase() === "a";
      const next = event.key === "ArrowRight" || event.key.toLowerCase() === "d";
      const digit = Number(event.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= workspaceObjects.length) {
        event.preventDefault();
        handleObjectSelect(workspaceObjects[digit - 1].id);
        return;
      }
      if (!previous && !next) return;
      event.preventDefault();
      selectRelativeObject(next ? 1 : -1);
    };
    window.addEventListener("keydown", handleExploreKeys);
    return () => window.removeEventListener("keydown", handleExploreKeys);
  }, [handleObjectSelect, mode, selectRelativeObject]);

  const handleObjectKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? workspaceObjects.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + workspaceObjects.length) % workspaceObjects.length;
    const next = workspaceObjects[nextIndex];
    setSelectedObject(next.id);
    setHasExplored(true);
    setVisitedObjects((current) => {
      const visited = new Set(current);
      visited.add(next.id);
      return visited;
    });
    window.requestAnimationFrame(() => document.getElementById(`workspace-tab-${next.id}`)?.focus());
  };

  const status = useMemo(
    () => ({
      chapter: chapterLabels[chapterIndex] ?? chapterLabels[0],
      project: projectId === "fraud-detection" ? "Fraud" : projectId === "weapon-detection" ? "Vision" : "LifeXP",
    }),
    [chapterIndex, projectId],
  );

  const showCanvas = webglAvailable && !reducedMotion && quality !== "lightweight";
  const scenePaused = !documentVisible || !sceneInView;

  return (
    <aside
      ref={experienceRef}
      className="workspace-experience"
      data-scene-ready={sceneReady ? "true" : "false"}
      data-quality={quality}
      data-static={!showCanvas ? "true" : "false"}
      data-mode={mode}
      data-startup-stage={startupStage}
      data-booted={booted ? "true" : "false"}
      aria-label="Living developer workspace"
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
            paused={scenePaused}
            reducedMotion={false}
            startupStage={startupStage}
            mode={mode}
            selectedObject={selectedObject}
            allowRotation={allowRotation}
            onSelect={handleObjectSelect}
            onModelReady={handleModelReady}
          />
        </div>
      )}

      <div className="workspace-mode" role="group" aria-label="Workspace experience mode">
        <button type="button" aria-pressed={mode === "guided"} onClick={() => { setMode("guided"); onExit?.(); }}>Guided</button>
        <button type="button" aria-pressed={mode === "explore"} onClick={() => setMode("explore")}>Explore workspace</button>
      </div>

      <div className="workspace-status" aria-hidden="true">
        <span>{mode === "explore" ? selectedDetail.label : status.chapter}</span>
        <strong>{mode === "explore" ? selectedDetail.domain : chapterIndex === 3 ? status.project : "System"}</strong>
      </div>

      {mode === "explore" && !hasExplored && (
        <div className="workspace-explore-guide" aria-hidden="true">
          <span>Select a workstation object</span>
          <small>A / D, arrows, or 1-5</small>
        </div>
      )}

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

      <section className="workspace-inspector" aria-label="Workspace object inspector" hidden={mode !== "explore"} data-collapsed={inspectorCollapsed ? "true" : "false"}>
        <div className="workspace-inspector__heading">
          <span>{String(workspaceObjects.findIndex((item) => item.id === selectedObject) + 1).padStart(2, "0")} / {String(workspaceObjects.length).padStart(2, "0")}</span>
          <button type="button" aria-expanded={!inspectorCollapsed} aria-controls="workspace-object-panel" onClick={() => setInspectorCollapsed((value) => !value)}>
            {inspectorCollapsed ? "Show evidence" : "Minimize"}
          </button>
        </div>
        <div className="workspace-progress" aria-label={`${visitedCount} of ${workspaceObjects.length} workspace objects inspected`}>
          <span>Inspected</span>
          <strong>{visitedCount}/{workspaceObjects.length}</strong>
        </div>
        <div className="workspace-object-tabs" role="tablist" aria-label="Inspect workstation objects">
          {workspaceObjects.map((item) => (
            <button
              type="button"
              role="tab"
              id={`workspace-tab-${item.id}`}
              aria-selected={selectedObject === item.id}
              aria-controls="workspace-object-panel"
              tabIndex={selectedObject === item.id ? 0 : -1}
              key={item.id}
              data-visited={visitedObjects.has(item.id) ? "true" : "false"}
              onClick={() => handleObjectSelect(item.id)}
              onKeyDown={(event) => handleObjectKeyDown(event, workspaceObjects.indexOf(item))}
            >
              <span>{item.label}</span><small>{workspaceObjects.indexOf(item) + 1}</small>
            </button>
          ))}
        </div>
        <div id="workspace-object-panel" role="tabpanel" aria-labelledby={`workspace-tab-${selectedObject}`} aria-live="polite" hidden={inspectorCollapsed}>
          <p>{selectedDetail.domain}</p>
          <h3>{selectedDetail.title}</h3>
          <p>{selectedDetail.summary}</p>
          <ul>{selectedDetail.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          {selectedObject === "monitor" && (
            <div className="workspace-project-switcher" role="group" aria-label="Project shown on the workstation monitor">
              {portfolio.projects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  aria-pressed={projectId === project.id}
                  onClick={() => {
                    const id = project.id as ProjectSceneId;
                    setProjectId(id);
                    window.dispatchEvent(new CustomEvent("signal-project", { detail: { id } }));
                  }}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
          <a href={selectedDetail.href}>{selectedDetail.action}</a>
        </div>
        <div className="workspace-inspector__footer" hidden={inspectorCollapsed}>
          <span>{allowRotation ? "Drag to orbit within limits. A / D or 1-5 changes focus" : "Tap an object or use the numbered controls"}</span>
          <button type="button" onClick={() => { setMode("guided"); onExit?.(); }}>Return to guided mode</button>
          <a href="#work">Skip experience</a>
        </div>
      </section>
    </aside>
  );
}
