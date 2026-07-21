export type ContentProvenance = "resume-verified" | "portfolio-source" | "in-progress";

export type Project = {
  id: string;
  name: string;
  kind: string;
  period: string;
  provenance: ContentProvenance;
  summary: string;
  problem: string;
  contribution: string;
  decision: string;
  challenge: string;
  outcome: string;
  metrics: Array<{ value: string; label: string }>;
  stack: string[];
  repository?: string;
  live?: string;
};

export const portfolio = {
  profile: {
    name: "Yashmit Singh",
    shortName: "Yashmit",
    role: "Computer Science student building explainable AI systems",
    headline: "From model accuracy to useful decisions.",
    introduction:
      "I work across machine learning, explainability, APIs, and product engineering—turning technical models into systems people can understand and use.",
    location: "Dehradun, India",
    availability: "Open to internships and engineering collaborations",
    email: "20yashmitsingh@gmail.com",
    resume: "/resume.pdf",
    github: "https://github.com/Krispymarty",
    linkedin: "https://www.linkedin.com/in/yashmit-singh-a04551312",
  },
  journey: [
    {
      period: "2024",
      title: "Started the computer-science foundation",
      text: "Began a B.Tech in Computer Science (Data Science) at UPES, building fluency in programming, algorithms, data analysis, and model fundamentals.",
      signal: "Foundations",
      provenance: "resume-verified" as ContentProvenance,
    },
    {
      period: "Jun—Jul 2025",
      title: "Learned to lead beyond the code",
      text: "Led a 10-member intern team at Stranger Friends Helping Hands Society, coordinating education-focused community work and resource allocation.",
      signal: "Leadership",
      provenance: "resume-verified" as ContentProvenance,
    },
    {
      period: "Jan—Apr 2026",
      title: "Made model behaviour measurable",
      text: "Built fraud and weapon-detection systems, focusing on class imbalance, explainability, low-latency inference, and real-world reliability.",
      signal: "Decision intelligence",
      provenance: "resume-verified" as ContentProvenance,
    },
    {
      period: "Now",
      title: "Moving from models into products",
      text: "Exploring AI agents, retrieval systems, local models, and the product architecture needed to make intelligent systems genuinely useful.",
      signal: "Product systems",
      provenance: "portfolio-source" as ContentProvenance,
    },
  ],
  capabilityGroups: [
    {
      label: "Model systems",
      description: "Train, evaluate, and explain models under real constraints.",
      skills: ["Python", "XGBoost", "YOLOv8", "Scikit-learn", "SHAP", "PyTorch"],
      evidence: ["fraud-detection", "weapon-detection"],
    },
    {
      label: "Data & inference",
      description: "Move data through repeatable analysis and low-latency inference paths.",
      skills: ["Pandas", "NumPy", "OpenCV", "SQL", "FastAPI", "REST APIs"],
      evidence: ["fraud-detection", "weapon-detection"],
    },
    {
      label: "Product engineering",
      description: "Connect interfaces, APIs, state, and storage around an intelligent core.",
      skills: ["TypeScript", "Next.js", "JavaScript", "HTML/CSS", "PostgreSQL", "Docker"],
      evidence: ["lifexp"],
    },
    {
      label: "Current exploration",
      description: "Active learning—not presented as finished expertise.",
      skills: ["RAG systems", "AI agents", "Vector databases", "Local LLMs"],
      evidence: ["lifexp"],
    },
  ],
  projects: [
    {
      id: "fraud-detection",
      name: "Fraud Detection Framework",
      kind: "Decision intelligence · Explainable AI",
      period: "Jan—Mar 2026",
      provenance: "resume-verified",
      summary:
        "An explainable fraud-risk pipeline designed around the cost of a wrong decision—not accuracy alone.",
      problem:
        "Fraud data is extremely imbalanced, and opaque predictions are difficult to trust in high-stakes financial review.",
      contribution:
        "Architected an XGBoost pipeline, added cost-sensitive evaluation, exposed inference through FastAPI, and used SHAP to explain risk signals.",
      decision:
        "Optimized for precision-recall and decision cost instead of headline accuracy, then added a three-tier justification fallback described in the résumé.",
      challenge:
        "Only 0.17% of transactions were fraudulent, so sampling and thresholds had to improve recall without flooding reviewers with false positives.",
      outcome:
        "The final evaluation reached 0.833 PR-AUC and 90.9% precision while reducing false positives from 18 to 11 in the recorded test comparison.",
      metrics: [
        { value: "0.833", label: "PR-AUC" },
        { value: "90.9%", label: "precision" },
        { value: "−38.9%", label: "false positives" },
      ],
      stack: ["Python", "XGBoost", "FastAPI", "SHAP", "Llama 3", "Mixtral"],
      repository: "https://github.com/Krispymarty",
    },
    {
      id: "weapon-detection",
      name: "Weapon Detection System",
      kind: "Computer vision · Real-time inference",
      period: "Jan—Apr 2026",
      provenance: "resume-verified",
      summary:
        "A custom YOLOv8 detection pipeline tuned for continuous, low-latency threat monitoring across changing conditions.",
      problem:
        "Continuous monitoring demands reliable detection across lighting, camera angles, and visually similar objects without overwhelming operators.",
      contribution:
        "Trained a custom YOLOv8 model on an RTX 4060, built the inference path, and introduced dynamic confidence thresholds for higher-risk conditions.",
      decision:
        "Treated data quality, augmentation, and threshold behaviour as first-class engineering decisions rather than relying on architecture changes alone.",
      challenge:
        "Balancing recall against false positives under varied environmental conditions while keeping inference suitable for live feeds.",
      outcome:
        "Recorded 91.5% mAP@0.5, 87.3% precision, and 88.0% recall in the project evaluation reported on the résumé.",
      metrics: [
        { value: "91.5%", label: "mAP@0.5" },
        { value: "87.3%", label: "precision" },
        { value: "88.0%", label: "recall" },
      ],
      stack: ["Python", "YOLOv8", "OpenCV", "PyTorch"],
      repository: "https://github.com/Krispymarty",
    },
    {
      id: "lifexp",
      name: "LifeXP",
      kind: "Active build · AI product systems",
      period: "In progress",
      provenance: "in-progress",
      summary:
        "An AI-assisted personal-growth concept exploring how goals can become smaller, trackable actions and adaptive recommendations.",
      problem:
        "Goal trackers record behaviour but rarely help users understand how to adjust when consistency breaks down.",
      contribution:
        "The current portfolio documents work around authentication, progress tracking, a Next.js/FastAPI split, and an AI recommendation milestone.",
      decision:
        "Keep behavioural tracking and analytics explicit before adding recommendation complexity; label planned AI work as planned.",
      challenge:
        "Creating useful first-session guidance before enough behavioural history exists to support personalization.",
      outcome:
        "This is presented as an active build, not a finished product. Repository-specific proof, screenshots, and a public demo are still needed.",
      metrics: [],
      stack: ["Next.js", "FastAPI", "PostgreSQL", "Python", "AI integration"],
    },
  ] satisfies Project[],
  education: [
    {
      qualification: "B.Tech, Computer Science (Data Science)",
      institution: "University of Petroleum and Energy Studies (UPES), Dehradun",
      period: "2024—2028 · pursuing",
      detail: "CGPA 7.74 through semester 3, as listed on the May 2026 résumé.",
    },
  ],
  experience: [
    {
      role: "Intern Group Leader",
      organisation: "Stranger Friends Helping Hands Society",
      period: "Jun—Jul 2025",
      detail:
        "Led a 10-member team delivering community-welfare and project-based education work; coordinated mentorship and resource allocation.",
    },
  ],
  achievements: [
    "Student representative for 90+ peers",
    "Hands-on local LLM deployment with Ollama and Docker",
    "Fraud and computer-vision projects with recorded evaluation results",
  ],
} as const;

export const projectNameById = Object.fromEntries(
  portfolio.projects.map((project) => [project.id, project.name]),
) as Record<string, string>;
