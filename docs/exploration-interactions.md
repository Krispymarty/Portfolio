# Exploration interaction contract

## Mode controls

The workspace exposes two mutually exclusive controls: Guided and Explore Workspace. Guided is the default. Escape and the visible Return to Guided Mode control always exit exploration.

Explore Mode does not change the document URL, trap focus, intercept scrolling, or hide page content. Skip Experience links to the semantic project chapter.

## Input map

| Input | Result |
| --- | --- |
| Explore Workspace button | Enters exploration and opens the monitor inspector |
| Pointer click/tap on a modeled object | Selects the matching semantic object |
| Desktop drag on the scene | Rotates the camera within fixed azimuth and polar limits |
| Mobile touch | Selects objects; free rotation is disabled |
| Tab | Moves through mode, object, project, detail, exit, and skip controls |
| Left/Right Arrow | Moves through the object tabs |
| Home/End | Selects the first/last object tab |
| Escape | Returns to Guided Mode |

Pan and zoom are disabled. There is no first-person movement, vehicle, physics obstacle, inventory, achievement, or required discovery.

## Object semantics

### Monitor — Projects

Shows the three real portfolio projects. Project buttons update the monitor and the existing project scene state. The panel links to the complete case studies in `#work`.

### Server — Backend and engineering

Exposes FastAPI, REST APIs, SQL/PostgreSQL, Docker, and local model deployment. It links to the full capability evidence rather than percentage bars.

### Notebook — Education and learning

Exposes the B.Tech program, programming/algorithm foundations, model fundamentals, and current learning already documented in portfolio data.

### Computational frame — Skill relationships

Exposes the four capability categories used by the semantic capability map. The 3D marker is an affordance; the HTML map remains authoritative.

### Lamp — Current focus

Exposes RAG systems, agents, vector databases, and local LLMs as current exploration—not finished expertise.

## Accessibility

- Canvas content is decorative to assistive technology; the inspector is the accessible interface for object meaning.
- The object selector follows the ARIA tab pattern with roving focus and Arrow/Home/End keys.
- The inspector uses a labelled tabpanel and polite updates.
- Every action is keyboard accessible and at least 44px on touch layouts.
- Focus indicators use the site focus token.
- Reduced motion removes Explore Mode because the static fallback already exposes all meanings through HTML.
- The lightweight tier keeps the inspector usable while replacing real-time WebGL with the static workstation schematic.

## State synchronization

`DecisionCore` owns `mode`, `selectedObject`, `projectId`, quality, visibility, and boot state. `WorkspaceScene` receives those values through a focused client-side interface. Project events continue to synchronize normal case-study controls and the monitor.
