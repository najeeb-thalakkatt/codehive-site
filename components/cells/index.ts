import type { ComponentType } from "react";
import Strategy from "./Strategy";

/** Map cell id → visual component. Add the other four here as you port them from prototype/index.html:
 *  02 tickets stack into a thread, 03 models settle into a benchmark, 04 pipeline draws itself, 05 knowledge ripples. */
export const visuals: Record<string, ComponentType> = {
  "01": Strategy,
};
