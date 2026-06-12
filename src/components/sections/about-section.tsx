"use client";

import { motion } from "framer-motion";
import { Terminal, BrainCircuit, Rocket, Compass, GraduationCap, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-16 md:py-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">The Journey</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg prose-invert max-w-none text-text-secondary"
          >
            <p className="text-xl text-text-primary font-medium leading-relaxed mb-6">
              My path into engineering wasn't a straight line. It started with a simple curiosity: how do complex systems actually work? That question led me to write my first scripts, break my first environments, and eventually build tools that solve real problems.
            </p>
            
            <p className="leading-relaxed">
              I began my journey deep in the trenches of <strong>Machine Learning</strong>. I spent months training models, fighting class imbalances in fraud detection datasets, and building real-time weapon detection systems using YOLO. While the mathematics and accuracy metrics were fascinating, I realized something critical: a highly accurate model is useless if it's not wrapped in a product that people can actually use.
            </p>
            
            <p className="leading-relaxed">
              That realization shifted my entire focus from <em>training models</em> to <em>building products</em>. I moved up the stack, learning Next.js, FastAPI, and robust database architectures. I started thinking about user experience, deployment pipelines, and scalable system design. I stopped calling myself an "ML researcher" and started operating as an engineer who builds.
            </p>
            
            <p className="leading-relaxed">
              Today, I'm deeply interested in <strong>AI Systems and Agentic Workflows</strong>. We're moving past the era of simple chat interfaces into a world where autonomous systems can execute complex, multi-step reasoning. My goal is to be at the forefront of this shift—building infrastructure and applications that harness LLMs as reasoning engines rather than just text generators.
            </p>
            
            <p className="leading-relaxed">
              Looking ahead, my aspirations go beyond just writing code. I am actively building towards becoming a founder. Everything I build, from my current focus on <strong>LifeXP</strong> to my weekend architectural experiments, is a stepping stone toward launching and scaling an AI product company.
            </p>
          </motion.div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface border border-border rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Core Philosophy</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary h-fit">
                  <Terminal size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">Build to Solve</h4>
                  <p className="text-sm text-text-secondary">Technology is a tool, not the goal. The focus should always be on the problem being solved.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1 bg-secondary/10 p-2 rounded-lg text-secondary h-fit">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">Systems Thinking</h4>
                  <p className="text-sm text-text-secondary">AI features must be deeply integrated into the core architecture, not bolted on as an afterthought.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1 bg-accent/10 p-2 rounded-lg text-accent h-fit">
                  <Rocket size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">Speed of Execution</h4>
                  <p className="text-sm text-text-secondary">Ship fast, gather feedback, and iterate. Momentum is the most valuable asset for a builder.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-surface border border-border rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Background</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary h-fit">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">UPES, Dehradun</h4>
                  <p className="text-sm font-medium text-text-secondary mb-1">B.Tech Computer Science (Data Science)</p>
                  <p className="text-xs text-text-secondary">2024 - 2028</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1 bg-accent/10 p-2 rounded-lg text-accent h-fit">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1">Intern Group Leader</h4>
                  <p className="text-sm font-medium text-text-secondary mb-1">Stranger Friends Helping Hands Society</p>
                  <p className="text-xs text-text-secondary">Led a 10-member team executing community welfare and education programs.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
