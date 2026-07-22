# Cinematic pipeline audit

## Preserved baseline

- Git checkpoint: `4b0844f checkpoint: portfolio before blender cinematic pipeline`.
- The checkpoint was created before Blender scene generation or website integration.
- The existing live React Three Fiber implementation remains in `src/components/workspace-scene.tsx` and is retained as Explore Mode.

## Source and Blender

- No original Blend, GLB, glTF, FBX, OBJ, or DAE asset existed in the repository.
- The authoritative source was the procedural workstation in `src/components/workspace-scene.tsx`.
- `blender/source/workspace-source.blend` is a generated, preserved Blender counterpart of that scene; it is not represented as an imported original.
- Store package: Blender 5.2.0 LTS at the protected WindowsApps package location.
- Verified CLI alias: `C:\Users\Asus\AppData\Local\Microsoft\WindowsApps\blender-launcher.exe`.
- The protected package executable rejects direct invocation, so scripts use the registered alias through `blender/config.json`.

## Website stack and architecture

- Next.js 16.2.9 App Router, React 19.2.4, TypeScript, npm.
- React Three Fiber 9.6.1, Drei 10.7.7, Three.js 0.185.1, and Framer Motion 12.40.0.
- The page remains a Server Component. Browser state is isolated in cinematic and Explore client components.
- Existing procedural clips: `idle_work`, `initialize`, `typing_loop`, `inspect_screen`, `use_mouse`, `check_notebook`, `short_break`, `skills_activate`, `project_switch`, `experience_integrate`, `contact_complete`, and `reset`.

## Assets and content

- Personal copy and factual project data: `src/data/portfolio.ts`.
- Portrait: `public/profile.jpg`; résumé: `public/resume.pdf`.
- Deployment and metadata remain in the existing Next.js configuration and App Router files.
- Missing at audit: original 3D source, texture maps, and a skeletal character rig. The Blender character therefore uses safe object transforms only.

## Risks and mitigations

- Store-packaged Blender cannot be invoked through its protected absolute executable; the verified launcher alias is centralized in config.
- Hundreds of decoded frames can exhaust browser memory; the guided engine uses a 56-frame LRU and closes released `ImageBitmap` resources.
- Canvas failure cannot hide evidence because all portfolio content remains semantic HTML and the poster remains behind the canvas.
- Guided and Explore renderers are mutually exclusive; Three.js is imported only after explicit activation.

## Baseline device behavior

- Before this pipeline, capable desktop devices mounted a persistent WebGL canvas with adaptive DPR and shadows.
- Lightweight/mobile and reduced-motion modes already removed continuous WebGL and exposed a static semantic fallback.
- The cinematic implementation preserves that contract: desktop uses image sequences, mobile/low-memory devices use MP4, and reduced motion uses static posters.
