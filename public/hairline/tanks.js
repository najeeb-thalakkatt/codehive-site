/**
 * Tanks: two open round tanks on a plinth, joined by a pipe with a valve in
 * the middle. The pointer's x opens the valve: the wheel turns and the right
 * tank fills as the left one drains. At rest the valve is a third open, the
 * left tank fuller, the wheel bright. The slider is the flow: how far the
 * levels move at full opening.
 *
 * The pattern: a continuous input. One spring on the opening, a hit test on
 * the ground plane (which never moves), and a rest that is a composition.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, unproj,
  spring, stepS, flatDot, mk, place, pointer, put, register, disposer, solid,
} = HL;

const R = 22, WALL = 1.8, TH = 26, PB = 5;
const A = [20, 0], B = [100, 0], VX = 60;            // tank centres and the valve's x
const REST_O = 0.33, LA = TH - 2, LB = 2, SWING = TH - 4;    // rest opening, the levels with the valve shut, how far they move at full flow
const at = (ring, c) => ring.map((q) => ({ ...q, u: q.u + c[0], v: q.v + c[1] }));
/** Points ordered left to right on screen. */
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/** An open tank at c: the far half (painted before its level plate) and the near half (after), as [d, class] lists. */
function tank(P, front, c) {
  const outer = at(circ(R, 48), c), inner = at(circ(R - WALL, 48), c);
  const far = [
    [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, TH)))), "sil"],
    [poly(ringAt(P, inner, TH)), "nf"],
  ];
  const iF = LR(ringAt(P, run(inner, front), TH)), oT = LR(ringAt(P, run(outer, front), TH)), oB = LR(ringAt(P, run(outer, front), 0));
  const near = [
    [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), "fo"],
    [open(oT), "nf lo"],
    [open(iF), "nf"],
    [open([oT[0], ...oB, oT[oT.length - 1]]), "nf sil"],
  ];
  return { far, near, inner };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let flow = value, over = false;

  const C = Cam(45, 0.5, 1.95);
  fit(C, [[A[0] - R - 14, -26, -PB], [B[0] + R + 14, 26, -PB], [B[0] + R + 14, -26, -PB], [A[0] - R - 14, 26, -PB], [A[0], 0, TH], [B[0], 0, TH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // plinth
  const [pr, pi] = rings(A[0] - R - 14, -26, B[0] + R + 14, 26, 9, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // the left tank, its level, then its near wall
  const tA = tank(P, front, A);
  for (const [d, cls] of tA.far) mk("path", { d, class: cls }, g);
  const lvA = mk("path", {}, g);
  for (const [d, cls] of tA.near) mk("path", { d, class: cls }, g);

  // the pipe between them, the valve stem on it, the wheel on the stem
  const [pp, ppi] = rings(A[0] + R - 2, -3, B[0] - R + 2, 3, 3, 0.8);
  put(solid(g), prism(P, front, pp, ppi, 3, 9));
  const [sr, si] = rings(VX - 3, -3, VX + 3, 3, 2, 0.8);
  put(solid(g), prism(P, front, sr, si, 9, 19));
  const wheel = solid(g);
  put(wheel, prism(P, front, at(circ(10, 48), [VX, 0]), at(circ(8.2, 48), [VX, 0]), 19, 21));
  const hub = flatDot(g, C, 0.9, "dot m"), spoke = flatDot(g, C, 0.9, "dot");
  place(hub, P(VX, 0, 21));

  // the right tank, its level, then its near wall
  const tB = tank(P, front, B);
  for (const [d, cls] of tB.far) mk("path", { d, class: cls }, g);
  const lvB = mk("path", {}, g);
  for (const [d, cls] of tB.near) mk("path", { d, class: cls }, g);

  const sp = spring(REST_O, { eps: 0.002 });
  let drawn = NaN;
  function draw(o) {
    if (o === drawn) return;
    drawn = o;
    const d = o * flow * SWING;
    lvA.setAttribute("d", poly(ringAt(P, tA.inner, LA - d)));
    lvB.setAttribute("d", poly(ringAt(P, tB.inner, LB + d)));
    const a = o * Math.PI * 2;
    place(spoke, P(VX + 8.2 * Math.cos(a), 8.2 * Math.sin(a), 21));
  }
  const B_ = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B_.unregister);

  /** The bright goes to the level that is filling; at rest the wheel keeps it. */
  function mark() {
    const o = sp.t, up = over && o > REST_O, down = over && o < REST_O;
    wheel.sil.classList.toggle("hi", !over);
    lvB.classList.toggle("hi", up);
    lvA.classList.toggle("hi", down);
    read.textContent = over ? `valve ${Math.round(o * 100)}` : "rest";
    B_.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const w = unproj(C, p[0], p[1], 0); over = true; sp.t = clamp((w[0] - A[0]) / (B[0] - A[0]), 0, 1); mark(); },
    leave: () => { over = false; sp.t = REST_O; mark(); },
  }));
  draw(REST_O); mark();
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { flow = v; drawn = NaN; B_.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "tanks",
  means: "Two tanks and a valve: the pointer opens it, and the right tank fills as the left one drains.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.6, 1],
  tour: [[110, 150], [300, 190], [200, 170], null],
  mount,
});
