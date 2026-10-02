#!/usr/bin/env python3
"""Port the hybrid service artboards (Claude Design canvas "Codehive service animations", files S0nA/S0nB and
their phone variants, saved under new-design/hybrid-src/) into components/new/hybrid/:
  cfgs.ts      the swarm configs (regions, moves, dynamic, light), desktop variants only: the phone figures are the
               same configs scaled, and the swarm scales and thins them itself
  overlays.tsx the overlay markup of every desktop and phone variant as JSX
  hybrid.css   their keyframes and class rules, prefixed per variant
The canvas has two options per service (A and B); PICK names the one the founder chose for each (2026-10-02), and
only those are ported. To try the other option of a service, change its letter here and run the script again.
Run it again whenever the canvas changes: python3 scripts/port-hybrid.py"""
import re, json, glob, os
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "new-design", "hybrid-src")
OUT = os.path.join(ROOT, "components", "new", "hybrid")
# Corrections to the saved artboards, applied to the overlay markup before it is ported (each must match once):
#  s01bp  the roadmap label sat on the three bars the swarm draws at 95 %; it goes above them
#  s03bp  "%%" typed twice in the source made the row of model names collapse onto one spot; the row also sat on the
#         clusters it names (the phone figure is the desktop one, scaled), so it goes under them, without tracking,
#         so three names fit side by side at 11 px
#  s06bp  the phone variant dropped "The brief" and "not needed", which left the brief line orphaned and the left
#         half of the held frame empty; both come back (the keyframes for them were already in the file), "not needed"
#         a row above the API line because the two do not fit side by side on a phone
MONO7 = "font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-size:13px;font-weight:500;letter-spacing:1px;text-transform:uppercase;line-height:1.4;"
PATCH = {
    "s01bp": [('class="ov rm" style="left: 50%; top: 90%;', 'class="ov rm" style="left: 50%; top: 84%;')],
    "s03bp": [('style="left:0;top:4%%;width:100%%;height:10px;"', 'style="left:0;top:20%;width:100%;height:10px;"'),
              ('font-size:7px;letter-spacing:.5px;color:var(--ink2);', 'font-size:7px;letter-spacing:0;white-space:nowrap;color:var(--ink2);', 3)],
    "s06bp": [
        ('<span class="typed bt">', f'<span style="{MONO7} display:block; color: var(--ink3); font-size:7px;letter-spacing:.5px;">The brief</span><span class="typed bt">'),
        ('<div class="ov api"', f'<div class="ov nn" style="left: 28.75%; top: 70%; width: 0; display: flex; justify-content: center;"><span style="{MONO7} white-space: nowrap; color: var(--alert); font-size:6px;letter-spacing:.3px;">not needed</span></div><div class="ov api"'),
    ],
}
PICK = {"01": "b", "02": "a", "03": "b", "04": "b", "05": "b", "06": "b"}
VOID = {"br", "line", "path", "circle", "rect", "polygon", "img"}
ATTR = {"class": "className", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-dasharray": "strokeDasharray", "viewbox": "viewBox", "preserveaspectratio": "preserveAspectRatio", "vector-effect": "vectorEffect"}

def camel(k): return re.sub(r"-(\w)", lambda m: m.group(1).upper(), k)

def keyframes(css):
    """yield (name, body) for every @keyframes block, and the css with them removed"""
    out, rest, i = [], "", 0
    while True:
        j = css.find("@keyframes", i)
        if j < 0: rest += css[i:]; break
        rest += css[i:j]
        k = css.index("{", j); name = css[j + 10:k].strip(); depth, e = 1, k + 1
        while depth: depth += {"{": 1, "}": -1}.get(css[e], 0); e += 1
        out.append((name, css[k + 1:e - 1])); i = e
    return out, rest

class Node:
    def __init__(s, tag, attrs): s.tag, s.attrs, s.kids = tag, attrs, []

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.root = Node("root", []); s.stack = [s.root]
    def handle_starttag(s, tag, attrs):
        n = Node(tag, attrs); s.stack[-1].kids.append(n)
        if tag not in VOID: s.stack.append(n)
    def handle_endtag(s, tag):
        if tag not in VOID and len(s.stack) > 1: s.stack.pop()
    def handle_data(s, d):
        if d.strip() or (d and not d.isspace()): s.stack[-1].kids.append(d)

def style_obj(css, W, H, phone, in_ov):
    d = {}
    for decl in css.split(";"):
        if ":" not in decl: continue
        k, v = decl.split(":", 1); k, v = k.strip(), v.strip()
        # absolute px positions inside an overlay element become % of the stage, so they follow the anchor's size
        if not in_ov and k in ("left", "right") and v.endswith("px"): v = f"{float(v[:-2]) / W * 100:.2f}%"
        if not in_ov and k in ("top", "bottom") and v.endswith("px"): v = f"{float(v[:-2]) / H * 100:.2f}%"
        # every other px length scales with the anchor (cqw of the stage width), so type and gaps keep the artboard's
        # proportions at any size; type never goes under 11 px (the phone artboards' 7 and 9 px are not readable)
        def scale(m):
            n = float(m.group(1))
            if n <= 1: return m.group(0)
            c = f"{n / W * 100:.4g}cqw"
            return f"max(11px, {c})" if k == "font-size" else c
        v = re.sub(r"(\d*\.?\d+)px", scale, v)
        d.pop(camel(k), None); d[camel(k)] = v
    return d

def jsx(n, cmap, W, H, phone, depth=0):
    if isinstance(n, str):
        t = re.sub(r"\s+", " ", n)
        return "{" + json.dumps(t, ensure_ascii=False) + "}"
    a = dict(n.attrs); props = []
    cls = (a.get("class") or "").split()
    is_ov = "ov" in cls and depth == 0
    if n.tag == "svg":
        # a leader-line layer: cover the stage in its own coordinates, strokes stay 1 px
        props = ['className="hy-svg"', f'viewBox="0 0 {W} {H}"', 'preserveAspectRatio="none"', 'aria-hidden="true"']
    else:
        if cls: props.append('className="' + " ".join(cmap(c) for c in cls) + '"')
        st = style_obj(a.get("style", ""), W, H, phone, is_ov)
        if is_ov and any(not isinstance(k, str) and k.tag == "svg" for k in n.kids): st.update({"left": "0", "top": "0", "width": "100%", "height": "100%"})
        if st: props.append("style={" + json.dumps(st, ensure_ascii=False) + "}")
        for k, v in n.attrs:
            if k in ("class", "style"): continue
            props.append(f'{ATTR.get(k, k)}="{v}"')
        if n.tag in ("line", "path"): props.append('vectorEffect="non-scaling-stroke"')
    open_ = "<" + n.tag + ("" if not props else " " + " ".join(props))
    if n.tag in VOID or not n.kids: return open_ + " />"
    return open_ + ">" + "".join(jsx(k, cmap, W, H, phone, depth + 1) for k in n.kids) + f"</{n.tag}>"

cfgs, overlays, css_out, names = [], [], [], {}
for f in sorted(glob.glob(os.path.join(SRC, "S0*.dc.html"))):
    base = os.path.basename(f)[:-8]            # S01A, S01Ap, S01spec
    s = open(f, encoding="utf-8").read()
    if base.endswith("spec"):
        t = re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S); t = re.sub(r"<[^>]+>", "\n", t)
        for m in re.finditer(r"^\s*([AB]) · (.+?)\s*$", t, flags=re.M): names.setdefault(base[:3].lower() + m.group(1).lower(), m.group(2).strip())
        continue
    vid = base.lower()                         # s01a, s01ap
    if PICK.get(vid[1:3]) != vid[3]: continue  # the option that was not chosen
    phone = vid.endswith("p")
    style = s[s.index("<style>") + 7:s.index("</style>")]
    ov = s[s.index("</canvas>") + 9:s.index("</x-dc>")].strip()
    ov = ov[:ov.rindex("</div>")]              # the stage's own closing tag
    for a, b_, *cnt in PATCH.get(vid, []):
        assert ov.count(a) == (cnt[0] if cnt else 1), (vid, a); ov = ov.replace(a, b_)
    cfg = s[s.index("var CFG = ({") + 11:s.index("\n});", s.index("var CFG = ({")) + 3]
    # two evolving arrays are captured by closures; give them their types (strict mode)
    cfg = cfg.replace("var m=[];", "var m: Mv[] = [];").replace("var pts=[];", "var pts: number[][] = [];")
    W, H, N, T = re.search(r"CFG\.W=(\d+); CFG\.H=(\d+); CFG\.N=(\d+); CFG\.T=([\d.]+);", s).groups()
    W, H = int(W), int(H)
    # --- css: keyframes and the per-variant class rules, prefixed
    kfs, rest = keyframes(style)
    rest = re.sub(r"@media[^{]*\{.*", "", rest, flags=re.S)
    rules = [(c, b) for c, b in re.findall(r"\.([\w-]+)\{([^{}]*)\}", rest) if c not in ("ov", "typed", "wander")]
    kname = {n: f"hy-{vid}-{n}" for n, _ in kfs if n != "wander"}
    shared = {"ov": "hy-ov", "typed": "hy-typed", "wander": "hy-wander", "gone": "hy-gone"}
    cmap = lambda c: shared.get(c, f"hy-{vid}-{c}")
    css_out.append(f"/* {vid}: {re.search('<title>(.*?)</title>', s).group(1)} */")
    css_out.append(f".hy-{vid} .hy-ov, .hy-{vid} .hy-typed {{ animation-duration: {T}s; }}")
    for n, body in kfs:
        if n == "wander": continue
        if "max-width" in body:                # typing: a clip instead of a width, so nothing reflows
            assert set(re.findall(r"max-width:([^;}]+)", body)) <= {"0", "100%"}, (vid, n)
            body = body.replace("max-width:0", "clip-path:inset(0 100% 0 0)").replace("max-width:100%", "clip-path:inset(0 0 0 0)")
        css_out.append(f"@keyframes {kname[n]}{{{body}}}")
    for c, body in rules:
        decls = []
        for d in body.split(";"):
            if ":" not in d: continue
            k, v = d.split(":", 1); k, v = k.strip(), v.strip()
            if k in ("animation-duration", "animation-iteration-count"): continue
            if k == "animation-name": v = ",".join(kname[x.strip()] for x in v.split(","))
            decls.append(f"{k}:{v}")
        css_out.append(f".hy-{vid}-{c}{{{';'.join(decls)}}}")
    # --- overlay
    p = P(); p.feed(ov)
    overlays.append(f'  {vid}: <>{"".join(jsx(k, cmap, W, H, phone) for k in p.root.kids if not isinstance(k, str))}</>,')
    # --- config (desktop only)
    if not phone:
        cfgs.append(f"export const {vid}: Cfg = {{ W: {W}, H: {H}, N: {N}, T: {T},\n{cfg[2:-3].strip()}\n}};\n")

