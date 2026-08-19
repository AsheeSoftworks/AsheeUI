import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";
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
  radius?: keyof Radius;
  itemRadius?: keyof Radius;
  animation?: AnimationProp;

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
}

export const defaultSidebarConfig: SidebarConfig = {
  size: "md",
  showTooltips: true,
  tooltipPlacement: "right",
};

export const FALLBACK_SIDEBAR_CONFIG = {
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
} as const;
