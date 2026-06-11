"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Lightbulb, Layers, AlertTriangle, Trophy, ArrowDown, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

interface ProjectData {
  name: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  challenges: string;
  lessonsLearned: string;
  techStack: string[];
  github: string;
  demo: string | null;
  status: string;
}

export function FeaturedProjectsSection({ featuredData }: { featuredData: Record<string, ProjectData> }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const projects = Object.entries(featuredData);

  if (projects.length === 0) {
    return (
      <section id="projects" className="scroll-mt-24 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Featured Projects</h2>
          <div className="h-px bg-border flex-1" />
        </div>
        <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-secondary">
          <p className="text-lg">No featured projects yet.</p>
        </div>
      </section>
    );
  }

  const renderArchitecture = (archString: string) => {
    const layers = archString.split("->").map(s => s.trim());
    return (
      <div className="flex flex-col items-center py-4 space-y-1">
        {layers.map((layer, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="px-5 py-2.5 bg-background border border-accent/20 rounded-lg text-text-primary font-mono text-sm text-center min-w-[140px] shadow-[0_0_12px_rgba(139,92,246,0.08)]">
              {layer}
            </div>
            {i < layers.length - 1 && <ArrowDown size={14} className="text-accent/60 my-1" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section id="projects" className="scroll-mt-24 py-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Featured Projects</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <p className="text-text-secondary mb-12 max-w-xl">Deep dives into the products I have built — the problems, the engineering, and the lessons.</p>

      <div className="grid grid-cols-1 gap-6">
        {projects.map(([key, project]) => (
          <motion.div
            key={key}
            className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
            layout
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-text-primary">{project.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      project.status === "Active Development" 
                        ? "bg-accent/10 text-accent border-accent/20" 
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed max-w-2xl">{project.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={project.github} target="_blank" className="p-2.5 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors text-text-primary">
                    <FaGithub size={18} />
                  </Link>
                  {project.demo && (
                    <Link href={project.demo} target="_blank" className="p-2.5 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors text-text-primary">
                      <ExternalLink size={18} />
                    </Link>
                  )}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-background border border-border rounded-md text-text-secondary font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Expand button */}
              <button
                onClick={() => setExpandedId(expandedId === key ? null : key)}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg font-medium hover:bg-accent/20 transition-colors text-sm"
              >
                {expandedId === key ? "Close Case Study" : "Read Case Study"}
                <motion.div animate={{ rotate: expandedId === key ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedId === key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 mt-8 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-8">
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-text-primary uppercase tracking-wider mb-3 text-xs">
                            <Target size={14} className="text-red-400" /> Problem
                          </h4>
                          <p className="text-text-secondary leading-relaxed">{project.problem}</p>
                        </div>
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-text-primary uppercase tracking-wider mb-3 text-xs">
                            <Lightbulb size={14} className="text-accent" /> Solution
                          </h4>
                          <p className="text-text-secondary leading-relaxed">{project.solution}</p>
                        </div>
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-text-primary uppercase tracking-wider mb-3 text-xs">
                            <Layers size={14} className="text-primary" /> Architecture
                          </h4>
                          <div className="bg-background rounded-xl border border-border p-4">
                            {renderArchitecture(project.architecture)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-text-primary uppercase tracking-wider mb-3 text-xs">
                            <AlertTriangle size={14} className="text-orange-400" /> Challenges
                          </h4>
                          <p className="text-text-secondary leading-relaxed">{project.challenges}</p>
                        </div>
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-text-primary uppercase tracking-wider mb-3 text-xs">
                            <Trophy size={14} className="text-green-400" /> Lessons Learned
                          </h4>
                          <p className="text-text-secondary leading-relaxed italic">{project.lessonsLearned}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
