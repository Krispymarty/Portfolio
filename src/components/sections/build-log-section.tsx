"use client";

import { motion } from "framer-motion";
import { AlertCircle, Info, Lightbulb, Trophy, ArrowRight } from "lucide-react";

interface LogEntry {
  date: string;
  project: string;
  problem: string;
  context: string;
  solution: string;
  lessonLearned: string;
  nextStep: string;
}

export function BuildLogSection({ buildLogs }: { buildLogs: LogEntry[] }) {
  if (!buildLogs || buildLogs.length === 0) {
    return (
      <section id="build-log" className="scroll-mt-24 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Engineering Journal</h2>
          <div className="h-px bg-border flex-1" />
        </div>
        <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-secondary">
          <p className="text-lg">No engineering logs yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="build-log" className="scroll-mt-24 py-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Engineering Journal</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <p className="text-text-secondary mb-12 max-w-xl">Real-time documentation of problems, technical context, solutions, and lessons learned while building.</p>

      <div className="space-y-8">
        {buildLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Date column */}
              <div className="md:w-40 shrink-0">
                <div className="font-mono text-sm text-text-secondary border-l-2 border-border pl-4 group-hover:border-accent transition-colors">
                  <div>{log.date}</div>
                  <div className="text-primary font-semibold mt-1">{log.project}</div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-surface border border-border rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors">
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                      <AlertCircle size={14} /> Problem
                    </h4>
                    <p className="text-text-primary text-sm font-medium leading-relaxed">{log.problem}</p>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">
                      <Info size={14} /> Context
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{log.context}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
                      <Lightbulb size={14} /> Solution
                    </h4>
                    <p className="text-text-primary/90 text-sm leading-relaxed">{log.solution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border/50">
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest mb-2">
                      <Trophy size={14} /> Lesson Learned
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed italic">{log.lessonLearned}</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
                      <ArrowRight size={14} /> Next Step
                    </h4>
                    <p className="text-text-primary text-sm font-medium">{log.nextStep}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
