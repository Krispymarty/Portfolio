# Interaction storyboard

## Global narrative system

The persistent Signal Spine listens to chapter intersections and updates navigation state, progress, atmosphere, and the Decision Core. Standard anchor navigation remains the source of truth. The visual layer enhances that structure rather than replacing it.

## Chapter 1 ? Arrival / calibration

- **Initial visual state:** Name and positioning are already present in HTML. A short amber calibration trace crosses the screen while the core's four layers align.
- **Visitor action:** Move the pointer, focus a layer control, choose a layer, or begin scrolling.
- **Animation response:** The core tilts within a restrained range, the chosen layer separates, and the name reveals through a horizontal mask. The trace connects to the Signal Rail.
- **Content revealed:** Identity, positioning, availability, portrait, work CTA, and resume CTA remain readable immediately.
- **3D state:** Four separated planes with a central aperture; Explain is the initial active state.
- **Transition:** Scroll progress draws the signal toward the journey trace while the core compacts.
- **Mobile:** One-column identity, actions, portrait, then a shorter low-quality core. No pointer dependency.
- **Reduced motion:** No calibration travel or tilt. The fully aligned static core and content appear immediately.

## Chapter 2 ? Journey / signal acquisition

- **Initial visual state:** A single vertical signal enters beside the first milestone.
- **Visitor action:** Scroll through four milestones or focus a milestone.
- **Animation response:** The active milestone receives the signal; one new channel joins the trace at each step. Copy remains stable.
- **Content revealed:** Foundation, leadership, measured model work, and product-system exploration.
- **3D state:** The compact core adds one layer per milestone and rotates to a side-on instrument view.
- **Transition:** The completed four-channel trace bends outward into the capability map.
- **Mobile:** Short sticky milestone labels followed by ordinary content blocks. Only discrete active-line changes.
- **Reduced motion:** All milestones render in document flow with the completed trace shown as a static diagram.

## Chapter 3 ? Capabilities / relationship map

- **Initial visual state:** Capability groups sit around a central project selector; all relationship paths are faint but visible.
- **Visitor action:** Select Fraud, Weapon Detection, LifeXP, or All evidence. Keyboard and pointer controls use the same state.
- **Animation response:** Relevant capability paths gain weight and color, unrelated paths recede, and evidence links update their emphasis.
- **Content revealed:** Technologies grouped by what they enabled, with current exploration kept distinct.
- **3D state:** Core planes reconfigure into a node-and-channel cross-section tied to the selected project.
- **Transition:** Project selection prepares the same project as the initial project instrument; normal scroll continues to work.
- **Mobile:** Segmented project filters above stacked capability groups. No freeform network geometry.
- **Reduced motion:** Relationship emphasis switches instantly without line drawing.

## Chapter 4 ? Work / project instruments

- **Initial visual state:** A sticky visual stage and visible three-project index. Fraud is selected first because it best demonstrates explainability.
- **Visitor action:** Choose a project, focus a metric/stage/layer, open the technical breakdown, or follow the GitHub context link.
- **Animation response:** The project title masks into place; the instrument changes with a shared aperture transition; ambient color and the Signal Rail update.
- **Content revealed:** Summary, provenance, outcome, recorded metrics, stack, technical breakdown, and source context.
- **3D state:** Fraud compresses the core into a threshold aperture; Weapon stretches it into a five-stage inference path; LifeXP separates it into product-system layers.
- **Transition:** After the third project, the signal leaves the instrument as three recorded outputs that converge into experience.
- **Mobile:** All three project summaries remain in flow. Tapping one expands its instrument and technical detail; no horizontal scroll trap or hover requirement.
- **Reduced motion:** Selected project swaps through a short opacity transition; diagrams remain static and readable.

### Fraud instrument

- Focusable documented metrics highlight corresponding labels in the evaluation diagram.
- The selected threshold is presented as the recorded evaluation strategy, not a live model simulator.
- No new precision or recall values are generated.

### Weapon-detection instrument

- Five focusable pipeline stages activate in order: camera feed, frame processing, YOLOv8, dynamic threshold, alert.
- Stage focus explains the role of that stage using existing project language.
- No camera footage, detections, latency figures, or deployment claims are fabricated.

### LifeXP instrument

- Interface, service, data, and recommendation layers can be inspected.
- Active, planned, and exploratory states remain explicitly labelled.
- The interaction demonstrates architecture only, not a finished product.

## Chapter 5 ? Context / convergence

- **Initial visual state:** Academic foundation, leadership, and recorded technical signals begin in separate lanes.
- **Visitor action:** Scroll or focus each evidence lane.
- **Animation response:** Lanes converge toward one impact aperture while important facts receive measured emphasis.
- **Content revealed:** NGO leadership, B.Tech education, CGPA provenance, student representation, and local-model exploration.
- **3D state:** Core layers align and reduce their depth, preparing to become one aperture.
- **Transition:** The three lanes meet at the edge of the amber closing field.
- **Mobile:** Lanes become an ordered sequence with a static convergence mark between items.
- **Reduced motion:** The converged state is shown immediately.

## Chapter 6 ? Contact / open channel

- **Initial visual state:** The amber field enters as the signal crosses its boundary. The opening core is now a single black aperture.
- **Visitor action:** Focus or choose email, LinkedIn, GitHub, resume, or return to origin.
- **Animation response:** The aperture subtly aligns with the focused action and the path terminates at that link. No custom cursor is used.
- **Content revealed:** Clear availability statement and direct contact actions.
- **3D state:** Layers fully converge; rendering becomes event-driven and stops at rest.
- **Transition:** Return to origin reverses the narrative state through a normal anchor jump or scroll.
- **Mobile:** Full-width actions with 44px targets; the aperture sits above the copy as a static resolution mark.
- **Reduced motion:** Static amber field and aperture; links retain focus and hover contrast only.

## Performance budget

- Initial JavaScript added by the creative pass: target less than 95 kB gzip beyond the existing app.
- Three.js is the only added 3D dependency and loads in a separate client chunk.
- No model, texture, video, or external scene download.
- Canvas DPR capped at 1.5 desktop and 1 mobile; antialiasing disabled on weaker devices.
- No continuous idle rotation. Render only on initialization, pointer damping, chapter changes, project changes, or resize.
- IntersectionObserver and document visibility pause work; renderer and geometry are disposed on unmount.
- Frequent motion uses transform, opacity, clip-path, and shader-free geometry changes.
- All content remains server-rendered and useful before the 3D chunk initializes.
