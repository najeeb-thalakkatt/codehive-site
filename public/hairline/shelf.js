/**
 * Shelf: a rounded shelf with a low back wall and an end stop, holding nine
 * documents of different heights and thicknesses, leaning together on the end
 * stop. The document under the pointer slides forward out of the row and stands
 * upright; its neighbours straighten a little, staggered outwards from it. A
 * column of dots on each spine (its number, in four slots) is the citation mark:
 * lit on the document pulled. At rest one document sits a little forward and
 * bright. The slider is how far a document is pulled, in world units.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, identity carried
 * by geometry, and a hit test on the resting row, so a document sliding out
 * from under the pointer cannot flip the choice.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, run,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, reflect, register, solid,
} = HL;

const N = 9, D = 30, GAP = 0.7, PT = 3, BH = 9, ES = 2.6, HOME = 6, HOMEPULL = 3, STAG = 45;
// each document: its thickness, height and resting lean, in degrees toward the stop (rule 05: not uniform)
const TH = [4.6, 3.4, 6.2, 4.0, 5.2, 3.6, 4.8, 6.0, 4.2];
const HT = [30, 24, 36, 27, 40, 26, 33, 38, 29];
const LEAN = [10, 13, 9, 12, 11, 13, 10, 9, 12];
const X0 = [];
let xx = 0;
for (let i = 0; i < N; i++) { X0.push(xx); xx += TH[i] + GAP; }
const SW = xx - GAP, HMAX = Math.max(...HT);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;

  // The camera is fitted with the tallest document upright and fully pulled, so nothing leaves the frame in any pose.
  const C = Cam(45, 0.5, 3);
  fit(C, [[-2.5, -2.6, -PT], [SW + ES + 2.5, D + 2, -PT], [SW + ES + 2.5, -2.6, 0], [-2.5, D + 22, 0], [X0[4], D + 20, HMAX], [X0[4] + 9, 0, HMAX]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the shelf, back to front: the plate, the back wall, the end stop
  const [plate, plateIn] = rings(-2.5, -2.6, SW + ES + 2.5, D + 2, 2.5, 1);
  reflect(svg, g, P, front, plate, -PT, 12);
  put(solid(g), prism(P, front, plate, plateIn, -PT, 0));
  const [wall, wallIn] = rings(-2.5, -2.4, SW + ES + 2.5, -0.4, 0.8, 0.5);
  put(solid(g), prism(P, front, wall, wallIn, 0, BH));

  /** Document i leaning th degrees toward the stop and pulled p toward the viewer: its paths and where its four slots sit on the spine. */
  function pose(i, th, p) {
    const s = Math.sin(rad(th)), c = Math.cos(rad(th)), x0 = X0[i], h = HT[i];
    const W = (u, v, w) => P(x0 + TH[i] + (u - TH[i]) * c + w * s, v + p, (TH[i] - u) * s + w * c);
    const b = books[i], foot = b.ring.map((q) => W(q.u, q.v, 0)), top = b.ring.map((q) => W(q.u, q.v, h));
    const slots = [];
    for (let k = 0; k < 4; k++) slots.push(W(TH[i] / 2, D + 0.05, h - 5 - k * 3.2));
    return { sil: poly(hull(foot.concat(top))), crease: open(run(b.inner, front).map((q) => W(q.u, q.v, h))), slots };
  }

  // the documents, in order of x: each a thin solid and the four slots of its number
  const books = [];
  for (let i = 0; i < N; i++) {
    const [ring, inner] = rings(0, 0, TH[i], D, 1.1, 0.6);
    const el = solid(g), code = [], slots = [];
    for (let k = 0; k < 4; k++) {
      const on = (i + 1) >> (3 - k) & 1;
      const dot = mk("circle", { r: 0.9, class: on ? "dot m" : "dot off" }, el.g);
      slots.push(dot);
      if (on) code.push(dot);
    }
    books.push({ ring, inner, el, slots, code, a: tween(LEAN[i]), p: tween(i === HOME ? HOMEPULL : 0), da: NaN, dp: NaN });
  }

  const [stop, stopIn] = rings(SW + 0.5, -0.4, SW + ES + 0.5, D, 0.9, 0.5);
  put(solid(g), prism(P, front, stop, stopIn, 0, 18));

  // hit boxes: each document's RESTING outline on screen, in the row (rule 01). They never move, and nothing draws them.
  const boxes = books.map((b, i) => {
    const xs = [], ys = [];
    const s = Math.sin(rad(LEAN[i])), c = Math.cos(rad(LEAN[i]));
    for (const r of b.ring) for (const w of [0, HT[i]]) { const [x, y] = P(X0[i] + TH[i] + (r.u - TH[i]) * c + w * s, r.v, (TH[i] - r.u) * s + w * c); xs.push(x); ys.push(y); }
    return { x0: Math.min(...xs) - 2, x1: Math.max(...xs) + 2, y0: Math.min(...ys) - 2, y1: Math.max(...ys) + 2, cx: (Math.min(...xs) + Math.max(...xs)) / 2 };
  });
  /** The document whose resting box holds the point, the nearest by centre when they overlap; -1 outside. */
  function hit([x, y]) {
    let best = -1, bd = Infinity;
    boxes.forEach((b, i) => {
      if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return;
      const d = Math.abs(x - b.cx);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  function draw(i, th, p) {
    const b = books[i];
    if (th === b.da && p === b.dp) return;
    b.da = th; b.dp = p;
    const q = pose(i, th, p);
    put(b.el, q);
    b.slots.forEach((el, k) => place(el, q.slots[k]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    books.forEach((b, i) => { draw(i, tval(b.a, now), tval(b.p, now)); if (!tdone(b.a, now) || !tdone(b.p, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  /** Pulls document a (-1 puts the row back). The stagger spreads out from the document pulled, or the one let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    books.forEach((b, i) => {
      const d = Math.abs(i - from), delay = d * STAG;
      let th = LEAN[i], p = 0;
      if (a < 0) p = i === HOME ? HOMEPULL : 0;
      else if (i === a) { th = 0; p = pull; }
      else th = LEAN[i] * clamp(0.45 + 0.18 * d, 0, 1);
      tset(b.a, th, now, delay); tset(b.p, p, now, delay);
      const lit = a < 0 ? i === HOME : i === a;
      b.el.sil.classList.toggle("hi", lit);
      b.code.forEach((el) => el.classList.toggle("m", !lit));
    });
    read.textContent = a < 0 ? "rest" : "doc " + String(a + 1).padStart(2, "0");
    B.wake();
  }
  books[HOME].el.sil.classList.add("hi");
  books[HOME].code.forEach((el) => el.classList.remove("m"));

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { pull = v; if (act >= 0) { tset(books[act].p, pull, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "shelf",
  means: "Nine documents on a shelf: the one under the pointer slides out and stands up, its neighbours straighten in turn.",
  rules: [1, 2, 5, 10],
  range: [6, 12, 20],
  tour: [[155, 164], [227, 182], [194, 162], null],
  mount,
});
