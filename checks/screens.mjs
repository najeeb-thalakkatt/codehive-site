// Screenshots of one section at three viewports. usage: node checks/screens.mjs "#cell-02" [waitMs]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const dir = new URL("./shots/", import.meta.url).pathname; mkdirSync(dir, { recursive: true });
const sel = process.argv[2] ?? "#top", wait = +(process.argv[3] ?? 800);
const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });
for (const [W, H, mob] of [[1280, 720, false], [1440, 900, false], [375, 812, true]]) {
  const p = await b.newPage({ viewport: { width: W, height: H }, isMobile: mob, deviceScaleFactor: mob ? 2 : 1 });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
  await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start", behavior: "instant" }), sel);
  await p.waitForTimeout(wait);
  await p.screenshot({ path: `${dir}screen-${W}.png` });
  console.log(`${dir}screen-${W}.png`);
  await p.close();
}
await b.close();
