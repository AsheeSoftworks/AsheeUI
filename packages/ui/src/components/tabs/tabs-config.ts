import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/token/radius/radius-config";

export type TabsVariant = "underline" | "pills" | "bordered" | "ghost";
export type TabsSizeKey = "sm" | "md" | "lg";

export interface TabItem {
  id: string | number;
  /** Primary display text. Alias for `name`. */
  label?: ReactNode;
  /** Legacy display text support. */
  name?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;

  /** Active button variant override for this specific tab */
  activeVariant?: Variant;
  /** Active button color override for this specific tab */
  activeColor?: Color;

  [key: string]: unknown;
}

export interface TabsConfig {
  size?: TabsSizeKey;
  variant?: TabsVariant;
  radius?: keyof Radius;

  activeRadius?: keyof Radius;
  activeVariant?: Variant;
  activeColor?: Color;

  animation?: AnimationProp;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  tabPanelClassName?: string;
}

export const defaultTabsConfig: TabsConfig = {
  size: "md",
  variant: "underline",
  radius: "md",
  activeRadius: "md",
  animation: "fade",
};

export const FALLBACK_TABS_CONFIG = {
  size: "md" as TabsSizeKey,
  variant: "underline" as TabsVariant,
  radius: "md" as keyof Radius,
  activeRadius: "md" as keyof Radius,
  activeVariant: "solid" as Variant,
  activeColor: "primary" as Color,
  animation: "fade" as AnimationProp,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    tabs: TabsConfig;
  }
}

registerComponentDefaults("tabs", defaultTabsConfig);
