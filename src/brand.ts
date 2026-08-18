/**
 * Brand + portfolio data for Coderman Studio marketing site.
 */
export const brand = {
  name: "Coderman",
  studioWord: "Studio",
  legalName: "Coderman Studio",
  domain: "coderman.studio",
  tagline: "We build apps and sites — fixed packages, clear price.",
  oneLiner:
    "Tell us what you need. We set the scope, quote a clear estimate, and ship. Websites, booking tools, storefronts, and custom web apps for anyone who needs software built.",
  whatsapp: "",
  email: "hello@coderman.studio",
  calendarUrl: "",
  cityLine:
    "Products, tools, bookings, dashboards — if you need it built, we scope it and ship it.",
} as const;

export const packages = [
  {
    id: "presence",
    name: "Presence",
    price: "$199–399",
    days: "3–7 days",
    blurb: "A sharp one-page site with a clear call to action — ready for traffic and enquiries.",
    includes: ["Landing page", "Mobile layout", "Contact / CTA", "Basic SEO"],
  },
  {
    id: "bookings",
    name: "Bookings",
    price: "$499–799",
    days: "7–14 days",
    blurb: "Landing page plus booking or lead form, with email or WhatsApp notifications.",
    includes: ["Landing + form", "Lead notify", "Calendar or waitlist", "Mobile-first"],
  },
  {
    id: "ops",
    name: "Ops app",
    price: "$900–2,000",
    days: "14–28 days",
    blurb: "A small custom web app for your workflow — catalogs, orders, staff tools, dashboards.",
    includes: ["Custom screens", "Auth if needed", "Data backend", "Deploy help"],
  },
  {
    id: "care",
    name: "Care",
    price: "$200–500/mo",
    days: "Ongoing",
    blurb: "Hosting support, small changes, uptime watch, and a feature queue after launch.",
    includes: ["Hosting help", "Small edits", "Uptime watch", "Priority queue"],
  },
] as const;

export type ThemeMode = "light" | "dark";
export type FormFactor = "mobile" | "web";

export type WorkShot = {
  src: string;
  mode: ThemeMode;
  form: FormFactor;
  label: string;
};

export type WorkItem = {
  name: string;
  kind: string;
  stack: string;
  proof: string;
  href: string;
  linkLabel: string;
  forms: FormFactor[];
  modes: ThemeMode[];
  /** Default device tab when listing loads */
  defaultForm?: FormFactor;
  /** Default theme tab when listing loads */
  defaultMode?: ThemeMode;
  shots: WorkShot[];
};

function grid(
  app: string,
  screens: { key: string; label: string }[],
  forms: FormFactor[] = ["mobile", "web"],
  modes: ThemeMode[] = ["light", "dark"],
): WorkShot[] {
  const shots: WorkShot[] = [];
  for (const mode of modes) {
    for (const form of forms) {
      for (const s of screens) {
        shots.push({
          src: `/work/${app}-${mode}-${form}-${s.key}.png`,
          mode,
          form,
          label: s.label,
        });
      }
    }
  }
  return shots;
}

