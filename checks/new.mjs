// /new (the constellation design lab route): swarm assembles into the cell, disperses past the hero, honours
// reduced motion and Pause motion; blocks play once and loop in view; phone overflow; block fit at 1280x720.
// usage: [BASE=http://localhost:4173/new/] node checks/new.mjs   (serve out/ WITHOUT -s: it rewrites /new/ to /)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync(new URL("./shots/", import.meta.url).pathname, { recursive: true });
process.chdir(new URL("./", import.meta.url).pathname);
const BASE = process.env.BASE ?? "http://localhost:3000/new/";
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); console.log(`${c ? "ok  " : "FAIL"} ${m}`); };
const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });
// lit pixels (luminance > 5 %) of a viewport rect, from a screenshot decoded in-page
async function lit(p, rect) {
  const png = await p.screenshot({ clip: rect });
  return p.evaluate(async (b64) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) if (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2] > 13) n++;
    return n / (d.length / 4);
  }, png.toString("base64"));
}
const rectOf = (p, sel) => p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
const twin = (r, W) => ({ x: Math.max(0, r.x - r.width - 40) , y: r.y, width: r.width, height: r.height }); // an equal rect to the left of the target
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE, { waitUntil: "networkidle" });
  const title = await p.textContent("h1");
  if (title !== "Ship the AI feature.") { console.log(`skip: ${BASE} is not the lab route (h1 "${title}"); build with DESIGN_NEW=1 in .env.local`); await b.close(); process.exit(0); }
  const swarmed = await p.waitForSelector('canvas[data-swarm="settled"]', { timeout: 5000 }).then(() => true).catch(() => false);
  ok(swarmed, "swarm: settled within 5 s");
  await p.waitForTimeout(300);
  await p.addStyleTag({ content: "main, header { visibility: hidden !important; }" }); await p.waitForTimeout(100);
  const tr = await rectOf(p, "[data-swarm-target]");
  const inside = await lit(p, tr), outside = await lit(p, twin(tr, 1280));
  ok(inside > 0.02 && inside > 4 * outside, `swarm: figure in the target column (${(inside * 100).toFixed(1)}% lit vs ${(outside * 100).toFixed(1)}% beside it)`);
  await p.evaluate(() => document.querySelector("#cell-03").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(1500);
  const field = await lit(p, { x: 0, y: 0, width: 1280, height: 720 });
  ok(field < 0.06, `swarm: sparse field past the hero, a quarter of the figure at most (${(field * 100).toFixed(2)}% lit)`);
  await p.addStyleTag({ content: "main, header { visibility: visible !important; }" });
  // blocks: fit, play-once text, loop policy
  for (const id of ["02", "04", "06"]) {
    const sel = `#cell-${id}`;
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "start", behavior: "instant" }), sel); await p.waitForTimeout(500);
    let s = await p.evaluate((s) => { const el = document.querySelector(s); const t = el.querySelector('[class*="text"]').getAnimations({ subtree: true }); const f = el.querySelector('[class*="frame"]').getAnimations({ subtree: true }); return { th: Math.round(el.querySelector('[class*="text"]').getBoundingClientRect().height), fh: Math.round(el.querySelector('[class*="frame"]').getBoundingClientRect().height), tn: t.length, trun: t.filter((x) => x.playState === "running").length, fn: f.length, frun: f.filter((x) => x.playState === "running").length, cta: +getComputedStyle(el.querySelector(".act")).opacity }; }, sel);
    ok(s.th <= 640 && s.fh <= 600, `block ${id}: text ${s.th}px, frame ${s.fh}px tall (fit 720)`);
    ok(s.trun > 0 && s.cta > 0.9, `block ${id}: text plays on entry, action already shown (${s.trun}/${s.tn}, cta ${s.cta})`);
    ok(s.fn > 0 && s.frun === s.fn, `block ${id}: loop running in view (${s.frun}/${s.fn})`);
    await p.waitForTimeout(3800);
    s = await p.evaluate((s) => { const t = document.querySelector(s).querySelector('[class*="text"]').getAnimations({ subtree: true }); return { tn: t.length, tfin: t.filter((x) => x.playState === "finished").length, sw: document.documentElement.scrollWidth }; }, sel);
    ok(s.tfin === s.tn && s.sw <= 1280, `block ${id}: text finished after 4 s (${s.tfin}/${s.tn}), no overflow (${s.sw})`);
  }
  await p.evaluate(() => document.querySelector("#contact").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(600);
  const paused = await p.evaluate(() => { const f = document.querySelector('#cell-01 [class*="frame"]').getAnimations({ subtree: true }); return { n: f.length, paused: f.filter((x) => x.playState === "paused").length }; });
  ok(paused.paused === paused.n, `block 01: loop paused off screen (${paused.paused}/${paused.n})`);
  ok(await p.$eval("header", (h) => h.hasAttribute("data-past-hero")), "nav: pill shown once past the hero");
  await p.screenshot({ path: "shots/new-contact-1280.png" });
  ok(errs.length === 0, `no page errors ${errs.join(";")}`);
  await p.close();
}
// --- phone
{
  const p = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, deviceScaleFactor: 2 });
  await p.goto(BASE, { waitUntil: "networkidle" }); await p.waitForTimeout(3500);
  ok(await p.$eval("header", (h) => !h.hasAttribute("data-past-hero")), "phone: nav pill hidden on the hero");
  await p.screenshot({ path: "shots/new-hero-375.png" });
  await p.evaluate(() => document.querySelector("#cell-02").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(4000);
  const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, tw: Math.round(document.querySelector('#cell-02 [class*="text"]').getBoundingClientRect().right), fw: Math.round(document.querySelector('#cell-02 [class*="frame"]').getBoundingClientRect().right) }));
  ok(r.sw <= 375 && r.tw <= 375 && r.fw <= 375, `phone: no horizontal overflow (page ${r.sw}, text right ${r.tw}, frame right ${r.fw})`);
  await p.screenshot({ path: "shots/new-cell02-375.png" });
  await p.close();
}
// --- Pause motion
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto(BASE, { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  const state = () => p.getAttribute("canvas", "data-swarm");
  const running = () => p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
  await p.click("footer button"); await p.waitForTimeout(300);
  ok((await state()) === "still" && (await running()) === 0, `pause: swarm still, nothing running (${await state()})`);
  await p.click("footer button"); await p.waitForTimeout(300);
  ok((await state()) === "settled", `pause: Play motion resumes the swarm (${await state()})`);
  await p.close();
}
// --- reduced motion: the finished scene, drawn once, no loop
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  await p.goto(BASE, { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  ok((await p.getAttribute("canvas", "data-swarm")) === "still", "reduced motion: swarm drawn still");
  await p.addStyleTag({ content: "main, header { visibility: hidden !important; }" }); await p.waitForTimeout(100);
  const tr = await rectOf(p, "[data-swarm-target]");
  const inside = await lit(p, tr), outside = await lit(p, twin(tr, 1280));
  ok(inside > 0.02 && inside > 4 * outside, `reduced motion: figure assembled at once (${(inside * 100).toFixed(1)}% vs ${(outside * 100).toFixed(1)}%)`);
  await p.addStyleTag({ content: "main, header { visibility: visible !important; }" });
  const r = await p.evaluate(() => { const t = document.querySelector('#cell-03 [class*="text"]').getAnimations({ subtree: true }); const f = document.querySelector('#cell-03 [class*="frame"]').getAnimations({ subtree: true }); return { tend: t.every((x) => x.playState === "finished"), fn: f.length, fpaused: f.filter((x) => x.playState === "paused").length, ft: Math.round(f[0]?.currentTime ?? -1), cta: +getComputedStyle(document.querySelector("#cell-03 .act")).opacity, run: document.getAnimations().filter((a) => a.playState === "running").length }; });
  ok(r.tend && r.cta > 0.9 && r.run === 0, `reduced motion: block text finished, nothing running (cta ${r.cta}, running ${r.run})`);
  ok(r.fn > 0 && r.fpaused === r.fn && r.ft >= 12300, `reduced motion: loop parked at 95% (${r.fpaused}/${r.fn}, t=${r.ft}ms)`);
  await p.screenshot({ path: "shots/new-hero-reduced.png" });
  await p.close();
}
await b.close();
if (fails.length) { console.log(`\n${fails.length} failure(s)`); process.exit(1); } console.log("\nall /new checks passed");
