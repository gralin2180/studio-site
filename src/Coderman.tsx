import { useId } from "react";
import "./Coderman.css";

/** Original vector character, shared by the entrance and the persistent hero art. */
export function Coderman({ entrance = false }: { entrance?: boolean }) {
  const id = useId().replaceAll(":", "");
  return (
    <div className={`coderman-stage ${entrance ? "is-entrance" : "is-idle"}`} aria-hidden="true">
      <div className="cm-aura" />
      <div className="cm-orbit orbit-one" /><div className="cm-orbit orbit-two" />
      <svg className="cm-character" viewBox="0 0 480 580" fill="none">
        <defs>
          <linearGradient id={`${id}-armor`} x1="120" y1="80" x2="330" y2="490" gradientUnits="userSpaceOnUse">
            <stop stopColor="#657a9a" /><stop offset=".35" stopColor="#26384f" /><stop offset=".72" stopColor="#101e32" /><stop offset="1" stopColor="#394e6c" />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="180" y1="100" x2="290" y2="330" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d1e3f7" /><stop offset=".5" stopColor="#6c8db8" /><stop offset="1" stopColor="#28405f" />
          </linearGradient>
          <linearGradient id={`${id}-energy`} x1="145" y1="180" x2="340" y2="350" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b2fff2" /><stop offset=".5" stopColor="#61ddff" /><stop offset="1" stopColor="#3568ff" />
          </linearGradient>
        </defs>
        <g className="cm-body">
          {/* Floating back fins: a broken geometric mantle, not a cape. */}
          <path d="M179 180L132 203L157 342L185 296M298 179L344 203L320 342L293 296" fill="#102239" stroke="#365b80" strokeWidth="2" />
          <path d="M140 217L159 303M335 217L319 303" stroke="#508dff" strokeWidth="3" />
          {/* Offset legs and articulated boots. */}
<g className="cm-legs">
          <path d="M198 310L234 324L228 400L210 430L177 425L183 365Z" fill={`url(#${id}-armor)`} stroke="#4d6685" strokeWidth="2" />
          <path d="M244 324L281 310L298 371L289 425L260 429L246 396Z" fill={`url(#${id}-armor)`} stroke="#4d6685" strokeWidth="2" />
          <path d="M184 397L217 401L208 464L198 489L160 490L163 473L177 456Z" fill="#17283f" stroke="#526d8c" strokeWidth="2" />
          <path d="M261 401L289 397L299 456L316 474L314 490L276 488L264 463Z" fill="#17283f" stroke="#526d8c" strokeWidth="2" />
          <path d="M182 415L194 419L182 466M278 417L283 461" stroke="#66cbff" strokeWidth="3" />
          <path d="M162 487L194 487M280 487L312 488" stroke="#91f8ed" strokeWidth="3" />
          <path d="M184 397L200 385L219 399L207 415L190 413Z M260 399L276 385L290 397L285 413L269 415Z" fill={`url(#${id}-edge)`} />
          </g>
{/* Core suit. */}
          <path d="M189 171L215 159H263L291 174L283 246L269 283L280 316L241 342L195 317L206 281L189 245Z" fill={`url(#${id}-armor)`} stroke="#6785a8" strokeWidth="2" />
          <path d="M191 181L216 169L239 184L262 169L289 181L277 221L241 242L203 222Z" fill={`url(#${id}-edge)`} />
          <path d="M215 192L240 202L265 192L257 225L239 236L222 226Z" fill="#0b1728" />
          <path className="cm-core" d="M250 203H233L226 210V224H242L250 217" stroke={`url(#${id}-energy)`} strokeWidth="5" />
          <path d="M211 248L238 262L267 248M210 267L239 281L266 267M207 289L239 300L271 288" stroke="#6885a8" strokeWidth="2" />
          <path d="M193 232L206 251L213 279M285 232L274 251L267 280" stroke="#579dff" strokeWidth="3" />
          <path d="M203 306L239 319L274 305" stroke="#95b5d9" strokeWidth="4" />
          {/* Hands held out to compose a field, with asymmetric segmented gauntlets. */}
          <g className="cm-arm-left">
            <path d="M190 179L168 174L148 190L151 225L170 239L195 213Z" fill={`url(#${id}-edge)`} stroke="#7c98b8" strokeWidth="2" />
            <path d="M155 219L175 234L147 275L121 280L113 263Z" fill={`url(#${id}-armor)`} stroke="#587493" strokeWidth="2" />
            <path d="M121 259L149 276L125 295L93 287L87 268Z" fill="#293f5c" stroke="#89a4c5" strokeWidth="2" />
            <path d="M92 270L77 259L62 261L62 270L77 278L62 281L51 275L47 282L60 293L80 296L95 286" fill="#8da6c2" stroke="#b0cee8" strokeWidth="2" strokeLinejoin="round" />
            <path d="M106 266L125 278M116 261L135 273" stroke="#7ff4ee" strokeWidth="3" />
          </g>
          <g className="cm-arm-right">
            <path d="M289 178L312 174L331 192L327 225L308 240L283 212Z" fill={`url(#${id}-edge)`} stroke="#7c98b8" strokeWidth="2" />
            <path d="M325 220L307 236L336 270L363 268L368 250Z" fill={`url(#${id}-armor)`} stroke="#587493" strokeWidth="2" />
            <path d="M338 269L362 247L386 260L385 282L354 290Z" fill="#293f5c" stroke="#89a4c5" strokeWidth="2" />
            <path d="M383 263L400 252L417 253L420 261L403 271L419 274L430 265L436 272L422 288L401 291L383 280" fill="#8da6c2" stroke="#b0cee8" strokeWidth="2" strokeLinejoin="round" />
            <path d="M355 265L373 276M347 270L365 282" stroke="#7ff4ee" strokeWidth="3" />
          </g>
          {/* Faceted helmet with a single offset visor, no facial features. */}
          <path d="M220 146H261V170L241 185L218 168Z" fill="#122239" stroke="#526b88" strokeWidth="2" />
          <path d="M206 91L229 75L259 78L278 98L275 139L253 161L226 157L206 135L201 109Z" fill={`url(#${id}-armor)`} stroke="#7d9bbe" strokeWidth="2" />
          <path d="M208 95L231 82L255 85L271 100L264 109L219 111Z" fill="#8da7c5" />
          <path d="M208 113L273 109L270 126L217 130Z" fill="#071320" />
          <path className="cm-visor" d="M214 118L266 115L257 122L220 125Z" fill="#9bfff4" />
          <path d="M221 135L240 141L262 133L251 153L230 151Z" fill="#476487" />
          <path d="M205 98L202 119M276 100L281 119" stroke="#7adaff" strokeWidth="3" />
        </g>
        <g className="cm-field" stroke={`url(#${id}-energy)`} strokeWidth="2">
          <path className="cm-hand-field" d="M34 242L77 224L112 244L71 262ZM373 239L413 219L452 239L411 260Z" />
          <path d="M34 242V253L71 274L112 254V244M373 239V251L411 272L452 251V239" opacity=".45" />
          <path d="M77 224V211M413 219V206" strokeDasharray="3 5" />
          <g className="cm-tile tile-a"><path d="M53 198L73 187L93 198L73 210Z" fill="#5cd4ff22" /><path d="M67 196L63 199L67 202M78 193L82 196L78 199" /></g>
          <g className="cm-tile tile-b"><path d="M389 186L413 173L438 186L413 200Z" fill="#5cd4ff22" /><path d="M403 186L409 189L422 182" /></g>
          <g className="cm-tile tile-c"><path d="M106 143H128V165H106Z" fill="#467bff30" /><path d="M112 151H122M112 157H118" /></g>
          <g className="cm-tile tile-d"><path d="M349 135H366V152H349Z" fill="#467bff30" /></g>
          <path className="cm-levitation" d="M150 517L238 491L328 517L239 546ZM182 517L239 502L295 517L239 533Z" opacity=".7" />
          <path d="M165 535L238 556L313 535" opacity=".25" />
        </g>
      </svg>
      <div className="cm-ground" />
    </div>
  );
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
        {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--tile": i } as React.CSSProperties} />)}
      </div>
      <div className="cm-intro-caption"><span>MEET CODERMAN</span><strong>Ideas become reality.</strong><small>THE COMPILE FIELD</small></div>
    </div>
  );
}

