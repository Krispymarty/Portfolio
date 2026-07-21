"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contact" className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 glow-ambient opacity-50" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            Let&apos;s Build Something Meaningful.
          </h2>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-16 leading-relaxed">
            I&apos;m always interested in AI products, startup ideas, engineering discussions, hackathons, internships, and collaborations. If you are building something ambitious, I want to hear about it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
        >
          <Link
            href="mailto:20yashmitsingh@gmail.com"
            className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] text-lg"
          >
            <Mail size={20} /> Email Me
          </Link>
          
          <Link
            href="https://www.linkedin.com/in/yashmit-singh-a04551312"
            target="_blank"
            className="flex items-center gap-3 px-8 py-4 bg-surface border border-border text-text-primary font-bold rounded-xl hover:bg-surface/80 hover:border-text-secondary/50 transition-all text-lg backdrop-blur-md"
          >
            <FaLinkedin size={20} className="text-[#0077b5]" /> LinkedIn
          </Link>
          
          <Link
            href="https://github.com/Krispymarty"
            target="_blank"
            className="flex items-center gap-3 px-8 py-4 bg-surface border border-border text-text-primary font-bold rounded-xl hover:bg-surface/80 hover:border-text-secondary/50 transition-all text-lg backdrop-blur-md"
          >
            <FaGithub size={20} /> GitHub
          </Link>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-surface border border-border text-text-primary font-bold rounded-xl hover:bg-surface/80 hover:border-text-secondary/50 transition-all text-lg backdrop-blur-md"
          >
            <FileText size={20} className="text-accent" /> Resume <ArrowRight size={16} className="ml-1 opacity-50" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
