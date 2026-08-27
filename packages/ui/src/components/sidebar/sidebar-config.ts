import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";
import type { TooltipPlacement } from "../tooltip/tooltip-config";

export type SidebarSizeKey = "sm" | "md" | "lg";
export type SidebarVariant = "default" | "bordered" | "floating" | "flush";

export interface SidebarItem<T = string> {
  /** Unique item identifier. */
  id: T;
  /** Display label or title. */
  label: React.ReactNode;
  /** Leading icon element. */
  icon?: React.ReactNode;
  /** Optional trailing badge element or count. */
  badge?: React.ReactNode;
  /** Role string list for optional visibility filtering. */
  roles?: string[];
  /** Disables click interaction. */
  disabled?: boolean;
}

export interface SidebarConfig {
  size?: SidebarSizeKey;
  variant?: SidebarVariant;
  radius?: Radius;
  itemRadius?: Radius;

  // Item Styling Tokens
  activeItemVariant?: Variant;
  activeItemColor?: Color;

  // Header Back Button Tokens
  backButtonVariant?: Variant;
  backButtonColor?: Color;

  // Tooltip Configuration
  showTooltips?: boolean;
  tooltipPlacement?: TooltipPlacement;
  tooltipVariant?: Variant;
  tooltipColor?: Color;

  // Animation configuration
  animation?: unknown;
}

export const defaultSidebarConfig: SidebarConfig = {
  size: "md",
  showTooltips: true,
  tooltipPlacement: "right",
};

export const FALLBACK_SIDEBAR_CONFIG: Required<SidebarConfig> = {
  size: "md",
  variant: "default",
  radius: "none",
  itemRadius: "md",
  activeItemVariant: "solid",
  activeItemColor: "primary",
  backButtonVariant: "ghost",
  backButtonColor: "secondary",
  showTooltips: true,
  tooltipPlacement: "right",
  tooltipVariant: "solid",
  tooltipColor: "secondary",
  animation: undefined,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    sidebar: SidebarConfig;
  }
}

registerComponentDefaults("sidebar", defaultSidebarConfig);
