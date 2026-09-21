import type { ComponentType } from "react";
import Strategy from "./Strategy";
import AppDev from "./AppDev";
import Models from "./Models";
import MLOps from "./MLOps";
import Enablement from "./Enablement";

/** Map cell id → visual component. Ported from prototype/index.html (keyframes s1..s5). */
export const visuals: Record<string, ComponentType> = {
  "01": Strategy,
  "02": AppDev,
  "03": Models,
  "04": MLOps,
  "05": Enablement,
};
