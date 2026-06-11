"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Contact</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <p className="text-text-secondary mb-12 max-w-xl">Let&apos;s build something together.</p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
      >
        <Link
          href="mailto:20yashmitsingh@gmail.com"
          className="flex flex-col items-center p-8 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-all group"
        >
          <div className="w-11 h-11 bg-background border border-border rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Mail size={18} className="text-primary" />
          </div>
          <span className="font-semibold text-text-primary text-sm mb-1">Email</span>
          <span className="text-xs text-text-secondary text-center break-all">20yashmitsingh@gmail.com</span>
        </Link>

        <Link
          href="https://github.com/Krispymarty"
          target="_blank"
          className="flex flex-col items-center p-8 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-all group"
        >
          <div className="w-11 h-11 bg-background border border-border rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FaGithub size={18} className="text-primary" />
          </div>
          <span className="font-semibold text-text-primary text-sm mb-1">GitHub</span>
          <span className="text-xs text-text-secondary">Krispymarty</span>
        </Link>

        <Link
          href="https://www.linkedin.com/in/yashmit-singh-a04551312"
          target="_blank"
          className="flex flex-col items-center p-8 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-all group"
        >
          <div className="w-11 h-11 bg-background border border-border rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FaLinkedin size={18} className="text-primary" />
          </div>
          <span className="font-semibold text-text-primary text-sm mb-1">LinkedIn</span>
          <span className="text-xs text-text-secondary">Yashmit Singh</span>
        </Link>
      </motion.div>
    </section>
  );
}
