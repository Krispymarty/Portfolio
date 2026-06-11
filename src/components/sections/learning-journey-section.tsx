"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "2024",
    title: "Learning Foundations",
    items: ["Python", "C++", "Data Structures", "Algorithms"],
  },
  {
    year: "2025",
    title: "Machine Learning & Leadership",
    items: ["Machine Learning", "Hackathons", "Leadership", "Deep Learning"],
  },
  {
    year: "2026",
    title: "AI Systems & Products",
    items: ["Fraud Detection", "Computer Vision", "AI Systems", "LifeXP"],
  },
  {
    year: "Future",
    title: "Agentic AI & Startups",
    items: ["Agentic AI", "Startups", "Product Building", "Autonomous Systems"],
  },
];

export function LearningJourneySection() {
  return (
    <section id="journey" className="scroll-mt-24 py-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Journey</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <p className="text-text-secondary mb-12 max-w-xl">From first lines of code to shipping AI products.</p>

      <div className="relative">
        {/* Vertical track */}
        <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

        <div className="space-y-12">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Node */}
              <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 z-10">
                <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-background ${milestone.year === "Future" ? "bg-accent" : "bg-primary"}`} />
              </div>

              {/* Content */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"}`}>
                <span className={`inline-block font-mono text-sm font-bold mb-2 ${milestone.year === "Future" ? "text-accent" : "text-primary"}`}>
                  {milestone.year}
                </span>
                <h3 className="text-xl font-bold text-text-primary mb-3">{milestone.title}</h3>
                <div className={`flex flex-wrap gap-2 ${idx % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                  {milestone.items.map((item, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-surface border border-border rounded-md text-text-secondary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
