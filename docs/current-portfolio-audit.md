# Current Portfolio Audit

Audit date: 2026-07-17

## Repository state

- Branch: `master`, tracking `origin/master`.
- Existing user work is uncommitted in `command-palette.tsx`, `navbar.tsx`, `contact-section.tsx`, and `landing-section.tsx`. Those edits fix résumé links and remove the theme toggle; they must be preserved.
- `.codex/` and `.cursor/` are untracked and treated as user/tool configuration.
- Recent history shows multiple June 2026 redesigns, including “Builder's OS” and a Groq migration.

## Framework and delivery

- Next.js 16.2.9 App Router with React 19.2.4 and TypeScript 5.
- npm with `package-lock.json`.
- Tailwind CSS 4 through PostCSS.
- Framer Motion 12 for nearly every section reveal.
- `cmdk`, Lucide, React Icons, `next-themes`, Groq SDK, and an unused Google Generative AI dependency.
- One page route (`/`) and one API route (`/api/chat`).
- Vercel-compatible configuration exists, but deployment, canonical URL, environment setup, and production operations are undocumented.

## Current content and visual identity

The site presents Yashmit as an AI engineer/product builder. It includes LifeXP, fraud detection, weapon detection, a disaster-relief app, an engineering log, current-learning topics, live GitHub repositories, an AI assistant, and contact links.

The visual identity is black and zinc with white type, violet/cyan radial glow, Geist, bordered dark cards, pill labels, monospace tech tags, and repeated fade/slide reveals. It is readable but resembles a common “developer OS” template and conflicts with the requested avoidance of purple-blue glow, repeated cards, gradient headings, and decorative dashboards.

## Useful assets and reusable work

- `public/profile.jpg`: clear formal portrait, 79.6 KB.
- `public/resume.pdf`: two-page A4 résumé, 25.9 KB, last updated 2026-05-13.
- Structured project/learning/build-log data under `src/data/`.
- Server-side GitHub fetch helpers with one-hour revalidation.
- Existing contact and social URLs.
- Existing résumé-link fixes in the dirty working tree.

## Content risks

- The résumé corroborates fraud detection, weapon detection, NGO leadership, education, student representation, and skills.
- LifeXP, disaster relief, several architecture claims, progress percentages, and some “implemented” build-log details exist only in website data and require owner review before being treated as résumé-grade proof.
- Every featured project currently links to the GitHub profile rather than a project repository.
- No project screenshots, live demos, certifications, testimonials, or case-study artifacts are present.
- `learning-journey-section.tsx` contains dates and leadership claims but is not rendered.
- Footer social links are generic placeholders and the footer is not rendered.

## Functional and accessibility findings

- No skip-to-content link.
- The AI input has no programmatic label; its send icon button has no accessible name.
- Project GitHub icon links have no accessible names.
- The command palette lacks an explicit dialog/modal semantic and focus-return handling.
- Mobile navigation has no chapter menu; only the name remains visible.
- Several touch targets are below 44px.
- No global reduced-motion treatment exists despite extensive Framer Motion usage.
- The visual architecture diagram is cramped and risks overflow at narrow widths.
- The page has no error/loading UI for GitHub data; the section simply disappears.

## Performance and engineering risks

- Most sections are Client Components even when their content is static, increasing hydration cost.
- Framer Motion is imported across the full narrative and the page is approximately 13,900px tall at 390px wide.
- GitHub fetching on the page makes the otherwise static route dependent on a third-party API.
- The AI assistant adds product complexity and an API key requirement without strengthening the primary proof journey.
- The external transparent-texture URL is a runtime dependency with no documented licence.
- `@google/generative-ai` appears unused.
- `any` types in GitHub components bypass strict typing.
- Current metadata is limited to title and description; no canonical, OG image, robots, sitemap, or structured data exists.

## Baseline visual review

Desktop is legible with a centered hero but relies on generic glow and a large gradient heading. On mobile the hero consumes more than one viewport before actions, navigation disappears, typography remains oversized, and the page becomes substantially longer. Content does not overflow horizontally in the observed 390px viewport, but hierarchy and touch density need redesign.
