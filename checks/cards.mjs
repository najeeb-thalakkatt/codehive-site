import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync(new URL("./shots/", import.meta.url).pathname, { recursive: true });
process.chdir(new URL("./", import.meta.url).pathname);
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); console.log(`${c ? "ok  " : "FAIL"} ${m}`); };
const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });
const ids = ["01", "02", "03", "04", "05", "06"];
// --- 1280x720: card fit, page height, text play, loop policy
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const live = await b.newPage({ viewport: { width: 1280, height: 720 } }); await live.goto("https://codehives.se/", { waitUntil: "networkidle" });
  const Hlive = await live.evaluate(() => document.documentElement.scrollHeight); await live.close();
  console.log(`page height 1280x720: v3 ${H}px (${(H / 720).toFixed(1)} screens) vs live ${Hlive}px (${(Hlive / 720).toFixed(1)} screens)`);
  const links = await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Six services"] a')].map((a) => a.getAttribute("href") + " " + a.getAttribute("aria-label")));
  ok(links.length === 6 && links.every((l, i) => l.startsWith(`#cell-0${i + 1} 0${i + 1} `)), `intro: six cells linked in order (${links[0]} … ${links[5]})`);
  await p.evaluate(() => document.querySelector("#services").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(600);
  let st = await p.evaluate(() => { const a = document.querySelector("#services").getAnimations({ subtree: true }); return { n: a.length, running: a.filter((x) => x.playState === "running").length }; });
  ok(st.running > 0, `intro: plays on entry (${st.running}/${st.n} running)`);
  await p.waitForTimeout(10500);
  st = await p.evaluate(() => { const a = document.querySelector("#services").getAnimations({ subtree: true }); return { n: a.length, fin: a.filter((x) => x.playState === "finished").length, fill: getComputedStyle(document.querySelector('nav[aria-label="Six services"] polygon')).fill }; });
  ok(st.fin === st.n, `intro: finished after 10 s, highlight stopped (${st.fin}/${st.n}, first cell fill ${st.fill})`);
  await p.screenshot({ path: "shots/v3-intro-1280.png" });
  for (const id of ids) {
    const r = await p.evaluate((s) => { const c = document.querySelector(s).getBoundingClientRect(); return Math.round(c.height); }, `#cell-${id}`);
    ok(r <= 720 - 40, `card ${id} height ${r}px fits a 720 viewport`);
  }
  for (const id of ["02", "04", "06"]) {
    const sel = `#cell-${id}`;
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "start", behavior: "instant" }), sel); await p.waitForTimeout(500);
    let s = await p.evaluate((s) => { const el = document.querySelector(s); const t = el.querySelector('[class*="text"]').getAnimations({ subtree: true }); const f = el.querySelector('[class*="frame"]').getAnimations({ subtree: true }); return { tn: t.length, trun: t.filter((x) => x.playState === "running").length, fn: f.length, frun: f.filter((x) => x.playState === "running").length, cta: +getComputedStyle(el.querySelector(".act")).opacity }; }, sel);
    ok(s.trun > 0 && s.cta === 0, `card ${id}: text plays on entry (${s.trun}/${s.tn})`);
    ok(s.fn > 0 && s.frun === s.fn, `card ${id}: animation loop running in view (${s.frun}/${s.fn})`);
    await p.waitForTimeout(7800);
    s = await p.evaluate((s) => { const el = document.querySelector(s); const t = el.querySelector('[class*="text"]').getAnimations({ subtree: true }); return { tn: t.length, tfin: t.filter((x) => x.playState === "finished").length, cta: +getComputedStyle(el.querySelector(".act")).opacity, sw: document.documentElement.scrollWidth }; }, sel);
    ok(s.tfin === s.tn && s.cta > 0.9, `card ${id}: text finished after 8 s (${s.tfin}/${s.tn}, cta ${s.cta})`);
    ok(s.sw <= 1280, `card ${id}: no horizontal overflow (${s.sw})`);
    if (id === "02") await p.screenshot({ path: "shots/v3-card02-1280-end.png" });
  }
  await p.evaluate(() => document.querySelector("#contact").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(600);
  const paused = await p.evaluate(() => { const f = document.querySelector('#cell-01 [class*="frame"]').getAnimations({ subtree: true }); return { n: f.length, paused: f.filter((x) => x.playState === "paused").length }; });
  ok(paused.paused === paused.n, `card 01: loop paused once off screen (${paused.paused}/${paused.n})`);
  ok(errs.length === 0, `no page errors ${errs.join(";")}`);
  await p.close();
}
// --- phone
{
  const p = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, deviceScaleFactor: 2 });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector("#services").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(10500);
  await p.screenshot({ path: "shots/v3-intro-375.png" });
  await p.evaluate(() => document.querySelector("#cell-02").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(7800);
  const r = await p.evaluate(() => { const f = document.querySelector('#cell-02 [class*="frame"]').getBoundingClientRect(); return { fw: Math.round(f.width), fh: Math.round(f.height), sw: document.documentElement.scrollWidth }; });
  ok(r.sw <= 375, `phone: no horizontal overflow (${r.sw}); frame ${r.fw}x${r.fh}`);
  await p.screenshot({ path: "shots/v3-card02-375.png", fullPage: false });
  await p.close();
}
// --- reduced motion
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const t = document.querySelector('#cell-03 [class*="text"]').getAnimations({ subtree: true }); const f = document.querySelector('#cell-03 [class*="frame"]').getAnimations({ subtree: true }); const i = document.querySelector("#services").getAnimations({ subtree: true }); return { tend: t.every((x) => x.currentTime >= 990), iend: i.length > 0 && i.every((x) => x.currentTime >= 990), fn: f.length, fpaused: f.filter((x) => x.playState === "paused").length, ft: Math.round(f[0]?.currentTime ?? -1), cta: +getComputedStyle(document.querySelector("#cell-03 .act")).opacity, speed: document.querySelector("#top canvas") ? "canvas" : "none" }; });
  ok(r.tend && r.cta > 0.9, `reduced motion: card text at finished state (cta ${r.cta})`);
  ok(r.iend, `reduced motion: intro at finished state`);
  ok(r.fn > 0 && r.fpaused === r.fn && r.ft >= 12300, `reduced motion: loop parked at 95% (${r.fpaused}/${r.fn} paused, t=${r.ft}ms)`);
  await p.evaluate(() => document.querySelector("#cell-03").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(400);
  await p.screenshot({ path: "shots/v3-card03-reduced.png" });
  await p.close();
}
await b.close();
if (fails.length) { console.log(`\n${fails.length} failure(s)`); process.exit(1); } console.log("\nall v3 checks passed");
