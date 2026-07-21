export function FraudDecisionPlot() {
  return (
    <figure className="project-figure project-figure--fraud">
      <figcaption>Evaluation view · precision / recall trade-off</figcaption>
      <svg viewBox="0 0 640 320" role="img" aria-labelledby="fraud-plot-title fraud-plot-desc">
        <title id="fraud-plot-title">Fraud framework precision-recall evaluation</title>
        <desc id="fraud-plot-desc">
          A stylized evaluation plot showing a high precision region and a selected operating threshold. It explains the project decision; it is not raw experimental output.
        </desc>
        <line x1="64" y1="32" x2="64" y2="264" className="plot-axis" />
        <line x1="64" y1="264" x2="596" y2="264" className="plot-axis" />
        <line x1="64" y1="92" x2="596" y2="92" className="plot-guide" />
        <line x1="64" y1="176" x2="596" y2="176" className="plot-guide" />
        <path d="M64 62 C140 70 188 82 250 104 C322 130 380 162 442 204 C500 242 548 254 596 258" className="plot-line" />
        <circle cx="296" cy="122" r="8" className="plot-point" />
        <line x1="296" y1="122" x2="296" y2="264" className="plot-threshold" />
        <text x="312" y="116" className="plot-label">selected threshold</text>
        <text x="14" y="42" className="plot-label">precision</text>
        <text x="526" y="302" className="plot-label">recall</text>
      </svg>
      <p>Explanatory diagram based on the documented evaluation strategy—not a substituted screenshot.</p>
    </figure>
  );
}

export function VisionPipeline() {
  const stages = ["Camera feed", "Frame processing", "YOLOv8", "Threshold", "Alert"];
  return (
    <figure className="project-figure project-figure--vision">
      <figcaption>Continuous inference path</figcaption>
      <div className="vision-track" role="img" aria-label="Camera feed flows through frame processing, YOLOv8 inference, a dynamic threshold, and an alert stage">
        {stages.map((stage, index) => (
          <div className="vision-stage" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
          </div>
        ))}
      </div>
      <div className="vision-scan" aria-hidden="true"><span /></div>
      <p>Pipeline diagram. Project footage or product screenshots are not present in the repository.</p>
    </figure>
  );
}

export function LifeXPSystem() {
  return (
    <figure className="project-figure project-figure--lifexp">
      <figcaption>Active-build architecture</figcaption>
      <div className="system-stack" role="img" aria-label="Next.js interface connects to a FastAPI service, PostgreSQL progress data, and a planned recommendation layer">
        <div><span>Interface</span><strong>Next.js</strong></div>
        <div><span>Service</span><strong>FastAPI</strong></div>
        <div><span>Progress</span><strong>PostgreSQL</strong></div>
        <div className="system-stack__planned"><span>Planned</span><strong>Recommendation layer</strong></div>
      </div>
      <p>Implementation status is taken from the existing portfolio and should be reviewed as the product changes.</p>
    </figure>
  );
}
