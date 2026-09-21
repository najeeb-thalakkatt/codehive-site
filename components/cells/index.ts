import type { ComponentType } from "react";
import Strategy from "./Strategy";
import AppDev from "./AppDev";
import Models from "./Models";
import MLOps from "./MLOps";
import Enablement from "./Enablement";

/** Region of the 1280×800 canvas that Cell.tsx shows, scaled to the column width. */
export type Crop = { x: number; y: number; w: number; h: number };

/** Desktop: the same 720×520 window for every cell, matching the design mockups. */
export const desktopCrop: Crop = { x: 560, y: 100, w: 720, h: 520 };

export type CellVisual = {
  Component: ComponentType;
  /** Narrow viewports (≤820px): a tighter window around the finished state so labels stay legible
   *  on a 390px column. Elements that fly in from outside the window are cut at its edge on purpose. */
  mobile: Crop;
};

/** Map cell id → visual. All five ported from prototype/index.html (keyframes s1..s5). */
export const visuals: Record<string, CellVisual> = {
  "01": { Component: Strategy, mobile: { x: 660, y: 150, w: 400, h: 400 } },
  "02": { Component: AppDev, mobile: { x: 740, y: 180, w: 440, h: 450 } },
  "03": { Component: Models, mobile: { x: 720, y: 216, w: 520, h: 400 } },
  "04": { Component: MLOps, mobile: { x: 660, y: 280, w: 510, h: 300 } },
  "05": { Component: Enablement, mobile: { x: 640, y: 130, w: 480, h: 460 } },
};
