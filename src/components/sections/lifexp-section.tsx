"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Target, Lightbulb, Server, GitPullRequest, ArrowRight, Activity, Zap } from "lucide-react";
import Image from "next/image";

export function LifeXPSection() {
  return (
    <section id="lifexp" className="scroll-mt-24 py-16 md:py-24 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          Flagship Product
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6">
          LifeXP
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
          Gamifying personal growth. An AI-powered platform designed to help people transform abstract goals into consistent, actionable habits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column - Core Narrative */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Vision & Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-border p-8 rounded-2xl shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px] rounded-full" />
            
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-primary" size={24} />
                  <h3 className="text-2xl font-bold text-text-primary">The Vision</h3>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  To bridge the gap between human ambition and daily execution. LifeXP doesn't just track what you do; it intelligently analyzes your behavioral patterns to recommend the optimal path forward, turning self-improvement into a quantifiable, engaging journey.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="text-accent" size={24} />
                  <h3 className="text-2xl font-bold text-text-primary">The Problem</h3>
                </div>
                <p className="text-text-secondary leading-relaxed mb-4">
                  People set ambitious goals but fail to build the microscopic habits required to achieve them. Existing tools suffer from two major flaws:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-secondary shrink-0 mt-0.5" />
                    <span className="text-text-secondary"><strong>Passive Tracking:</strong> They act as dumb ledgers waiting for input, offering zero proactive guidance.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-secondary shrink-0 mt-0.5" />
                    <span className="text-text-secondary"><strong>Lack of Context:</strong> They don't understand why you missed a habit or how to adapt when you fall behind.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Architecture */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-border p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Server className="text-primary" size={24} />
              <h3 className="text-2xl font-bold text-text-primary">System Architecture</h3>
            </div>
            
            {/* Architecture Diagram Placeholder */}
            <div className="w-full h-64 bg-background border border-border rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
              <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="flex items-center gap-8 text-sm font-mono">
                  <div className="bg-surface px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" /> Next.js Frontend
                  </div>
                  <ArrowRight className="text-muted" />
                  <div className="bg-surface px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" /> FastAPI Gateway
                  </div>
                  <ArrowRight className="text-muted" />
                  <div className="bg-surface px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" /> PostgreSQL + pgvector
                  </div>
                </div>
                <div className="flex items-center gap-8 text-sm font-mono mt-4">
                  <ArrowRight className="text-muted rotate-90" />
                </div>
                <div className="bg-surface px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2 text-sm font-mono">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]" /> AI Reasoning Engine (LLM)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <h4 className="font-bold text-text-primary mb-2 text-sm">State Management</h4>
                <p className="text-xs text-text-secondary leading-relaxed">Centralized application state with optimistic UI updates for instant perceived performance on habit interactions.</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <h4 className="font-bold text-text-primary mb-2 text-sm">AI Integration</h4>
                <p className="text-xs text-text-secondary leading-relaxed">Asynchronous python workers handle expensive LLM inference to generate personalized insights without blocking the main API thread.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Status & Progress */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Current Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-border p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-accent" size={20} />
              <h3 className="text-xl font-bold text-text-primary">Current Progress</h3>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-text-primary">Phase 1: Foundation</span>
                  <span className="text-primary">100%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-primary rounded-full w-full" />
                </div>
                <p className="text-xs text-text-secondary mt-2">Auth, schema design, basic CRUD operations.</p>
              </div>

              <div className="relative">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-text-primary">Phase 2: Data Pipeline</span>
                  <span className="text-secondary">85%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-secondary rounded-full w-[85%]" />
                </div>
                <p className="text-xs text-text-secondary mt-2">Connecting user behavior to the analytics engine.</p>
              </div>

              <div className="relative">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-text-primary">Phase 3: AI Inference</span>
                  <span className="text-accent">30%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-accent rounded-full w-[30%]" />
                </div>
                <p className="text-xs text-text-secondary mt-2">Building the prompt chains and RAG pipeline for insights.</p>
              </div>
            </div>
          </motion.div>

          {/* Key Challenges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-surface border border-border p-6 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <GitPullRequest className="text-primary" size={20} />
              <h3 className="text-xl font-bold text-text-primary">Engineering Challenges</h3>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="text-sm font-bold text-text-primary mb-1">Cold Start Problem</h4>
                <p className="text-xs text-text-secondary leading-relaxed">How do we provide AI value on Day 1 before we have historical user data? Solved via an interactive onboarding quiz mapped to demographic baselines.</p>
              </div>
              <div className="border-l-2 border-secondary pl-4">
                <h4 className="text-sm font-bold text-text-primary mb-1">Cost Optimization</h4>
                <p className="text-xs text-text-secondary leading-relaxed">Running LLM inference on every user action is cost-prohibitive. Implemented a batched job system that runs insights during off-peak hours.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Future Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-background border border-border p-6 rounded-2xl"
          >
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Zap className="text-secondary" size={18} /> What's Next
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-text-secondary flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted" /> Agentic goal breakdown</li>
              <li className="text-sm text-text-secondary flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted" /> Social accountability loops</li>
              <li className="text-sm text-text-secondary flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted" /> Mobile application release</li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
