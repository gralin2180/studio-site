import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "work");
const base =
  process.env.ACUMEN_URL ||
  "https://unexpired-estimator-clutter.ngrok-free.dev";

async function hardHide(page) {
  for (const re of [/got it/i, /skip/i, /let.?s learn/i, /continue/i, /not now/i]) {
    const els = page.getByText(re);
    const n = await els.count();
    for (let i = 0; i < n; i++) {
      const el = els.nth(i);
      if (await el.isVisible().catch(() => false)) {
        await el.click({ force: true }).catch(() => {});
      }
    }
  }
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    const markers = [
      /Auri/i,
      /curious cat/i,
      /GOT IT/i,
      /LET.?S LEARN/i,
      /Quick glance/i,
      /Your pulse/i,
      /where you stand/i,
      /Hey from Auri/i,
    ];
    document.querySelectorAll("body *").forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const t = (el.innerText || "").trim();
      if (!t || t.length > 280) return;
      if (!markers.some((m) => m.test(t))) return;
      const r = el.getBoundingClientRect();
      if (r.height > 240 && r.width > 200) {
        el.style.setProperty("display", "none", "important");
      }
    });
  });
}

const browser = await chromium.launch({ headless: true });

for (const form of ["mobile", "web"]) {
  const vp =
    form === "mobile"
      ? { width: 420, height: 900, dpr: 2 }
      : { width: 1280, height: 800, dpr: 1.25 };
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
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
    ["/", "home"],
    ["/decks", "decks"],
    ["/leaderboard", "ranks"],
    ["/quests", "quests"],
    ["/profile", "profile"],
    ["/api-keys", "settings"],
  ];

  for (const [route, name] of routes) {
    await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1000);
    await hardHide(page);
    await hardHide(page);
    await page.screenshot({
      path: path.join(out, `acumen-light-${form}-${name}.png`),
    });
    const snippet = (await page.locator("body").innerText())
      .slice(0, 90)
      .replace(/\n/g, " | ");
    console.log("light", form, name, snippet);
  }

  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await hardHide(page);
  const input = page.locator("input").first();
  if (await input.isVisible().catch(() => false)) {
    await input.fill("Product design fundamentals");
  }
  await page.getByText(/BUILD MY DECK/i).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1200);
  await hardHide(page);
  if (!/Create deck|Difficulty/i.test(await page.locator("body").innerText())) {
    await page.goto(base + "/generate", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);
    await hardHide(page);
  }
  await page.screenshot({
    path: path.join(out, `acumen-light-${form}-generate.png`),
  });
  console.log(
    "light",
    form,
    "generate",
    (await page.locator("body").innerText()).slice(0, 80).replace(/\n/g, " | "),
  );
  await context.close();
}

await browser.close();
console.log("done");
