import type { ComponentType } from "react";
import Strategy from "./Strategy";
import AppDev from "./AppDev";
import Models from "./Models";
import MLOps from "./MLOps";
import Enablement from "./Enablement";
import Backend from "./Backend";

/** Map `animation` key in content/services.ts → visual. All six ported from the "Codehive service
 *  animations" design canvas (site-v3/animations, one 640×600 artboard per service); each draws in a
 *  560×520 `.stg` that ServiceAnimation.tsx places inside the artboard's 40px padding and scales. */
export const visuals: Record<string, ComponentType> = {
  strategy: Strategy, applications: AppDev, models: Models, production: MLOps, enablement: Enablement, backend: Backend,
};
