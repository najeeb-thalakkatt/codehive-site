# Prompt for Claude Design: hybrid service animations for codehives.se

Paste everything below the line into Claude Design. Attach the images listed under "What I am attaching".

---

Design six animated service illustrations for the Codehive website, as six artboards on one canvas. Codehive AB is an AI engineering consultancy in Stockholm. The page is dark, typographic and built around one idea: a swarm of tiny outlined hexagons that forms a different figure for each section as the reader scrolls.

I need a **hybrid** of two things we already have. Neither works alone.

1. **The swarm version (current).** Each service is a formation of about 2,400 particles: clusters, bars, a pipeline, a honeycomb. It fits the page and it moves well, but it is abstract. A reader cannot tell what the bars or the cells stand for.
2. **The explicit version (previous).** Each service was a small diagram with real labels, a typed question, a cited answer, file names, a pipeline with stage names. It explained the service, but it sat in a box and looked like a different website.

The hybrid: **the swarm draws the structure, a thin layer of crisp labels and one or two real interface fragments says what it means.** The particles stay the material. The overlay is annotation on top of them, never a card around them.

## Where each illustration lives

- One illustration per service, beside that service's copy. No frame, no card, no border, no background. It floats on the page ground.
- Stage for five of them: a square, **800 × 800**. On phones the same illustration runs at about 250 × 250, so everything must survive that reduction (see "Phone variant").
- Stage for 04 Production: a wide band, **1600 × 400**, with the copy centred beneath it. On phones it runs at about 350 × 220.
- The figure may reach the edges of the stage. Nothing clips.
- A sparse field of the same particles drifts behind the whole page at all times. Do not draw it; assume it is there.

## The swarm layer (fixed, do not redesign)

- A particle is a **tiny outlined hexagon**, pointy-top, 1 px stroke, no fill, radius 2, 3 or 4 px.
- Particle colours: amber, deep amber, off-white, warm grey, dim grey, and green only for a solved state. Nothing else.
- Particles never stand still. Each one buzzes around its place quickly and by a few pixels. About one in sixteen ranges further. A wave of agitation crosses the figure every few seconds.
- A figure is made by **where particles sit** (outlines, filled regions, lines, clusters) and **how they are lit** (amber for the thing that matters, grey for the rest, dimmed for what has not happened yet).
- Changes of light cross-fade in about 180 ms. Changes of shape are a flight: particles leave one place and arrive at another over about a second, with some turbulence on the way.
- Shapes the swarm draws well: hexagon outlines, straight lines, filled rectangles, loose clusters, rings, a lattice. It cannot draw text, icons or curves with fine detail. Those belong to the overlay.

## The overlay layer (this is what I need designed)

A small number of crisp elements placed on or beside the swarm figure:

- **Labels:** IBM Plex Mono, 12 to 13 px, uppercase, 1 px letter spacing. Off-white or warm grey; amber only for the one thing that matters.
- **A line of real content** where it carries the story: a typed question, a cited answer, a file name, a verdict. Schibsted Grotesk 15 to 16 px, or IBM Plex Mono 13 px for code and file names.
- **At most one interface fragment per illustration** (a speech line, a stage tag, a small result line). No boxes with fills. If a fragment needs an edge, it gets a 1 px line in the line colour, or better, the swarm draws its edge.
- **Leader lines** from a label to the part of the figure it names: 1 px, straight, in the line colour, ending in a small hexagon marker.
- Overlay elements may wander a few pixels, slowly, like a bee near the hive. They must stay readable.
- Budget: **at most five overlay elements visible at once** on desktop, at most two on a phone.

The test for every overlay element: remove it, and the reader understands less. If the reader understands the same, it does not belong.

## Brand rules (not negotiable)

| Token | Value | Use |
|---|---|---|
| Ground | `#0b0d10` | The page. Never a panel colour. |
| Ink 1 | `#f4f1ea` | Primary text and labels |
| Ink 2 | `#b8b3a8` | Secondary text |
| Ink 3 | `#8a867e` | Dim labels, unlit particles |
| Line | `#2a2d33` / `#3a3d44` | Leader lines, 1 px edges |
| Amber | `#f2b84b` | The one accent. A fill with dark text on it, or amber text on dark. |
| Deep amber | `#e0a030` | Second tone of the same accent, particles only |
| OK | `#6fcf97` | A solved state inside an animation, nothing else |
| Alert | `#f26d5b` | A broken state inside an animation, nothing else |

- Fonts: **Familjen Grotesk** (display, weight 400 at large sizes), **Schibsted Grotesk** (body), **IBM Plex Mono** (labels, code). No other fonts.
- No gradients. No glows, no blurred shadows, no glass. No new colours. No pulsing dots.
- Hexagons are never rounded. Buttons are pills, but there are no buttons in these illustrations.
- Copy rules: short sentences, concrete nouns, no exclamation marks, no em dashes, no arrows in text. Use only the strings I give below. Do not invent numbers, clients, model names or claims. If something is missing, write `[PLACEHOLDER]`.

## Motion rules

- Each illustration is a loop of **9 to 12 seconds** that tells one small story in three or four beats, holds the final state for at least 2.5 seconds, then resets quietly.
- The last beat is the message. If the reader sees only the held final frame, they should still get it. That frame is also what a reader with reduced motion sees, as a still.
- One thing happens at a time. No beat shorter than 600 ms.
- Overlay text appears by fading up 4 px, or by being typed, never by sliding in from off stage.
- No bounce, no elastic easing, no scale-from-zero.

## The six services

For each: the copy that sits beside it (context, do not redraw it), what the swarm does now, what the old explicit version showed, and the strings you may use in the overlay.

