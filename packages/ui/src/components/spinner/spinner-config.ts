import type { Color } from "../../shared/variant";
import { registerComponentDefaults } from "../../libs/registry";

export type SpinnerSizeKey = "sm" | "md" | "lg";

export interface SpinnerConfig {
  size?: SpinnerSizeKey;
  color?: Color;
  speed?: string;
  className?: string;
}

export const defaultSpinnerConfig: SpinnerConfig = {
  size: "md",
  speed: "0.75s",
};

export const FALLBACK_SPINNER_CONFIG = {
  size: "md" as SpinnerSizeKey,
  speed: "0.75s",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    spinner: SpinnerConfig;
  }
}

registerComponentDefaults("spinner", defaultSpinnerConfig);
