import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { Color, Variant } from "../../shared/variant";

export type TabsVariant = "underline" | "bordered" | "ghost";
export type TabsSizeKey = Size;

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
  radius?: Radius;

  activeRadius?: Radius;
  activeVariant?: Variant;
  activeColor?: Color;

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
};

export const FALLBACK_TABS_CONFIG: Required<TabsConfig> = {
  size: "md",
  variant: "underline",
  radius: "md",
  activeRadius: "md",
  activeVariant: "solid",
  activeColor: "primary",
  className: "",
  tabListClassName: "",
  tabClassName: "",
  tabPanelClassName: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    tabs: TabsConfig;
  }
}

registerComponentDefaults("tabs", defaultTabsConfig);
