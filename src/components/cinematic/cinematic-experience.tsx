"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { FrameStore, type CinematicDrawable } from "@/lib/cinematic/frame-store";
import {
  cinematicAssetVersion,
  cinematicChapters,
  cinematicSequences,
  type CinematicChapter,
  type CinematicSequenceId,
} from "@/lib/cinematic/manifest";

const ExploreWorkspace = dynamic(
  () => import("@/components/decision-core").then((module) => module.DecisionCore),
  { ssr: false, loading: () => <div className="cinematic-explore__loading">Preparing interactive workspace…</div> },
);

type ScrollState = {
  chapter: CinematicChapter;
  chapterIndex: number;
  progress: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getScrollState(): ScrollState {
  const viewport = window.innerHeight;
  let selectedIndex = 0;
  let selectedDistance = Number.POSITIVE_INFINITY;

  cinematicChapters.forEach((chapter, index) => {
    const section = document.getElementById(chapter.id);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height * 0.5 - viewport * 0.5);
    if (distance < selectedDistance) {
      selectedDistance = distance;
      selectedIndex = index;
    }
  });

  const chapter = cinematicChapters[selectedIndex];
  const section = document.getElementById(chapter.id);
  const rect = section?.getBoundingClientRect();
  const travel = Math.max(1, (rect?.height ?? viewport) - viewport * 0.22);
  const progress = rect ? clamp((viewport * 0.72 - rect.top) / travel) : 0;
  return { chapter, chapterIndex: selectedIndex, progress };
}

function frameForState(state: ScrollState) {
  const sequence = cinematicSequences[state.chapter.sequence];
  if (state.chapter.direction === "hold-start") return 1;
  if (state.chapter.direction === "hold-end") return sequence.frameCount;
  const progress = state.chapter.direction === "reverse" ? 1 - state.progress : state.progress;
  return Math.round(1 + clamp(progress) * (sequence.frameCount - 1));
}

