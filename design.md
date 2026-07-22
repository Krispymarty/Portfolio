# Design system

## Brand scene

A curious computer-science student works late in a quiet university project room. The monitor and lamp provide controlled warmth; cyan paths show learning and system relationships; orange paths show projects, decisions, and output. The interface feels like a carefully assembled physical workstation—not a gaming setup, terminal theme, or generic WebGL demo.

Brand voice: measured, mechanical, and humane.

## Principles

1. Evidence before adjectives.
2. The workstation explains progression; it never blocks access.
3. Cyan connects knowledge. Orange marks applied decisions and output.
4. Every chapter remains useful without JavaScript, animation, or WebGL.
5. Distinct project behavior is more valuable than repeated visual containers.
6. Immersion must shorten evaluation, not make recruiters wait.

## Color tokens

The palette is a controlled full system with graphite carrying most surfaces and two restrained functional accents.

- Page background: oklch(0.145 0.012 220)
- Raised background: oklch(0.19 0.016 220)
- Soft surface: oklch(0.225 0.018 220)
- Primary text: oklch(0.94 0.012 85)
- Secondary text: oklch(0.75 0.018 220)
- Muted text: oklch(0.62 0.018 220)
- Border: oklch(0.34 0.022 220)
- Soft border: oklch(0.255 0.016 220)
- Systems cyan: oklch(0.67 0.085 195)
- Project orange: oklch(0.72 0.135 48)
- Focus: oklch(0.78 0.145 58)
- Success: oklch(0.73 0.12 155)
- Warning: oklch(0.78 0.14 72)
- Error: oklch(0.68 0.16 28)

Large surfaces are never pure black or pure white. Cyan and orange emission remains restrained; neither becomes a full-page neon wash.

## Typography

Manrope is the primary family. JetBrains Mono is limited to measurements, provenance, short stack labels, and scene state.

- Display: 760 weight, 0.96–1.02 line-height, no tighter than -0.04em, maximum 5.8rem.
- Section heading: 520–650 weight, 1.0–1.12 line-height, maximum 4.8rem.
- Body: 1–1.18rem, 1.6–1.72 line-height, maximum 68ch.
- Technical label: 0.68–0.78rem, mono, restrained tracking.
- Navigation/button: 0.82–0.9rem, 650–750 weight.
- Metadata: 0.75–0.86rem with secondary or muted text color.

Headings use balanced wrapping; prose uses pretty wrapping. No reveal may leave important copy invisible during loading.

## Layout and rhythm

- Base rhythm: 4px with primary spacing steps of 8, 12, 16, 24, 32, 48, 72, 96, 128.
- Content width: 1320px maximum.
- Reading width: 68ch maximum.
- Gutters: 24px desktop, 18px tablet, 14px small phone.
- Radii: 4px, 10px, 14px; cards never exceed 16px.
- Section rhythm alternates compressed evidence chapters with larger narrative transitions.
- Z-index: canvas 1, content 2, sticky 30, menu 40, focus/tooltip 50.

The narrative order is Arrival, Identity, Journey, Capabilities, Projects, Experience, Contact. At least three chapters use different spatial structures: integrated hero, pinned growth trace, capability map, project instrument, and contact resolution.

## Workstation behavior

The same low-poly workstation persists as a narrative instrument.

- Dormant: dark monitor, lamp off, paths inactive.
- Initialization/Journey: lamp and monitor wake; cyan path establishes foundations.
- Skills: cyan nodes and relevant monitor context activate.
- Projects: orange path and project modules activate; selected project changes monitor content.
- Experience: cyan and orange systems synchronize.
- Contact: the character rests, monitor enters communication mode, and both pathways resolve.

The mesh named primary_screen carries a procedural CanvasTexture that changes by chapter and selected project. All screen information also exists in accessible HTML.

## Motion

- Instant feedback: 120ms.
- Quick state change: 220ms.
- Standard transition: 380ms.
- Narrative transition: 720ms.
- Initialization: 900ms.
- Tight stagger: 50ms; copy stagger: 80ms.
- Ease out: cubic-bezier(0.16, 1, 0.3, 1).
- Shared-state ease: cubic-bezier(0.65, 0, 0.35, 1).

Character motion uses named procedural clips: idle_work, typing_loop, inspect_screen, use_mouse, check_notebook, short_break, initialize, project_switch, contact_complete, and reset. The pelvis stays seated and motion blends through damped transforms.

Reduced motion removes first-load travel, parallax, continuous character movement, and sticky journey behavior. It substitutes a static workstation schematic and immediate state changes.

## Performance tiers

- High: DPR up to 1.6, 1024 shadow map, contact shadow, full path signals, restrained particles.
- Balanced: DPR up to 1.25, 512 shadow map, reduced particles and secondary motion.
- Lightweight: DPR 1, no real-time shadows or particles, simplified lighting and short state changes.
- Reduced motion: static HTML/CSS fallback; no continuous WebGL loop.

Default tier is inferred from viewport, device memory, and hardware concurrency. Visitors may override it when the control is visible.

## Accessibility and interaction

- WCAG 2.2 AA contrast where practical.
- 44px touch targets and visible 2px focus outlines.
- Conventional anchor navigation, resume, projects, email, GitHub, and LinkedIn remain persistent.
- No hover-only information.
- Tab patterns support arrow, Home, and End keys.
- Copy-email feedback uses a polite live region.
- All meaningful content is outside canvas and follows logical reading order.
## Guided and Explore modes

Guided Story Mode is the default and owns chapter progression. Explore Mode is an optional layer on the same workstation—not a separate world. It supports five meaningful targets (monitor, server, notebook, computational frame, and lamp), bounded desktop orbit, touch selection on mobile, visible exit/skip controls, and semantic inspector content. Pan, zoom, locomotion, destructive physics, and essential Easter-egg content are prohibited.

The startup sequence coordinates the dormant scene with the hero copy. It completes within 2.6 seconds, can be dismissed by any primary input, and is never persisted across reloads. The settled identity remains mounted from first render.

Audio is intentionally omitted until a lightweight opt-in sound demonstrably improves comprehension. Visual state and accessible labels may never depend on sound.
