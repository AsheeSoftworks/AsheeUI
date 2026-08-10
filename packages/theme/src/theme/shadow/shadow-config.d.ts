import type { Size } from "../../token/token";

export interface ShadowConfig {
  default: keyof Size;
  values: Size;
}
