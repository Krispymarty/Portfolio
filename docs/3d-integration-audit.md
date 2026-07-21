# 3D integration audit

Audited in the running portfolio on 17 July 2026 at 1440 x 900 and 390 x 844, in the hero, selected-work, and contact chapters. The model was evaluated only in composition with the page.

## Diagnosis

The main problem is a combination of the model itself, its scale, placement, colour weight, motion, camera, and environment treatment.

The current object contains several competing silhouettes at once: four large square plates, two orbital rings, a faceted kernel, a bright torus aperture, radial nodes, axes, project-specific geometry, and a transmission line. Each individual part relates loosely to "a system," but together they read as a generic sci-fi assembly rather than one clear instrument.

The model uses the site's amber, chalk, and violet, but the violet rings and luminous amber wire occupy too much area. Because the materials are primarily unlit `MeshBasicMaterial`, they behave like bright diagram ink rather than matter in the page atmosphere. There is no lighting hierarchy to bind the object to the changing chapter backgrounds.

At desktop hero size the canvas occupies roughly half the viewport (706 x 648 in the audited frame). The object becomes the second headline and competes with "From model accuracy to useful decisions." In the work chapter, the scene overlaps the introductory copy and creates visual noise behind already-dense project instrumentation. In contact, its thin lines lose contrast against the amber panel while still interfering with links.

The camera is a stable perspective view, but the large tilted plates create strong foreshortening and make the scene feel like a separate demo floating over the layout. The scene lacks a typographic anchor: its axes do not reliably align to the content column, project divider, or progress rail.

Motion is event-driven and paused with document visibility, which is good. However, the kernel, rings, aperture, module, plates, and camera all change concurrently. Continuous ring and kernel rotation makes the object restless compared with the site's controlled 220/420/760ms interface rhythm.

On mobile the automatic Lightweight tier correctly removes WebGL and avoids horizontal overflow. The hero remains readable, but the model's narrative is absent in the first viewport; the CSS Decision Core appears later as a separate block rather than a small integrated identity mark.

## Category findings

- **Shape language:** too many circles, polygons, squares, nodes, and axes compete. The site itself uses disciplined squares, diamonds, hairlines, and one aperture motif.
- **Geometry complexity:** unnecessary for the concept and visually noisy at small size.
- **Colour palette:** token-adjacent but overweight; violet is acting as a dominant neon outline instead of a secondary signal.
- **Materials:** flat emissive-looking basic materials do not share the HTML surface hierarchy.
- **Lighting:** effectively absent; brightness comes from raw colour, so the object does not inherit page atmosphere.
- **Scale:** too large in hero and too visually present behind project copy.
- **Camera perspective:** dramatic plate foreshortening creates a detached floating-object effect.
- **Motion behaviour:** too many simultaneous moving systems; insufficient stillness.
- **Visual weight:** denser and brighter than the surrounding body copy and at times as strong as the display type.
- **Typography relationship:** overlap is incidental rather than aligned to baselines, dividers, or negative space.
- **Background treatment:** acceptable on black, weak on the amber contact state, and not tuned per chapter.
- **Section composition:** hero placement is plausible; work and contact placement interfere with functional content.
- **Realism / abstraction:** correctly abstract, but its visual grammar leans generic sci-fi rather than optical-lab measurement.
- **Interaction:** direct layer controls are clear; pointer and scroll response are appropriately bounded, but model movement should be slower and rarer.
- **Narrative relevance:** the evolving-system role is valid, but the current geometry does not communicate accumulation clearly because every subsystem is visible too early.

## 3D Visual Translation

### Colour

- Canvas: `oklch(0.12 0.008 255)` becomes the environmental clear colour / shadow tone.
- Chalk ink: `oklch(0.95 0.008 90)` becomes the dominant matte body.
- Measurement amber: `oklch(0.78 0.16 75)` is limited to the active edge, acquired node, or transmission slit.
- Signal violet: `oklch(0.65 0.16 295)` becomes a single quiet secondary line, never a large orbit.
- Success green is reserved for verified project state, not general decoration.

Three.js colours should be synchronized in one named palette object that mirrors the CSS tokens. No unrelated blue, chrome, rainbow, or bloom palette.

### Typography personality

Manrope is open, blunt, and precise; JetBrains Mono appears only for measurements. The model should therefore read like a calibrated specimen: one strong mass, thin measurement cuts, and a small number of labelled state relationships, not a game object.

### Borders and radii

The interface uses one-pixel hairlines, restrained 4-14px radii, squares, and diamonds. The model should use planar modules, narrow chamfers, square/diamond frames, and line geometry. Large soft bubbles and rounded plastic forms are inappropriate.

### Spacing and density

The page alternates dense evidence with generous negative space. The model needs a compact silhouette with internal voids so it can sit near type without filling the entire canvas. Parts should appear only when their chapter gives them meaning.

### Contrast and texture

The website is high contrast but not glossy. Use matte surfaces, low-opacity line work, and one brighter active edge. No environment reflection, heavy transparency stack, glass, or bloom.

### Motion

Match the existing 220/420/760ms tokens and `cubic-bezier(.16, 1, .3, 1)`. State transitions should settle, then stop. Pointer damping remains subtle; no continuous spin. Scroll changes should assemble or align parts instead of making every part orbit.

### Technical versus organic

The system is clearly technical and angular. Organic movement should be limited to soft damping. Geometry should feel like an optical measurement plate or compact computational specimen from a university lab, not a spaceship component.

## Narrative role

**The model is a compact computational specimen that gains one verified structural layer as Yashmit's evidence accumulates.**

This role requires visible absence at the start, selective acquisition through journey and capabilities, a single project-specific insert, and a complete but still quiet transmission state.

## Option evaluation

### A - Restyle the existing model

Useful as a control variant. Removing violet dominance and lowering plate opacity improves coherence, but the silhouette still contains too many competing systems.

### B - Simplify the current model

Promising: retain the layered decision idea, remove the orbits and most nodes, compress the plates into a clear four-part specimen, and stop continuous rotation.

### C - Rebuild procedurally

Strongest direction: a compact, original four-vane aperture around a faceted chalk kernel, with one amber measurement slit and one violet secondary trace. It matches the site's square/diamond/aperture language, remains readable when small, and needs no external asset.

### D - Spline scene

Rejected. It adds licensing, loading, and style-matching risk without improving the simple procedural concept.

### E - Remove 3D from some sections

Recommended alongside C. Keep the specimen meaningful in identity, journey, capabilities, and project selection. Use a nearly static watermark or no WebGL in dense project-detail and mobile compositions where it weakens hierarchy.

## Audit decision

