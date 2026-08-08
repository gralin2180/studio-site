/**
 * Swap name + contact here when you buy the domain.
 * Site copy reads from this file — no hunt-and-replace.
 *
 * DEMO HOSTING (do NOT use ngrok for clients):
 * - Vercel (recommended): one project per app or monorepo routes
 * - Cloudflare Pages: fine for static Vite (FORMA, studio site)
 * - ngrok: dev tunnels only — offline when PC sleeps, free interstitial, not professional
 *
 * After you deploy, paste production URLs into `works[].href`.
 */
export const brand = {
  /** Provisional — change after you pick + register the domain */
  name: "Tillcraft",
  legalName: "Tillcraft Studio",
  domain: "tillcraft.com",
  tagline: "Quiet craft. Fixed price. Live in days.",
  oneLiner:
    "Websites and small apps for shops and small businesses—designed carefully, priced clearly, delivered in 7–14 days.",
  /** WhatsApp with country code, digits only — e.g. 9198XXXXXXXX */
  whatsapp: "",
  email: "hello@tillcraft.com",
  /** Optional: Calendly / Cal.com URL */
  calendarUrl: "",
  cityLine: "Built for stores, clinics, gyms, tutors — and anything that needs customers online.",
} as const;

/** Shortlist if you rename — check domain before you fall in love */
export const nameOptions = [
  { name: "Tillcraft", domain: "tillcraft.com", vibe: "Retail till + craft. Our pick to ship with." },
  { name: "Benchlane", domain: "benchlane.com", vibe: "Workshop / workbench energy." },
  { name: "Shopscript", domain: "shopscript.com", vibe: "Clear: code for shops." },
  { name: "Kilnware", domain: "kilnware.com", vibe: "Fired, crafted, durable." },
  { name: "Counterpixel", domain: "counterpixel.com", vibe: "Shop counter × digital." },
  { name: "Formforge", domain: "formforge.com", vibe: "Forms, apps, forged fast." },
  { name: "Localwire", domain: "localwire.app", vibe: "Wire up local businesses." },
  { name: "Signwork", domain: "signwork.co", vibe: "Street presence, real build." },
  { name: "Softshelf", domain: "softshelf.com", vibe: "Shelf-ready software." },
  { name: "Dockframe", domain: "dockframe.com", vibe: "Frame to launch from." },
] as const;

export const packages = [
  {
    id: "presence",
    name: "Presence",
    price: "$199–399",
    days: "3–7 days",
    blurb: "One sharp page, WhatsApp CTA, ready for Google Maps traffic.",
  },
  {
    id: "bookings",
    name: "Bookings",
    price: "$499–799",
    days: "7–14 days",
    blurb: "Landing + booking or lead form + email/WhatsApp notify.",
  },
  {
    id: "ops",
    name: "Ops app",
    price: "$900–2,000",
    days: "14–28 days",
    blurb: "Custom small webapp for your stack — catalogs, orders, staff tools.",
  },
  {
    id: "care",
    name: "Care",
    price: "$200–500/mo",
    days: "Ongoing",
    blurb: "Hosting help, small changes, uptime watch, feature queue.",
  },
] as const;

export type WorkItem = {
  name: string;
  kind: string;
  stack: string;
  proof: string;
  /** Production or local live URL — open in new tab */
  href: string;
  linkLabel: string;
  /** Play Store gallery screens (left → right) */
  images: string[];
  /** phone = portrait tiles; wide = landscape product shots */
  shot: "phone" | "wide";
};

/**
 * Local demo ports (dev). Production: replace hrefs after Vercel deploy.
 * FORMA is also static-hosted under /demos/forma/ on this site.
 */
export const works: WorkItem[] = [
  {
    name: "Acumen",
    kind: "Trivia · study app",
    stack: "Expo · Supabase",
    proof:
      "Guest mode, AI deck builder from topics, streaks and XP, decks and profile — full study product surface.",
    href: "https://unexpired-estimator-clutter.ngrok-free.dev",
    linkLabel: "Open demo",
    shot: "phone",
    images: [
      "/work/acumen-main.png",
      "/work/acumen-topic.png",
      "/work/acumen-tab-decks.png",
      "/work/acumen-tab-profile.png",
      "/work/acumen-generate.png",
    ],
  },
  {
    name: "Plethora",
    kind: "AI tools platform",
    stack: "Next.js · Supabase",
    proof:
      "Tools directory, AI finder, prompt assistant, and learn hub under one roof — multi-page product UI.",
    href: "http://127.0.0.1:3000",
    linkLabel: "Open demo",
    shot: "wide",
    images: [
      "/work/plethora-01-home.png",
      "/work/plethora-02-tools.png",
      "/work/plethora-03-finder.png",
      "/work/plethora-04-prompt.png",
      "/work/plethora-05-learn.png",
    ],
  },
  {
    name: "FORMA",
    kind: "Music studio",
    stack: "Vite · Web Audio",
    proof:
      "Beat home, full drums board with layers, guided tour — interactive real-time music studio in the browser.",
    href: "/demos/forma/index.html",
    linkLabel: "Open demo",
    shot: "wide",
    images: [
      "/work/forma-01-home.png",
      "/work/forma-02-studio.png",
      "/work/forma-03-tour.png",
    ],
  },
];

export const steps = [
  { n: "01", title: "Fit call", body: "15 minutes: problem, must-haves, budget, go-live." },
  { n: "02", title: "One-screen scope", body: "In / out of scope, package, timeline — same day." },
  { n: "03", title: "Deposit & build", body: "50% to start. Milestone demos so nothing ships blind." },
  { n: "04", title: "Live & care", body: "You own the domain. Free-tier host or Care retainer." },
] as const;

export function waLink(text?: string): string | null {
  if (!brand.whatsapp) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${brand.whatsapp}${q}`;
}
