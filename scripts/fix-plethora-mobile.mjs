/**
 * Plethora mobile: show the FULL desktop UI (no left strip crop).
 * object-fit: contain inside a phone shell — full page always visible.
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const work = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "work",
);

const masters = {
  home: "plethora-01-home.png",
  tools: "plethora-02-tools.png",
  finder: "plethora-03-finder.png",
  prompt: "plethora-04-prompt.png",
  learn: "plethora-05-learn.png",
};

const browser = await chromium.launch({ headless: true });

async function phoneContain(srcFile, dest, invert) {
  const src = path.join(work, srcFile);
  if (!fs.existsSync(src)) {
    console.log("missing", srcFile);
    return;
  }
  const buf = fs.readFileSync(src).toString("base64");
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const bg = invert ? "#ece8e1" : "#0b0b12";
  const filter = invert
    ? "filter:invert(1) hue-rotate(180deg) contrast(0.95) brightness(1.05);"
    : "";

  await page.setContent(
    `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body {
    width: 100%;
    height: 100%;
    background: ${bg};
    font-family: system-ui, sans-serif;
  }
  .phone {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${bg};
  }
  .status {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 10px 16px 6px;
    font-size: 11px;
    font-weight: 600;
    color: ${invert ? "#4a4a4a" : "rgba(255,255,255,0.55)"};
  }
  .screen {
    flex: 1 1 auto;
    min-height: 0;
    margin: 0 10px 12px;
    border-radius: 14px;
    overflow: hidden;
    background: ${invert ? "#fff" : "#05050a"};
    border: 1px solid ${invert ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .screen img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* full page — no cut */
    object-position: top center;
    display: block;
    ${filter}
  }
  .hint {
    flex: 0 0 auto;
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0 12px 14px;
    color: ${invert ? "#7a7a7a" : "rgba(255,255,255,0.4)"};
  }
</style>
</head>
<body>
  <div class="phone">
    <div class="status"><span>9:41</span><span>●● LTE</span></div>
    <div class="screen">
      <img src="data:image/png;base64,${buf}" alt=""/>
    </div>
    <div class="hint">Full page · scroll layout</div>
  </div>
</body>
</html>`,
    { waitUntil: "load" },
  );
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(work, dest) });
  console.log("ok", dest);
  await page.close();
}

async function webContain(srcFile, dest, invert) {
  const src = path.join(work, srcFile);
  if (!fs.existsSync(src)) return;
  const buf = fs.readFileSync(src).toString("base64");
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.25,
  });
  const bg = invert ? "#f4f1ea" : "#0a0a12";
  const filter = invert
    ? "filter:invert(1) hue-rotate(180deg) contrast(0.95) brightness(1.05);"
    : "";
  await page.setContent(
    `<!doctype html><html><head><style>
html,body{margin:0;height:100%;background:${bg}}
img{width:100%;height:100%;object-fit:contain;object-position:top center;${filter}}
</style></head><body>
<img src="data:image/png;base64,${buf}" alt=""/>
</body></html>`,
    { waitUntil: "load" },
  );
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(work, dest) });
  console.log("ok", dest);
  await page.close();
}

for (const [key, master] of Object.entries(masters)) {
  const masterPath = path.join(work, master);
  if (!fs.existsSync(masterPath)) continue;

  fs.copyFileSync(masterPath, path.join(work, `plethora-dark-web-${key}.png`));
  await phoneContain(master, `plethora-dark-mobile-${key}.png`, false);
  await phoneContain(master, `plethora-light-mobile-${key}.png`, true);
  await webContain(master, `plethora-light-web-${key}.png`, true);
}

await browser.close();
console.log("done");
