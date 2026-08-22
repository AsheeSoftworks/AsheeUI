import { registerComponentDefaults } from "../../libs/registry";
import type { Spacing } from "../../theme/spacing/spacing-config";

export interface GridConfig {
  columns?: number;
  gap?: keyof Spacing;
  className?: string;
}

export const defaultGridConfig: GridConfig = {
  columns: 12,
  gap: "md",
};

export const FALLBACK_GRID_CONFIG = {
  columns: 12,
  gap: "md" as keyof Spacing,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    grid: GridConfig;
  }
}

registerComponentDefaults("grid", defaultGridConfig);