### 01 Strategy and advisory
- Beside it: "Which of your AI pilots deserves a budget?" answered by "A plan the board can fund."
- Swarm now: six loose clusters in a ring (the pilots). They light one at a time, then one stays amber and the rest dim.
- Old version: three scattered pilots collapse into one amber core, strategy cells assemble around it, roadmap steps tick in below.
- Strings: `THREE PILOTS, ONE BUDGET LINE` · `BUILD VS BUY` · `RISK` · `VENDOR` · `Roadmap · in the order it has to happen` · `Data` · `People` · `Change`
- The message: many pilots, one decision, then an order of work.

### 02 Application development
- Beside it: "How many tabs does support open per ticket?" answered by "Assistants that answer from your own documents."
- Swarm now: three document stacks on the left, one hexagon in the middle (the assistant), three answer lines on the right, a pulse travelling left to right.
- Old version: a customer question is typed, the assistant searches two sources and misses a third, passages fly in, an answer streams out with its source.
- Strings: `Customer` · `Where is the refund policy for EU orders?` · `policy.pdf · §4.2` · `confluence · eu-returns` · `Tickets` · `ASSISTANT` · `EU orders can be returned within 14 days.` · `cites policy.pdf §4.2 instead of guessing` · `eval`
- The message: the answer comes from your documents, and it says which one.

### 03 Model work
- Beside it: "Which model, and on whose servers?" answered by "The right model, measured on your data, run where your data may go."
- Swarm now: four bars fill from the bottom on a baseline, the best one turns amber.
- Old version: your eval set feeds three candidates, bars fill on the same cases, the open model moves inside a boundary marked EU, is deployed, then fine-tuned.
- Strings: `Your eval set` · `the same cases for every model` · `benchmark` · `open weights · private inference` · `Your infrastructure · EU` · `must not leave the EU` · `deployed` · `fine-tuned` · `QLoRA · your curated dataset`
- Model names stay generic: `Frontier A`, `Frontier B`, `Open model`.
- The message: measured on your cases, then run inside your boundary.

### 04 Production and MLOps (the wide band, 1600 × 400)
- Beside it: "It works on the laptop. Then what?" answered by "A system your team can run without us."
- Swarm now: four hexagon cells in a row joined by lines. They light in turn, then all hold green.
- Old version: a notebook with no tracing, no cost cap and no login folds into a dev, test, prod pipeline; a front door, a cost ceiling and tracing appear; a request passes through.
- Strings: `prototype.ipynb` · `demo page · localhost` · `no tracing` · `no cost cap` · `no login` · `dev` · `test` · `prod` · `monitor` · `terraform` · `JWT` · `cost ceiling` · `trace · langfuse` · `request` · `handover`
- The message: the laptop demo becomes a pipeline with a door, a ceiling and a trace, and it runs on its own.

### 05 Enablement
- Beside it: "What happens when the one person who knows leaves?" answered by "A team that owns it."
- Swarm now: a honeycomb of nineteen cells. The centre lights, then the light spreads ring by ring until all hold it.
- Old version: the one who knows leaves and the knowledge with them; Codehive lands in the middle of the team and pairs with each role until every cell is lit, then steps away and the team stays lit.
- Strings: `THE ONE WHO KNOWS` · `KNOWLEDGE LEAVES TOO` · `CODEHIVE` · `PAIRING · TRAINING · RUNBOOKS` · `handover` · `the knowledge stays when we leave`
- The message: we arrive, the knowledge spreads, we leave, it stays.

### 06 Plain backend
- Beside it: "Do you need AI for this at all?" answered by "Sometimes a good API is the whole answer."
- Swarm now: a regular lattice of small cells with one sweep passing through.
- Old version: the brief says add AI; the actual problems list themselves; the model cell is marked not needed and an amber API cell takes its place.
- Strings: `The brief` · `add AI to the reports` · `The actual problem` · `a report that takes a week` · `a sync job that fails every Sunday` · `two systems that do not talk` · `verdict` · `not needed` · `one API · one job · zero tokens` · `we say so before you pay for a model you do not need`
- The message: the plain, ordered thing was the answer.

## What I want back

1. **One canvas, six artboards** at the stage sizes above, each playing its loop, on the page ground.
2. For each artboard, a short **spec block** beside it:
   - the beats as a table: time range, what the swarm does, what the overlay does;
   - each overlay element with its position as a percentage of the stage, its text, its font and its colour token;
   - the held final frame described in one sentence.
3. A **phone variant** of each: the same swarm figure with at most two overlay elements, legible at 250 × 250 (350 × 220 for the band). Say which elements are dropped.
4. Build it so it can be ported without redrawing:
   - the swarm layer on a `<canvas>`, with each figure defined as a function that returns particle home points in a unit square (−1 to 1) and a function that returns each particle's colour and brightness at time `t`;
   - the overlay as plain HTML positioned in percentages over the canvas, animated with CSS keyframes written on a 0 to 100 % timeline of the loop;
   - colours as CSS variables named `--bg0`, `--ink1`, `--ink2`, `--ink3`, `--line1`, `--line2`, `--amber`, `--amber2`, `--ok`, `--alert`;
   - no animation libraries, no images, no icon fonts.
5. One paragraph at the top of the canvas: the rule you used to decide what the swarm draws and what the overlay says, so a seventh service could be designed the same way.

## What I am attaching

- `new-00-hero.png`, `new-00-services-index.png`: the page's language. The logo cell formed by the swarm, and the services index where each service is a small hive with a label.
- `new-01` to `new-06-swarm-only.png`: the current swarm formations, in place beside their copy. This is the structure layer to keep.
- `old-01` to `old-06-artboard.png`: the previous explicit diagrams. This is the meaning to bring back, as annotation, not as boxes.

Start with 02 Application development and 04 Production and show me those two before doing the rest. They are the hardest: 02 has the most text, 04 has the widest stage.
