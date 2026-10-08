/**
 * Locks: a flight of three canal locks on a plinth, stepping up away from the
 * viewer. The pointer picks a chamber: the gate it came through lifts and takes
 * the bright stroke, the boat sails in and the chamber fills, so the boat rides
 * up to that level. At rest the boat waits in the lowest lock behind its closed
 * gate. The slider is the rise per lock.
 *
 * The pattern: discrete items. Tweens for the gate, the boat and the water, a
 * hit test on each chamber's resting water plane (rule 01, stepped parts), and
 * a paint order that walks the flight from the far, highest lock to the near one.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, CL = 34, CW = 22, WT = 2.4, WH = 5, LO = 1.5, HI = 5, GT = 1.6, GUP = 2, LIFT = 9, PB = 4, RISE_MAX = 12;
const BL = 24, BW = 10, HH = 5, CBL = 9, CBW = 6, CH = 6;
// chamber i runs from x0 to x1; lock 1 (i = 0) is nearest and lowest, the flight rises towards -x
const x0 = (i) => (N - 1 - i) * CL, x1 = (i) => (N - i) * CL, mid = (i) => x0(i) + CL / 2;
const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;
  const F = (i) => i * rise, T = (i) => F(i) + WH;

  // fitted to the flight at its steepest, with the far gate lifted and the boat on the top lock
  const C = Cam(45, 0.5, 2.5), L = N * CL, zTop = (N - 1) * RISE_MAX;
  fit(C, [[-5, -5, -PB], [L + 5, CW + 5, -PB], [L + 5, -5, -PB], [-5, CW + 5, -PB], [0, CW / 2, zTop + WH + GUP + LIFT], [mid(N - 1), CW / 2, zTop + HI + HH + CH]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-5, -5, L + 5, CW + 5, 6, 2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // gate j stands at x1(j): gate 0 is the entrance of lock 1, gate N the far end wall
  const gate = (j) => {
    const [r, i] = rings(x1(j) - GT / 2, WT - 0.4, x1(j) + GT / 2, CW - WT + 0.4, 0.7, 0.5);
    return { j, r, i, el: solid(g), up: tween(0), drawn: NaN };
  };
  const gates = [], walls = [], water = [], wr = [], lv = [], wz = [];
  for (let i = N - 1; i >= 0; i--) {
    gates[i + 1] = gate(i + 1);
    const [fr, fi] = rings(x0(i), 0, x1(i), WT, 1, 0.7), [nr, ni] = rings(x0(i), CW - WT, x1(i), CW, 1, 0.7);
    const far = solid(g);
    wr[i] = rrect(x0(i) + GT / 2, WT, x1(i) - GT / 2, CW - WT, 1.5, 4);
    water[i] = mk("path", {}, g);
    lv[i] = tween(F(i) + LO); wz[i] = NaN;
    walls[i] = { far, fr, fi, near: solid(g), nr, ni };
  }
  gates[0] = gate(0);

  // the boat, built once at the origin and shifted to where it floats: a tapered hull and a cabin aft
  const bg = mk("g", {}, g);
  const hullEl = solid(bg), cabinEl = solid(bg);
  const hTop = rrect(-BL / 2, -BW / 2, BL / 2, BW / 2, BW / 2, 5), hFoot = rrect(-BL / 2 + 2, -BW / 2 + 1.6, BL / 2 - 2, BW / 2 - 1.6, BW / 2 - 1.6, 5);
  const hIn = rrect(-BL / 2 + 0.9, -BW / 2 + 0.9, BL / 2 - 0.9, BW / 2 - 0.9, BW / 2 - 0.9, 5);
  const [cr, ci] = rings(3, -CBW / 2, 3 + CBL, CBW / 2, 1.2, 0.7);
  const bx = tween(mid(0)), bz = tween(F(0) + LO);
  let bd = [NaN, NaN], inLock = 0;
  water[0].after(bg);

  function drawBoat(x, z) {
    const y = CW / 2;
    put(hullEl, {
      sil: poly(hull(ringAt(P, shift(hFoot, x, y), z).concat(ringAt(P, shift(hTop, x, y), z + HH)))),
      crease: open(ringAt(P, run(shift(hIn, x, y), front), z + HH)),
    });
    put(cabinEl, prism(P, front, shift(cr, x, y), shift(ci, x, y), z + HH, z + HH + CH));
  }
  let dirty = true;
  function drawWalls() {
    for (const w of walls) { const i = walls.indexOf(w); put(w.far, prism(P, front, w.fr, w.fi, 0, T(i))); put(w.near, prism(P, front, w.nr, w.ni, 0, T(i))); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    if (dirty) { drawWalls(); dirty = false; }
    lv.forEach((tw, i) => {
      const z = tval(tw, now);
      if (z !== wz[i]) { wz[i] = z; water[i].setAttribute("d", poly(ringAt(P, wr[i], z))); }
      if (!tdone(tw, now)) moving = true;
    });
    for (const gt of gates) {
      const u = tval(gt.up, now);
      if (u !== gt.drawn) { gt.drawn = u; put(gt.el, prism(P, front, gt.r, gt.i, F(Math.max(0, gt.j - 1)) + u, T(Math.min(gt.j, N - 1)) + GUP + u)); }
      if (!tdone(gt.up, now)) moving = true;
    }
    const x = tval(bx, now), z = tval(bz, now);
    if (x !== bd[0] || z !== bd[1]) {
      bd = [x, z]; drawBoat(x, z);
      // the boat is painted in the lock it is over, so a gate it has not reached yet still covers it
      const c = Math.min(N - 1, Math.max(0, N - 1 - Math.floor(x / CL)));
      if (c !== inLock) { inLock = c; water[c].after(bg); }
    }
    if (!tdone(bx, now) || !tdone(bz, now)) moving = true;
    return moving;
  });
  bag.add(B.unregister);

  /** The chamber whose resting water plane holds the pointer, nearest its middle; -1 outside. */
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < N; i++) {
      const [x, y] = unproj(C, sx, sy, F(i) + LO);
      if (x < x0(i) - 3 || x > x1(i) + 3 || y < -3 || y > CW + 3) continue;
      const d = Math.hypot((x - mid(i)) / CL, (y - CW / 2) / CW);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  let act = -1;
  /** Aims everything at lock a (-1 is rest): the gate first, then the boat sails in and the lock fills. */
  function aim(a) {
    const now = performance.now(), i = Math.max(0, a);
    lv.forEach((tw, c) => tset(tw, F(c) + (c === a ? HI : LO), now, 150));
    tset(bx, mid(i), now, 150); tset(bz, F(i) + (a < 0 ? LO : HI), now, 150);
    for (const gt of gates) { tset(gt.up, gt.j === a ? LIFT : 0, now, 0); gt.el.sil.classList.toggle("hi", gt.j === i); }
    B.wake();
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    aim(a);
    read.textContent = a < 0 ? "rest" : `lock ${a + 1}`;
  }
  aim(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { rise = v; dirty = true; for (const gt of gates) gt.drawn = NaN; aim(act); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "locks",
  means: "Three canal locks: the boat sails into the one under the pointer, its gate lifts and the chamber fills.",
  rules: [1, 6, 8, 9],
  range: [5, 8, 12],
  tour: [[260, 214], [140, 119], [200, 166], null],
  mount,
});
