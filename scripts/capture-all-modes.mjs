/**
 * Capture portfolio shots: light/dark × mobile/web for each demo app.
 * Studio site must be on 5173. Acumen tunnel for mobile/web app.
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

const MOBILE = { width: 420, height: 900, deviceScaleFactor: 2 };
const WEB = { width: 1280, height: 800, deviceScaleFactor: 1.25 };

async function dismiss(page) {
  for (let i = 0; i < 10; i++) {
    let hit = false;
    for (const re of [
      /skip/i,
      /got it/i,
      /let'?s learn/i,
      /continue/i,
      /not now/i,
    ]) {
      const el = page.getByText(re).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click({ force: true }).catch(() => {});
        hit = true;
        await page.waitForTimeout(350);
        break;
      }
    }
    if (!hit) break;
  }
}

async function seedTheme(page, mode) {
  const val = mode === "light" ? "day" : "dusk";
  await page.addInitScript((theme) => {
    localStorage.setItem("visual_theme_v2", theme);
    localStorage.setItem("@AsyncStorage:visual_theme_v2", theme);
    localStorage.setItem(
      "RCTAsyncLocalStorage_V1",
      JSON.stringify({ visual_theme_v2: theme }),
    );
    localStorage.setItem("onboarding_complete_v1", "true");
    localStorage.setItem("guest_mode", "true");
  }, val);
}

async function shot(page, name) {
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file });
  console.log("ok", name, fs.statSync(file).size);
}

const LOOM_DARK_CSS = `
:root {
  --bg: #0f0f0f !important;
  --bg-soft: #171717 !important;
  --bg-muted: #1f1f1f !important;
  --text: #f4f4f4 !important;
  --text-2: #c8c8c8 !important;
  --muted: #8a8a8a !important;
  --line: #2a2a2a !important;
  --line-strong: #3a3a3a !important;
  --accent: #f4f4f4 !important;
  --announcement: #000 !important;
  color-scheme: dark;
}
body { background: #0f0f0f !important; color: #f4f4f4 !important; }
.site-header, .announce { border-color: #2a2a2a !important; }
.btn-solid, .cart-pill, .btn-primary { background: #f4f4f4 !important; color: #111 !important; }
.btn-outline, .lane-strip a, .filters a, .filters button {
  border-color: #3a3a3a !important; color: #f4f4f4 !important; background: transparent !important;
}
.filters .active, .lane-strip .active { background: #f4f4f4 !important; color: #111 !important; }
.product-card, .product-media { background: #171717 !important; border-color: #2a2a2a !important; }
`;

const FORMA_LIGHT_CSS = `
:root, body, html {
  --bg: #f4f1ea !important;
  --ink: #14201c !important;
  background: #f4f1ea !important;
  color: #14201c !important;
  color-scheme: light !important;
}
body { filter: none !important; }
/* best-effort soft inversion of dark music UI */
canvas, .panel, main, .app { background: #f4f1ea !important; }
`;

const browser = await chromium.launch({ headless: true });

// ——— ACUMEN ———
for (const mode of ["light", "dark"]) {
  for (const form of ["mobile", "web"]) {
    const vp = form === "mobile" ? MOBILE : WEB;
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      userAgent: "PinekraftPortfolioCapture/1.0",
    });
    await seedTheme(context, mode);
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ "ngrok-skip-browser-warning": "true" });

    const routes = [
      ["/", "home"],
      ["/decks", "decks"],
      ["/leaderboard", "ranks"],
      ["/quests", "quests"],
      ["/profile", "profile"],
      ["/api-keys", "settings"],
    ];

    for (const [route, screen] of routes) {
      try {
        await page.goto(`${base}${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 45000,
        });
        await page.waitForTimeout(900);
        await dismiss(page);
        await shot(page, `acumen-${mode}-${form}-${screen}`);
      } catch (e) {
        console.log("fail", mode, form, screen, String(e).slice(0, 80));
      }
    }

    // generate
    try {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(700);
      await dismiss(page);
      const input = page.locator("input").first();
      if (await input.isVisible().catch(() => false)) {
        await input.fill("Product design fundamentals");
      }
      await page.getByText(/BUILD MY DECK/i).first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(1200);
      await dismiss(page);
      await shot(page, `acumen-${mode}-${form}-generate`);
    } catch (e) {
      console.log("fail gen", mode, form, String(e).slice(0, 60));
    }

    await context.close();
  }
}

// ——— LOOM ———
for (const mode of ["light", "dark"]) {
  for (const form of ["mobile", "web"]) {
    const vp = form === "mobile" ? MOBILE : WEB;
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
      try {
        await page.goto(`${studio}/demos/loom/${url}`, {
          waitUntil: "networkidle",
          timeout: 20000,
        });
        if (mode === "dark") {
          await page.addStyleTag({ content: LOOM_DARK_CSS });
          await page.waitForTimeout(200);
        }
        await page.waitForTimeout(400);
        await shot(page, `loom-${mode}-${form}-${screen}`);
      } catch (e) {
        console.log("loom fail", mode, form, screen, String(e).slice(0, 60));
      }
    }
    await page.close();
  }
}

// ——— FORMA ———
for (const mode of ["light", "dark"]) {
  for (const form of ["mobile", "web"]) {
    const vp = form === "mobile" ? MOBILE : WEB;
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
    });
    try {
      await page.goto(`${studio}/demos/forma/index.html`, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      if (mode === "light") {
        // Soft light remap of dark studio
        await page.evaluate(() => {
          document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
          document.querySelectorAll("img, video, canvas, svg").forEach((el) => {
            el.style.filter = "invert(1) hue-rotate(180deg)";
          });
        });
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(500);
      await shot(page, `forma-${mode}-${form}-home`);

      // try open studio board
      for (const re of [/open|start|enter|studio|play|begin/i]) {
        const el = page.getByText(re).first();
        if (await el.isVisible().catch(() => false)) {
          await el.click({ force: true }).catch(() => {});
          await page.waitForTimeout(800);
          break;
        }
      }
      await shot(page, `forma-${mode}-${form}-studio`);
    } catch (e) {
      console.log("forma fail", mode, form, String(e).slice(0, 60));
    }
    await page.close();
  }
}

// ——— Plethora (if up) ———
try {
  const res = await fetch("http://127.0.0.1:3000", { signal: AbortSignal.timeout(2000) });
  if (res.ok) {
    for (const mode of ["light", "dark"]) {
      for (const form of ["mobile", "web"]) {
        const vp = form === "mobile" ? MOBILE : WEB;
        const page = await browser.newPage({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: vp.deviceScaleFactor,
        });
        const routes = [
          ["/", "home"],
          ["/tools", "tools"],
          ["/finder", "finder"],
        ];
        for (const [route, screen] of routes) {
          await page.goto(`http://127.0.0.1:3000${route}`, {
            waitUntil: "domcontentloaded",
            timeout: 20000,
          }).catch(() => {});
          await page.waitForTimeout(700);
          if (mode === "light") {
            await page.evaluate(() => {
              document.documentElement.style.filter =
                "invert(1) hue-rotate(180deg)";
              document
                .querySelectorAll("img, video, canvas, svg")
                .forEach((el) => {
                  el.style.filter = "invert(1) hue-rotate(180deg)";
                });
            });
            await page.waitForTimeout(200);
          }
          await shot(page, `plethora-${mode}-${form}-${screen}`);
        }
        await page.close();
      }
    }
  } else {
    console.log("plethora skip (not ok)");
  }
} catch {
  console.log("plethora skip (down) — keep mapped legacy shots later");
}

await browser.close();
console.log("done");
