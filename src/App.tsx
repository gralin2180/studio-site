import { useEffect, useRef, useState } from "react";
import {
  brand,
  packages,
  works,
  type WorkItem,
  type FormFactor,
  type ThemeMode,
} from "./brand";
import "./App.css";

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M64 12H32C18 12 10 20 10 32s9 20 22 20h16c7 0 10 4 10 9s-4 9-11 9H16"
        stroke="currentColor"
        strokeWidth="17"
      />
      <path
        d="M64 10H33c-7 0-11 4-11 9s4 9 11 9h15c14 0 22 8 22 20s-8 20-22 20H16"
        stroke="currentColor"
        strokeWidth="4"
      />
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
  const [mode, setMode] = useState<ThemeMode>(work.defaultMode ?? "light");
  const [index, setIndex] = useState(0);
  const shots = work.shots.filter((s) => s.form === form && s.mode === mode);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const modal = dialog.current;
    modal?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
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
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<WorkItem | null>(null);
  const [service, setService] = useState("A website");
  const [brief, setBrief] = useState("");
  const emailHref = `mailto:${brand.email}?subject=${encodeURIComponent("A new project for Simplith — " + service)}&body=${encodeURIComponent(brief)}`;
  const ordered = [works[1], works[2], works[0], works[3]];
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="wordmark" href="#" aria-label="Simplith home">
          <Mark />
          simplith<span className="brand-dot">✳</span>
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
      <main id="main">
        <section className="hero wrap">
          <div className="hero-top">
            <span className="eyebrow">
              <span className="status-dot" /> INDEPENDENT DIGITAL STUDIO
            </span>
            <span className="hero-index">STRATEGY / DESIGN / DEVELOPMENT</span>
          </div>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>
                Big ideas.
                <br />
                Beautifully
                <br />
                <span className="orange">simple.</span>
              </h1>
              <p>
                We turn your next big thing into a website or app that feels
                right. Thoughtfully designed. Built to work.
              </p>
              <a className="button dark" href="#work">
                Explore our work <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div
              className="hero-art"
              aria-label="Abstract sculptural Simplith S mark"
              role="img"
            >
              <div className="art-grid" />
              <div className="sculpture">
                <div className="s-piece top-piece" />
                <div className="s-piece bottom-piece" />
              </div>
              <span className="art-label">COMPLEXITY, RECONSIDERED.</span>
              <span className="art-number">S—01</span>
              <span className="art-cross">+</span>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              A small studio.
              <br />
              <strong>A considered approach.</strong>
            </p>
            <p>
              From the first sketch to the final pixel,
              <br />
              we make the complicated feel effortless.
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
            <span>Web apps</span>
            <i>✳</i>
            <span>Digital experiences</span>
            <i>✳</i>
            <span>Made with intention</span>
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
                            s.mode === (w.defaultMode ?? "light"),
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
                Clear scope, fixed packages, no guesswork.
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
            <p className="pricing-note">
              Prices in USD. Final scope and estimate agreed before we start.
            </p>
          </div>
        </section>
        <section className="approach-section wrap section" id="approach">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / THE SIMPLITH WAY</span>
              <h2>
                Simple doesn't
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
          simplith<span className="brand-dot">✳</span>
        </a>
        <p>Thoughtfully made. Simply Simplith.</p>
        <span>© {new Date().getFullYear()} Simplith Studio</span>
        <a href="#">Back to top ↑</a>
      </footer>
      {active && <ProjectGallery work={active} close={() => setActive(null)} />}
    </div>
  );
}
