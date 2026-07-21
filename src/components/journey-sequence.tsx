"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/data/portfolio";

export function JourneySequence() {
  const [activeStep, setActiveStep] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>("li")];
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        const index = Number((active.target as HTMLElement).dataset.step ?? 0);
        setActiveStep(index);
        window.dispatchEvent(new CustomEvent("signal-layer", { detail: { index: Math.min(index, 3) } }));
      },
      { rootMargin: "-28% 0px -48%", threshold: [0.1, 0.35, 0.7] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="journey-sequence" style={{ "--journey-step": activeStep } as React.CSSProperties}>
      <div className="journey-instrument" aria-hidden="true">
        <div className="journey-instrument__readout">
          <span>Signal acquired</span>
          <strong>{portfolio.journey[activeStep].signal}</strong>
          <small>{String(activeStep + 1).padStart(2, "0")} / 04</small>
        </div>
        <div className="journey-channels">
          {portfolio.journey.map((milestone, index) => (
            <i key={milestone.signal} data-live={index <= activeStep ? "true" : "false"} />
          ))}
          <b />
        </div>
        <p>{activeStep === 0 ? "One foundation" : `${activeStep + 1} connected inputs`}</p>
      </div>

      <ol className="journey-steps" ref={listRef}>
        {portfolio.journey.map((milestone, index) => (
          <li key={milestone.period} data-step={index} data-active={index === activeStep ? "true" : "false"}>
            <div className="journey-step__meta">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time>{milestone.period}</time>
            </div>
            <h3>{milestone.title}</h3>
            <p>{milestone.text}</p>
            <strong>{milestone.signal}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
