# Portfolio agent instructions

## Purpose and audience

This repository is Yashmit Singh's professional portfolio for recruiters, engineering leads, internship reviewers, and technical collaborators. It must communicate within five seconds that Yashmit is a Computer Science (Data Science) student building explainable AI and product systems. Projects, the resume, GitHub, LinkedIn, email, education, and experience must remain directly accessible without completing the immersive narrative.

## Source-of-truth constraints

- Treat src/data/portfolio.ts, public/resume.pdf, and verified repository content as factual sources.
- Do not invent employers, clients, metrics, users, awards, certifications, repositories, live links, technologies, or outcomes.
- Label resume-backed, portfolio-sourced, planned, and in-progress claims distinctly.
- Preserve personal assets, deployment configuration, structured data, and the procedural low-poly workstation.
- Put editable portfolio copy and project facts in structured data rather than scattering them across components.

## Design principles

- Follow design.md as the visual source of truth.
- The brand is a quiet computational studio: deep graphite, warm off-white, restrained cyan for learning/systems, and restrained orange for projects/output.
- The low-poly workstation is a narrative instrument, not a background demo. It may support content but must never obscure navigation or evidence.
- Prefer asymmetric chapter compositions, real evidence, and distinct project behaviors over identical card grids.
- Avoid generic AI-portfolio patterns: purple-blue glow, gradient text, excessive pills, glass-card grids, terminal cosplay, decorative particles without meaning, huge clipped headings, and repeated numbered eyebrows.

## Interaction and animation

- Reserve signature motion for initialization, major chapter changes, project switching, and contact resolution.
- Keep moments of stillness. Do not animate every object continuously.
- Use transform, opacity, material state, and camera framing; avoid layout-property animation.
- All animation requires a reduced-motion replacement. Reduced motion must expose content immediately and use a static workstation state or fallback.
- Scroll, visibility, media-query, and WebGL listeners must be cleaned up. Pause rendering when the document is hidden or the scene is not contributing.

## Accessibility

- Target WCAG 2.2 AA where practical.
- Preserve semantic landmarks, one H1, logical heading order, a skip link, visible focus, meaningful names, 44px touch targets, readable line lengths, sufficient contrast, and keyboard access.
- No meaningful information may exist only in WebGL, hover, color, or motion.
- Project details and workstation state must have adjacent accessible HTML equivalents.

## Engineering and performance

- This project uses Next.js 16. Read the relevant guide in node_modules/next/dist/docs before changing framework APIs or conventions.
- Keep the page a Server Component and isolate browser state/WebGL in focused Client Components.
- Use dynamic imports for the 3D scene, adaptive DPR/shadows, responsive images, and event-driven or visibility-aware rendering.
- Maintain high, balanced, and lightweight scene tiers. Mobile and low-power devices must not receive desktop-grade shadows or DPR.
- Avoid duplicate animation libraries, stale listeners, memory leaks, secrets, unused large dependencies, and unbounded render work.

## Verification

After making visual or interaction changes, start the application, inspect the live website in a browser at multiple viewport sizes, identify defects, and fix them before considering the task complete.

Required checks:

- Test 360x800, 390x844, 768x1024, 1024x768, 1366x768, 1440x900, and 1920x1080.
- Exercise navigation, project switching, skill filters, keyboard operation, the 3D scene, reduced motion, and the WebGL fallback.
- Review the browser console and check overflow, clipping, camera framing, touch targets, layout jumps, and loading states.
- Run npm run lint, npx tsc --noEmit, the available tests, the Impeccable detector/audit, npm audit, and npm run build.
- Self-verify the live result. Do not assume source changes are visually or behaviorally correct.