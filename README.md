# Yashmit Singh - Portfolio

An evidence-led portfolio for Yashmit Singh, focused on explainable AI, machine-learning systems, and product engineering. The site is built as a six-chapter narrative: identity, journey, capabilities, selected work, experience, and contact.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Environment variables

Define these in your local environment or deployment provider:

- `NEXT_PUBLIC_SITE_URL` - canonical production origin, for example `https://example.com`. Used by the sitemap and metadata. Local fallback: `http://localhost:3000`.
- `GROQ_API_KEY` - only required by the retained legacy `/api/chat` route. The redesigned public page does not call it.

Never commit API keys. The OriginKit MCP registration is global Codex configuration and is not a runtime dependency of this site.

## Content and project data

Edit `src/data/portfolio.ts` to update biography, skills, metrics, projects, experience, education, and contact links. Each material claim includes a provenance label:

- `resume-verified` - supported by the supplied resume
- `portfolio-source` - retained from the previous site and clearly scoped
- `in-progress` - explicitly presented as current exploration

Project visuals in `src/components/project-visuals.tsx` are explanatory diagrams, not screenshots. Replace a diagram only with a real product screenshot or another clearly labelled system visualization. Add project-specific repository and live-demo URLs to `src/data/portfolio.ts` when available; current links intentionally point to the verified GitHub profile rather than inventing repository URLs.

## Visual system and motion

- Global design tokens, layout, responsive rules, and motion fallbacks: `src/app/globals.css`
- Interactive layered decision model: `src/components/decision-core.tsx`
- Persistent signal rail and chapter orchestration: `src/components/narrative-signal.tsx`
- Procedural Three.js signal scene: `src/components/signal-scene.tsx`
- Project, capability, and journey instruments: `src/components/project-lab.tsx`, `src/components/capability-map.tsx`, and `src/components/journey-sequence.tsx`
- Page composition and structured data: `src/app/page.tsx`
- Metadata and social image: `src/app/layout.tsx` and `src/app/opengraph-image.tsx`

The Signal Scene uses a small, procedural Three.js composition with no model, texture, or continuous render-loop download. It is dynamically loaded, caps device pixel ratio, renders only in response to interaction/state changes, pauses while the document is hidden, and disposes its resources on teardown. The CSS Decision Core remains visible as the WebGL fallback. `prefers-reduced-motion: reduce` removes the scene and motion while preserving the complete HTML narrative. To disable WebGL entirely, remove `SignalScene` from `narrative-signal.tsx`; no portfolio content depends on it.

## Deployment

The app uses the Next.js App Router and can deploy to Vercel or any Node host that supports `next build` and `next start`.

1. Set `NEXT_PUBLIC_SITE_URL` to the final origin.
2. Run the production checks above.
3. Deploy the repository with Node.js 20 or newer.
4. Verify `/robots.txt`, `/sitemap.xml`, and the generated Open Graph image.

## Design documentation

The project includes the audit trail and implementation rationale in `PRODUCT.md`, `DESIGN.md`, and `docs/`. Asset and attribution notes are in `docs/asset-credits.md`.

## External assets and libraries

- Portrait and resume: supplied project assets in `public/`
- Fonts: Manrope and JetBrains Mono, self-hosted at build time through `next/font`
- Icons: Lucide React
- Procedural 3D: Three.js
- Interaction: React and CSS; Framer Motion remains for retained legacy components

No stock imagery or unverified project screenshots are used.
