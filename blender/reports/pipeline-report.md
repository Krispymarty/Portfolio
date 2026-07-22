# The Living Workspace pipeline report

## Toolchain and source

- Blender: 5.2.0 LTS.
- Executable alias: `C:\Users\Asus\AppData\Local\Microsoft\WindowsApps\blender-launcher.exe`.
- Generated source: `blender/source/workspace-source.blend` (155,522 bytes).
- Automated working scene: `blender/working/workspace-cinematic.blend` (155,522 bytes).
- Visual source of truth: the repository's procedural Three.js workstation.

## Scene inspection

- 6,908 estimated triangles, one cinematic camera, three lights, eleven materials, no external texture dependencies, no hidden geometry, no duplicate materials, and no unapplied transforms.
- No armature was present. Character motion is constrained object animation with a seated pelvis and compatible hand/head poses.
- Full inspection: `blender/reports/scene-inspection.json`.

## Rendered sequences

| Sequence | Frames | Duration | Render time | Frame payload |
| --- | ---: | ---: | ---: | ---: |
| Initialization | 120 | 5 s | 57.54 s | 2,202,518 bytes |
| Transformation | 144 | 6 s | 98.25 s | 3,751,038 bytes |
| Details | 120 | 5 s | 64.56 s | 3,107,888 bytes |

- Output: 1280×720 opaque WebP, 24 fps, quality 82, AgX Medium High Contrast.
- Total frame payload: 9.20 MB; validation found no gaps or dimension mismatches.
- Five representative frames per affected sequence were rendered before the full batch. Initialization and Detail Journey were rerendered to restore the amber lamp activation and readable Contact resolution; Transformation remained unchanged.
- Contact sheets are in `blender/previews/`; the anchor is `public/cinematic/posters/workspace-anchor.webp`.

## Fallback and Explore assets

- Initialization MP4: 292,058 bytes.
- Transformation MP4: 425,943 bytes.
- Details MP4: 436,013 bytes.
- Explore GLB: `public/models/developer-workspace.glb`, 271,264 bytes.

## Browser implementation

- Desktop Guided Mode uses an event-driven full-viewport canvas and an LRU decoded-frame cache.
- Initialization loads its first 16 frames first; remaining frames load progressively and later sequences load around their active chapter.
- Transformation maps forward from capability signals into the applied project state. Detail Journey carries Experience into the held Contact resolution.
- Mobile and low-memory devices use H.264 fallbacks. Reduced motion uses static posters.
- Explore Mode dynamically imports the existing React Three Fiber scene after explicit activation and unmounts it on exit.

## Known limitations

- The generated character is an object hierarchy rather than a skeletal rig; motion intentionally remains minimal.
- The monitor is a rendered emissive surface. All meaningful project information remains adjacent semantic HTML.
- The Microsoft Store package path is versioned; update only `blender/config.json` if the installed package changes.

## Rebuild commands

Run from the repository root. `$BLENDER` below means the `blenderExecutable` value in `blender/config.json`.

```powershell
& $BLENDER --factory-startup --background --python blender/scripts/prepare_scene.py
& $BLENDER --background blender/working/workspace-cinematic.blend --python blender/scripts/pipeline.py -- inspect
& $BLENDER --background blender/working/workspace-cinematic.blend --python blender/scripts/pipeline.py -- samples
& $BLENDER --background blender/working/workspace-cinematic.blend --python blender/scripts/pipeline.py -- render
& $BLENDER --background blender/working/workspace-cinematic.blend --python blender/scripts/pipeline.py -- export
python blender/scripts/validate_outputs.py
```

Fallback videos are generated with FFmpeg from each sequence's `frame_%04d.webp` files using H.264, `yuv420p`, CRF 24, and `+faststart`.


## Final verification

- ESLint, TypeScript, Impeccable detection, asset validation, and the Next.js production build passed.
- Browser checks passed at 360x800, 390x844, 768x1024, 1024x768, 1366x768, 1440x900, and 1920x1080 with zero horizontal overflow.
- Portrait widths resolve to 96, 112, 144, and 176 pixels at their intended breakpoints; mobile actions are full-width and 48 pixels high.
- Desktop uses one Guided canvas; phone layouts use one decoded MP4; Explore replaces Guided with one WebGL canvas and unmounts on Escape or the visible exit control.
- Project transformation, Experience detail progression, focus restoration, direct navigation, resizing, and mobile control placement were exercised with no browser errors.
- Production JavaScript output contains 14 chunks totaling approximately 1.63 MB uncompressed; the 1.01 MB Three.js chunk remains lazy Explore-only code.
- npm audit reports zero known vulnerabilities across production and development dependencies.
