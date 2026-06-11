"use client";

import { motion } from "framer-motion";
import { FolderGit2, GitCommit, Activity, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function GitHubIntegrationSection({ user, repos }: { user: any; repos: any[] }) {
  if (!user || !repos || repos.length === 0) {
    return (
      <section id="github" className="scroll-mt-24 py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">GitHub Activity</h2>
          <div className="h-px bg-border flex-1" />
        </div>
        <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-secondary">
          <FaGithub size={32} className="mx-auto mb-4 text-border" />
          <p className="text-lg">Unable to load GitHub data.</p>
        </div>
      </section>
    );
  }

  const totalRepos = user.public_repos || 0;
  const featuredRepos = repos.slice(0, 5);
  const latestRepo = repos[0];
  const latestPush = latestRepo?.pushed_at
    ? new Date(latestRepo.pushed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

  return (
    <section id="github" className="scroll-mt-24 py-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">GitHub Activity</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <p className="text-text-secondary mb-12 max-w-xl">Live data from GitHub. No vanity metrics — just what is being built.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <FolderGit2 className="text-primary mb-4" size={22} />
            <div className="text-4xl font-bold text-text-primary mb-1">{totalRepos}</div>
            <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Public Repositories</div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <Activity className="text-accent mb-4" size={22} />
            <div className="text-sm font-semibold text-text-primary mb-1">Latest push to {latestRepo?.name || "—"}</div>
            <div className="text-xs text-text-secondary">{latestPush}</div>
          </div>
          <Link
            href={user.html_url}
            target="_blank"
            className="flex items-center justify-between bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <FaGithub size={20} className="text-text-primary" />
              <span className="font-semibold text-text-primary">View Profile</span>
            </div>
            <ArrowRight size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
          </Link>
        </div>

        {/* Repos Column */}
        <div className="lg:col-span-8">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Featured Repositories</h4>
            </div>
            <div className="divide-y divide-border">
              {featuredRepos.map((repo: any) => (
                <Link
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  className="flex items-center justify-between px-6 py-4 hover:bg-background/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-primary group-hover:text-accent transition-colors text-sm">{repo.name}</span>
                      {repo.language && (
                        <span className="text-[10px] px-2 py-0.5 bg-background border border-border rounded-md text-text-secondary font-mono">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary truncate max-w-md">{repo.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-secondary ml-4 shrink-0">
                    <Star size={12} /> {repo.stargazers_count}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
