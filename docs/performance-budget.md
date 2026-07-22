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
