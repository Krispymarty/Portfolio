# Living Workspace performance budget

## Guardrails

- One WebGL canvas maximum.
- No second shader background or duplicate render loop.
- No new runtime physics dependency unless a measured object response cannot be achieved with damped transforms.
- Essential text, links, and project information must render without the canvas.
- Mobile defaults to the lightweight static tier.

## Quality tiers

| Tier | Target devices | DPR | Shadows | Environment | Particles | Continuous canvas |
| --- | --- | --- | --- | --- | --- | --- |
| High | capable desktop | 1–1.75 | 1536 directional + 512 contact | 96 | 32 | Yes, while visible |
| Balanced | typical laptop/tablet | 1–1.35 | 1024 directional + 256 contact | 48 | 12 | Yes, while visible |
| Lightweight | phone/low power/manual choice | n/a | none | static schematic | none | No |
| Reduced motion | user preference | n/a | none | static schematic | none | No |

## Runtime rules

- Pause the render loop when the document is hidden or the workspace is outside the viewport.
- Do not mount WebGL in lightweight or reduced-motion modes.
- Disable desktop orbit on viewports at or below 700px.
- Keep generated monitor textures in memory only for the scene lifetime and dispose them on teardown.
- Dispose materials on scene teardown.
- Use one-time environment rendering (`frames={1}`).
- Keep pan and zoom disabled; bounded orbit avoids rendering irrelevant world space.
- Object camera transitions reuse the existing scene frame loop, stop after converging on their preset, and are cancelled immediately when the visitor starts orbiting.
- The selection marker and object hotspots are short transform-only cues; they introduce no new renderer, texture request, external asset, or unbounded animation.
- Do not autoplay audio. No audio is retained in this pass because it does not yet add enough value to justify payload and control complexity.

## Retention criteria for effects

An effect remains only if it improves one of: chapter comprehension, object affordance, project differentiation, or perceived causality. It must also:

1. avoid blocking input;
2. have a reduced-motion/static equivalent;
3. add no horizontal overflow;
4. preserve readable frame time on Balanced hardware;
5. stop when it cannot contribute visually.

## Measurement checklist

Before release, record:

- `next build` route sizes;
- initial JavaScript and async Three.js chunk size;
- canvas count;
- selected DPR and tier at each test viewport;
- long tasks during intro, project switching, and Explore Mode;
- layout shift during startup;
- console errors and WebGL warnings;
- memory stability after repeated Guided/Explore switches.
## Recorded production measurement

The 22 July 2026 production build emitted 10 JavaScript chunks totaling 1.62 MB uncompressed on disk. The largest asynchronous chunk is 984.7 KB and contains the dynamically loaded real-time scene stack; the primary non-scene chunks are substantially smaller. This confirms that Three.js remains isolated from the initial server-rendered content path, while also identifying the scene chunk as the main future optimization target.


## Cinematic budget

- 384 WebP frames at 1280x720 total 9.20 MB, below the 40 MB target.
- The decoded-frame cache holds at most 56 frames and releases evicted ImageBitmap resources.
- Only frame changes repaint the canvas; interpolation stops when the target frame is reached.
- The first 16 Initialization frames form the critical window. The visible readiness indicator clears after those requests settle; remaining frames use a four-request background queue plus chapter-predictive loading.
- Mobile and low-memory devices use three H.264 files totaling approximately 1.10 MB.
- Reduced motion decodes no sequence frames and runs no video or WebGL loop.
