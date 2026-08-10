import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { ReactNode } from "react";
import type { AnimationProp } from "../../../motion/types";

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
  [key: string]: unknown;
}

export interface TabsSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface TabsSizeScale {
  default: TabsSizeKey;
  values: Record<TabsSizeKey, TabsSizeValue>;
}

export interface TabsConfig {
  size?: TabsSizeScale;
  variant?: TabsVariant;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  tabPanelClassName?: string;
}
