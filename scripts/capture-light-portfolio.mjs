/**
 * Capture light-mode Acumen + LOOM screens for the studio site portfolio.
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

async function dismissCoach(page) {
  for (let i = 0; i < 12; i++) {
    let hit = false;
    for (const re of [
      /skip/i,
      /let'?s learn/i,
      /continue/i,
      /got it/i,
      /not now/i,
      /close/i,
    ]) {
      const el = page.getByText(re).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click({ force: true }).catch(() => {});
        hit = true;
        await page.waitForTimeout(450);
        break;
      }
    }
    if (!hit) break;
  }
}

async function shot(page, name) {
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(
    "ok",
    name,
    fs.statSync(file).size,
    (await page.locator("body").innerText()).slice(0, 80).replace(/\n/g, " | "),
  );
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 420, height: 900 },
  deviceScaleFactor: 2,
  userAgent: "CodermanPortfolioCapture/1.0",
});
await context.addInitScript(() => {
  localStorage.setItem("visual_theme_v2", "day");
  localStorage.setItem("@AsyncStorage:visual_theme_v2", "day");
  localStorage.setItem(
    "RCTAsyncLocalStorage_V1",
    JSON.stringify({ visual_theme_v2: "day" }),
  );
  localStorage.setItem("onboarding_complete_v1", "true");
  localStorage.setItem("guest_mode", "true");
});

const page = await context.newPage();
await page.setExtraHTTPHeaders({ "ngrok-skip-browser-warning": "true" });

const routes = [
  ["/", "acumen-lite-home"],
  ["/decks", "acumen-lite-decks"],
  ["/leaderboard", "acumen-lite-ranks"],
  ["/quests", "acumen-lite-quests"],
  ["/profile", "acumen-lite-profile"],
  ["/generate", "acumen-lite-generate"],
  ["/settings", "acumen-lite-settings"],
  ["/api-keys", "acumen-lite-apikeys"],
];

for (const [route, name] of routes) {
  await page.goto(`${base}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(1000);
  await dismissCoach(page);
  await shot(page, name);
}

// Prefer API keys if settings blank
const settingsText = await page.goto(`${base}/settings`, {
  waitUntil: "domcontentloaded",
});
await page.waitForTimeout(800);
const body = await page.locator("body").innerText();
if (body.trim().length < 20) {
  await page.goto(`${base}/api-keys`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  await shot(page, "acumen-lite-settings");
} else {
  await shot(page, "acumen-lite-settings");
}

// LOOM
const loom = await browser.newPage({
  viewport: { width: 1280, height: 860 },
  deviceScaleFactor: 1.25,
});
for (const [url, name] of [
  ["index.html", "loom-home"],
  ["shop.html", "loom-shop"],
  ["product.html?id=demo-tee", "loom-product"],
  ["cart.html", "loom-cart"],
  ["fit.html", "loom-fit"],
]) {
  await loom.goto(`${studio}/demos/loom/${url}`, {
    waitUntil: "networkidle",
    timeout: 20000,
  });
  await loom.waitForTimeout(600);
  await shot(loom, name);
}

await browser.close();
console.log("done");
