# Exploration interaction contract

## Mode controls

The workspace exposes two mutually exclusive states: Guided and Explore Workspace. Guided is the default. Escape and the visible Exit Explore Mode control always exit exploration.

Explore Mode does not change the document URL. While its dialog is open, background portfolio landmarks are inert, keyboard focus is contained inside the workspace, and closing with Escape or the visible exit restores focus to the initiating control. Skip Experience links to the semantic project chapter.

## Input map

| Input | Result |
| --- | --- |
| Explore Workspace button | Enters exploration and opens the monitor inspector |
| Pointer click/tap on a modeled object or hotspot | Selects the matching semantic object and settles the camera into its bounded focus composition |
| Desktop drag on the scene | Rotates the camera within fixed azimuth and polar limits |
| Mobile touch | Selects objects; free rotation is disabled |
| Tab | Moves through object, project, detail, exit, and skip controls |
| Left/Right Arrow | Moves through the object tabs; outside the tab list, changes the active object without moving focus |
| A/D | Changes the active object while focus remains on the current control |
| 1-5 | Jumps directly to Monitor, Server, Notebook, Computational frame, or Lamp |
| Home/End | Selects the first/last object tab |
| Minimize / Show evidence | Collapses or restores the semantic evidence deck without stopping object selection |
| Inspected counter | Shows how many of the five object meanings have been visited in the current Explore session |
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
- Visual hotspots and the selected-object marker are affordances only; they duplicate controls already exposed in the tablist.
- The object selector follows the ARIA tab pattern with roving focus and Arrow/Home/End keys.
- The inspector uses a labelled tabpanel and polite updates.
- Every action is keyboard accessible and at least 44px on touch layouts.
- Focus indicators use the site focus token.
- Reduced motion removes Explore Mode because the static fallback already exposes all meanings through HTML.
- The lightweight tier keeps the inspector usable while replacing real-time WebGL with the static workstation schematic.

## State synchronization

DecisionCore owns mode, selectedObject, projectId, quality, visibility, boot state, and evidence-deck state. WorkspaceScene receives those values through a focused client-side interface. Every object selection triggers one short camera settle toward a fixed composition; direct orbit input cancels the settle and remains bounded. Explore tracks visited objects locally for the inspected counter; this is not persisted between visits. Project events continue to synchronize normal case-study controls and the monitor.


## Cinematic lifecycle

The global cinematic controller owns whether Guided or Explore rendering is active. The Three.js module is imported only after "Explore workspace" is activated. Entering Explore removes the image-sequence canvas; Escape or the visible exit control unmounts WebGL and restores the current guided chapter. Both modes continue to use the existing signal-project event.