export const works: WorkItem[] = [
  {
    name: "Acumen",
    kind: "Trivia · study app",
    stack: "Expo · Supabase",
    proof:
      "Study product with AI deck builder, decks, ranks, quests, profile, and settings — light/dark on phone and web.",
    href: "https://unexpired-estimator-clutter.ngrok-free.dev",
    linkLabel: "Open demo",
    forms: ["mobile", "web"],
    modes: ["light", "dark"],
    shots: grid("acumen", [
      { key: "home", label: "Home" },
      { key: "generate", label: "Create deck" },
      { key: "decks", label: "Decks" },
      { key: "ranks", label: "Ranks" },
      { key: "quests", label: "Quests" },
      { key: "profile", label: "Profile" },
      { key: "settings", label: "Settings" },
    ]),
  },
  {
    name: "Plethora",
    kind: "AI tools platform",
    stack: "Next.js · Supabase",
    proof:
      "Tools directory, AI finder, prompt assistant, and learn hub — light/dark, mobile and desktop.",
    href: "http://127.0.0.1:3000",
    linkLabel: "Open demo",
    forms: ["mobile", "web"],
    modes: ["light", "dark"],
    shots: grid("plethora", [
      { key: "home", label: "Home" },
      { key: "tools", label: "Tools" },
      { key: "finder", label: "Finder" },
      { key: "prompt", label: "Prompt" },
      { key: "learn", label: "Learn" },
    ]),
  },
  {
    name: "LOOM",
    kind: "Clothing storefront",
    stack: "HTML · CSS · JS",
    proof:
      "Apparel shop with product photos: home, catalog, product detail, bag, and fit guide — phone and desktop.",
    href: "/demos/loom/index.html",
    linkLabel: "Open demo",
    forms: ["mobile", "web"],
    modes: ["light", "dark"],
    shots: grid("loom", [
      { key: "home", label: "Home" },
      { key: "shop", label: "Shop" },
      { key: "product", label: "Product" },
      { key: "cart", label: "Bag" },
      { key: "fit", label: "Fit guide" },
    ]),
  },
  {
    name: "FORMA",
    kind: "Music studio",
    stack: "Vite · Web Audio",
    proof:
      "Browser music studio — home, beat board, guided tour — light/dark and mobile/web layouts.",
    href: "/demos/forma/index.html",
    linkLabel: "Open demo",
    forms: ["mobile", "web"],
    modes: ["light", "dark"],
    defaultMode: "dark",
    defaultForm: "web",
    shots: grid(
      "forma",
      [
        { key: "home", label: "Home" },
        { key: "studio", label: "Studio" },
      ],
      ["mobile", "web"],
      ["light", "dark"],
    ),
  },
];

/**
 * Design templates by industry type (no brand names).
 * Each vertical ships four distinct app screens.
 */
export type TemplateLayout =
  | "dashboard"
  | "schedule"
  | "form"
  | "map"
  | "tickets"
  | "checkout"
  | "board"
  | "confirm";

export type TemplateScreen = {
  id: string;
  label: string;
  layout: TemplateLayout;
  title: string;
  sub: string;
  rows: string[];
  meta?: string[];
  cta: string;
};

export type BusinessDemo = {
  id: string;
  /** Industry type only — shown to clients */
  type: string;
  blurb: string;
  accent: string;
  accentSoft: string;
  screens: TemplateScreen[];
};

