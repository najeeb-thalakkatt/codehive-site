/**
 * Beam: a balance on a rounded plinth. A post, a beam across its top, two
 * pans hanging on strings from the beam's ends, and a rider weight sitting on
 * the beam. The pointer slides the rider along the beam on a spring, and the
 * beam tilts with the rider's offset from the post, clamped; the pans always
 * hang level. At rest the rider sits a third of the way to one side and the
 * pan that side, the lower one, is bright. The slider is the tilt at full
 * offset, in degrees.
 *
 * The pattern: one continuous number. A spring on the rider, a hit test on the
 * plane at the beam's resting height (which never tilts), and a rest that is
 * already a lean.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, rrect, run, seg, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 70, PY = 30, PB = 5;      // plinth half-extents and depth
const POST = 5, Z0 = 58;             // post half-width; the beam's underside at the pivot
const L = 62, BW = 3.5, BT = 4;      // beam half-length, half-width, thickness
const E = 56, HANG = 26, PR = 13;    // where the strings hook on, their length, the pan's radius
const RW = 4, RH = 6, RMAX = 48;     // rider half-size, height, travel
const REST_U = -20, DEAD = 4;        // the rider's rest seat; within DEAD of the post reads level

/** A pan's ring, centred on x = cx. */
const pan = (cx, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + cx }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value, over = false;
  const C = Cam(45, 0.5, 1.72);
  const zTop = Z0 + L * Math.sin(rad(20)) + BT + RH;
  fit(C, [[-PX, -PY, -PB], [PX, PY, -PB], [PX, -PY, -PB], [-PX, PY, -PB], [-L, 0, zTop], [L, 0, zTop]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // back to front: plinth, the far pan, the post, the beam, the rider, the near pan
  const [pr, pi] = rings(-PX, -PY, PX, PY, 9, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  const mkPan = () => { const grp = mk("g", {}, g); return { strings: mk("path", { class: "nf" }, grp), el: solid(grp) }; };
  const far = mkPan();
  const [qr, qi] = rings(-POST, -POST, POST, POST, 2, 0.8);
  put(solid(g), prism(P, front, qr, qi, 0, Z0));
  const beam = solid(g), rider = solid(g);
  const near = mkPan();

  // the beam's rings in its own plane, and the rider's: u along the beam, v across
  const bo = rrect(-L, -BW, L, BW, 2.5, 4), bi = rrect(-L + 1, -BW + 1, L - 1, BW - 1, 1.5, 4);
  const ro = rrect(-RW, -RW, RW, RW, 2.5, 4), ri = rrect(-RW + 1, -RW + 1, RW - 1, RW - 1, 1.5, 4);

  let drawn = NaN;
  function draw(u) {
    if (u === drawn) return;
    drawn = u;
    const th = rad(clamp(u / E, -1, 1) * tilt), s = Math.sin(th), c = Math.cos(th);
    // a point in the beam's frame (u along it, v across, w up from its underside) in the world, tilted about the pivot
    const T = (U, V, W) => [U * c + W * s, V, Z0 - U * s + W * c];
    const box = (el, outer, inner, du, w0, w1) => {
      const at = (ring, w) => ring.map((q) => P(...T(q.u + du, q.v, w)));
      put(el, { sil: poly(hull(at(outer, w0).concat(at(outer, w1)))), crease: open(at(run(inner, front), w1)) });
    };
    box(beam, bo, bi, 0, 0, BT);
    box(rider, ro, ri, u, BT, BT + RH);
    // each pan hangs level from its hook, so only its height follows the beam
    for (const [side, ue] of [[far, -E], [near, E]]) {
      const hook = T(ue, 0, 0), z = hook[2] - HANG, ring = pan(hook[0], PR), inner = pan(hook[0], PR - 1.4);
      put(side.el, prism(P, front, ring, inner, z, z + 2.5));
      const h = P(...hook);
      side.strings.setAttribute("d", seg(h, P(hook[0], -PR * 0.75, z + 2.5)) + seg(h, P(hook[0], PR * 0.75, z + 2.5)));
    }
  }

  const sp = spring(REST_U);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function light() {
    far.el.sil.classList.toggle("hi", !over);
    rider.sil.classList.toggle("hi", over);
    read.textContent = !over ? "rest" : sp.t < -DEAD ? "build" : sp.t > DEAD ? "buy" : "level";
    B.wake();
  }
  // the pointer lands on the plane at the beam's resting height, which never tilts; its x is the rider's seat
  bag.add(pointer(stage, {
    move: (p) => { over = true; sp.t = clamp(unproj(C, p[0], p[1], Z0)[0], -RMAX, RMAX); light(); },
    leave: () => { over = false; sp.t = REST_U; light(); },
  }));
  light();
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { tilt = v; drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "beam",
  means: "A balance: the pointer slides the rider along the beam, and the beam tilts to the side that carries it.",
  rules: [1, 3, 5, 8],
  range: [6, 12, 20],
  tour: [[142, 102], [200, 131], [258, 160], null],
  mount,
});
