# Implementation Plan

## Sitemap

- `/`: complete six-chapter portfolio narrative.
- `/resume.pdf`: existing résumé.
- `/robots.txt` and `/sitemap.xml`: generated through Next.js metadata file conventions.
- `/opengraph-image`: generated static social image route.

## Narrative flow

1. Arrival states the role and opportunity fit within seconds.
2. Journey explains the move from foundations to explainable ML and product systems.
3. Capabilities connect technologies to demonstrated project evidence.
4. Selected work gives fraud detection and weapon detection the strongest proof, with LifeXP visibly marked as an active build.
5. Experience and education establish the student context, leadership, and academic timeline.
6. Contact resolves the Decision Core into an open signal and presents email, résumé, LinkedIn, and GitHub actions.

## Component architecture

- Keep `app/page.tsx` as a Server Component.
- Put all personal data/types in `src/data/portfolio.ts`.
- Render semantic static sections as Server Components.
- Use one small `PortfolioExperience` Client Component for chapter progress, project selection, and Decision Core state.
- Keep navigation usable with plain anchors when client code fails.

## Content model

`profile`, `socials`, `journey`, `capabilityGroups`, `projects`, `experience`, `education`, and `achievements`. Project records distinguish `verified`, `portfolio-source`, and `in-progress` provenance.

## Motion architecture

- CSS custom properties drive the Decision Core transform.
- IntersectionObserver updates the active chapter without hiding content.
- Pointer motion is coarse-device aware and throttled through animation frames.
- `prefers-reduced-motion` removes rotation, travel, smooth scroll, and parallax.
- Page visibility pauses ambient motion.

## 3D architecture

- CSS `perspective` and `transform-style: preserve-3d` create five thin system layers.
- No WebGL library, model download, shader, or continuous canvas render loop.
- A 2D stacked-diagram fallback appears when 3D transforms are unsupported; reduced motion freezes a meaningful front-facing state.

## Asset list

- Reuse `public/profile.jpg` through static `next/image` import.
- Reuse `public/resume.pdf` unchanged.
- Generate diagrams and project visuals from semantic HTML/CSS; no external imagery or Spline licence required.
- Generate the OG image in-repository.

## Performance budget

- Initial route JS target: under 150 KB compressed where realistic.
- No new runtime dependency for 3D or scrolling.
- One optimized portrait above the fold.
- No render loop when the Decision Core is outside the viewport or the page is hidden.
- GitHub activity must not block the core page and may be reduced to a direct profile link.

## Accessibility strategy

- Semantic landmarks and one H1.
- Skip link and visible focus.
- 44px interactive targets.
- No unlabeled icon controls.
- Native buttons/links and `aria-current` for chapter state.
- Content-first DOM order matches visual order.
- Reduced-motion and 2D spatial fallback.
- Contrast verified against WCAG 2.2 AA targets.

## Milestones

1. Add design tokens, fonts, content model, metadata, and layout primitives.
2. Build Arrival and Journey; verify desktop/mobile.
3. Build Capabilities and Selected Work; verify keyboard/project selection.
4. Build Experience, Education, and Contact; verify reading order and actions.
5. Add Decision Core state/motion and fallbacks.
6. Run lint, type/build, browser console, responsive, reduced-motion, and detector audits.
7. Complete README, credits, and final audit report.
