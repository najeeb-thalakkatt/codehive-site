import type { ComponentType } from "react";
import Strategy from "./Strategy";
import AppDev from "./AppDev";
import Models from "./Models";
import MLOps from "./MLOps";
import Enablement from "./Enablement";
import Backend from "./Backend";

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

/** Map cell id → visual. All six ported from the "Codehive service animations" design canvas (one artboard per cell); the mobile crop is the stage plus a 16px margin on the side where content meets its edge. */
export const visuals: Record<string, CellVisual> = {
  "01": { Component: Strategy, mobile: { x: 680, y: 100, w: 480, h: 520 } },
  "02": { Component: AppDev, mobile: { x: 624, y: 100, w: 592, h: 520 } },
  "03": { Component: Models, mobile: { x: 624, y: 100, w: 592, h: 520 } },
  "04": { Component: MLOps, mobile: { x: 624, y: 100, w: 592, h: 520 } },
  "05": { Component: Enablement, mobile: { x: 680, y: 100, w: 480, h: 520 } },
  "06": { Component: Backend, mobile: { x: 624, y: 100, w: 560, h: 520 } },
};
