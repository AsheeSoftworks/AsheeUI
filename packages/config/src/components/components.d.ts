import type { DeepPartial } from "@ashee/utils";

// biome-ignore lint/suspicious/noEmptyInterface: Required for cross-package module augmentation
export interface ComponentConfigRegistry {
  // Components will augment this interface downstream
}
// empty by default — augmented by @ashee/ui internally, per component

export type ComponentsConfig = {
  [K in keyof ComponentConfigRegistry]?: DeepPartial<
    ComponentConfigRegistry[K]
  >;
};
