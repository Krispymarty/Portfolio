"use client";

import Image from "next/image";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import profileImage from "../../public/profile.jpg";

type HeroPhase = "intro" | "exiting" | "settled";

type HeroArrivalProps = {
  name: string;
  role: string;
  headline: string;
  introduction: string;
  location: string;
  availability: string;
  resume: string;
};

export function HeroArrival(props: HeroArrivalProps) {
  const [phase, setPhase] = useState<HeroPhase>("intro");
  const [startupStage, setStartupStage] = useState(0);
  const phaseRef = useRef<HeroPhase>("intro");
  const autoTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const stageTimersRef = useRef<number[]>([]);
  const primaryActionRef = useRef<HTMLAnchorElement>(null);
  const focusPrimaryOnSettleRef = useRef(false);

  const dismiss = useCallback((focusPrimary = false, duration = 320) => {
    if (phaseRef.current !== "intro") return;
    phaseRef.current = "exiting";
    stageTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    setStartupStage(5);
    if (focusPrimary) focusPrimaryOnSettleRef.current = true;
    setPhase("exiting");
    if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      phaseRef.current = "settled";
      setPhase("settled");
    }, duration);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      phaseRef.current = "settled";
      const reducedTimer = window.setTimeout(() => setPhase("settled"), 0);
      return () => window.clearTimeout(reducedTimer);
    }

    const stageTimers = [180, 440, 760, 1080, 1500].map((delay, index) =>
      window.setTimeout(() => {
        setStartupStage(index + 1);
        window.dispatchEvent(new CustomEvent("workspace-intro", { detail: { stage: index + 1 } }));
      }, delay),
    );
    stageTimersRef.current = stageTimers;
    autoTimerRef.current = window.setTimeout(() => dismiss(false, 400), 2200);
    const isSkipControl = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".hero-startup__skip"));
    const handleKey = (event: KeyboardEvent) => {
      if (["Tab", "Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      if (isSkipControl(event.target) && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        dismiss(true);
        return;
      }
      dismiss(false);
    };
    const handlePointer = (event: PointerEvent) => {
      if (!isSkipControl(event.target)) dismiss(false);
    };
    const handleTouch = (event: TouchEvent) => {
      if (!isSkipControl(event.target)) dismiss(false);
    };
    const handleWheel = () => dismiss(false);

    window.addEventListener("keydown", handleKey, { once: true });
    window.addEventListener("pointerdown", handlePointer, { once: true });
    window.addEventListener("touchstart", handleTouch, { once: true, passive: true });
    window.addEventListener("wheel", handleWheel, { once: true, passive: true });

    return () => {
      stageTimers.forEach((timer) => window.clearTimeout(timer));
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [dismiss]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("workspace-intro", {
      detail: {
        complete: phase === "settled",
        ...(phase === "intro" ? { stage: 0 } : phase === "settled" ? { stage: 5 } : {}),
      },
    }));
  }, [phase]);
  useEffect(() => {
    if (phase !== "settled" || !focusPrimaryOnSettleRef.current) return;
    focusPrimaryOnSettleRef.current = false;
    const focusTimer = window.setTimeout(() => {
      primaryActionRef.current?.focus({ preventScroll: true });
    }, 50);
    return () => window.clearTimeout(focusTimer);
  }, [phase]);
  return (
    <div className="hero-arrival" data-phase={phase} data-stage={startupStage}>
      <h1 className="sr-only" id="arrival-title">{props.headline}</h1>

      <div className="hero-startup" aria-hidden="true">
        <div className="hero-startup__topline">
          <span>Living developer workspace</span>
          <strong>Boot / 0{startupStage}</strong>
        </div>
        <p className="hero-startup__headline">
          <span className="headline-mask"><span>From model accuracy</span></span>
          <span className="headline-mask"><span>to useful decisions.</span></span>
        </p>
        <p className="hero-startup__intro">{props.introduction}</p>
        <div className="hero-startup__progress">
          <div className="hero-startup__track"><i /></div>
          <div className="hero-startup__stages">
            {["Light", "Display", "Focus", "Signal", "Ready"].map((label, index) => (
              <span key={label} data-complete={startupStage > index ? "true" : "false"}>
                <i />{label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        className="hero-startup__skip"
        type="button"
        onClick={() => dismiss(true)}
        aria-label="Skip startup introduction"
      >
        Skip sequence
      </button>

      <div className="hero-profile">
        <Image
          className="hero-profile__portrait"
          src={profileImage}
          alt={`Portrait of ${props.name}`}
          width={352}
          height={528}
          priority
          placeholder="blur"
          sizes="(max-width: 560px) 112px, (max-width: 1050px) 144px, 176px"
        />
        <div className="hero-profile__details">
          <p className="availability"><span />{props.availability}</p>
          <strong className="hero-profile__name">{props.name}</strong>
          <p className="hero-profile__role">{props.role}</p>
          <p className="hero-profile__location"><MapPin aria-hidden="true" size={15} />{props.location}</p>
        </div>
        <div className="hero-profile__actions">
          <a ref={primaryActionRef} className="action action--primary" href="#work">
            Inspect the work <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
          </a>
          <a className="action action--quiet" href={props.resume} target="_blank" rel="noreferrer">
            Resume <Download aria-hidden="true" size={16} />
          </a>
          <button
            className="action action--quiet hero-explore-trigger"
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("workspace-explore-request"))}
          >
            Explore workspace
          </button>
        </div>
      </div>
    </div>
  );
}
