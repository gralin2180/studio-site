import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  brand,
  businessDemos,
  packages,
  steps,
  waLink,
  works,
  type BusinessDemo,
  type FormFactor,
  type ThemeMode,
  type WorkItem,
  type WorkShot,
} from "./brand";
import { PineMark, PinekraftWord } from "./PineMark";
import "./App.css";

function primaryCta(): { href: string; label: string } {
  const wa = waLink(`Hi ${brand.legalName} — I want a fixed-price app built.`);
  if (wa) return { href: wa, label: "WhatsApp us" };
  if (brand.calendarUrl) return { href: brand.calendarUrl, label: "Book a fit call" };
  return { href: `mailto:${brand.email}`, label: "Email us" };
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function modeLabel(mode: ThemeMode) {
  return mode === "light" ? "Light mode" : "Dark mode";
}

function formLabel(form: FormFactor) {
  return form === "mobile" ? "Mobile app" : "Web app";
}

function shotCaption(s: WorkShot) {
  return `${s.label} · ${modeLabel(s.mode)} · ${formLabel(s.form)}`;
}

type LightboxState = {
  title: string;
  shots: WorkShot[];
  index: number;
} | null;

function ViewToggles({
  forms,
  modes,
  form,
  mode,
  onForm,
  onMode,
}: {
  forms: FormFactor[];
  modes: ThemeMode[];
  form: FormFactor;
  mode: ThemeMode;
  onForm: (f: FormFactor) => void;
  onMode: (m: ThemeMode) => void;
}) {
  return (
    <div className="store-toggles" role="group" aria-label="View options">
      <div className="toggle-group">
        <span className="toggle-label">Device</span>
        <div className="toggle-pills">
          {forms.map((f) => (
            <button
              key={f}
              type="button"
              className={form === f ? "toggle-pill is-active" : "toggle-pill"}
              aria-pressed={form === f}
              onClick={() => onForm(f)}
            >
              {formLabel(f)}
            </button>
          ))}
        </div>
      </div>
      <div className="toggle-group">
        <span className="toggle-label">Theme</span>
        <div className="toggle-pills">
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              className={mode === m ? "toggle-pill is-active" : "toggle-pill"}
              aria-pressed={mode === m}
              onClick={() => onMode(m)}
            >
              {modeLabel(m)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoreListing({
  w,
  onOpenGallery,
}: {
  w: WorkItem;
  onOpenGallery: (shots: WorkShot[], index: number, title: string) => void;
}) {
  const external = isExternal(w.href);
  const monogram = w.name.slice(0, 1).toUpperCase();
  const [form, setForm] = useState<FormFactor>(w.defaultForm ?? w.forms[0] ?? "mobile");
  const [mode, setMode] = useState<ThemeMode>(w.defaultMode ?? w.modes[0] ?? "light");
  const [broken, setBroken] = useState<Record<string, true>>({});

  const filtered = w.shots.filter(
    (s) => s.form === form && s.mode === mode && !broken[s.src],
  );

  return (
    <article className={`store-listing store-form-${form} store-mode-${mode}`}>
      <header className="store-head">
        <div className="store-icon" aria-hidden="true">
          {monogram}
        </div>
        <div className="store-meta">
          <h3>{w.name}</h3>
          <p className="store-kind">{w.kind}</p>
          <p className="store-stack">{w.stack}</p>
        </div>
        <a
          className="btn btn-primary store-cta"
          href={w.href}
          target="_blank"
          rel={external ? "noreferrer" : undefined}
        >
          {w.linkLabel}
        </a>
      </header>

      <ViewToggles
        forms={w.forms}
        modes={w.modes}
        form={form}
        mode={mode}
        onForm={setForm}
        onMode={setMode}
      />

      <p className="store-view-hint">
        Showing <strong>{formLabel(form)}</strong> in{" "}
        <strong>{modeLabel(mode).toLowerCase()}</strong>
        {filtered.length > 0 ? ` · ${filtered.length} screens` : null}
      </p>

      {filtered.length === 0 ? (
        <p className="store-empty">
          Screens for this combo are still rendering — try the other theme or device.
        </p>
      ) : (
        <div className="store-gallery" aria-label={`${w.name} screenshots`}>
          {filtered.map((s, i) => (
            <button
              key={`${s.src}-${s.label}`}
              type="button"
              className={`store-shot store-shot-${s.form}`}
              onClick={() =>
                onOpenGallery(filtered, i, `${w.name} · ${shotCaption(s)}`)
              }
            >
              <span className="shot-frame">
                <img
                  src={s.src}
                  alt={`${w.name} — ${shotCaption(s)}`}
                  loading="lazy"
                  onError={() =>
                    setBroken((prev) =>
                      prev[s.src] ? prev : { ...prev, [s.src]: true },
                    )
                  }
                />
              </span>
              <span className="shot-meta">
                <span className="shot-label">{s.label}</span>
                <span className="shot-tags">
                  {mode === "light" ? "Light" : "Dark"} ·{" "}
                  {form === "mobile" ? "Mobile" : "Web"}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="store-about-inline">{w.proof}</p>
    </article>
  );
}

function Lightbox({
  state,
  onClose,
  onPrev,
  onNext,
  onJump,
}: {
  state: NonNullable<LightboxState>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const shot = state.shots[state.index];
  const n = state.shots.length;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${state.title} screenshot gallery`}
      onClick={onClose}
    >
      <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
        <header className="lightbox-bar">
          <span className="lightbox-title">{state.title}</span>
          <span className="lightbox-count">
            {state.index + 1} / {n}
          </span>
          <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
            Close
          </button>
        </header>
        <div className={`lightbox-stage is-${shot.form} is-${shot.mode}`}>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={onPrev}
            aria-label="Previous image"
            disabled={n <= 1}
          >
            ‹
          </button>
          <img src={shot.src} alt={shotCaption(shot)} />
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={onNext}
            aria-label="Next image"
            disabled={n <= 1}
          >
            ›
          </button>
        </div>
        <p className="lightbox-caption">{shotCaption(shot)}</p>
        <div className="lightbox-thumbs">
          {state.shots.map((thumb, i) => (
            <button
              key={`${thumb.src}-${thumb.label}-${i}`}
              type="button"
              className={
                i === state.index ? "lightbox-thumb is-active" : "lightbox-thumb"
              }
              onClick={() => onJump(i)}
              aria-label={`Go to ${shotCaption(thumb)}`}
            >
              <img src={thumb.src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Live multi-page app UI for each industry type. */
function MockScreen({
  demo,
  screen,
  mode,
  form,
}: {
  demo: BusinessDemo;
  screen: (typeof demo.screens)[number];
  mode: ThemeMode;
  form: FormFactor;
}) {
  const dark = mode === "dark";
  const tabs = demo.screens.map((s) => s.label);

  return (
    <div
      className={`biz-mock layout-${screen.layout} form-${form} ${dark ? "is-dark" : "is-light"}`}
      style={
        {
          "--biz-accent": demo.accent,
          "--biz-soft": demo.accentSoft,
        } as CSSProperties
      }
    >
      <div className="biz-status" aria-hidden="true">
        <span>9:41</span>
        <span className="biz-status-icons">●●●</span>
      </div>

      <header className="biz-appbar">
        <div>
          <p className="biz-type">{demo.type}</p>
          <h4>{screen.title}</h4>
        </div>
        <span className="biz-avatar" aria-hidden="true">
          {demo.type.slice(0, 1)}
        </span>
      </header>

      {screen.meta && screen.meta.length > 0 ? (
        <div className="biz-stats">
          {screen.meta.map((m) => (
            <div key={m} className="biz-stat">
              <strong>{m.split(" ")[0]}</strong>
              <span>{m.split(" ").slice(1).join(" ") || "today"}</span>
            </div>
          ))}
        </div>
      ) : null}

      <p className="biz-sub">{screen.sub}</p>

      {screen.layout === "map" ? (
        <div className="biz-map" aria-hidden="true">
          <div className="biz-map-grid" />
          <span className="biz-pin pin-a" />
          <span className="biz-pin pin-b" />
          <span className="biz-pin pin-c" />
          <ul className="biz-map-list">
            {screen.rows.slice(0, 2).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {screen.layout === "schedule" ? (
        <div className="biz-week" aria-hidden="true">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={`${d}-${i}`} className={i === 2 ? "is-on" : undefined}>
              {d}
            </span>
          ))}
        </div>
      ) : null}

      {screen.layout === "form" ? (
        <div className="biz-fields">
          {screen.rows.map((row) => (
            <label key={row} className="biz-field">
              <span>{row}</span>
              <span className="biz-input" />
            </label>
          ))}
        </div>
      ) : null}

      {screen.layout === "confirm" ? (
        <div className="biz-confirm">
          <div className="biz-check" aria-hidden="true">
            ✓
          </div>
          <ul className="biz-rows">
            {screen.rows.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {screen.layout === "checkout" ? (
        <div className="biz-checkout">
          {screen.rows.map((row, i) => (
            <div key={row} className={i === screen.rows.length - 1 ? "biz-total" : "biz-line"}>
              <span>{row.split("·")[0]?.trim() ?? row}</span>
              <strong>{row.includes("·") ? row.split("·").slice(1).join("·").trim() : ""}</strong>
            </div>
          ))}
        </div>
      ) : null}

      {(screen.layout === "dashboard" ||
        screen.layout === "board" ||
        screen.layout === "tickets") && (
        <ul className={`biz-rows is-${screen.layout}`}>
          {screen.rows.map((row, i) => (
            <li key={row}>
              <span className="biz-mark">{screen.layout === "tickets" ? `#${i + 1}` : ""}</span>
              <span className="biz-row-text">{row}</span>
              <span className="biz-chip">{i === 0 ? "Live" : i === 1 ? "Open" : "Queued"}</span>
            </li>
          ))}
        </ul>
      )}

      {screen.layout === "map" || screen.layout === "schedule" ? (
        <ul className="biz-rows compact">
          {screen.rows.map((row) => (
            <li key={row}>
              <span className="biz-row-text">{row}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <button type="button" className="biz-cta" tabIndex={-1}>
        {screen.cta}
      </button>

      <nav className="biz-tabs-bar" aria-hidden="true">
        {tabs.map((t) => (
          <span key={t} className={t === screen.label ? "is-active" : undefined}>
            {t}
          </span>
        ))}
      </nav>
    </div>
  );
}

function BusinessShowcase() {
  const [activeId, setActiveId] = useState(businessDemos[0].id);
  const demo = businessDemos.find((d) => d.id === activeId) ?? businessDemos[0];
  const [form, setForm] = useState<FormFactor>("mobile");
  const [mode, setMode] = useState<ThemeMode>("light");

  return (
    <section id="designs" className="biz-section" aria-label="Design templates">
      <div className="section-head">
        <h2>Design templates</h2>
        <p>
          Ready-made UI systems for common industries. Each template includes four core
          screens — switch device size and light/dark to review the full surface before
          we scope your build.
        </p>
      </div>

      <div className="biz-tabs" role="tablist" aria-label="Template types">
        {businessDemos.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === activeId}
            className={d.id === activeId ? "biz-tab is-active" : "biz-tab"}
            onClick={() => setActiveId(d.id)}
          >
            {d.type}
          </button>
        ))}
      </div>

      <div className="biz-panel">
        <header className="biz-panel-head">
          <div>
            <h3>{demo.type}</h3>
            <p>{demo.blurb}</p>
          </div>
          <ViewToggles
            forms={["mobile", "web"]}
            modes={["light", "dark"]}
            form={form}
            mode={mode}
            onForm={setForm}
            onMode={setMode}
          />
        </header>

        <p className="store-view-hint">
          Showing <strong>{formLabel(form)}</strong> in{" "}
          <strong>{modeLabel(mode).toLowerCase()}</strong> · {demo.screens.length}{" "}
          screens
        </p>

        <div className={`biz-gallery is-${form}`}>
          {demo.screens.map((s) => (
            <figure key={s.id} className={`biz-frame is-${form} is-${mode}`}>
              <MockScreen demo={demo} screen={s} mode={mode} form={form} />
              <figcaption>
                <span className="shot-label">{s.label}</span>
                <span className="shot-tags">
                  {mode === "light" ? "Light" : "Dark"} ·{" "}
                  {form === "mobile" ? "Mobile" : "Web"}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const cta = primaryCta();
  const year = new Date().getFullYear();
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const openGallery = useCallback((shots: WorkShot[], index: number, title: string) => {
    setLightbox({ shots, index, title });
  }, []);

  const closeGallery = useCallback(() => setLightbox(null), []);

  const goPrev = useCallback(() => {
    setLightbox((s) => {
      if (!s) return s;
      return { ...s, index: (s.index - 1 + s.shots.length) % s.shots.length };
    });
  }, []);

  const goNext = useCallback(() => {
    setLightbox((s) => {
      if (!s) return s;
      return { ...s, index: (s.index + 1) % s.shots.length };
    });
  }, []);

  return (
    <div className="site">
      <header className="top">
        <a className="logo" href="#top" aria-label={`${brand.name} ${brand.studioWord}`}>
          <PineMark className="lockup-pine" />
          <span className="logo-text" aria-hidden="true">
            <PinekraftWord />
            <span className="logo-studios"> {brand.studioWord}</span>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#packages">Packages</a>
          <a href="#work">Apps</a>
          <a href="#designs">Designs</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="Introduction">
          <div className="hero-stack">
          <p className="hero-eyebrow">App &amp; web studio</p>
          <div className="brand-mark" aria-label={`${brand.name} ${brand.studioWord}`}>
            <PineMark className="lockup-pine" />
            <PinekraftWord className="lockup-name" />
            <span className="brand-studios">{brand.studioWord}</span>
          </div>
          <h1>{brand.tagline}</h1>
          <p className="hero-lead">{brand.oneLiner}</p>
          <p className="hero-what">
            Websites, booking tools, online stores, and custom ops apps. Scope first,
            clear estimate, then build — usually live in 7–14 days.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href={cta.href}>
              {cta.label}
            </a>
            <a className="btn btn-ghost" href="#packages">
              View packages
            </a>
            <a className="btn btn-ghost" href="#work">
              See our apps
            </a>
          </div>
          <ul className="hero-stats">
            <li>
              <span>From</span>
              <strong>$199</strong>
            </li>
            <li>
              <span>Typical delivery</span>
              <strong>7–14 days</strong>
            </li>
            <li>
              <span>Payment</span>
              <strong>50% start · 50% live</strong>
            </li>
            <li>
              <span>Adjustable</span>
              <strong>Quotes by scope</strong>
            </li>
          </ul>
          </div>
        </section>

        <section id="packages">
          <div className="section-head">
            <h2>Packages</h2>
            <p>
              Starting estimates for common builds. Final price is adjusted to your
              scope, features, and timeline — so you only pay for what you need. Fifty
              percent to start, fifty on delivery.
            </p>
          </div>
          <p className="packages-note">
            These are <strong>estimated rates</strong>. We can go lower for a tight MVP
            or higher for more screens and integrations. You get a clear quote before
            any deposit.
          </p>
          <div className="package-grid">
            {packages.map((p) => (
              <article key={p.id} className="package-card">
                <header className="package-card-head">
                  <h3>{p.name}</h3>
                  <span className="package-days">{p.days}</span>
                </header>
                <p className="package-blurb">{p.blurb}</p>
                <ul className="package-includes">
                  {p.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="package-foot">
                  <div>
                    <span className="package-est-label">Starting estimate</span>
                    <div className="price">{p.price}</div>
                  </div>
                  <a className="btn btn-ghost package-cta" href={cta.href}>
                    Get quote
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work">
          <div className="section-head">
            <h2>Our Apps</h2>
            <p>
              Real products we have built. Switch mobile/web and light/dark to see each
              product surface. Tap a frame to enlarge.
            </p>
          </div>
          <div className="store-rail">
            {works.map((w) => (
              <StoreListing key={w.name} w={w} onOpenGallery={openGallery} />
            ))}
          </div>
        </section>

        <BusinessShowcase />

        <section id="process">
          <div className="section-head">
            <h2>How we work</h2>
            <p>Four steps from first note to live.</p>
          </div>
          <div className="process">
            {steps.map((s) => (
              <div key={s.n} className="step">
                <div className="n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact">
          <div className="contact-block">
            <div>
              <h2>Tell us what you need</h2>
              <p>
                Fifteen minutes: what users do today, what version one must do, budget,
                and timing. Same-day written estimate when it is a fit.
              </p>
            </div>
            <div className="contact-actions">
              <a className="btn btn-primary" href={cta.href}>
                {cta.label}
              </a>
              <a className="btn btn-ghost" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
              <p className="note">
                Free pilots: build free on capped scope. You own the domain.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div>
          <strong>{brand.legalName}</strong>
          <span> · Fixed-price apps and sites, built to order</span>
        </div>
        <div>
          © {year} · {brand.domain}
        </div>
      </footer>

      {lightbox ? (
        <Lightbox
          state={lightbox}
          onClose={closeGallery}
          onPrev={goPrev}
          onNext={goNext}
          onJump={(i) => setLightbox((s) => (s ? { ...s, index: i } : s))}
        />
      ) : null}
    </div>
  );
}
