"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { FraudDecisionPlot, LifeXPSystem, VisionPipeline } from "@/components/project-visuals";

const provenanceLabel = {
  "resume-verified": "Résumé verified",
  "portfolio-source": "Portfolio source",
  "in-progress": "Work in progress",
} as const;

const projectControls = {
  "fraud-detection": [
    { id: "pr-auc", label: "PR-AUC", detail: "0.833 recorded evaluation" },
    { id: "precision", label: "Precision", detail: "90.9% recorded precision" },
    { id: "false-positives", label: "Review load", detail: "False positives reduced from 18 to 11" },
  ],
  "weapon-detection": [
    { id: "camera", label: "Camera feed", detail: "Continuous frames enter the inference path" },
    { id: "processing", label: "Frame processing", detail: "OpenCV prepares data for inference" },
    { id: "model", label: "YOLOv8", detail: "The custom model evaluates each frame" },
    { id: "threshold", label: "Threshold", detail: "Confidence changes for higher-risk conditions" },
    { id: "alert", label: "Alert", detail: "Qualified detections reach the monitoring output" },
  ],
  lifexp: [
    { id: "interface", label: "Interface", detail: "Next.js experience layer" },
    { id: "service", label: "Service", detail: "FastAPI application boundary" },
    { id: "progress", label: "Progress data", detail: "PostgreSQL tracking layer" },
    { id: "planned", label: "Recommendation", detail: "Planned, not presented as complete" },
  ],
} as const;

type ProjectId = keyof typeof projectControls;

export function ProjectLab() {
  const [activeId, setActiveId] = useState<ProjectId>("fraud-detection");
  const [instrumentState, setInstrumentState] = useState(projectControls[activeId][0].id as string);

  const selectProject = (id: ProjectId) => {
    setActiveId(id);
    setInstrumentState(projectControls[id][0].id);
    window.dispatchEvent(new CustomEvent("signal-project", { detail: { id } }));

    if (window.matchMedia("(max-width: 820px)").matches) {
      window.requestAnimationFrame(() => {
        document.getElementById(`project-panel-${id}`)?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  const moveProjectFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const lastIndex = portfolio.projects.length - 1;
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? lastIndex
        : (index + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) + portfolio.projects.length) % portfolio.projects.length;
    const nextProject = portfolio.projects[nextIndex];
    selectProject(nextProject.id as ProjectId);
    document.getElementById(`project-tab-${nextProject.id}`)?.focus();
  };

  return (
    <div className="project-lab">
      <div className="project-index" role="tablist" aria-label="Choose a project instrument">
        {portfolio.projects.map((project, index) => (
          <button
            type="button"
            role="tab"
            id={`project-tab-${project.id}`}
            aria-controls={`project-panel-${project.id}`}
            aria-selected={activeId === project.id}
            tabIndex={activeId === project.id ? 0 : -1}
            key={project.id}
            onClick={() => selectProject(project.id as ProjectId)}
            onKeyDown={(event) => moveProjectFocus(event, index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{project.name}</strong>
            <small>{project.kind}</small>
          </button>
        ))}
      </div>

      <div className="project-stage">
        {portfolio.projects.map((project, projectIndex) => {
          const id = project.id as ProjectId;
          const active = activeId === id;
          const controls = projectControls[id];
          return (
            <article
              className={`project-instrument project-instrument--${projectIndex + 1}`}
              id={`project-panel-${project.id}`}
              role="tabpanel"
              aria-labelledby={`project-tab-${project.id}`}
              hidden={!active}
              data-active={active ? "true" : "false"}
              key={project.id}
            >
              <header className="instrument-header">
                <div>
                  <p>{project.kind}</p>
                  <h3>{project.name}</h3>
                </div>
                <div className="instrument-source">
                  <span>{project.period}</span>
                  <strong data-source={project.provenance}>{provenanceLabel[project.provenance]}</strong>
                </div>
              </header>

              <div className="instrument-brief">
                <div>
                  <span>Problem</span>
                  <p>{project.problem}</p>
                </div>
                <div>
                  <span>Key decision</span>
                  <p>{project.decision}</p>
                </div>
              </div>

              <div className="instrument-body">
                <div className="instrument-visual" data-state={active ? instrumentState : controls[0].id}>
                  {id === "fraud-detection" && <FraudDecisionPlot />}
                  {id === "weapon-detection" && <VisionPipeline />}
                  {id === "lifexp" && <LifeXPSystem />}
                </div>

                <details className="project-story project-story--technical">
                  <summary>Technical evidence <span aria-hidden="true">+</span></summary>
                  <div className="project-story__content">
                    <p className="instrument-console__label">Interact with the visualization</p>
                    <div className="instrument-controls" role="group" aria-label={`${project.name} instrument states`}>
                      {controls.map((control, index) => (
                        <button
                          type="button"
                          key={control.id}
                          aria-pressed={instrumentState === control.id}
                          onClick={() => setInstrumentState(control.id)}
                          onFocus={() => setInstrumentState(control.id)}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{control.label}</strong>
                          <small>{control.detail}</small>
                        </button>
                      ))}
                    </div>
                    <dl>
                      <div><dt>My contribution</dt><dd>{project.contribution}</dd></div>
                      <div><dt>Notable challenge</dt><dd>{project.challenge}</dd></div>
                    </dl>
                    <div className="instrument-technical-footer">
                      <ul aria-label={`${project.name} technology stack`}>
                        {project.stack.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                      {project.repository ? (
                        <a href={project.repository} target="_blank" rel="noreferrer">
                          GitHub context <ArrowUpRight aria-hidden="true" size={16} />
                        </a>
                      ) : <span>Repository link needed</span>}
                    </div>
                  </div>
                </details>
              </div>

              <div className="instrument-outcome">
                <div>
                  <span>Recorded outcome</span>
                  <p>{project.outcome}</p>
                </div>
                {project.metrics.length > 0 && (
                  <ul aria-label={`${project.name} recorded metrics`}>
                    {project.metrics.slice(0, 2).map((metric) => (
                      <li key={metric.label}>
                        <strong>{metric.value}</strong><span>{metric.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>


            </article>
          );
        })}
      </div>
    </div>
  );
}
