// Addendum checks: T7 luminance and per-line contrast, pills; T8 snippets inside the cell polygon; T9 reveal pacing.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync(new URL("./shots/", import.meta.url).pathname, { recursive: true });
process.chdir(new URL("./", import.meta.url).pathname);
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); console.log(`${c ? "ok  " : "FAIL"} ${m}`); };
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const INK = lum(244, 241, 234);
const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });
// stats of a viewport rect from a screenshot, computed in-page on a 2d canvas
async function stats(p, rect) {
  const png = await p.screenshot({ clip: rect });
  return p.evaluate(async (b64) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let sum = 0, min = 1, max = 0;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]); sum += l; if (l < min) min = l; if (l > max) max = l; }
    return { mean: sum / (d.length / 4), min, max };
  }, png.toString("base64"));
}
for (const [W, H, mob] of [[1280, 720, false], [375, 812, true]]) {
  const p = await b.newPage({ viewport: { width: W, height: H }, isMobile: mob, deviceScaleFactor: 1 });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" }); await p.waitForTimeout(2500);
  // T7.2 luminance behind the copy block with the copy hidden
  await p.addStyleTag({ content: '[class*="copy"] { visibility: hidden !important; }' });
  await p.waitForTimeout(300);
  const box = { x: Math.max(0, W / 2 - 380), y: H / 2 - 210, width: Math.min(760, W), height: 420 };
  const s = await stats(p, box);
  ok(s.mean < 0.45, `${W}: mean luminance behind the copy block ${(s.mean * 100).toFixed(0)}% (< 45%)`);
  // T7 accept: per line, glyphs transparent but shadows rendered
  await p.addStyleTag({ content: '[class*="copy"] { visibility: visible !important; } [class*="copy"] * { color: transparent !important; }' });
  await p.waitForTimeout(300);
  for (const sel of ['[class*="eyebrow"]', "#hero-title", '[class*="sub"]']) {
    const r = await p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
    const t = await stats(p, r);
    const cMin = contrast(INK, t.max), cMax = contrast(INK, t.min);
    ok(cMin >= 4.5, `${W}: ${sel} contrast vs brightest pixel behind it ${cMin.toFixed(1)}:1, vs darkest ${cMax.toFixed(1)}:1`);
  }
  await p.addStyleTag({ content: '[class*="copy"] * { color: revert !important; }' });
  // T7.3 pills
  const btns = await p.$$eval('[class*="actions"] a', (as) => as.map((a) => { const r = a.getBoundingClientRect(); const c = getComputedStyle(a); return { h: Math.round(r.height), radius: c.borderRadius, bg: c.backgroundColor, text: a.textContent }; }));
  ok(btns.length === 2 && btns.every((x) => x.h >= 48 && x.radius === "999px"), `${W}: two pill buttons ≥48px (${btns.map((x) => `${x.text} ${x.h}px ${x.radius}`).join(", ")})`);
  // T8 snippets inside the rendered cell polygon
  const t8 = await p.evaluate(() => {
    const cell = document.querySelector('[class*="cell"]').getBoundingClientRect();
    const pts = [[50, 5.5], [88.5, 27.7], [88.5, 72.3], [50, 94.5], [11.5, 72.3], [11.5, 27.7]].map(([px, py]) => [cell.left + (px / 100) * cell.width, cell.top + (py / 100) * cell.height]);
    const inside = (x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
    const lis = [...document.querySelectorAll('[class*="code"] li')];
    return { n: lis.length, out: lis.filter((li) => { const r = li.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const visible = r.bottom > cell.top && r.top < cell.bottom; return visible && !inside(cx, cy); }).map((li) => li.textContent) };
  });
  ok(t8.out.length === 0, `${W}: every visible snippet centre inside the cell polygon (${t8.n} snippets${t8.out.length ? ", outside: " + t8.out.join("; ") : ""})`);
  await p.screenshot({ path: `shots/hero3-${W}.png` });
  await p.close();
}
// T9 pacing at 720 tall: scroll at ~700 px/s and sample when the card top reaches 60% of the viewport
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  const words = (sel) => p.$$eval(`${sel} h2 .w`, (ws) => ws.filter((w) => +getComputedStyle(w).opacity > 0.9).length + "/" + ws.length);
  for (const id of ["01", "02", "03"]) {
    const top = await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, `#cell-${id}`);
    // scroll from 900px above the card to top-at-60% in 35px steps at 20 ms → ~1750 px/s? no: 35px/20ms = 1750px/s; use 14px/20ms = 700px/s
    const target = top - 0.6 * 720; let y = target - 700; await p.evaluate((y) => scrollTo(0, y), y);
    while (y < target) { y = Math.min(target, y + 14); await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(20); }
    const w = await words(`#cell-${id}`);
    ok(w.split("/")[0] === w.split("/")[1], `T9 card ${id}: question headline complete when its top reaches 60% of the viewport at 700 px/s (${w})`);
    await p.waitForTimeout(8000);
  }
  // honeycomb: bottom row 50% visible
  await p.evaluate(() => scrollTo(0, 0)); await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(500);
  const navTop = await p.evaluate(() => document.querySelector('nav[aria-label="Six services"] svg').getBoundingClientRect().bottom + scrollY);
  const target = navTop - 0.5 * 92 - 720 + 0; // bottom row (92px tall) half visible at the viewport bottom
  let y = target - 700; await p.evaluate((y) => scrollTo(0, y), y);
  while (y < target) { y = Math.min(target, y + 14); await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(20); }
  const cells = await p.$$eval('nav[aria-label="Six services"] a > g', (gs) => gs.filter((g) => +getComputedStyle(g).opacity > 0.9).length);
  ok(cells === 6, `T9 intro: honeycomb fully drawn when its bottom row is 50% visible at 700 px/s (${cells}/6)`);
  await p.close();
}
await b.close();
if (fails.length) { console.log(`\n${fails.length} failure(s)`); process.exit(1); } console.log("\nall addendum checks passed");
