/**
 * Gauge: six candidate pillars of uneven height stand in a row on a plinth,
 * their scores. Behind them runs a rail with a height gauge on it: a slim post
 * and a thin arm that reaches forward over the row. The pointer picks a
 * pillar; the gauge glides along the rail to it and its arm settles on the
 * lid, on the 700ms lift curve, and the pillar takes the bright stroke. At
 * rest the arm reads the tallest. The slider is the spread of the scores.
 *
 * The pattern: one of many. Tweens for which, a hit test on the resting
 * centres (nothing drawn is tested), paint order that follows the gauge.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 6, CELL = 22, FOOT = 14, PY = 26, PB = 5;
const BASE = [22, 41, 58, 36, 50, 30];
const X0 = -8, X1 = N * CELL + 8, Y0 = -6, Y1 = 40;
const RAIL = 3.5, ARM = 1.4, HEAD = 6, LIFT = 8;
const cx = (i) => i * CELL + CELL / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let F = value;
  const top = Math.max(...BASE) * 1.4;

  const C = Cam(45, 0.5, 1.9);
  fit(C, [[X0, Y0, -PB], [X1, Y1, -PB], [X1, Y0, -PB], [X0, Y1, -PB], [cx(2), 0, top + LIFT + HEAD], [cx(2), PY, top + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // plinth, then the rail along the back: both never move
  const [pr, pi] = rings(X0, Y0, X1, Y1, 8, 2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  const [rr, ri] = rings(X0 + 4, 0, X1 - 4, 4, 1.6, 0.6);
  put(solid(g), prism(P, front, rr, ri, 0, RAIL));

  // the pillars, in ascending x: the paint order along the row
  const cols = [];
  for (let i = 0; i < N; i++) {
    const [ring, inner] = rings(cx(i) - FOOT / 2, PY - FOOT / 2, cx(i) + FOOT / 2, PY + FOOT / 2, 3.2, 1);
    cols.push({ ring, inner, el: solid(g), z: tween(0), drawn: NaN });
  }

  // the gauge: post on the rail, arm reaching forward, a dot where the arm reads. One group, moved in the paint
  // order to just after the pillar it stands behind, so the next pillar still covers it.
  const gauge = mk("g", {}, g);
  const post = solid(gauge), arm = solid(gauge);
  const tip = flatDot(gauge, C, 0.8, "dot");
  let slot = -1;

  const tallest = BASE.indexOf(Math.max(...BASE));
  const ax = tween(cx(tallest)), az = tween(BASE[tallest] * F);
  let act = tallest, gx = NaN, gz = NaN;

  // the pillar being read is lifted off the plinth by LIFT, as a sample is set on a gauge's anvil
  function drawCol(i, now) {
    const c = cols[i], h = BASE[i] * F, z = tval(c.z, now), key = h + z * 1000;
    if (key === c.drawn) return false;
    c.drawn = key;
    put(c.el, prism(P, front, c.ring, c.inner, z, z + h));
    return !tdone(c.z, now);
  }
  function drawGauge(x, z) {
    if (x === gx && z === gz) return;
    gx = x; gz = z;
    const k = clamp(Math.round((x - CELL / 2) / CELL), 0, N - 1);
    if (k !== slot) { slot = k; cols[k].el.g.after(gauge); }
    const [pr2, pi2] = rings(x - 2.2, 0.4, x + 2.2, 3.6, 1.2, 0.6);
    put(post, prism(P, front, pr2, pi2, RAIL, z + ARM + HEAD));
    const [ar, ai] = rings(x - 2, 1, x + 2, PY + 2, 1.2, 0.6);
    put(arm, prism(P, front, ar, ai, z, z + ARM));
    place(tip, P(x, PY, z + ARM));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (let i = 0; i < N; i++) if (drawCol(i, now)) m = true;
    drawGauge(tval(ax, now), tval(az, now));
    return m || !tdone(ax, now) || !tdone(az, now);
  });
  bag.add(B.unregister);

  // hit bands: the resting centres of the pillars on screen, which never move
  const sx = [], band = (P(cx(1), PY, 0)[0] - P(cx(0), PY, 0)[0]) * 0.55;
  for (let i = 0; i < N; i++) sx.push(P(cx(i), PY, 0)[0]);
  const yTop = P(cx(0), PY, top + LIFT)[1] - 10, yBot = P(cx(N - 1), PY, -PB)[1] + 14;
  function hit([x, y]) {
    if (y < yTop || y > yBot) return -1;
    let best = -1, d = band;
    for (let i = 0; i < N; i++) { const e = Math.abs(x - sx[i]); if (e < d) { d = e; best = i; } }
    return best;
  }

  function choose(i, now) {
    const to = i < 0 ? tallest : i;
    const lift = i < 0 ? 0 : LIFT;
    tset(ax, cx(to), now, 0); tset(az, BASE[to] * F + lift, now, 0);
    cols.forEach((c, k) => { tset(c.z, k === to ? lift : 0, now, 0); c.el.sil.classList.toggle("hi", k === to); });
    read.textContent = i < 0 ? "rest" : `m·${String(i + 1).padStart(2, "0")} ${Math.round(BASE[i] * F)}`;
    B.wake();
  }
  function setActive(i) {
    if (i === act) return;
    act = i;
    choose(i, performance.now());
  }
  choose(-1, performance.now());
  act = -1;

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { F = v; choose(act, performance.now()); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "gauge",
  means: "Six candidates on a plinth, their scores as height: the gauge glides to the one under the pointer and reads it.",
  rules: [1, 5, 8, 9],
  range: [0.6, 1, 1.4],
  tour: [[144, 171], [232, 213], [262, 237], null],
  mount,
});