export const businessDemos: BusinessDemo[] = [
  {
    id: "gym",
    type: "Gym & fitness",
    blurb: "Class boards, memberships, trainer booking, and front-desk check-in.",
    accent: "#c2410c",
    accentSoft: "#ffedd5",
    screens: [
      {
        id: "home",
        label: "Home",
        layout: "dashboard",
        title: "Today on the floor",
        sub: "Live capacity and next sessions",
        meta: ["12 in now", "3 classes", "2 PT"],
        rows: ["HIIT · 6:30 pm · 4 left", "Yoga flow · almost full", "Open gym until 10"],
        cta: "Book a class",
      },
      {
        id: "classes",
        label: "Schedule",
        layout: "schedule",
        title: "Weekly schedule",
        sub: "Filter by coach, level, or room",
        rows: ["Mon · Strength lab", "Wed · Spin room B", "Fri · Conditioning", "Sat · Open mat"],
        cta: "Reserve spot",
      },
      {
        id: "plan",
        label: "Plans",
        layout: "checkout",
        title: "Membership plans",
        sub: "Monthly · quarterly · drop-in",
        rows: ["Studio · $49/mo", "Peak · $79/mo", "PT pack · 4 sessions"],
        cta: "Choose plan",
      },
      {
        id: "checkin",
        label: "Check-in",
        layout: "tickets",
        title: "Front desk",
        sub: "Scan code or search member",
        rows: ["Maya R · Day pass", "Jordan K · Peak", "Walk-ins waiting · 2"],
        cta: "Check in",
      },
    ],
  },
  {
    id: "campus",
    type: "School & university",
    blurb: "Timetables, assignments, campus notices, and staff dashboards.",
    accent: "#1d4ed8",
    accentSoft: "#dbeafe",
    screens: [
      {
        id: "home",
        label: "Dashboard",
        layout: "dashboard",
        title: "Your day",
        sub: "Tue · 3 classes · 1 due tonight",
        meta: ["3 classes", "1 due", "2 notices"],
        rows: ["09:00 Design studio", "11:30 CS lecture", "Lab report · 18:00"],
        cta: "Open timetable",
      },
      {
        id: "timetable",
        label: "Timetable",
        layout: "schedule",
        title: "Week view",
        sub: "Room · faculty · join link",
        rows: ["Hall B · Prof. Nair", "Lab 2 · hybrid", "Seminar C · online"],
        cta: "Export week",
      },
      {
        id: "work",
        label: "Assignments",
        layout: "board",
        title: "Assignments",
        sub: "Status and deadlines",
        rows: ["UX audit · Due Thu", "Quiz set · Submitted", "Project brief · Draft"],
        cta: "Upload work",
      },
      {
        id: "notices",
        label: "Notices",
        layout: "tickets",
        title: "Campus notices",
        sub: "Faculty and admin",
        rows: ["Library hours extended", "Sports meet open", "Fee window closes Fri"],
        cta: "Mark read",
      },
    ],
  },
  {
    id: "bookings",
    type: "Bookings & services",
    blurb: "Service menus, available slots, client forms, and confirmations.",
    accent: "#0f766e",
    accentSoft: "#ccfbf1",
    screens: [
      {
        id: "home",
        label: "Services",
        layout: "board",
        title: "Services",
        sub: "Duration and price upfront",
        rows: ["Haircut · 45 min", "Colour · 90 min", "Consult · 20 min"],
        cta: "Pick a service",
      },
      {
        id: "slots",
        label: "Slots",
        layout: "schedule",
        title: "Open slots",
        sub: "This week · staff: Mia",
        rows: ["Thu 11:00", "Thu 14:30", "Fri 10:00", "Sat 09:15"],
        cta: "Hold slot",
      },
      {
        id: "form",
        label: "Details",
        layout: "form",
        title: "Your details",
        sub: "Name, phone, notes",
        rows: ["Full name", "WhatsApp number", "Preferences / notes"],
        cta: "Confirm booking",
      },
      {
        id: "done",
        label: "Confirmed",
        layout: "confirm",
        title: "You're booked",
        sub: "Thu 14:30 · confirmation sent",
        rows: ["Add to calendar", "Reschedule link", "Pay deposit (optional)"],
        cta: "Done",
      },
    ],
  },
  {
    id: "delivery",
    type: "Delivery & logistics",
    blurb: "Order queues, live tracking, rider assign, and proof of delivery.",
    accent: "#7c3aed",
    accentSoft: "#ede9fe",
    screens: [
      {
        id: "home",
        label: "Orders",
        layout: "tickets",
        title: "Order queue",
        sub: "12 live · 3 late risk",
        meta: ["12 live", "3 risk", "4 idle"],
        rows: ["#1842 · Zone B", "#1843 · Zone A", "#1844 · Express"],
        cta: "Assign rider",
      },
      {
        id: "map",
        label: "Map",
        layout: "map",
        title: "Live map",
        sub: "Riders and drop pins",
        rows: ["Sam · 2 drops · 12 min", "Nu · idle", "Warehouse heat · medium"],
        cta: "Focus active",
      },
      {
        id: "assign",
        label: "Assign",
        layout: "board",
        title: "Assign #1842",
        sub: "Best match by ETA",
        rows: ["Sam · 12 min", "Nu · 18 min", "Call-in shift"],
        cta: "Dispatch",
      },
      {
        id: "proof",
        label: "Delivered",
        layout: "confirm",
        title: "Delivered",
        sub: "Photo + signature captured",
        rows: ["Drop photo attached", "OTP verified", "Rated 5★"],
        cta: "Close ticket",
      },
    ],
  },
  {
    id: "restaurant",
    type: "Restaurant & F&B",
    blurb: "Menus, floor maps, kitchen tickets, and table billing.",
    accent: "#b45309",
    accentSoft: "#fef3c7",
    screens: [
      {
        id: "home",
        label: "Menu",
        layout: "board",
        title: "Tonight’s menu",
        sub: "Kitchen updates live",
        rows: ["Wood-fired mains", "Bar bites", "Dessert board"],
        cta: "Take order",
      },
      {
        id: "floor",
        label: "Tables",
        layout: "map",
        title: "Floor map",
        sub: "Covers and waitlist",
        rows: ["T4 · dining · 4", "T7 · bill out", "Waitlist · 3 parties"],
        cta: "Seat next",
      },
      {
        id: "kitchen",
        label: "Kitchen",
        layout: "tickets",
        title: "Kitchen tickets",
        sub: "Expo order",
        rows: ["#88 · pasta · fire", "#89 · salad · ready", "#90 · new"],
        cta: "Bump ticket",
      },
      {
        id: "bill",
        label: "Bill",
        layout: "checkout",
        title: "Table 7 bill",
        sub: "Split or full pay",
        rows: ["2 mains · 1 dessert", "Service 10%", "Total $86"],
        cta: "Charge",
      },
    ],
  },
  {
    id: "clinic",
    type: "Clinic & health",
    blurb: "Appointment books, intake forms, waiting queues, and visit notes.",
    accent: "#0369a1",
    accentSoft: "#e0f2fe",
    screens: [
      {
        id: "home",
        label: "Today",
        layout: "dashboard",
        title: "Today’s clinic",
        sub: "18 booked · 2 walk-ins",
        meta: ["18 booked", "2 walk-in", "On time"],
        rows: ["09:20 · new patient", "10:00 · follow-up", "11:30 · vaccines"],
        cta: "Open chart",
      },
      {
        id: "book",
        label: "Book",
        layout: "form",
        title: "Book a visit",
        sub: "Doctor · reason · time",
        rows: ["Department", "Preferred doctor", "Reason for visit"],
        cta: "Hold slot",
      },
      {
        id: "queue",
        label: "Queue",
        layout: "tickets",
        title: "Waiting room",
        sub: "Live token board",
        rows: ["Token 14 · check-in", "Token 15 · with nurse", "Token 16 · next"],
        cta: "Call next",
      },
      {
        id: "notes",
        label: "Notes",
        layout: "form",
        title: "Visit notes",
        sub: "Staff only",
        rows: ["Symptoms", "Rx draft", "Follow-up in 2 weeks"],
        cta: "Save note",
      },
    ],
  },
  {
    id: "office",
    type: "Office & teams",
    blurb: "Task boards, room booking, staff directory, and attendance.",
    accent: "#374151",
    accentSoft: "#e5e7eb",
    screens: [
      {
        id: "home",
        label: "Tasks",
        layout: "board",
        title: "Team tasks",
        sub: "Sprint board",
        rows: ["Ship pricing UI", "Client call prep", "Invoice review"],
        cta: "New task",
      },
      {
        id: "rooms",
        label: "Rooms",
        layout: "schedule",
        title: "Meeting rooms",
        sub: "Book by the hour",
        rows: ["Pod A · free 2–3", "Board · taken", "Call booth · free"],
        cta: "Book room",
      },
      {
        id: "people",
        label: "Directory",
        layout: "tickets",
        title: "Directory",
        sub: "Teams and contacts",
        rows: ["Design · 4 people", "Ops · 6 people", "Founders · 2"],
        cta: "Message",
      },
      {
        id: "att",
        label: "Attendance",
        layout: "dashboard",
        title: "Attendance",
        sub: "Office vs remote today",
        meta: ["11 office", "8 remote", "1 leave"],
        rows: ["Check-in window open", "Remote flagged", "Leave approved"],
        cta: "Check me in",
      },
    ],
  },
  {
    id: "retail",
    type: "Retail & POS",
    blurb: "Catalog, checkout, stock alerts, and end-of-day reports.",
    accent: "#be123c",
    accentSoft: "#ffe4e6",
    screens: [
      {
        id: "home",
        label: "Catalog",
        layout: "board",
        title: "Shop floor",
        sub: "Fast search and filters",
        rows: ["Restocks today", "Top sellers", "Staff picks"],
        cta: "Open POS",
      },
      {
        id: "pos",
        label: "Checkout",
        layout: "checkout",
        title: "Checkout",
        sub: "Barcode + bag",
        rows: ["2 items · $64", "Tax included", "Card / UPI / cash"],
        cta: "Complete sale",
      },
      {
        id: "stock",
        label: "Stock",
        layout: "tickets",
        title: "Stock alerts",
        sub: "Low and out of stock",
        rows: ["Denim 32 · low", "Tee black M · out", "Transfer from WH"],
        cta: "Reorder",
      },
      {
        id: "report",
        label: "Day close",
        layout: "dashboard",
        title: "Day close",
        sub: "Sales and cash float",
        meta: ["$2,140", "$40 refund", "Cash OK"],
        rows: ["Gross sales", "Refunds", "Float match"],
        cta: "Close till",
      },
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
