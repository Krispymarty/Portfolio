import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import WorkspaceScene from "./WorkspaceScene";

const chapters = [
  { id: "intro", label: "Introduction" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const skillGroups = [
  ["TypeScript", "React", "WebGL"],
  ["Node.js", "PostgreSQL", "APIs"],
  ["Python", "Systems", "Cloud"],
];

function ChapterLabel({ index }: { index: number }) {
  return (
    <div className="chapter-label" aria-hidden="true">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <span className="chapter-label__line" />
      <span>{chapters[index].label}</span>
    </div>
  );
}

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [model, setModel] = useState<Group | null>(null);
  const [exportState, setExportState] = useState<"idle" | "working" | "error">("idle");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.chapter);
        if (Number.isFinite(next)) setActiveChapter(next);
      },
      { rootMargin: "-28% 0px -28% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const exportModel = useCallback(() => {
    if (!model || exportState === "working") return;
    setExportState("working");
    model.updateMatrixWorld(true);

    const exporter = new GLTFExporter();
    exporter.parse(
      model,
      (result) => {
        const isBinary = result instanceof ArrayBuffer;
        const output = isBinary ? result : JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: isBinary ? "model/gltf-binary" : "model/gltf+json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = isBinary ? "stackform-computational-studio.glb" : "stackform-computational-studio.gltf";
        anchor.click();
        URL.revokeObjectURL(url);
        setExportState("idle");
      },
      () => setExportState("error"),
      { binary: true, onlyVisible: true, trs: false, maxTextureSize: 1024 },
    );
  }, [exportState, model]);

  const registerSection = (index: number) => (node: HTMLElement | null) => {
    sectionRefs.current[index] = node;
  };

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="ambient-field" aria-hidden="true" />

      <div className="world-canvas" aria-label="Interactive 3D computational workspace">
        <WorkspaceScene chapter={activeChapter} reducedMotion={reducedMotion} onModelReady={setModel} />
      </div>

      <header className="topbar">
        <button className="topbar__mark" onClick={() => scrollTo("intro")} aria-label="Back to introduction">
          <span>SF</span>
          <i />
        </button>
        <nav className="topbar__nav" aria-label="Primary navigation">
          <button onClick={() => scrollTo("education")}>Journey</button>
          <button onClick={() => scrollTo("projects")}>Projects</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>
        <button className="model-export" onClick={exportModel} disabled={!model || exportState === "working"}>
          <Download size={14} strokeWidth={1.8} />
          <span>{exportState === "working" ? "Preparing" : exportState === "error" ? "Retry export" : "Export GLB"}</span>
        </button>
      </header>

      <aside className="chapter-rail" aria-label="Portfolio chapters">
        <span className="chapter-rail__count">{String(activeChapter + 1).padStart(2, "0")}</span>
        <div className="chapter-rail__track">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              className={index === activeChapter ? "is-active" : ""}
              onClick={() => scrollTo(chapter.id)}
              aria-label={`Go to ${chapter.label}`}
              aria-current={index === activeChapter ? "step" : undefined}
            />
          ))}
        </div>
        <span className="chapter-rail__count">06</span>
      </aside>

      <main>
        <section
          id="intro"
          ref={registerSection(0)}
          data-chapter="0"
          className="chapter hero-chapter"
          aria-labelledby="hero-title"
        >
          <motion.div
            className="hero-copy"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.75, 0.25, 1] }}
          >
            <p className="hero-kicker">Computational portfolio / 2026</p>
            <h1 id="hero-title" className="wordmark">
              STACK<span>FORM</span>
            </h1>
            <h2>A software engineer in formation.</h2>
            <p className="hero-summary">
              I turn computer-science foundations into useful, considered software. This living workspace maps the systems, experiments, and ideas behind the work.
            </p>
            <div className="hero-actions">
              <button className="primary-action" onClick={() => scrollTo("education")}>
                Explore the system
                <ArrowDown size={17} strokeWidth={1.7} />
              </button>
              <button className="text-action" onClick={exportModel} disabled={!model || exportState === "working"}>
                Download the 3D world
              </button>
            </div>
          </motion.div>
        </section>

        <section
          id="education"
          ref={registerSection(1)}
          data-chapter="1"
          className="chapter content-chapter"
          aria-labelledby="education-title"
        >
          <motion.div className="chapter-copy" initial="rest" whileInView="visible" viewport={{ amount: 0.45, once: false }}>
            <ChapterLabel index={1} />
            <motion.h2 id="education-title" variants={{ rest: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
              Learning becomes structure.
            </motion.h2>
            <motion.p variants={{ rest: { opacity: 0 }, visible: { opacity: 1 } }}>
              Computer science taught me to move from first principles to working systems: understand the model, test the edges, then make it clear.
            </motion.p>
            <div className="journey-line">
              <span>Foundations</span>
              <span>Systems thinking</span>
              <span>Applied engineering</span>
            </div>
          </motion.div>
        </section>

        <section
          id="skills"
          ref={registerSection(2)}
          data-chapter="2"
          className="chapter content-chapter"
          aria-labelledby="skills-title"
        >
          <motion.div className="chapter-copy" initial="rest" whileInView="visible" viewport={{ amount: 0.45, once: false }}>
            <ChapterLabel index={2} />
            <motion.h2 id="skills-title" variants={{ rest: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
              Connections, not collections.
            </motion.h2>
            <motion.p variants={{ rest: { opacity: 0 }, visible: { opacity: 1 } }}>
              My toolkit is a connected graph. Interfaces meet data, backend decisions shape user experience, and every layer is measured against the whole.
            </motion.p>
            <div className="skill-matrix" aria-label="Technical skills">
              {skillGroups.map((group, index) => (
                <div key={index}>
                  <span>0{index + 1}</span>
                  <p>{group.join(" / ")}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section
          id="projects"
          ref={registerSection(3)}
          data-chapter="3"
          className="chapter content-chapter"
          aria-labelledby="projects-title"
        >
          <motion.div className="chapter-copy project-copy" initial="rest" whileInView="visible" viewport={{ amount: 0.45, once: false }}>
            <ChapterLabel index={3} />
            <motion.h2 id="projects-title" variants={{ rest: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
              Ideas proven in code.
            </motion.h2>
            <motion.p variants={{ rest: { opacity: 0 }, visible: { opacity: 1 } }}>
              Selected builds focus on useful complexity: real-time interfaces, dependable services, and visual systems that make difficult information feel legible.
            </motion.p>
            <div className="project-index">
              <button>
                <span>01</span>
                <strong>Signal Atlas</strong>
                <em>Realtime systems map</em>
                <ArrowUpRight size={18} />
              </button>
              <button>
                <span>02</span>
                <strong>Fieldnote</strong>
                <em>Research knowledge tool</em>
                <ArrowUpRight size={18} />
              </button>
              <button>
                <span>03</span>
                <strong>Queue Lab</strong>
                <em>Distributed job simulator</em>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </motion.div>
        </section>

        <section
          id="experience"
          ref={registerSection(4)}
          data-chapter="4"
          className="chapter content-chapter"
          aria-labelledby="experience-title"
        >
          <motion.div className="chapter-copy" initial="rest" whileInView="visible" viewport={{ amount: 0.45, once: false }}>
            <ChapterLabel index={4} />
            <motion.h2 id="experience-title" variants={{ rest: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
              Capability compounds.
            </motion.h2>
            <motion.p variants={{ rest: { opacity: 0 }, visible: { opacity: 1 } }}>
              Each role adds a module: stronger collaboration, cleaner delivery, deeper technical judgment, and more confidence operating beyond the brief.
            </motion.p>
            <div className="experience-lines">
              <div><time>Now</time><span>Building full-stack products and interactive systems</span></div>
              <div><time>2025</time><span>Engineering practice through team-based delivery</span></div>
              <div><time>2024</time><span>Core CS, algorithms, data, and software design</span></div>
            </div>
          </motion.div>
        </section>

        <section
          id="contact"
          ref={registerSection(5)}
          data-chapter="5"
          className="chapter contact-chapter"
          aria-labelledby="contact-title"
        >
          <motion.div
            className="contact-copy"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5, once: true }}
          >
            <ChapterLabel index={5} />
            <h2 id="contact-title">Build the next layer.</h2>
            <p>I am open to software engineering internships, thoughtful collaborations, and ambitious technical ideas.</p>
            <a className="primary-action" href="mailto:hello@stackform.dev">
              <Mail size={17} strokeWidth={1.7} />
              hello@stackform.dev
            </a>
            <div className="contact-footer">
              <span>Designed as a continuous computational world.</span>
              <button onClick={exportModel} disabled={!model || exportState === "working"}>Export scene as GLB</button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}