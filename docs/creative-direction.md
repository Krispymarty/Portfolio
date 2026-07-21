# Creative Direction: Model → Impact

1. Central story: Yashmit is learning to move AI work from model metrics into decisions and products people can use.
2. Visual metaphor: a layered Decision Core. Each layer represents data, model, explanation, interface, and impact.
3. Emotional progression: curiosity on arrival → confidence through quantified proof → momentum through active learning → openness at contact.
4. Chapters: Arrival; Journey; Capabilities; Selected Work; Experience & Education; Contact.
5. Role of 3D: one CSS-3D core visualizes the system layers and changes emphasis with the active chapter. It is decorative only where the adjacent text already explains the idea.
6. Motion language: controlled rotation, layer separation, scan-line travel, and direct state changes. No repeated fade-up scaffold.
7. Typography: Manrope for open, technical clarity; JetBrains Mono for terse measurements only. High contrast, balanced headings, readable body widths.
8. Colour system: near-black optical canvas, off-white ink, amber measurement/progress, violet model signal, green verified state.
9. Interaction model: native scroll with sticky chapter orientation, keyboard-accessible project selectors, pointer depth on capable devices, and direct links for all core actions.
10. Performance strategy: server-render the story, isolate client logic to the Decision Core/project state, use CSS transforms instead of a 3D library, optimize the portrait through `next/image`, lazy-load nonessential interactive modules, and stop motion when hidden or reduced motion is requested.

The physical scene is a student and an engineering lead reviewing measured work on a calibrated optical instrument in a quiet lab at night. That scene forces a dark, precise, low-glare interface and rejects generic neon gaming atmosphere.

## Second-pass evolution: The Signal Spine

The portfolio is one signal travelling from raw input to useful impact.

The current layered Decision Core remains the visual origin, but it is no longer a hero-only object. A compact trace leaves the core, follows the visitor through every chapter, accumulates capability, activates project systems, and finally converges into an open communication channel.

This is not a space scene, operating system, laboratory simulator, terminal, or game. The visual language comes from a calibrated optical instrument: measured layers, apertures, traces, thresholds, and recorded signals.

## Why it fits the content

1. **Data** ? build foundations and frame a problem.
2. **Model** ? train and evaluate a system.
3. **Explain** ? expose why a decision was made.
4. **Product** ? connect the model to APIs, interfaces, and people.
5. **Impact** ? make the system useful in a real context.

## How the metaphor appears

### Navigation

A persistent Signal Rail reports the active chapter and overall progress. Conventional anchor navigation remains available. The rail includes direct paths to work, resume, contact, and origin. It never replaces standard scrolling.

### Opening

A short initialization sequence calibrates four layers before revealing the full name and positioning. The Three.js Decision Core responds to pointer position, scroll progress, and active layer selection. The sequence never blocks content for more than a fraction of a second and becomes an immediate static state for reduced motion.

### Journey

The signal descends through a pinned trace. Each milestone adds a structural layer rather than appearing as a plain timeline dot. The trace visibly changes from a single line into a multi-channel system as the questions evolve.

### Capabilities

Capabilities form an inspectable signal map. Selecting a project lights only the technologies that contributed to it, making relationships visible instead of presenting a tag cloud.

### Projects

The Signal Spine enters three different instruments:

- **Fraud Detection Framework:** a decision aperture exposes the documented precision/recall operating point and false-positive reduction.
- **Weapon Detection System:** the signal moves through the documented continuous-inference stages.
- **LifeXP:** the signal separates into interface, service, data, and recommendation layers, clearly marked as active or planned.

The project selector changes the spatial stage, core state, atmosphere, and technical interaction. Core summary and outcome text remain visible without manipulation.

### Experience and closing

Academic foundation, leadership, and recorded technical signals become converging inputs. The layered core then collapses into a single aperture and the signal becomes an open channel leading directly to email, LinkedIn, GitHub, and the resume.

## Spatial compositions

1. **Arrival chamber:** asymmetric full-viewport identity plus interactive Three.js core.
2. **Pinned growth trace:** a staged vertical narrative with an evolving signal object.
3. **Capability map:** a relationship field with project-driven highlighted paths.
4. **Project instrument:** a sticky scene and changing technical interface, with three project-specific compositions.
5. **Convergence field:** experience inputs merge into the final contact aperture.

## 3D decision

Use **Three.js directly** as the only WebGL system. Do not add React Three Fiber or Spline. The geometry is procedural and small, so an external model or scene library would add weight without adding meaning. The existing CSS core becomes the static, reduced-motion, and non-WebGL fallback.

The renderer is dynamically imported, device-pixel ratio is capped, antialiasing is reduced on weaker devices, and rendering is event-driven rather than continuously spinning. Rendering stops when hidden and resources are disposed on unmount.

## Atmosphere

- Arrival: near-black with amber calibration marks.
- Journey: graphite with a narrow amber trace.
- Capabilities: cooler violet signal relationships.
- Work: project-specific amber, violet, and green emphasis.
- Experience: restrained neutral convergence.
- Contact: committed amber field with black aperture.

Color changes are contextual states, not decorative gradients.

## OriginKit decision

OriginKit is registered globally, but its bearer-token environment variable is not available to the running Codex app process, so its component catalog is not callable in this session. No component was imported by guesswork. The chosen interactions are sufficiently specific to the Signal Spine that small custom components provide better accessibility, lower bundle impact, and stronger originality than unreviewed external examples.

## Mobile choreography

Mobile does not reproduce desktop pinning. The Signal Rail becomes a compact top progress indicator. The core uses a simplified static or low-quality scene. Journey states advance in short sticky steps, the capability map becomes project filters plus connected lists, and project scenes become tap-selectable panels with all essential evidence in document flow.
