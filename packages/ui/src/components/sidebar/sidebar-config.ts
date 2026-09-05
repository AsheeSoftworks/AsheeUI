import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";
import type { TooltipPlacement } from "../tooltip/tooltip-config";

export type SidebarSizeKey = Size;
export type SidebarVariant = "default" | "bordered" | "floating" | "ghost";

export interface SidebarItem<T = string> {
  /** Unique item identifier. */
  id: T;
  /** Display label or title. */
  label: ReactNode;
  /** URL or path for navigation. */
  href?: string;
  /** Leading icon element. */
  icon?: ReactNode;
  /** Optional trailing badge element or count. */
  badge?: ReactNode;
  /** Role string list for optional visibility filtering. */
  roles?: string[];
  /** Disables click interaction. */
  disabled?: boolean;
  /** Target for link (e.g., "_blank"). */
  target?: string;
  /** Rel attribute for link. */
  rel?: string;
}

export interface SidebarSection<T = string> {
  /** Unique section identifier. */
  id: T;
  /** Display label or title. */
  label?: ReactNode;
  /** Optional array of sidebar items within the section. */
  items?: SidebarItem<T>[];
  /** Role string list for optional visibility filtering. */
  roles?: string[];
  /** Disables click interaction for the entire section. */
  disabled?: boolean;
}

// New type to support both flat items and sections
export type SidebarItems<T = string> = SidebarItem<T>[] | SidebarSection<T>[];

// Add to SidebarConfig interface
export interface SidebarConfig {
  size?: SidebarSizeKey;
  variant?: SidebarVariant;
  radius?: Radius;
  itemRadius?: Radius;

  // Item Styling Tokens
  itemVariant?: Variant;
  activeItemColor?: Color;

  // Header Back Button Tokens
  backButtonVariant?: Variant;
  backButtonColor?: Color;

  // Collapse Button Tokens
  collapseButtonVariant?: Variant;
  collapseButtonColor?: Color;

  // Control collapse button visibility
  showCollapseButton?: boolean;

  // Tooltip Configuration
  showTooltips?: boolean;
  tooltipPlacement?: TooltipPlacement;
  tooltipVariant?: Variant;
  tooltipColor?: Color;

  // Animation configuration
  animated?: boolean;

  // Control initial collapsed state and collapsibility
  defaultCollapsed?: boolean;
  collapsible?: boolean;
}

// Update default config
export const defaultSidebarConfig: SidebarConfig = {
  size: "md",
  showTooltips: true,
  tooltipPlacement: "right",
  animated: true,
  defaultCollapsed: false, // Default to expanded
  collapsible: true, // Default to collapsible
  showCollapseButton: true, // Default to showing collapse button
};

export const FALLBACK_SIDEBAR_CONFIG: Required<SidebarConfig> = {
  size: "md",
  variant: "default",
  radius: "none",
  itemRadius: "md",
  itemVariant: "solid",
  activeItemColor: "primary",
  backButtonVariant: "ghost",
  backButtonColor: "secondary",
  collapseButtonVariant: "ghost",
  collapseButtonColor: "secondary",
  showTooltips: true,
  tooltipPlacement: "right",
  tooltipVariant: "solid",
  tooltipColor: "secondary",
  animated: true,
  defaultCollapsed: false,
  collapsible: true,
  showCollapseButton: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    sidebar: SidebarConfig;
  }
}

registerComponentDefaults("sidebar", defaultSidebarConfig);
