import { ImageResponse } from "next/og";

export const alt = "Yashmit Singh - From model accuracy to useful decisions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#111318", color: "#f1f0e9", padding: "68px 76px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <strong>Yashmit Singh</strong>
          <span style={{ color: "#e1a62b" }}>Explainable AI · Product Engineering</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <span style={{ color: "#a9abb3", fontSize: 26, marginBottom: 22 }}>From model accuracy</span>
            <span style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-3px", fontWeight: 700 }}>to useful decisions.</span>
          </div>
          <div style={{ width: 190, height: 190, border: "2px solid #e1a62b", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)" }}>
            <span style={{ fontSize: 48, transform: "rotate(-45deg)" }}>YS</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
