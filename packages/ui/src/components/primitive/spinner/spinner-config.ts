import type { Color } from "../../../shared/variant";

export type SpinnerSizeKey = "sm" | "md" | "lg";

export interface SpinnerSizeScale {
  default: SpinnerSizeKey;
  values: Record<SpinnerSizeKey, string>; // raw CSS dimension, e.g. "1rem"
}

export interface SpinnerConfig {
  size?: SpinnerSizeScale;
  color?: Color; // undefined = inherit currentColor from context
  speed?: string; // animation-duration, e.g. "0.75s"
  className?: string;
}
