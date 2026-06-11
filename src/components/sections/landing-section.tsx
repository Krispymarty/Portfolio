"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

interface BuildStatus {
  projectName: string;
  status: string;
  currentFocus: string[];
  nextMilestone: string;
}

export function LandingSection({ user, repos, buildStatus }: { user: any; repos: any[]; buildStatus: BuildStatus }) {
  const latestRepo = repos?.[0];
  const latestPush = latestRepo?.pushed_at ? new Date(latestRepo.pushed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left — Current Build */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Current Build
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary mb-4 leading-[1.1]">
            {buildStatus.projectName || "Building"}
          </h1>

          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 max-w-lg">
            An AI-powered personal growth platform designed to help users transform goals into consistent habits.
          </p>

          {buildStatus.status && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Status:</span>
              <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
                {buildStatus.status}
              </span>
            </div>
          )}

          {buildStatus.currentFocus && buildStatus.currentFocus.length > 0 && (
            <div className="mb-10">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-3">Current Focus:</span>
              <div className="flex flex-wrap gap-2">
                {buildStatus.currentFocus.map((focus, i) => (
                  <span key={i} className="text-sm px-3 py-1.5 bg-surface border border-border rounded-lg text-text-primary font-medium">
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(79,124,255,0.25)] hover:shadow-[0_0_30px_rgba(79,124,255,0.4)]"
            >
              View LifeXP <ArrowRight size={16} />
            </Link>
            <Link
              href="#build-log"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text-primary border border-border font-medium rounded-lg hover:border-primary/50 transition-colors"
            >
              View Build Log
            </Link>
            <Link
              href={user?.html_url || "https://github.com/Krispymarty"}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text-primary border border-border font-medium rounded-lg hover:border-primary/50 transition-colors"
            >
              <FaGithub size={16} /> GitHub
            </Link>
            <Link
              href="/resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text-primary border border-border font-medium rounded-lg hover:border-primary/50 transition-colors"
            >
              Resume
            </Link>
          </div>
        </motion.div>

        {/* Right — Mission Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative w-full"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 blur-2xl opacity-60" />

          <div className="relative bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header bar */}
            <div className="bg-background/60 border-b border-border px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-accent" />
                <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">Mission Control</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Current Build */}
              <div className="bg-background border border-border rounded-xl p-4">
                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Current Build</div>
                <div className="text-lg font-bold text-text-primary">{buildStatus.projectName || "—"}</div>
                <div className="text-sm text-text-secondary mt-1">Next: {buildStatus.nextMilestone || "N/A"}</div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{user?.public_repos ?? "—"}</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Repositories</div>
                </div>
                <div className="bg-background border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">4</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Active Projects</div>
                </div>
              </div>

              {/* Latest Activity */}
              <div className="bg-background border border-border rounded-xl p-4">
                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Latest GitHub Activity</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-primary">{latestRepo?.name || "—"}</div>
                    <div className="text-xs text-text-secondary mt-0.5">pushed {latestPush}</div>
                  </div>
                  <FaGithub size={16} className="text-text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
