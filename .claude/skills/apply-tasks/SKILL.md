---
name: apply-tasks
description: Apply a pasted task list (CLAUDE_TASKS_*.md style, P0/P1/P2 with Accept lines and a Done-when block) to codehive-site - one commit per task, copy pasted byte-exact, every Accept line verified, deviations reported honestly. Use whenever the user pastes a numbered T1..Tn task list or a copy file and says "fix it", "apply", "do these".
---

# Apply a task list

The founder writes task files with a copy file as source of truth and per-task Accept lines. Work
them like this:

1. Read the whole list and any attached package first (unzip to the scratchpad, `find`, `cat` the
   references). Diff reference files against what is already in the repo before porting: the v3
   animation files turned out byte-identical to the canvas artboards already ported.
2. Do the content source first (`content/services.ts`), then the tasks in dependency order, not
   list order. One commit per task, subject `T<n> <what changed>`, body with the why and any
   deviation, plus the attribution trailers.
3. Copy: paste from the copy file exactly. Verify with a script that compares the strings
   (question, problem, answer, body, chips) rather than by eye. Never invent numbers or claims; the
   copy rules in `CLAUDE.md` apply to anything you write yourself.
4. Where a task conflicts with `CLAUDE.md` or an earlier decision, follow the newer instruction from
   the founder and correct `CLAUDE.md` in the same commit (example: "no pills" was wrong; pills are
   the button shape, hexagons are never rounded). Where two spec numbers conflict with each other
   (card padding vs "fits 720px"), keep the acceptance line and say which number you dropped.
5. Verify every Accept line with the `check` skill or a one-off Playwright script; measure, do not
   assert. Add durable checks to `checks/`.
6. Run the Done-when block literally (`grep -n "without you"`, hand-typed numbers, Lighthouse,
   reduced motion) and ship with the `ship` skill.

Report format the founder expects: "Met" list, "Deviations, each on purpose" numbered, "Not met or
only partly" with the measured numbers, then one next action. No padding. If a metric cannot be
met with the values the task fixes (the hero's 4.5:1 against the brightest pixel), say so with the
numbers and offer the local `variants` page so they decide by eye.
