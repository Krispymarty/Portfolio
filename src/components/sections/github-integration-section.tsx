"use client";

import { motion } from "framer-motion";
import { GitCommit, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function GitHubIntegrationSection({ user, repos }: { user: any; repos: any[] }) {
  if (!user || !repos || repos.length === 0) {
    return null;
  }

  // Sort repos by pushed_at date descending
  const recentRepos = [...repos].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()).slice(0, 4);

  return (
    <section id="github" className="scroll-mt-24 py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">Currently Building</h2>
            <p className="text-lg text-text-secondary max-w-xl">
              Live engineering activity. I believe in learning and building in public.
            </p>
          </div>
          
          <Link
            href={user.html_url}
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-zinc-900 transition-colors"
          >
            <FaGithub size={16} /> View Profile
          </Link>
        </div>

        <div className="space-y-6">
          {recentRepos.map((repo: any, index: number) => {
            const pushDate = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently";
            
            return (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-surface/50 border border-border rounded-xl hover:bg-surface hover:border-text-secondary/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Activity className="text-primary/70 group-hover:text-primary transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-text-primary text-lg">{repo.name}</span>
                        {repo.language && (
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-text-secondary font-mono">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-1 max-w-xl">{repo.description || "Active development repository"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:ml-4 shrink-0 border-t sm:border-t-0 border-border/50 pt-4 sm:pt-0">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <GitCommit size={14} /> Pushed {pushDate}
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-border group-hover:bg-primary group-hover:border-primary transition-colors">
                      <ArrowRight size={14} className="text-text-secondary group-hover:text-background transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
