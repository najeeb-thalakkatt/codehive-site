/**
 * Lanterns: seven lanterns on a rounded plinth, in a loose row. The one under
 * the pointer lights: its stroke goes bright, its flame comes up and its lid
 * lifts, and the light spreads to its neighbours in turn, fading with
 * distance. At rest the lantern at the near end is lit alone. The slider is
 * the reach, in lanterns.
 *
 * The pattern: discrete items. Tweens for the lids, a stagger by distance, a
 * falloff with a far end, and a hit test on the resting base centres, which
 * never move.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, run,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 7, GAP = 26, PB = 5, HB = 7, CAP = 4, KNOB = 2.5, LIFT = 5, STEP = 40;
const YS = [0, 7, -3, 9, 2, -6, 5], HG = [15, 17, 13, 18, 14, 16, 15];
const X0 = -14, X1 = (N - 1) * GAP + 14, Y0 = -16, Y1 = 20;

/** Share of the light at d lanterns from the lit one, with a reach of R: 1 at the lantern, 0 past the reach. */
const falloff = (d, R) => clamp(1 - d / (R + 1), 0, 1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;

  const C = Cam(45, 0.5, 1.85);
  const TOP = HB + Math.max(...HG) + LIFT + CAP + KNOB;
  fit(C, [[X0, Y0, -PB], [X1, Y1, -PB], [X1, Y0, -PB], [X0, Y1, -PB], [X0, Y0, TOP], [X1, Y1, TOP]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(X0, Y0, X1, Y1, 8, 2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // one lantern after another along +x: appending in that order is painting back to front
  const lamps = [];
  for (let i = 0; i < N; i++) {
    const cx = i * GAP, cy = YS[i], T = HB + HG[i];
    const grp = mk("g", {}, g);
    const [br, bi] = rings(cx - 7, cy - 7, cx + 7, cy + 7, 2.5, 1);
    const [gr, gi] = rings(cx - 4.5, cy - 4.5, cx + 4.5, cy + 4.5, 1.8, 0.8);
    // the cap tapers: a wide foot ring, a narrow top ring and its crease; the knob sits on the top
    const foot = rrect(cx - 7.5, cy - 7.5, cx + 7.5, cy + 7.5, 2.8, 4), top = rrect(cx - 4, cy - 4, cx + 4, cy + 4, 1.6, 4), inner = rrect(cx - 3.2, cy - 3.2, cx + 3.2, cy + 3.2, 1, 4);
    const [kr, ki] = rings(cx - 1.6, cy - 1.6, cx + 1.6, cy + 1.6, 0.8, 0.5);
    const base = solid(grp), band = solid(grp);
    put(base, prism(P, front, br, bi, 0, HB));
    put(band, prism(P, front, gr, gi, HB, T));
    // the flame, on the glass band's near face at its middle height
    const flame = mk("circle", { r: 1.2, class: "dot off" }, grp);
    place(flame, P(cx, cy, HB + HG[i] / 2));
    const lid = solid(grp), knob = solid(grp);
    lamps.push({ cx, cy, T, foot, top, inner, kr, ki, base, band, flame, lid, knob, z: tween(0), drawn: NaN });
  }

  /** A lid whose tween has not moved keeps its paths. */
  function drawLid(L, z) {
    if (z === L.drawn) return;
    L.drawn = z;
    const z0 = L.T + z, z1 = z0 + CAP;
    put(L.lid, { sil: poly(hull(ringAt(P, L.foot, z0).concat(ringAt(P, L.top, z1)))), crease: open(ringAt(P, run(L.inner, front), z1)) });
    put(L.knob, prism(P, front, L.kr, L.ki, z1, z1 + KNOB));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const L of lamps) { drawLid(L, tval(L.z, now)); if (!tdone(L.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit test: the lantern whose RESTING base centre is nearest the pointer's screen x, inside the row's band
  const cen = lamps.map((L) => P(L.cx, L.cy, 0));
  const yTop = Math.min(...lamps.map((L) => P(L.cx, L.cy, L.T + LIFT + 6)[1])), yBot = Math.max(...cen.map((c) => c[1])) + 6;
  const half = (cen[1][0] - cen[0][0]) / 2 + 2;
  function hit([x, y]) {
    if (y < yTop || y > yBot) return -1;
    let best = -1, bd = half;
    cen.forEach((c, i) => { const d = Math.abs(c[0] - x); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  let act = -2;
  /** Lights lantern a (-1 is rest: the near-end lantern alone). The spread goes out from the lantern chosen, or the one let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : N - 1, reach = a >= 0 ? R : 0, lit = a >= 0 ? a : N - 1;
    act = a;
    lamps.forEach((L, i) => {
      const d = Math.abs(i - lit), f = falloff(d, reach);
      tset(L.z, LIFT * f, now, Math.abs(i - from) * STEP);
      for (const s of [L.base, L.band, L.lid]) s.sil.classList.toggle("hi", d === 0);
      L.flame.setAttribute("class", d === 0 ? "dot" : f > 0 ? "dot m" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : `lamp ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; if (act >= 0) { const a = act; act = -2; setActive(a); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "lanterns",
  means: "Seven lanterns on a plinth: the one under the pointer lights, and its light spreads to its neighbours in turn.",
  rules: [2, 3, 4, 5],
  range: [1, 2, 4],
  tour: [[134, 131], [191, 173], [265, 205], null],
  mount,
});
