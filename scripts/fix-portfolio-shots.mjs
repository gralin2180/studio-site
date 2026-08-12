/**
 * Rebuild portfolio screens that clients actually need to see.
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "public", "work");
const base =
  process.env.ACUMEN_URL ||
  "https://unexpired-estimator-clutter.ngrok-free.dev";
const studio = process.env.STUDIO_URL || "http://127.0.0.1:5173";

function copy(from, to) {
  const a = path.join(out, from);
  const b = path.join(out, to);
  if (fs.existsSync(a)) {
    fs.copyFileSync(a, b);
    console.log("copy", from, "→", to);
  }
}

async function dismiss(page) {
  for (let i = 0; i < 14; i++) {
    let hit = false;
    for (const re of [
      /^got it$/i,
      /skip/i,
      /let'?s learn/i,
      /continue/i,
      /not now/i,
      /close/i,
    ]) {
      const el = page.getByText(re).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click({ force: true }).catch(() => {});
        hit = true;
        await page.waitForTimeout(400);
        break;
      }
    }
    if (!hit) break;
  }
  // Hide leftover floating coach if it still covers UI
  await page.evaluate(() => {
    document.querySelectorAll("div,section,aside").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (
        t.length < 180 &&
        /Auri|curious cat|GOT IT|Quick glance|Hey from Auri/i.test(t) &&
        /GOT IT|LET'?S LEARN|Skip/i.test(t)
      ) {
        const r = el.getBoundingClientRect();
        if (r.height > 200 && r.width > 200) {
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
        }
      }
    });
  });
}

async function shot(page, name) {
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file });
  console.log("ok", name, fs.statSync(file).size);
}

const browser = await chromium.launch({ headless: true });

// —— Reliable FORMA / Plethora from known-good masters ——
copy("forma-01-home.png", "forma-dark-web-home.png");
copy("forma-02-studio.png", "forma-dark-web-studio.png");
copy("forma-03-tour.png", "forma-dark-web-tour.png");
copy("forma-01-home.png", "forma-dark-mobile-home.png");
copy("forma-02-studio.png", "forma-dark-mobile-studio.png");
copy("forma-03-tour.png", "forma-dark-mobile-tour.png");

copy("plethora-01-home.png", "plethora-dark-web-home.png");
copy("plethora-02-tools.png", "plethora-dark-web-tools.png");
copy("plethora-03-finder.png", "plethora-dark-web-finder.png");
copy("plethora-04-prompt.png", "plethora-dark-web-prompt.png");
copy("plethora-05-learn.png", "plethora-dark-web-learn.png");
copy("plethora-01-home.png", "plethora-dark-mobile-home.png");
copy("plethora-02-tools.png", "plethora-dark-mobile-tools.png");
copy("plethora-03-finder.png", "plethora-dark-mobile-finder.png");
copy("plethora-04-prompt.png", "plethora-dark-mobile-prompt.png");
copy("plethora-05-learn.png", "plethora-dark-mobile-learn.png");

// Light = inverted framed masters
async function invertFrame(srcName, destName, w, h, dpr = 1.25) {
  const src = path.join(out, srcName);
  if (!fs.existsSync(src)) return;
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: dpr,
  });
  const buf = fs.readFileSync(src).toString("base64");
  const mime = "image/png";
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:#f3f0ea">
    <img src="data:${mime};base64,${buf}" style="width:100%;height:100vh;object-fit:cover;object-position:top center;filter:invert(1) hue-rotate(180deg) contrast(0.95) brightness(1.05)"/>
    </body></html>`,
    { waitUntil: "load" },
  );
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(out, destName) });
  console.log("invert", destName);
  await page.close();
}

for (const [s, d] of [
  ["forma-01-home.png", "forma-light-web-home.png"],
  ["forma-02-studio.png", "forma-light-web-studio.png"],
  ["forma-03-tour.png", "forma-light-web-tour.png"],
  ["forma-01-home.png", "forma-light-mobile-home.png"],
  ["forma-02-studio.png", "forma-light-mobile-studio.png"],
  ["forma-03-tour.png", "forma-light-mobile-tour.png"],
  ["plethora-01-home.png", "plethora-light-web-home.png"],
  ["plethora-02-tools.png", "plethora-light-web-tools.png"],
  ["plethora-03-finder.png", "plethora-light-web-finder.png"],
  ["plethora-04-prompt.png", "plethora-light-web-prompt.png"],
  ["plethora-05-learn.png", "plethora-light-web-learn.png"],
  ["plethora-01-home.png", "plethora-light-mobile-home.png"],
  ["plethora-02-tools.png", "plethora-light-mobile-tools.png"],
  ["plethora-03-finder.png", "plethora-light-mobile-finder.png"],
  ["plethora-04-prompt.png", "plethora-light-mobile-prompt.png"],
  ["plethora-05-learn.png", "plethora-light-mobile-learn.png"],
]) {
  const mobile = d.includes("-mobile-");
  await invertFrame(s, d, mobile ? 420 : 1280, mobile ? 900 : 800, mobile ? 2 : 1.25);
}

// —— ACUMEN proper screens ——
for (const mode of ["light", "dark"]) {
  for (const form of ["mobile", "web"]) {
    const vp =
      form === "mobile"
        ? { width: 420, height: 900, deviceScaleFactor: 2 }
        : { width: 1280, height: 800, deviceScaleFactor: 1.25 };
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
    });
    const theme = mode === "light" ? "day" : "dusk";
    await context.addInitScript((t) => {
      localStorage.setItem("visual_theme_v2", t);
      localStorage.setItem("@AsyncStorage:visual_theme_v2", t);
      localStorage.setItem(
        "RCTAsyncLocalStorage_V1",
        JSON.stringify({ visual_theme_v2: t }),
      );
      localStorage.setItem("onboarding_complete_v1", "true");
      localStorage.setItem("guest_mode", "true");
    }, theme);

    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ "ngrok-skip-browser-warning": "true" });

    // warm session + dismiss coach
    await page.goto(base + "/", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(800);
    await dismiss(page);

    const routes = [
      ["/", "home"],
      ["/decks", "decks"],
      ["/leaderboard", "ranks"],
      ["/quests", "quests"],
      ["/profile", "profile"],
      ["/api-keys", "settings"],
    ];
    for (const [route, screen] of routes) {
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1100);
      await dismiss(page);
      // second pass — if still coach, hard hide
      await dismiss(page);
      await shot(page, `acumen-${mode}-${form}-${screen}`);
    }

    // generate with topic
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    await dismiss(page);
    const input = page.locator("input").first();
    if (await input.isVisible().catch(() => false)) {
      await input.fill("Product design fundamentals");
    }
    await page.getByText(/BUILD MY DECK/i).first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1400);
    await dismiss(page);
    // if create deck form visible, good; else open /generate
    const body = await page.locator("body").innerText();
    if (!/Create deck|Difficulty|Mode/i.test(body)) {
      await page.goto(base + "/generate", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);
      await dismiss(page);
    }
    await shot(page, `acumen-${mode}-${form}-generate`);
    await context.close();
  }
}

// —— LOOM with product photos ——
const LOOM_DARK = `
:root {
  --bg:#0f0f0f!important;--bg-soft:#171717!important;--bg-muted:#1f1f1f!important;
  --text:#f4f4f4!important;--text-2:#c8c8c8!important;--muted:#8a8a8a!important;
  --line:#2a2a2a!important;--accent:#f4f4f4!important;--announcement:#000!important;
}
body{background:#0f0f0f!important;color:#f4f4f4!important}
.btn-solid,.cart-pill{background:#f4f4f4!important;color:#111!important}
.filters .active{background:#f4f4f4!important;color:#111!important}
`;

for (const mode of ["light", "dark"]) {
  for (const form of ["mobile", "web"]) {
    const vp =
      form === "mobile"
        ? { width: 420, height: 900, deviceScaleFactor: 2 }
        : { width: 1280, height: 800, deviceScaleFactor: 1.25 };
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
    });
    const pages = [
      ["index.html", "home"],
      ["shop.html", "shop"],
      ["product.html?id=demo-tee", "product"],
      ["cart.html", "cart"],
      ["fit.html", "fit"],
    ];
    for (const [url, screen] of pages) {
      await page.goto(`${studio}/demos/loom/${url}`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      if (mode === "dark") await page.addStyleTag({ content: LOOM_DARK });
      // wait product images
      await page.waitForTimeout(1200);
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images).map((img) =>
            img.complete
              ? null
              : new Promise((r) => {
                  img.onload = r;
                  img.onerror = r;
                }),
          ),
        ),
      );
      await page.waitForTimeout(400);
      await shot(page, `loom-${mode}-${form}-${screen}`);
    }
    await page.close();
  }
}

// Live FORMA capture for dark web/mobile from actual studio
try {
  for (const form of ["web", "mobile"]) {
    const vp =
      form === "mobile"
        ? { width: 420, height: 900, deviceScaleFactor: 2 }
        : { width: 1280, height: 800, deviceScaleFactor: 1.25 };
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
    });
    await page.goto(`${studio}/demos/forma/index.html`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(800);
    await shot(page, `forma-dark-${form}-home`);
    await page.getByText(/New project/i).first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1400);
    await shot(page, `forma-dark-${form}-studio`);
    // light via invert of current page
    await page.evaluate(() => {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    });
    await page.waitForTimeout(200);
    await shot(page, `forma-light-${form}-studio`);
    await page.goto(`${studio}/demos/forma/index.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    });
    await page.waitForTimeout(200);
    await shot(page, `forma-light-${form}-home`);
    await page.close();
  }
} catch (e) {
  console.log("forma live fail", String(e).slice(0, 100));
}

await browser.close();
console.log("done");
