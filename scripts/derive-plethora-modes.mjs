import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { pathToFileURL } from "url";

const work = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "work");
const sources = [
  ["plethora-01-home.png", "home"],
  ["plethora-02-tools.png", "tools"],
  ["plethora-03-finder.png", "finder"],
  ["plethora-04-prompt.png", "prompt"],
  ["plethora-05-learn.png", "learn"],
];

const browser = await chromium.launch({ headless: true });

for (const [file, key] of sources) {
  const src = path.join(work, file);
  if (!fs.existsSync(src)) {
    console.log("skip", file);
    continue;
  }
  const href = pathToFileURL(src).href;
  fs.copyFileSync(src, path.join(work, `plethora-dark-web-${key}.png`));

  const web = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.25,
  });
  await web.setContent(
    `<!doctype html><html><body style="margin:0;background:#fff">
    <img src="${href}" style="width:100%;height:100vh;object-fit:cover;object-position:top;filter:invert(1) hue-rotate(180deg)"/>
    </body></html>`,
    { waitUntil: "load" },
  );
  await web.waitForTimeout(250);
  await web.screenshot({ path: path.join(work, `plethora-light-web-${key}.png`) });
  await web.close();

  const mobD = await browser.newPage({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 2,
  });
  await mobD.setContent(
    `<!doctype html><html><body style="margin:0;background:#0a0a11;display:flex;justify-content:center">
    <img src="${href}" style="height:100vh;width:auto;max-width:none;object-fit:cover"/>
    </body></html>`,
    { waitUntil: "load" },
  );
  await mobD.waitForTimeout(250);
  await mobD.screenshot({ path: path.join(work, `plethora-dark-mobile-${key}.png`) });
  await mobD.close();

  const mobL = await browser.newPage({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 2,
  });
  await mobL.setContent(
    `<!doctype html><html><body style="margin:0;background:#f5f5f7;display:flex;justify-content:center">
    <img src="${href}" style="height:100vh;width:auto;max-width:none;object-fit:cover;filter:invert(1) hue-rotate(180deg)"/>
    </body></html>`,
    { waitUntil: "load" },
  );
  await mobL.waitForTimeout(250);
  await mobL.screenshot({ path: path.join(work, `plethora-light-mobile-${key}.png`) });
  await mobL.close();

  console.log("plethora", key);
}

await browser.close();
console.log("done");
