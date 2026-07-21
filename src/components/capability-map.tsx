"use client";

import { useState } from "react";
import { portfolio, projectNameById } from "@/data/portfolio";

const filters = [
  { id: "all", label: "All evidence" },
  { id: "fraud-detection", label: "Fraud" },
  { id: "weapon-detection", label: "Vision" },
  { id: "lifexp", label: "LifeXP" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function CapabilityMap() {
  const [filter, setFilter] = useState<FilterId>("all");

  const selectFilter = (id: FilterId) => {
    setFilter(id);
    if (id !== "all") window.dispatchEvent(new CustomEvent("signal-project", { detail: { id } }));
  };

  return (
    <div className="capability-map">
      <div className="capability-selector" role="group" aria-label="Filter capabilities by project evidence">
        <p>Trace a system</p>
        {filters.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => selectFilter(item.id)}
          >
            <span>{String(index).padStart(2, "0")}</span>{item.label}
          </button>
        ))}
      </div>

      <div className="capability-field" data-filter={filter}>
        <span className="capability-field__origin" aria-hidden="true">Signal</span>
        {portfolio.capabilityGroups.map((group, index) => {
          const connected = filter === "all" || group.evidence.includes(filter as never);
          return (
            <article key={group.label} data-connected={connected ? "true" : "false"} style={{ "--capability-index": index } as React.CSSProperties}>
              <div className="capability-node" aria-hidden="true"><i /></div>
              <div className="capability-name">
                <h3>{group.label}</h3>
                <p>{group.description}</p>
              </div>
              <ul className="skill-list" aria-label={`${group.label} technologies`}>
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
              <div className="evidence-links">
                <span>Evidence</span>
                {group.evidence.map((projectId) => (
                  <a href={`#project-panel-${projectId}`} key={projectId}>{projectNameById[projectId]}</a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
