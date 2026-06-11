"use client";

import { motion } from "framer-motion";
import { Zap, Search, Bot, Network, Server, Code2 } from "lucide-react";

interface LearningItem {
  name: string;
  description: string;
  status: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "RAG Pipelines": <Search size={20} />,
  "Vector Databases": <Server size={20} />,
  "AI Agents": <Bot size={20} />,
  "Multi-Agent Systems": <Network size={20} />,
  "Local LLM Infrastructure": <Zap size={20} />,
  "FastAPI": <Code2 size={20} />,
};

export function CurrentLearningSection({ learningItems }: { learningItems: LearningItem[] }) {
  if (!learningItems || learningItems.length === 0) {
    return null;
  }

  return (
    <section id="learning" className="scroll-mt-24 py-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Current Learning</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <p className="text-text-secondary mb-12 max-w-xl">Technologies and concepts I am actively exploring and building with.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {learningItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="group bg-surface border border-border rounded-2xl p-6 hover:border-accent/40 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-background border border-border rounded-xl text-accent group-hover:text-primary transition-colors">
                {iconMap[item.name] || <Zap size={20} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                item.status === "active"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}>
                {item.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">{item.name}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
