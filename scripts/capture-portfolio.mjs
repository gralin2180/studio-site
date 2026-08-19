/**
 * Capture multi-screen portfolio shots. Run while local demos are up:
 *   node scripts/capture-portfolio.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "work");

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("wrote", name);
}

async function capturePlethora(page) {
  const routes = [
    ["http://127.0.0.1:3000/", "plethora-01-home.png"],
    ["http://127.0.0.1:3000/tools", "plethora-02-tools.png"],
    ["http://127.0.0.1:3000/ai-finder", "plethora-03-finder.png"],
    ["http://127.0.0.1:3000/prompt-assistant", "plethora-04-prompt.png"],
    ["http://127.0.0.1:3000/learn", "plethora-05-learn.png"],
  ];
  for (const [url, name] of routes) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(800);
    await shot(page, name);
  }
}

async function captureForma(page) {
  await page.goto("http://127.0.0.1:5174/", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(1000);
  await shot(page, "forma-01-home.png");

  // New project → studio
  const newProj = page.getByRole("button", { name: /new project/i });
  if (await newProj.count()) {
    await newProj.first().click();
    await page.waitForTimeout(1500);
    await shot(page, "forma-02-studio.png");
  }

  // Back home if possible, then Learn FORMA
  await page.goto("http://127.0.0.1:5174/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const learn = page.getByRole("button", { name: /learn forma/i });
  if (await learn.count()) {
    await learn.first().click();
    await page.waitForTimeout(1500);
    await shot(page, "forma-03-tour.png");
  }
}

async function captureAcumen(page) {
  const base = "https://unexpired-estimator-clutter.ngrok-free.dev";
  await page.setExtraHTTPHeaders({ "ngrok-skip-browser-warning": "true" });
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2000);

  // Phone-ish viewport for mobile app
  await page.setViewportSize({ width: 420, height: 860 });
  await page.waitForTimeout(500);
  await shot(page, "acumen-01-welcome.png");

  // Click through onboarding
  for (let i = 0; i < 6; i++) {
    const cont = page.getByRole("button", { name: /continue/i });
    const skip = page.getByRole("button", { name: /skip/i });
    if (await cont.count()) {
      await cont.first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);
      await shot(page, `acumen-0${i + 2}-step.png`);
    } else if (await skip.count()) {
      await skip.first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);
      await shot(page, `acumen-0${i + 2}-step.png`);
    } else {
      break;
    }
  }

  // Try guest / tabs if visible
  for (const label of [/guest/i, /continue as guest/i, /get started/i, /start/i]) {
    const b = page.getByRole("button", { name: label });
    if (await b.count()) {
      await b.first().click().catch(() => {});
      await page.waitForTimeout(1200);
      await shot(page, "acumen-tabs.png");
      break;
    }
  }

  // Wider crop of last state
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.waitForTimeout(400);
  await shot(page, "acumen-desktop-frame.png");
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    userAgent: "PinekraftPortfolioCapture/1.0",
  });
  const page = await context.newPage();

  try {
    console.log("— plethora —");
    await capturePlethora(page);
  } catch (e) {
    console.error("plethora capture failed:", e.message);
  }

  try {
    console.log("— forma —");
    await captureForma(page);
  } catch (e) {
    console.error("forma capture failed:", e.message);
  }

  try {
    console.log("— acumen —");
    await captureAcumen(page);
  } catch (e) {
    console.error("acumen capture failed:", e.message);
  }

  await browser.close();
  console.log("done →", outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
