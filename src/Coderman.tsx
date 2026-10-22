import type { CSSProperties } from "react";
import "./Coderman.css";

const toolkit = [
  { name: "Node.js", glyph: "nodedotjs", x: 18, y: 139, color: "#9fe68b", side: "left" },
  { name: "Flutter", glyph: "flutter", x: 5, y: 198, color: "#6bd5ff", side: "left" },
  { name: "React", glyph: "react", x: 30, y: 257, color: "#83e8ff", side: "left" },
  { name: "Unreal", glyph: "unrealengine", x: 351, y: 169, color: "#e2f3ff", side: "right" },
  { name: "Unity", glyph: "unity", x: 368, y: 228, color: "#d0e4ee", side: "right" },
  { name: "Blender", glyph: "blender", x: 350, y: 287, color: "#ffb36c", side: "right" },
];

/** Shared rendered character; the toolkit remains sharp, animated vector UI. */
export function Coderman({ entrance = false }: { entrance?: boolean }) {
  return <div className={`coderman-stage cm-rendered ${entrance ? "is-entrance" : "is-idle"}`} aria-hidden="true">
    <div className="cm-aura" />
    <div className="cm-orbit orbit-one" /><div className="cm-orbit orbit-two" />
    <div className="cm-render-float">
      <img className="cm-render-image" src="/character/coderman-v2.webp" alt="" width="900" height="1200" fetchPriority="high" draggable="false" />
      <svg className="cm-toolkit" viewBox="0 0 480 580" fill="none">
        <g className="cm-hand-projections" stroke="#8cf1de">
          <path d="M105 238L63 162M105 238L53 221M105 238L78 280M394 274L403 192M394 274L420 251M394 274L402 310" strokeWidth=".8" opacity=".5" strokeDasharray="3 5" />
          <ellipse cx="105" cy="238" rx="40" ry="10" fill="#7dffe31a" />
          <ellipse cx="394" cy="274" rx="40" ry="10" fill="#7dffe31a" />
          <ellipse cx="105" cy="238" rx="27" ry="6" opacity=".5" />
          <ellipse cx="394" cy="274" rx="27" ry="6" opacity=".5" />
        </g>
        {toolkit.map((tool, i) => <g key={tool.name} transform={`translate(${tool.x} ${tool.y})`}>
          <g className={`cm-tool cm-tool-${tool.side}`} style={{ '--tool-delay': `${i * -.7}s`, color: tool.color } as CSSProperties}>
            <rect width="108" height="43" rx="8" fill="#0b1b25" fillOpacity=".94" stroke="currentColor" strokeOpacity=".65" />
            <path d="M9 2H30M78 41H99" stroke="currentColor" strokeWidth="2" />
            <rect x="9" y="9" width="26" height="25" rx="6" fill="currentColor" fillOpacity=".12" />
            <image href={`/character/tools/${tool.glyph}.svg`} x="13" y="12" width="18" height="18" />
            <text x="42" y="26" fill="#e7f4f5" fontSize="12" fontFamily="Space Grotesk, Arial, sans-serif">{tool.name}</text>
          </g>
        </g>)}
      </svg>
    </div>
    <div className="cm-hover-ring" /><div className="cm-ground" />
  </div>;
}

export function CodermanEntrance({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="cm-intro" role="dialog" aria-modal="true" aria-label="Coderman Studios entrance" onKeyDown={(event) => { if (event.key === "Escape") onFinish(); }}>
      <div className="cm-intro-brand">CODERMAN <span>STUDIOS</span></div>
      <button className="cm-skip" onClick={onFinish} autoFocus>Skip intro <span aria-hidden="true">↗</span></button>
      <div className="cm-intro-grid" />
      <div className="cm-intro-figure"><Coderman entrance /></div>
      <div className="cm-compile-wave" />
      <div className="cm-build-tiles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--tile": i } as CSSProperties} />)}
      </div>
      <div className="cm-intro-caption"><span>MEET CODERMAN</span><strong>Ideas become reality.</strong><small>THE COMPILE FIELD</small></div>
    </div>
  );
}

