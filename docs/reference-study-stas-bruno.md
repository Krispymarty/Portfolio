# Reference study: Stas Bondar and Bruno Simon

Date reviewed: 22 July 2026

This study treats [Stas Bondar](https://www.stabondar.com/) and [Bruno Simon](https://bruno-simon.com/) as quality references only. The goal is to identify transferable principles for Yashmit Singh's portfolio—not to reproduce visible solutions, source code, assets, mechanics, typography, color, scene design, camera language, or storytelling.

## Method

Both sites were inspected in a live browser at desktop scale. The review covered entry behavior, navigation, information hierarchy, typography, canvas use, persistence of the central scene, controls, direct access, mobile-facing control affordances, performance controls, and accessibility signals observable from the rendered DOM. The current portfolio was inspected alongside them to identify fit rather than imitate surface details.

Some observations about implementation are reasoned inferences from the rendered experience and DOM, not claims about unpublished source code.

## Stas Bondar

### 1. Strongest design principles

- Typography carries the composition. Large type is treated as spatial material rather than a heading placed above content.
- The visual system is highly reduced: a narrow palette, assertive scale changes, precise alignment, and abundant negative space create confidence.
- A single cinematic canvas unifies otherwise separate pages and case-study moments.
- Project indexing is editorial rather than card-based. Numbering, repetition, scale, and rhythm make the work feel curated.
- The site establishes a distinct voice immediately and preserves it across home, cases, and contact.

### 2. Strongest interaction principles

- Navigation is deliberately small in scope: Home, Cases, Contacts, and a direct conversation route.
- Transitions preserve visual continuity; content feels reframed rather than replaced by unrelated screens.
- Repeated project labels and large interaction regions make browsing feel physical without requiring game knowledge.
- Interaction pacing leaves time for composition changes to register, but primary destinations remain directly addressable.

### 3. Strongest technical ideas

- One viewport-filling canvas appears to coordinate much of the visual language.
- DOM text and links remain present alongside the canvas, allowing essential destinations to exist outside graphics.
- Smooth-scroll state and scene transitions appear coordinated through a single motion model.
- Repeated case items suggest data-driven project rendering even though the visual result avoids a generic card grid.

### 4. Usability strengths

- Very low navigation complexity.
- Immediate direct contact path.
- Strong project indexing and memorable visual hierarchy.
- Large type creates clear chapter identity.
- The limited vocabulary helps visitors understand what matters quickly.

### 5. Usability risks

- Several meaningful project links expose little or no accessible link text in the rendered DOM, increasing dependence on the visual canvas.
- The highly cinematic first view can obscure content when graphics fail or initialization stalls.
- Large fixed compositions may create clipping or loss of hierarchy on short or narrow viewports.
- Low-information navigation can make detailed résumé content less discoverable.
- Motion-heavy transitions may delay task-focused visitors if no bypass is offered.

### 6. Ideas that fit this portfolio

- Treat section headings as compositional partners to the workstation geometry.
- Use distinct editorial compositions for the three projects rather than identical cards.
- Carry project titles between selectors and details through restrained shared-element motion.
- Preserve a limited palette and let scale, spacing, and scene light create emphasis.
- Keep transitions chapter-specific while sharing timing, easing, and spatial rules.
- Make the persistent workstation the continuity device across the whole document.

### 7. Elements that must not be copied

- Exact typeface, type scale, letter treatment, or word arrangements.
- Red/cream/black palette and canvas styling.
- Home, cases, and contact layouts.
- Project ticker/repetition treatment.
- Image distortion, shader treatment, transition order, or camera paths.
- Personal biography framing, sports references, project names, and narrative voice.

## Bruno Simon

### 1. Strongest design principles

- The portfolio is a persistent place rather than a sequence of pages.
- Content landmarks are part of the world, so navigation, storytelling, and environment reinforce one another.
- Playfulness comes from responsive objects, sound, scale, and discovery—not decorative animation alone.
- The visual world has a consistent authored physics and material language.
- The experience exposes its own controls and settings instead of pretending interaction cost does not exist.

### 2. Strongest interaction principles

- Visitors can explore freely, but explicit controls, respawn, reset, map, and menu affordances prevent permanent disorientation.
- Objects respond with weight and damping, making interaction feel causally connected.
- Interaction is layered: movement, proximity, direct action, settings, and discoveries reward different levels of engagement.
- Mobile/tablet and gamepad control categories are acknowledged as distinct modes rather than scaled desktop input.
- Sound and effects are configurable, and a visible quality/performance control is part of the experience.

### 3. Strongest technical ideas

- A single persistent WebGL world coordinates navigation, object interaction, content landmarks, and state.
- Lightweight rigid-body physics is used selectively for tangible response.
- Settings expose render/effect choices and a performance-oriented renderer option.
- Spatial reset/respawn mechanisms provide fault recovery for an open environment.
- The rendered DOM exposes control and settings interfaces even though most narrative content lives spatially.
- The site links openly to its technical ecosystem, indicating a modular real-time stack rather than a static sequence of renders.

### 4. Usability strengths

- Extremely memorable central interaction model.
- Strong sense of continuity and discovery.
- Clear recovery tools for a potentially disorienting environment.
- Explicit sound, effects, renderer, and device-control settings.
- Touch/mobile input is treated as a first-class concern.
- Physical response makes cause and effect understandable without explanatory copy.

### 5. Usability risks

- Essential portfolio information is difficult to extract from the normal document text; keyboard and screen-reader use can become secondary to the world.
- Visitors must learn movement controls before reaching some content.
- A large real-time world creates substantial load, battery, thermal, and device-compatibility costs.
- Open navigation can hide chronology and make completion ambiguous.
- Physics, achievements, and discoveries can compete with the professional message.
- A recruiter seeking projects or contact details may leave before learning the interaction model.

### 6. Ideas that fit this portfolio

- Keep one persistent workstation and let its objects represent real content domains.
- Add an optional Explore Workspace mode with bounded orbit, object selection, a visible exit, and no locomotion.
- Use object response sparingly: a lamp tilt, key travel, cable drift, and spring-settled frame nodes.
- Highlight interactable objects in both pointer and keyboard flows.
- Provide recovery by making Guided Mode one action away at all times.
- Expose quality tiers and pause the render loop when hidden or inactive.
- Let two or three tiny discoveries reward attention without containing essential facts.

### 7. Elements that must not be copied

- Vehicle, driving controls, road-world layout, ramps, signs, achievements, or checkpoints.
- The map, respawn language, camera angle, or world scale.
- Purple/pink night palette, low-poly environment assets, buildings, vegetation, or lighting composition.
- Physics obstacles, collectible logic, game menu, control diagrams, or audio identity.
- Bruno's personal landmarks, jokes, copy, project placement, or narrative order.

## Current portfolio baseline

The existing portfolio already has the right foundation for an original hybrid:

- one persistent React Three Fiber canvas;
- a low-poly computational workstation with desk, monitor, developer, notebook, server, lamp, and rear frame;
- six semantic HTML chapters with direct links;
- chapter-driven camera and scene-state transitions;
- project selection synchronized to the scene;
- high, balanced, and lightweight quality controls;
- a non-WebGL fallback and reduced-motion static state;
- visible résumé, email, GitHub, LinkedIn, skills, experience, and projects;
- an evidence-led content model that avoids invented claims.

The main gap is not visual ambition alone. The workstation currently behaves primarily as an illustration of scroll state. It needs a bounded interaction layer, object semantics, a clear Guided/Explore mode model, and object-to-HTML synchronization.

## Synthesis: principles for The Living Developer Workspace

| Reference quality | Original translation for this portfolio |
| --- | --- |
| Editorial scale and restraint | Large chapter typography aligned to the workstation, with stable readable body copy |
| Persistent cinematic canvas | Keep the existing single workstation canvas across chapters |
| Spatial continuity | Reframe the same desk objects instead of introducing unrelated 3D worlds |
| Playful direct manipulation | Bounded orbit and five meaningful selectable workstation objects |
| Physical causality | Small spring/damping responses that always settle back into composition |
| Distinct project treatment | Monitor-led project inspection plus complete semantic case-study HTML |
| Configurable real-time experience | Existing quality tiers plus explicit Guided/Explore mode and pause rules |
| Immediate professional utility | Persistent navigation, résumé, contact, and a clear Skip Experience route |

## Creative boundary

The result should feel like an authored computational instrument: quiet, precise, curious, and evidence-led. It should not feel like a design-agency clone or a miniature driving game. The workstation remains Yashmit's own metaphor—models become signals, signals become systems, and objects reveal the work behind those systems.
