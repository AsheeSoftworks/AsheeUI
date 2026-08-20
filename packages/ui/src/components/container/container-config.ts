import type { Spacing } from "../../theme/token/spacing/spacing-config";
import { registerComponentDefaults } from "../../libs/registry";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "full";

export interface ScrollbarOverride {
  thumb?: string;
  track?: string;
  width?: string;
  radius?: string;
}

export interface ContainerConfig {
  maxWidth?: ContainerMaxWidth;
  padding?: keyof Spacing;
  margin?: keyof Spacing;
  center?: boolean;
  className?: string;
  scrollable?: boolean;
  scrollbar?: ScrollbarOverride;
}

export const defaultContainerConfig: ContainerConfig = {
  maxWidth: "lg",
  padding: "md",
  center: true,
  scrollable: false,
};

export const FALLBACK_CONTAINER_CONFIG = {
  maxWidth: "lg" as ContainerMaxWidth,
  padding: "md" as keyof Spacing,
  margin: "none" as keyof Spacing,
  center: true,
  scrollable: false,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    container: ContainerConfig;
  }
}

registerComponentDefaults("container", defaultContainerConfig);
