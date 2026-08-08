import {
  brand,
  packages,
  steps,
  waLink,
  works,
  type WorkItem,
} from "./brand";
import "./App.css";

function primaryCta(): { href: string; label: string } {
  const wa = waLink(
    `Hi ${brand.name} — I want a fixed-price app for my business.`,
  );
  if (wa) return { href: wa, label: "WhatsApp us" };
  if (brand.calendarUrl) return { href: brand.calendarUrl, label: "Book a fit call" };
  return { href: `mailto:${brand.email}`, label: "Email us" };
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function StoreListing({ w }: { w: WorkItem }) {
  const external = isExternal(w.href);
  const monogram = w.name.slice(0, 1).toUpperCase();

  return (
    <article className={`store-listing store-${w.shot}`}>
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

      <div className="store-gallery" aria-label={`${w.name} screenshots`}>
        {w.images.map((src, i) => (
          <a
            key={src}
            className="store-shot"
            href={w.href}
            target="_blank"
            rel={external ? "noreferrer" : undefined}
          >
            <img src={src} alt={`${w.name} screenshot ${i + 1}`} loading="lazy" />
          </a>
        ))}
      </div>

      <div className="store-about">
        <h4>About this app</h4>
        <p>{w.proof}</p>
      </div>
    </article>
  );
}

export default function App() {
  const cta = primaryCta();
  const year = new Date().getFullYear();

  return (
    <div className="site">
      <header className="top">
        <a className="logo" href="#top">
          {brand.name}
          <span>.</span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#packages">Packages</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="Introduction">
          <div className="hero-copy">
            <p className="hero-eyebrow">Studio · fixed-price builds</p>
            <p className="brand-mark">
              {brand.name}
              <em>.</em>
            </p>
            <h1>{brand.tagline}</h1>
            <p className="hero-lead">{brand.oneLiner}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href={cta.href}>
                {cta.label}
              </a>
              <a className="btn btn-ghost" href="#work">
                View work
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="showcase">
              <div className="showcase-inner">
                <div className="atelier-nav">
                  <span className="atelier-logo">Meridian</span>
                  <span className="atelier-nav-links">Menu · Visit · Book</span>
                </div>
                <div className="atelier-body">
                  <div className="atelier-panel">
                    <p className="atelier-eyebrow">Neighborhood café</p>
                    <p className="atelier-title">Tables reserved. Tables full.</p>
                    <p className="atelier-sub">
                      A quiet booking page your guests actually use—
                      live in a week, fixed price.
                    </p>
                    <span className="atelier-btn">Reserve a table</span>
                  </div>
                  <div className="atelier-band">
                    <figure>
                      <figcaption>Presence</figcaption>
                      <strong>One page</strong>
                    </figure>
                    <figure>
                      <figcaption>Bookings</figcaption>
                      <strong>Notify live</strong>
                    </figure>
                    <figure>
                      <figcaption>Care</figcaption>
                      <strong>Month to month</strong>
                    </figure>
                  </div>
                </div>
              </div>
              <span className="showcase-caption">{brand.domain}</span>
            </div>
          </div>
        </section>

        <section id="packages">
          <div className="section-head">
            <h2>Packages with edges</h2>
            <p>
              Clear price bands and timelines—shops, clinics, gyms, tutors.
              Fifty percent to start, fifty on delivery.
            </p>
          </div>
          <div className="packages">
            {packages.map((p) => (
              <article key={p.id} className="package">
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <div className="package-aside">
                  <div className="price">{p.price}</div>
                  <div className="meta">{p.days}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>
              Real products we have shipped. Scroll the galleries, open a demo
              when you want the full product.
            </p>
          </div>
          <div className="store-rail">
            {works.map((w) => (
              <StoreListing key={w.name} w={w} />
            ))}
          </div>
        </section>

        <section id="process">
          <div className="section-head">
            <h2>How we work</h2>
            <p>Four calm steps from first note to live.</p>
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
              <h2>A fifteen-minute fit call</h2>
              <p>
                What customers do today, what v1 must do, budget and timing.
                Same-day one-screen proposal when it is a fit.
              </p>
            </div>
            <div className="contact-actions">
              <a className="btn btn-primary" href={cta.href}>
                {cta.label}
              </a>
              {brand.calendarUrl && cta.href !== brand.calendarUrl ? (
                <a className="btn btn-ghost" href={brand.calendarUrl}>
                  Book calendar
                </a>
              ) : (
                <a className="btn btn-ghost" href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>
              )}
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
          <span> · Fixed-price apps for local business</span>
        </div>
        <div>
          © {year} · {brand.domain}
        </div>
      </footer>
    </div>
  );
}
