import type { ComponentType } from "react";
import Strategy from "./Strategy";
import AppDev from "./AppDev";

/** Map cell id → visual component. Ported from prototype/index.html (keyframes s1..s5).
 *  Still to port: 03 models settle into a benchmark, 04 pipeline draws itself, 05 knowledge ripples. */
export const visuals: Record<string, ComponentType> = {
  "01": Strategy,
  "02": AppDev,
};
