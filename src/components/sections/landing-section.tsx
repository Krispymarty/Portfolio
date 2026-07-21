"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LandingSection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 glow-ambient opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full glow-cyan opacity-40 blur-xl"></div>
          <Image 
            src="/profile.jpg" 
            alt="Yashmit Singh" 
            width={96} 
            height={96} 
            className="relative rounded-full border border-border/50 shadow-2xl z-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/50 border border-border rounded-full text-xs font-semibold text-text-secondary tracking-widest uppercase mb-8 backdrop-blur-sm">
            Yashmit Singh
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-text-secondary mb-8 leading-[1.15]"
        >
          Building AI systems that turn intention into action.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mb-12"
        >
          From training complex machine learning models to architecting real-world products. 
          Currently exploring the intersection of autonomous agents, automation, and human behavior through my flagship product, LifeXP.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#lifexp"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            View Current Build <ArrowRight size={16} />
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface/80 text-text-primary border border-border font-medium rounded-lg hover:bg-surface hover:border-text-secondary/30 transition-all backdrop-blur-sm"
          >
            <FileText size={16} /> Read Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
