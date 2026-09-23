---
name: variants
description: Put several variants of a component (different css variables, copy or parameters) on one local page so the founder can compare them in the browser and pick by eye. Use when a visual choice is subjective (shade, shadow, spacing, colour tuning) or when asked to "show me variants locally".
---

# Local variants page

1. Make the knob a css custom property with the current value as the fallback, e.g.
   `rgba(11,13,16,var(--shade-0, .55))`, so variants need no component changes.
2. Create `app/variants/page.tsx` (never commit it) that stacks the component once per variant
   inside a wrapper `div` carrying the variables as inline style, with a labelled amber tag in the
   corner (`A · what it is`). Include the current value and a "none" variant as anchors.
3. `npm run dev` in the background and give the user http://localhost:3000/variants. Tell them to
   resize to phone width too.
4. When they pick a letter, set that value as the css fallback, delete `app/variants`, and ship
   with the `ship` skill. Keep the variables in place; the next comparison is then one page away.

The hero shade was chosen this way on 2026-09-23 (variant A, .55 core).
