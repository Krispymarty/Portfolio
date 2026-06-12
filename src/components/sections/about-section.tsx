"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  const storyMilestones = [
    {
      title: "How It Started",
      content: "My path into engineering wasn't a straight line. It started with a simple curiosity: how do complex systems actually work? That question led me to write my first scripts, break my first environments, and eventually build tools that solve real problems.",
      year: "The Beginning"
    },
    {
      title: "Why AI",
      content: "I began my journey deep in the trenches of Machine Learning. I spent months training models, fighting class imbalances in fraud datasets, and building real-time computer vision systems. The mathematics were fascinating, but I realized something critical: a highly accurate model is useless if it's not wrapped in a product that people can actually use.",
      year: "The Shift"
    },
    {
      title: "Why Products",
      content: "That realization shifted my entire focus from training models to building products. I moved up the stack, learning Next.js, FastAPI, and robust database architectures. I started thinking about user experience, deployment pipelines, and scalable system design. I stopped calling myself an 'ML researcher' and started operating as an engineer who builds.",
      year: "The Evolution"
    },
    {
      title: "Current Focus",
      content: "Today, I'm deeply interested in AI Systems and Agentic Workflows. We're moving past simple chat interfaces into a world where autonomous systems execute complex reasoning. My goal is to be at the forefront of this shift—harnessing LLMs as reasoning engines rather than just text generators.",
      year: "Today"
    }
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 border-t border-border/50 bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] glow-purple opacity-20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">Who I Am</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            My goal is to build and scale AI products that solve meaningful real-world problems. Here is how I got here.
          </p>
        </motion.div>

        <div className="relative border-l border-border/50 ml-4 md:ml-8 space-y-16">
          {storyMilestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-surface border-2 border-primary shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-4">
                <h3 className="text-2xl font-bold text-text-primary">{milestone.title}</h3>
                <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">{milestone.year}</span>
              </div>
              
              <p className="text-lg text-text-secondary leading-relaxed">
                {milestone.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