function drawCover(context: CanvasRenderingContext2D, drawable: CinematicDrawable, width: number, height: number) {
  const sourceWidth = drawable.width;
  const sourceHeight = drawable.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  context.clearRect(0, 0, width, height);
  context.drawImage(drawable, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function GuidedCanvas({ paused, onChapter }: { paused: boolean; onChapter: (id: CinematicSequenceId) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storeRef = useRef(new FrameStore(56));
  const targetRef = useRef(1);
  const displayRef = useRef(1);
  const sequenceRef = useRef<CinematicSequenceId>("initialize");
  const animationRef = useRef<number | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const [criticalLoaded, setCriticalLoaded] = useState(0);
  const [criticalReady, setCriticalReady] = useState(false);

  const paint = useCallback(async (sequenceId: CinematicSequenceId, frame: number) => {
    const canvas = canvasRef.current;
    const store = storeRef.current;
    if (!canvas) return;
    const sequence = cinematicSequences[sequenceId];
    const url = sequence.frameUrl(frame);
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    try {
      const drawable = store.get(url) ?? await store.load(url, controller.signal);
      if (controller.signal.aborted || !canvasRef.current) return;
      const context = canvas.getContext("2d", { alpha: false });
      if (context) drawCover(context, drawable, canvas.width, canvas.height);
    } catch (error) {
      if ((error as Error).name !== "AbortError") console.warn(error);
    }
  }, []);

  const schedule = useCallback(() => {
    if (animationRef.current !== null || paused || document.hidden) return;
    const tick = () => {
      animationRef.current = null;
      const current = displayRef.current;
      const target = targetRef.current;
      const distance = target - current;
      const next = Math.abs(distance) < 0.55 ? target : current + distance * 0.2;
      const nextFrame = Math.round(next);
      const previousFrame = Math.round(current);
      displayRef.current = next;
      if (nextFrame !== previousFrame || next === target) void paint(sequenceRef.current, nextFrame);
      if (next !== target) animationRef.current = window.requestAnimationFrame(tick);
    };
    animationRef.current = window.requestAnimationFrame(tick);
  }, [paint, paused]);

  const updateFromScroll = useCallback(() => {
    if (paused) return;
    const state = getScrollState();
    const nextSequence = state.chapter.sequence;
    const sequenceChanged = sequenceRef.current !== nextSequence;
    sequenceRef.current = nextSequence;
    const introStage = Number(document.querySelector<HTMLElement>(".hero-arrival")?.dataset.stage ?? 0);
    targetRef.current = state.chapter.id === "arrival"
      ? Math.round(1 + clamp(introStage / 5) * (cinematicSequences.initialize.frameCount - 1))
      : frameForState(state);
    onChapter(nextSequence);
    const settledArrival = state.chapter.id === "arrival" && introStage >= 5;
    if (sequenceChanged || settledArrival) {
      if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      displayRef.current = targetRef.current;
      void paint(nextSequence, Math.round(displayRef.current));
    } else {
      schedule();
    }

    const sequence = cinematicSequences[nextSequence];
    const frame = targetRef.current;
    const nearby = Array.from({ length: 12 }, (_, index) => clamp(Math.round(frame + index - 4), 1, sequence.frameCount));
    void Promise.allSettled(nearby.map((candidate) => storeRef.current.load(sequence.frameUrl(candidate))));
  }, [onChapter, paint, paused, schedule]);

  useEffect(() => {
    const store = storeRef.current;
    let cancelled = false;
    const preloadController = new AbortController();
    const initial = cinematicSequences.initialize;

    const loadBounded = async (frames: number[], concurrency: number, onSettled?: () => void) => {
      let cursor = 0;
      const worker = async () => {
        while (!cancelled) {
          const index = cursor++;
          if (index >= frames.length) return;
          try {
            await store.load(initial.frameUrl(frames[index]), preloadController.signal);
          } catch {
            // The anchor poster remains visible and later scroll requests can recover the frame.
          } finally {
            if (!cancelled) onSettled?.();
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(concurrency, frames.length) }, () => worker()));
    };

    const critical = Array.from({ length: 16 }, (_, index) => index + 1);
    void loadBounded(critical, 4, () => setCriticalLoaded((value) => value + 1)).then(() => {
      if (cancelled) return;
      setCriticalReady(true);
      void paint(sequenceRef.current, Math.round(displayRef.current));
      const remaining = Array.from({ length: initial.frameCount - critical.length }, (_, index) => index + critical.length + 1);
      void loadBounded(remaining, 4);
    });

    return () => {
      cancelled = true;
      preloadController.abort();
    };
  }, [paint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const store = storeRef.current;
    if (!canvas) return;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      void paint(sequenceRef.current, Math.round(displayRef.current));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const onVisibility = () => { if (!document.hidden) updateFromScroll(); };
    const onIntro = (event: Event) => {
      const stage = (event as CustomEvent<{ stage?: number }>).detail?.stage;
      if (typeof stage === "number" && getScrollState().chapter.id === "arrival") {
        sequenceRef.current = "initialize";
        targetRef.current = Math.round(1 + clamp(stage / 5) * (cinematicSequences.initialize.frameCount - 1));
        if (stage === 5) {
          if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
          displayRef.current = targetRef.current;
          void paint("initialize", targetRef.current);
        } else {
          schedule();
        }
        return;
      }
      updateFromScroll();
    };
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("workspace-intro", onIntro);
    resize();
    updateFromScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("workspace-intro", onIntro);
      requestControllerRef.current?.abort();
      if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current);
      store.dispose();
    };
  }, [paint, schedule, updateFromScroll]);

  const readinessPercent = Math.min(100, Math.round((criticalLoaded / 16) * 100));
  return (
    <>
      <canvas ref={canvasRef} className="cinematic-canvas" aria-hidden="true" />
      {!criticalReady && <div className="cinematic-loader" role="status">Preparing first view <span>{readinessPercent}%</span></div>}
    </>
  );
}

function FallbackMedia({ sequenceId, reduced }: { sequenceId: CinematicSequenceId; reduced: boolean }) {
  const sequence = cinematicSequences[sequenceId];
  if (reduced) return <div className="cinematic-poster" style={{ backgroundImage: `url(${sequence.poster})` }} aria-hidden="true" />;
  return <video key={sequence.video} className="cinematic-video" autoPlay muted loop playsInline poster={sequence.poster} aria-hidden="true"><source src={sequence.video} type="video/mp4" /></video>;
}

export function CinematicExperience() {
  const [exploring, setExploring] = useState(false);
  const [sequenceId, setSequenceId] = useState<CinematicSequenceId>("initialize");
  const [deviceMode, setDeviceMode] = useState<"canvas" | "video" | "poster">("poster");
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const canvasMode = deviceMode === "canvas";

  const openExplore = useCallback((initiator?: HTMLElement | null) => {
    if (deviceMode === "poster") return;
    previousFocusRef.current = initiator ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setExploring(true);
  }, [deviceMode]);

  const closeExplore = useCallback(() => {
    setExploring(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const handleRequest = () => openExplore();
    window.addEventListener("workspace-explore-request", handleRequest);
    return () => window.removeEventListener("workspace-explore-request", handleRequest);
  }, [openExplore]);

  useEffect(() => {
    if (!exploring) return;
    const background = Array.from(document.querySelectorAll<HTMLElement>("body > .site-header, body > main, body > .site-footer, body > .signal-rail"));
    background.forEach((element) => { element.inert = true; });
    const focusTimer = window.setTimeout(() => exitRef.current?.focus({ preventScroll: true }), 0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeExplore();
        return;
      }
      if (event.key !== "Tab" || !exploreRef.current) return;
      const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(exploreRef.current.querySelectorAll<HTMLElement>(selector)).filter((element) => !element.hidden);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKey);
      background.forEach((element) => { element.inert = false; });
    };
  }, [closeExplore, exploring]);

  useEffect(() => {
    const chooseMode = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
      setDeviceMode(reduced ? "poster" : window.innerWidth <= 700 || memory <= 2 ? "video" : "canvas");
    };
    chooseMode();
    window.addEventListener("resize", chooseMode);
    return () => window.removeEventListener("resize", chooseMode);
  }, []);

  useEffect(() => {
    if (canvasMode || exploring) return;
    const update = () => setSequenceId(getScrollState().chapter.sequence);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [canvasMode, exploring]);


  return (
    <>
      <div className="cinematic-experience" data-exploring={exploring ? "true" : "false"}>
        <div className="cinematic-viewport" style={{ backgroundImage: `url(/cinematic/posters/workspace-anchor.webp?v=${cinematicAssetVersion})` }}>
          {!exploring && (canvasMode ? <GuidedCanvas paused={false} onChapter={setSequenceId} /> : <FallbackMedia sequenceId={sequenceId} reduced={deviceMode === "poster"} />)}
          <div className="cinematic-shade" aria-hidden="true" />
        </div>
      </div>
      <div className="cinematic-controls">
        <button ref={desktopTriggerRef} type="button" onClick={(event) => openExplore(event.currentTarget)} disabled={deviceMode === "poster"}>Explore workspace</button>
      </div>
      {exploring && (
        <div ref={exploreRef} className="cinematic-explore" role="dialog" aria-modal="true" aria-label="Interactive workspace">
          <ExploreWorkspace initialMode="explore" onExit={closeExplore} />
          <button ref={exitRef} className="cinematic-explore__exit" type="button" onClick={closeExplore}>Exit explore mode</button>
        </div>
      )}
    </>
  );
}