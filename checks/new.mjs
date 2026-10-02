// /new (the constellation design lab route): swarm assembles into the cell, disperses past the hero, honours
// reduced motion and Pause motion; blocks play once and loop in view; phone overflow; block fit at 1280x720.
// usage: [BASE=http://localhost:4173/new/] node checks/new.mjs   (serve out/ WITHOUT -s: it rewrites /new/ to /)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync(new URL("./shots/", import.meta.url).pathname, { recursive: true });
process.chdir(new URL("./", import.meta.url).pathname);
const BASE = process.env.BASE ?? (process.env.CHECK_ORIGIN ?? "http://localhost:3000") + "/new/";
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); console.log(`${c ? "ok  " : "FAIL"} ${m}`); };
const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });
// drawn pixels of a viewport rect, read straight off the swarm canvas (alpha > 12 %): the page's text does
// not get in the way and nothing has to be hidden
async function lit(p, rect) {
  return p.evaluate((r) => {
    const c = document.querySelector("canvas"), k = c.width / c.clientWidth;
    const d = c.getContext("2d").getImageData(Math.round(r.x * k), Math.round(r.y * k), Math.max(1, Math.round(r.width * k)), Math.max(1, Math.round(r.height * k))).data; let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 30) n++;
    return n / (d.length / 4);
  }, rect);
}
const rectOf = (p, sel) => p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
// a rect beside the target on the side with more room, as wide as fits (densities are compared, not counts)
const twin = (r, W) => { const L = r.x - 24, R = W - r.x - r.width - 24; return L >= R ? { x: Math.max(0, r.x - 24 - Math.min(r.width, L)), y: r.y, width: Math.min(r.width, L), height: r.height } : { x: r.x + r.width + 24, y: r.y, width: Math.min(r.width, R), height: r.height }; };
{
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(BASE, { waitUntil: "networkidle" });
  const title = await p.textContent("h1");
  if (title !== "Ship the AI feature.") { console.log(`skip: ${BASE} is not the lab route (h1 "${title}"); build with DESIGN_NEW=1 in .env.local`); await b.close(); process.exit(0); }
  const swarmed = await p.waitForSelector('canvas[data-swarm="settled"]', { timeout: 5000 }).then(() => true).catch(() => false);
  ok(swarmed, "swarm: settled within 5 s");
  await p.waitForTimeout(300);
  const tr = await rectOf(p, '[data-swarm-scene="cell"]');
  const inside = await lit(p, tr), outside = await lit(p, twin(tr, 1280));
  ok(inside > 0.02 && inside > 4 * outside, `swarm: figure in the target column (${(inside * 100).toFixed(1)}% lit vs ${(outside * 100).toFixed(1)}% beside it)`);
  // the lab slider: twice the particles draw a denser cell, Reset returns to the default
  await p.fill("#lab-particles", "4800"); await p.waitForTimeout(1500);
  const n1 = await p.getAttribute("canvas", "data-swarm-n"), dense = await lit(p, tr);
  ok(n1 === "4800" && dense > 1.3 * inside, `lab slider: 4800 particles draw a denser cell (${(dense * 100).toFixed(1)}% lit vs ${(inside * 100).toFixed(1)}%)`);
  await p.click('[aria-label="Lab: particle count"] button'); await p.waitForTimeout(1500);
  const n2 = await p.getAttribute("canvas", "data-swarm-n"), back = await lit(p, tr);
  ok(n2 === "2400" && Math.abs(back - inside) < 0.25 * inside, `lab slider: Reset returns to 2400 (${(back * 100).toFixed(1)}% lit)`);
  await p.evaluate(() => document.querySelector("#services").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(1500);
  const field = await lit(p, { x: 0, y: 0, width: 1280, height: 720 });
  ok(field < 0.06, `swarm: the intro stays sparse, six small hives and the field (${(field * 100).toFixed(2)}% lit)`);
  // the services index: the swarm forms the hives, and each item wanders (a transform set by the swarm) with its label
  const bee = async () => p.$$eval("#services [data-bee]", (els) => els.map((e) => e.style.transform));
  const b1 = await bee(); await p.waitForTimeout(700); const b2 = await bee();
  ok((await p.getAttribute("canvas", "data-swarm-at")) === "hive" && b1.length === 6, `intro: six hives held by the swarm (${b1.length})`);
  ok(b1.every((t) => t.startsWith("translate3d")) && b1.some((t, i) => t !== b2[i]), "intro: the items wander like bees (transforms change)");
  const hr = await rectOf(p, '#services [data-swarm-scene="hive"]'), hIn = await lit(p, hr);
  ok(hIn > 0.03, `intro: a hive is drawn in its square (${(hIn * 100).toFixed(1)}% lit)`);
  // blocks: fit, play-once text, the formation held
  for (const id of ["02", "04", "06"]) {
    const sel = `#cell-${id}`;
    // the formation: with the section at the top of the viewport its scene square is on screen
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "start", behavior: "instant" }), sel); await p.waitForTimeout(1500);
    let s = await p.evaluate((s) => { const el = document.querySelector(s); return { th: Math.round(el.querySelector('[class*="text"]').getBoundingClientRect().height), sh: Math.round(el.querySelector('[data-swarm-scene]').getBoundingClientRect().height), scene: document.querySelector("canvas").dataset.swarmAt, key: el.querySelector('[data-swarm-scene]').getAttribute('data-swarm-scene') }; }, sel);
    ok(s.th <= 700 && s.sh <= 648, `block ${id}: text ${s.th}px, scene ${s.sh}px tall (a viewport each at 1280x720)`);
    ok(s.scene === s.key, `block ${id}: swarm holds its formation (${s.scene} vs ${s.key})`);
    // (judged at the end of this block: a figure's story starts dim, 06 is mostly unlit for its first 2.5 s, and
    // waiting here would let the text finish before it is checked)
    const sr = await rectOf(p, `${sel} [data-swarm-scene]`); let sIn = await lit(p, sr), sOut = await lit(p, twin(sr, 1280));
    // the overlay runs on the swarm's clock: its animations are paused in css and their time moves anyway
    const ov = () => p.evaluate((s) => document.querySelector(s).getAnimations({ subtree: true }).filter((x) => x.animationName && !x.animationName.endsWith("wander")).map((x) => [x.playState, Math.round(x.currentTime)]), `${sel} [data-swarm-scene]`);
    const o1 = await ov(); await p.waitForTimeout(400); const o2 = await ov();
    ok(o1.length > 0 && o1.every((x) => x[0] === "paused") && o1.some((x, i) => x[1] !== o2[i][1]), `block ${id}: overlay scrubbed by the swarm (${o1.length} animations, t ${o1[0]?.[1]} to ${o2[0]?.[1]} ms)`);
    // the text: bring its column fully into view (the wide band's copy sits below its formation) and it plays once
    await p.evaluate((s) => document.querySelector(s).querySelector('[class*="text"]').scrollIntoView({ block: "end", behavior: "instant" }), sel); await p.waitForTimeout(500);
    s = await p.evaluate((s) => { const el = document.querySelector(s); const t = el.querySelector('[class*="text"]').getAnimations({ subtree: true }); return { tn: t.length, trun: t.filter((x) => x.playState === "running").length, cta: +getComputedStyle(el.querySelector(".act")).opacity }; }, sel);
    ok(s.trun > 0 && s.cta > 0.9, `block ${id}: text plays on entry, action already shown (${s.trun}/${s.tn}, cta ${s.cta})`);
    await p.waitForTimeout(3800);
    s = await p.evaluate((s) => { const t = document.querySelector(s).querySelector('[class*="text"]').getAnimations({ subtree: true }); return { tn: t.length, tfin: t.filter((x) => x.playState === "finished").length, sw: document.documentElement.scrollWidth }; }, sel);
    ok(s.tfin === s.tn && s.sw <= 1280, `block ${id}: text finished after 4 s (${s.tfin}/${s.tn}), no overflow (${s.sw})`);
    // the figure: if the first look caught the dim start of its loop, look again for up to 5 s with the scene back in place
    const drawn = () => sIn > 0.01 && sIn > 3 * sOut;
    if (!drawn()) { await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "start", behavior: "instant" }), sel); await p.waitForTimeout(1200); }
    for (let k = 0; k < 10 && !drawn(); k++) { if (k) await p.waitForTimeout(500); sIn = await lit(p, sr); sOut = await lit(p, twin(sr, 1280)); }
    ok(drawn(), `block ${id}: figure drawn in the scene column (${(sIn * 100).toFixed(1)}% lit vs ${(sOut * 100).toFixed(1)}%)`);
  }
  await p.evaluate(() => document.querySelector("#contact").scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(1800);
  ok((await p.evaluate(() => document.querySelector("canvas").dataset.swarmAt)) === "cell", "contact: the swarm forms the cell again (bookend)");
  // the lab's A/B switch swaps the figure and the swarm follows
  await p.evaluate(() => document.querySelector("#cell-05 [data-swarm-scene]").scrollIntoView({ block: "center", behavior: "instant" })); await p.waitForTimeout(800);
  const before = await p.getAttribute("canvas", "data-swarm-at");
  await p.click('#cell-05 button[aria-pressed="false"]'); await p.waitForTimeout(800);
  const after = await p.getAttribute("canvas", "data-swarm-at");
  ok(/^s05[ab]$/.test(before) && /^s05[ab]$/.test(after) && before !== after, `lab: A/B switch swaps the figure (${before} to ${after})`);
  await p.click('#cell-05 button[aria-pressed="false"]'); await p.waitForTimeout(300);
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
  const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, tw: Math.round(document.querySelector('#cell-02 [class*="text"]').getBoundingClientRect().right), fw: Math.round(document.querySelector('#cell-02 [data-swarm-scene]').getBoundingClientRect().right), pill: getComputedStyle(document.querySelector('header a[href="#book"]')).display }));
  ok(r.sw <= 375 && r.tw <= 375 && r.fw <= 375, `phone: no horizontal overflow (page ${r.sw}, text right ${r.tw}, scene right ${r.fw})`);
  ok(r.pill === "none", `phone: nav pill not shown (${r.pill})`);
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
  const tr = await rectOf(p, '[data-swarm-scene="cell"]');
  const inside = await lit(p, tr), outside = await lit(p, twin(tr, 1280));
  ok(inside > 0.02 && inside > 4 * outside, `reduced motion: figure assembled at once (${(inside * 100).toFixed(1)}% vs ${(outside * 100).toFixed(1)}%)`);
  const r = await p.evaluate(() => { const t = document.querySelector('#cell-03 [class*="text"]').getAnimations({ subtree: true }); return { tend: t.every((x) => x.playState === "finished"), cta: +getComputedStyle(document.querySelector("#cell-03 .act")).opacity, run: document.getAnimations().filter((a) => a.playState === "running").length }; });
  ok(r.tend && r.cta > 0.9 && r.run === 0, `reduced motion: block text finished, nothing running (cta ${r.cta}, running ${r.run})`);
  await p.evaluate(() => document.querySelector("#cell-04").scrollIntoView({ block: "center", behavior: "instant" })); await p.waitForTimeout(400);
  const rm = await p.evaluate(() => document.querySelector("canvas").dataset.swarmAt);
  ok(/^s04[ab]$/.test(rm), `reduced motion: formation follows scroll while still (${rm})`);
  const held = await p.evaluate(() => { const sc = document.querySelector("#cell-04 [data-swarm-scene]"); const an = sc.getAnimations({ subtree: true }).filter((x) => x.animationName && !x.animationName.endsWith("wander")); const vis = [...sc.querySelectorAll(".hy-desk .hy-ov")].filter((e) => +getComputedStyle(e).opacity > 0.9).length; return { t: Math.round(an[0]?.currentTime ?? -1), moving: an.filter((x) => x.playState === "running").length, vis }; });
  ok(held.t >= 10000 && held.moving === 0 && held.vis >= 2, `reduced motion: overlay parked on the held frame (t=${held.t} ms, ${held.vis} labels shown)`);
  ok((await p.$$eval("#services [data-bee]", (els) => els.every((e) => !e.style.transform))), "reduced motion: the intro items do not wander");
  await p.screenshot({ path: "shots/new-hero-reduced.png" });
  await p.close();
}
await b.close();
if (fails.length) { console.log(`\n${fails.length} failure(s)`); process.exit(1); } console.log("\nall /new checks passed");
