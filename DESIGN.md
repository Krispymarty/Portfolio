# Design System

## Intent

The interface is a dark, high-contrast spatial field inspired by an optical instrument in a quiet university lab at night: black surfaces, chalk-white type, amber measurement marks, and one cool violet inherited from the existing site as a secondary signal rather than a glow effect.

## Color

- Canvas: `oklch(0.12 0.008 255)`
- Raised canvas: `oklch(0.17 0.012 255)`
- Primary ink: `oklch(0.95 0.008 90)`
- Secondary ink: `oklch(0.72 0.018 255)`
- Measurement amber: `oklch(0.78 0.16 75)`
- Signal violet: `oklch(0.65 0.16 295)`
- Success: `oklch(0.74 0.13 155)`
- Hairline: `oklch(0.31 0.02 255)`

Color is committed but controlled: amber carries progress and interaction, violet identifies model/explainability signals, and neutrals carry most reading surfaces. Gradients are permitted only for dimensional lighting on the spatial model, never for text.

## Typography

Use `Manrope` as the principal variable family for its open technical shapes and compact display range, paired with `JetBrains Mono` only for measurements, stack labels, and short data readouts. Display text stays at or below 6rem and no tighter than -0.04em. Body copy is 17-19px with 1.55-1.7 line-height and a 68ch maximum.

## Layout

The page follows a six-chapter narrative with asymmetric compositions and deliberate shifts in density. The content column is capped near 1320px. Project sections use different evidence-led compositions rather than a card grid. Mobile collapses spatial layers into a single reading track and shortens decorative travel.

## Components

- `SiteHeader`: stable chapter navigation and contact action.
- `DecisionCore`: one CSS-3D model with static and reduced-motion states.
- `ChapterIntro`: chapter title plus concise narrative orientation.
- `JourneyTrace`: chronological evidence and transition markers.
- `CapabilityMatrix`: skill-to-project evidence mapping.
- `ProjectCase`: project-specific composition with outcome, challenge, stack, and provenance.
- `ProofStrip`: education, experience, and achievements without vanity metrics.
- `ContactOrbit`: closing actions that resolve the opening metaphor.

## Shape and depth

Corners are restrained at 4-14px. Hairline borders define measurement surfaces; wide soft shadows are not paired with bordered cards. Depth comes from overlap, perspective, controlled lighting, and scale rather than glass blur.

## Motion

Motion uses 180ms, 360ms, and 700ms durations with an ease-out-expo curve. The Decision Core responds subtly to pointer position and chapter progress. Text is never hidden while waiting for an observer. Reduced motion stops rotation, removes parallax, and uses immediate state changes.

## Accessibility

Focus uses a 2px amber outline with offset. Interactive controls preserve 44px targets. All spatial visuals are decorative or have an adjacent textual explanation. No core information depends on hover, canvas, color alone, or client hydration.

## Signal Spine motion tokens

- `--motion-instant: 110ms` for press, focus, and hover confirmation.
- `--motion-quick: 220ms` for control and progress-rail updates.
- `--motion-standard: 420ms` for masks and project selection.
- `--motion-major: 760ms` for chapter and core transformations.
- `--motion-init: 1050ms` for the complete opening calibration.
- `--ease-out: cubic-bezier(.16, 1, .3, 1)` for arrivals.
- `--ease-in-out: cubic-bezier(.65, 0, .35, 1)` for shared state changes.
- `--stagger-tight: 55ms` and `--stagger-copy: 90ms` for short display sequences only.

The Decision Core responds to pointer position, chapter progress, project selection, focus, reduced motion, and document visibility. Text is visible by default and never waits for an observer. Reduced motion removes parallax and travel, replaces WebGL with the static CSS core, releases sticky sequences into document flow, and uses immediate or short opacity state changes.
