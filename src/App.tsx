import { useCallback, useEffect, useRef, useState } from "react";
import {
  brand,
  packages,
  works,
  type WorkItem,
  type FormFactor,
  type ThemeMode,
} from "./brand";
import "./App.css";
import Assistant from "./Assistant";
import { Coderman, CodermanEntrance } from "./Coderman";

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <path d="M62 18H30L14 34V62H50L64 48" stroke="currentColor" strokeWidth="12" strokeLinejoin="miter" />
      <path d="M42 32L34 40L42 48M54 32L62 40L54 48" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}
const Arrow = () => <span aria-hidden="true">↗</span>;
const descriptions: Record<string, string> = {
  Plethora: "A little less searching. A lot more possibility.",
  Acumen: "Turning curiosity into a daily habit.",
  LOOM: "A thoughtful storefront for everyday essentials.",
  FORMA: "A space to find your sound.",
};

function ProjectGallery({
  work,
  close,
}: {
  work: WorkItem;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<FormFactor>("web");
  const [mode, setMode] = useState<ThemeMode>(work.modes.includes("dark") ? "dark" : "light");
  const [index, setIndex] = useState(0);
  const shots = work.shots.filter((s) => s.form === form && s.mode === mode);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  function move(by: number) {
    setIndex((i) => (i + by + shots.length) % shots.length);
  }
  return (
    <dialog
      ref={dialog}
      aria-label={work.name + " project gallery"}
      className="gallery"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") move(1);
        if (e.key === "ArrowLeft") move(-1);
      }}
    >
      <div className="gallery-inner">
        <header>
          <div>
            <span className="eyebrow">PROJECT EXPLORER</span>
            <h2>{work.name}</h2>
          </div>
          <button
            className="circle-button"
            onClick={close}
            aria-label="Close project gallery"
          >
            ×
          </button>
        </header>
        <div className="gallery-options">
          <div role="group" aria-label="Device">
            {work.forms.map((f) => (
              <button
                key={f}
                aria-pressed={form === f}
                onClick={() => {
                  setForm(f);
                  setIndex(0);
                }}
              >
                {f === "web" ? "Desktop" : "Mobile"}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Theme">
            {work.modes.map((m) => (
              <button
                key={m}
                aria-pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setIndex(0);
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className={"gallery-image " + form}>
          <img
            src={shots[index].src}
            alt={`${work.name}: ${shots[index].label}, ${mode} ${form} view`}
          />
        </div>
        <div className="gallery-navigation">
          <button onClick={() => move(-1)} aria-label="Previous screenshot">
            ←
          </button>
          <span>
            {shots[index].label}{" "}
            <small>
              {index + 1} / {shots.length}
            </small>
          </span>
          <button onClick={() => move(1)} aria-label="Next screenshot">
            →
          </button>
        </div>
        <p>{work.proof}</p>
        {work.href.startsWith("/demos/") && (
          <a
            className="button dark"
            href={work.href}
            target="_blank"
            rel="noreferrer"
          >
            Explore live demo <Arrow />
          </a>
        )}
      </div>
    </dialog>
  );
}

export default function App() {
  const [intro, setIntro] = useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try { return sessionStorage.getItem("coderman-intro-v1") !== "seen"; } catch { return true; }
  });
  const replayButton = useRef<HTMLButtonElement>(null);
  const replaying = useRef(false);
  const finishIntro = useCallback(() => {
    setIntro(false);
    try { sessionStorage.setItem("coderman-intro-v1", "seen"); } catch { /* Storage is optional. */ }
    requestAnimationFrame(() => {
      const destination = replaying.current ? replayButton.current : document.querySelector<HTMLElement>("#main");
      destination?.focus({ preventScroll: true });
      replaying.current = false;
    });
  }, []);
  useEffect(() => {
    if (!intro) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = window.setTimeout(finishIntro, 3500);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => { if (motion.matches) finishIntro(); };
    motion.addEventListener("change", onMotion);
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = previousOverflow;
      motion.removeEventListener("change", onMotion);
    };
  }, [intro, finishIntro]);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<WorkItem | null>(null);
  const [service, setService] = useState("A website");
  const [brief, setBrief] = useState("");
  const emailHref = `mailto:${brand.email}?subject=${encodeURIComponent("A new project for Coderman Studios — " + service)}&body=${encodeURIComponent(brief)}`;
  const ordered = [works[1], works[2], works[0], works[3]];
  return (
    <>
    {intro && <CodermanEntrance onFinish={finishIntro} />}
    <div className="site" inert={intro}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="wordmark" href="#" aria-label="Coderman Studios home">
          <Mark />
          <span className="wordmark-text">Coderman<span>Studios</span></span>
        </a>
        <nav
          className={menu ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          {[
            ["Work", "work"],
            ["What we do", "services"],
            ["Our approach", "approach"],
          ].map(([label, id]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          Let's talk <Arrow />
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Close" : "Menu"}
        </button>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap">
          <div className="hero-top">
            <span className="eyebrow">
              <span className="status-dot" /> INDEPENDENT DIGITAL STUDIO
            </span>
            <span className="hero-index">DESIGN / CODE / EXPERIENCE</span>
          </div>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>
                Ideas into
                <br />
                working
                <br />
                <span className="accent">worlds.</span>
              </h1>
              <p>
                Websites, apps, and interactive experiences. We bring design
                and engineering together to turn your idea into something real.
              </p>
              <a className="button dark" href="#work">
                Explore our work <span aria-hidden="true">↘</span>
              </a>
              <button ref={replayButton} className="cm-replay" onClick={() => {
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                replaying.current = true; setIntro(true);
              }}><span aria-hidden="true">▷</span> Meet Coderman</button>
            </div>
            <div
              className="hero-art"
              aria-label="Coderman in sleek graphite armor, levitating with holographic Node.js, Flutter, React, Unreal Engine, Unity and Blender tools above his hands"
              role="img"
            >
              <div className="art-grid" />
              <Coderman />
              <span className="art-label">THE COMPILE FIELD</span>
              <span className="art-number">CM—01</span>
              <span className="art-cross">+</span>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              A small studio.
              <br />
              <strong>Built with purpose.</strong>
            </p>
            <p>
              From the first prototype to the final release,
              <br />
              we make ideas work in the real world.
            </p>
            <a href="#work" aria-label="Scroll to selected work">
              ↓
            </a>
          </div>
        </section>
        <div className="capability-strip">
          <div className="wrap">
            <span>Websites</span>
            <i>✳</i>
            <span>Apps & AI tools</span>
            <i>✳</i>
            <span>Unreal & XR</span>
            <i>✳</i>
            <span>Virtual production</span>
            <i>✳</i>
          </div>
        </div>
        <section className="work-section wrap section" id="work">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / SELECTED WORK</span>
              <h2>
                Less talk.
                <br />
                More <em>this.</em>
              </h2>
            </div>
            <p>
              A few things we've brought to life.
              <br />
              Open a project to look a little closer.
            </p>
          </div>
          <div className="project-grid">
            {ordered.map((w, i) => (
              <article
                className={"project project-" + w.name.toLowerCase()}
                key={w.name}
              >
                <button
                  className="project-preview"
                  onClick={() => setActive(w)}
                  aria-label={"Explore " + w.name}
                >
                  <div className="preview-top">
                    <span>{w.kind}</span>
                    <span>0{i + 1}</span>
                  </div>
                  <div className="browser-frame">
                    <div className="browser-bar">
                      <i />
                      <i />
                      <i />
                      <span>{w.name.toLowerCase()} / preview</span>
                    </div>
                    <img
                      src={
                        w.shots.find(
                          (s) =>
                            s.form === "web" &&
                            s.mode === (w.modes.includes("dark") ? "dark" : "light"),
                        )!.src
                      }
                      alt={w.name + " website preview"}
                      loading="lazy"
                    />
                  </div>
                  <span className="project-open">
                    <Arrow />
                  </span>
                </button>
                <div className="project-meta">
                  <div>
                    <h3>{w.name}</h3>
                    <p>{descriptions[w.name]}</p>
                  </div>
                  <button
                    aria-label={"View " + w.name + " gallery"}
                    onClick={() => setActive(w)}
                  >
                    ↗
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="services-section" id="services">
          <div className="wrap section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">02 / WHAT WE DO</span>
                <h2>
                  Good design.
                  <br />
                  Real-world function.
                </h2>
              </div>
              <p>
                One partner from idea to launch.
                <br />
                Web packages below. Interactive projects scoped individually.
              </p>
            </div>
            <div className="services-list">
              {packages.map((p, i) => (
                <article key={p.id}>
                  <span className="service-number">0{i + 1}</span>
                  <div>
                    <h3>
                      {
                        [
                          "Websites that make an impression.",
                          "Bookings without the back-and-forth.",
                          "Software shaped around you.",
                          "A little care goes a long way.",
                        ][i]
                      }
                    </h3>
                    <p>{p.blurb}</p>
                    <div className="service-tags">
                      {p.includes.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="service-price">
                    <strong>{p.price}</strong>
                    <span>{p.days}</span>
                    <a
                      href="#contact"
                      onClick={() =>
                        setService(
                          [
                            "A website",
                            "A booking platform",
                            "A custom app",
                            "Ongoing support",
                          ][i],
                        )
                      }
                    >
                      Let's build it <Arrow />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="interactive-services">
              <span className="eyebrow">BEYOND THE BROWSER</span>
              <div className="interactive-grid">
                {[
                  ["Unreal & multiplayer", "Gameplay systems, interactive prototypes, and multiplayer experiences."],
                  ["XR & virtual production", "VR, MR, and real-time worlds built for interaction and storytelling."],
                  ["AI workflow tools", "Purpose-built tools that connect your data, models, and everyday workflows."],
                ].map(([title, description]) => (
                  <article key={title}>
                    <h3>{title}</h3><p>{description}</p>
                    <a href="#contact" onClick={() => setService(title)}>Discuss your project <Arrow /></a>
                  </article>
                ))}
              </div>
            </div>
            <p className="pricing-note">
              Prices in USD. Final scope and estimate agreed before we start.
            </p>
          </div>
        </section>
        <section className="approach-section wrap section" id="approach">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / THE CODERMAN APPROACH</span>
              <h2>
                Good work doesn't
                <br />
                happen by accident.
              </h2>
            </div>
            <p>
              We ask the right questions, sweat the details,
              <br />
              and keep you part of the process.
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "Understand",
                "We start with your business, your people, and what this needs to do. Good questions come before good design.",
              ],
              [
                "Make it clear",
                "A focused scope. A clear price. A shared direction. You know what we’re building and why.",
              ],
              [
                "Build together",
                "See the work as it takes shape. We design, develop, and refine with your feedback along the way.",
              ],
              [
                "Put it out there",
                "Tested across screens and ready for real people. We help you launch, hand it over, and plan what’s next.",
              ],
            ].map(([title, body], i) => (
              <article key={title}>
                <span>
                  0{i + 1}
                  <b aria-hidden="true">↗</b>
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="wrap contact-layout">
            <div>
              <span className="eyebrow">HAVE SOMETHING IN MIND?</span>
              <h2>
                Let's make
                <br />
                it <em>happen.</em>
                <Arrow />
              </h2>
              <p>
                A new idea. A fresh start. Something that could work better.
                <br />
                We'd love to hear it.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = emailHref;
              }}
            >
              <label htmlFor="service">I'm looking for</label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {[
                  "A website",
                  "A booking platform",
                  "A custom app",
                  "Ongoing support",
                  "Unreal & multiplayer",
                  "XR & virtual production",
                  "AI workflow tools",
                  "Something else",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <label htmlFor="brief">A little about your idea</label>
              <textarea
                id="brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="What are you building? Who is it for?"
                rows={3}
                required
              />
              <button className="button dark" type="submit">
                Start a conversation <Arrow />
              </button>
              <small>Opens your email app with your project brief.</small>
            </form>
          </div>
        </section>
      </main>
      <footer className="wrap footer">
        <a className="wordmark" href="#">
          <Mark />
          <span className="wordmark-text">Coderman<span>Studios</span></span>
        </a>
        <p>Design with intent. Build with precision.</p>
        <span>© {new Date().getFullYear()} {brand.legalName}</span>
        <a href="#">Back to top ↑</a>
      </footer>
      {!intro && <Assistant />}
      {active && <ProjectGallery work={active} close={() => setActive(null)} />}
    </div>
    </>
  );
}


