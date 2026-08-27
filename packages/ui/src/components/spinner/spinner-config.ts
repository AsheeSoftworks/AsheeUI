import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../shared/size";
import type { Color } from "../../shared/variant";

export type SpinnerSizeKey = Size;

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

export const FALLBACK_SPINNER_CONFIG: Required<SpinnerConfig> = {
  size: "md",
  color: "primary",
  speed: "0.75s",
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    spinner: SpinnerConfig;
  }
}

registerComponentDefaults("spinner", defaultSpinnerConfig);
