import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "work");
const base = "https://unexpired-estimator-clutter.ngrok-free.dev";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 420, height: 900 },
  deviceScaleFactor: 2,
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
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

for (let n = 0; n < 10; n++) {
  for (const re of [/got it/i, /skip/i, /let.?s learn/i, /continue/i, /not now/i]) {
    const el = page.getByText(re).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ force: true }).catch(() => {});
      await page.waitForTimeout(350);
    }
  }
}

const input = page.locator("input").first();
if (await input.isVisible().catch(() => false)) {
  await input.fill("Product design fundamentals");
}
await page.getByText(/BUILD MY DECK/i).first().click({ force: true }).catch(() => {});
await page.waitForTimeout(1500);
await page.getByText(/got it/i).first().click({ force: true }).catch(() => {});
await page.waitForTimeout(700);

let text = await page.locator("body").innerText();
if (!/Create deck|Difficulty|Mode/i.test(text)) {
  await page.goto(base + "/generate", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  text = await page.locator("body").innerText();
}
console.log(text.slice(0, 220));
const file = path.join(out, "acumen-lite-generate.png");
await page.screenshot({ path: file });
console.log("size", fs.statSync(file).size);
await browser.close();
