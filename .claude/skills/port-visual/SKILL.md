---
name: port-visual
description: Port a service animation from a design canvas artboard or a site-v3 animations/*.html file into a codehive-site cell component (components/cells) that loops inside ServiceAnimation. Use when a new or changed artboard, animation html or "animations" package arrives.
---

# Port an artboard into a cell visual

Sources: the "Codehive service animations" canvas (Artifact `read` with `paths` gives the
`project/<Name>.dc.html` files) or `site-v3/animations/0N-*.html`. Both are 640x600 pages: a
`<style>` with keyframes on a 13 s loop and a 560x520 `.stage` inside 40px padding.

Recipe (see `components/cells/Strategy.tsx` as the model):
1. Component `components/cells/<Name>.tsx` + `<name>.css`, registered by the `animation` key of
   `SERVICES` in `components/cells/index.ts`. Draw everything inside `<div className="stg">`
   (560x520; `ServiceAnimation` places it at 40,40 in the 640x600 frame and scales the frame).
2. Coordinates carry over unchanged. Keyframe percentages carry over unchanged. Drop the artboard's
   loop-only `stagefade` (the frame adds it) and any infinite `crawl` animation.
3. Every hex becomes a token: `#0b0d10` bg0, `#14171c` bg1, `#1c2026` bg2, `#2a2d33` line1,
   `#3a3d44` line2, `#f4f1ea` ink1, `#b8b3a8` ink2, `#8a867e` ink3, `#f2b84b` amber, `#e0a030`
   amber2, `#6fcf97` ok, `#f26d5b` alert. Easings: `var(--eo)`/`var(--ei)` are defined on `.stg`.
4. Keyframes go in the plain css file (CSS modules hash keyframe names, inline `animationName`
   needs the real name) and are prefixed `s<cell>` because the css is global. An element that
   stacks two artboard classes (`card1 dim`, `bar3 ft ftbar`) gets one merged keyframe.
5. Each animated element: `className="anim"` plus inline `animationName`; typed lines add
   `animationTimingFunction: "steps(n)"` inline. Shared pieces: `parts.tsx` (`HEX58`, `HEX48`,
   `Tick`, `Badge`, `Lines`) and `viz.css` (`.el .lbl .note .tag .typed .bub .ans .box .bar`).
6. Hex clusters snap to the site grid: pointy-top, 6px gap, neighbours at sqrt(3)*r+6 (106 for
   r=58, 89.1 for r=48). Text that would clip at the stage edge wraps or the box widens; never
   change the words (change the reference first if a word must go).
7. Build, then `check` skill; read `checks/shots/v3-card0N-*.png` and a phone shot. Under reduced
   motion the frame parks every animation at 12.35 s; make sure that frame is the finished scene.
