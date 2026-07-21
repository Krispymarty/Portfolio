# 3D variant comparison

Compared in the browser on 17 July 2026. Each variant was rendered by the same production scene using `?core=restyled`, `?core=simplified`, or `?core=minimal`, so placement and surrounding HTML remained directly comparable.

## Evaluation criteria

- Hero hierarchy and typographic negative space
- Selected-work legibility and project interaction
- Contact link contrast on the amber chapter
- Desktop composition
- Tablet/narrow-desktop composition
- Mobile static fallback and horizontal overflow
- Reduced-motion equivalence
- Draw calls, geometry, materials, and render-loop behaviour
- Narrative clarity at small sizes

## Variant 1 - Restyled current model

### Construction

Retains the four stacked planes, faceted kernel, two orbits, radial nodes, axes, aperture, and project modules. Colours are synchronized to the site's named chalk/amber/violet/hairline palette, exposure is lowered, and continuous rotation is slowed.

### Browser result

- **Hero:** still reads as several objects overlaid. The large tilted planes and circular systems compete with the headline.
- **Projects:** project-specific geometry is visible, but it adds another visual system behind an already detailed instrument panel.
- **Contact:** line density remains illegible on amber and intersects links.
- **Responsive:** reducing canvas size does not solve the unclear silhouette.
- **Reduced motion:** stopping rotation helps, but visual density remains.

### Decision

Rejected. The mismatch is structural, not a colour-correction problem.

## Variant 2 - Simplified abstract stack

### Construction

Keeps the four decision planes, one aperture ring, and the central kernel. Removes radial nodes, axes, secondary orbit, project modules, and transmission clutter.

### Browser result

- **Hero:** calmer than Variant 1, but the planes still occupy most of the right half and feel like a tilted WebGL demo.
- **Projects:** better legibility, though the large square footprint still overlaps the section introduction.
- **Contact:** the broad planes produce a muddy shape against amber.
- **Responsive:** recognizable when reduced, but still visually heavy.
- **Reduced motion:** stable and understandable, but not strongly connected to the interface's diamond/aperture motif.

### Decision

Rejected. It removes symptoms while preserving the detached silhouette.

## Variant 3 - Minimal procedural specimen

### Construction

Four matte chalk vanes form a square aperture rotated into the site's diamond language. A compact octahedral kernel represents acquired structure. One amber slit represents the active system layer. One restrained violet trace appears only after the origin state. No textures, imported model, bloom, environment map, shadow map, or post-processing.

### Browser result

- **Hero:** gives the headline clear priority and aligns naturally with the existing diamond mark, progress nodes, and thin measurement rules.
- **Projects:** remains legible as a quiet watermark; selection changes the bounded orientation and amber slit without adding competing project sculptures.
- **Contact:** works only when pushed partly outside the viewport and reduced in opacity; this final placement was adopted.
- **Desktop:** the silhouette remains recognizable while occupying much less visual area.
- **Tablet:** the compact form preserves negative space without requiring a different camera path.
- **Mobile:** WebGL is not mounted. A CSS four-vane counterpart uses the same diamond, chalk, hairline, and amber-kernel language at a smaller scale.
- **Reduced motion:** WebGL is not mounted, pointer response is removed, and the same static CSS specimen remains. Content and controls are unchanged.

### Decision

Selected. It feels like an interface artifact from the same optical-lab system rather than a separate 3D showcase.

## Final integration changes

- Default production variant is `minimal`; comparison query parameters remain available for development review.
- Named Three.js palette mirrors `DESIGN.md` tokens: canvas, chalk, amber, violet, success, and hairline.
- Matte `MeshStandardMaterial` is used only for the four vanes and kernel; amber and violet remain restrained line/accent materials.
- Ambient, amber key, and faint violet fill lighting extend the page atmosphere without reflections or bloom.
- Pointer influence is limited to a few degrees and chapter states settle instead of continuously spinning.
- Work opacity is reduced and the scene shifts outside the text column.