head = "// Generated by scripts/port-hybrid.py from new-design/hybrid-src (the Claude Design canvas). Do not edit by hand.\n"
open(os.path.join(OUT, "cfgs.ts"), "w", encoding="utf-8").write(head + '/* eslint-disable */\nimport { ramp, type Cfg, type Mv } from "./engine";\n\n' + "\n".join(cfgs)
    + "\nexport const CFGS: Record<string, Cfg> = { " + ", ".join(re.search(r"export const (\w+)", c).group(1) for c in cfgs) + " };\n"
    + "/** the option chosen for each service (service id to scene key); set in scripts/port-hybrid.py */\nexport const PICK: Record<string, string> = " + json.dumps({k: f"s{k}{v}" for k, v in PICK.items()}) + ";\n")
open(os.path.join(OUT, "overlays.tsx"), "w", encoding="utf-8").write(head + '/* eslint-disable */\nimport type { ReactNode } from "react";\n\nexport const OVERLAYS: Record<string, ReactNode> = {\n' + "\n".join(overlays) + "\n};\n")
open(os.path.join(OUT, "generated.css"), "w", encoding="utf-8").write("/* " + head[3:].strip() + " */\n" + "\n".join(css_out) + "\n")
print(len(cfgs), "configs,", len(overlays), "overlays;", ", ".join(f"{k} {names.get(f's{k}{v}', v)}" for k, v in PICK.items()))
