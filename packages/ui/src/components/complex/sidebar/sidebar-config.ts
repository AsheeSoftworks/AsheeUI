import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { ReactNode } from "react";
import type { AnimationProp } from "../../../motion/types";

export type SidebarSizeKey = "sm" | "md" | "lg";
export type SidebarVariant = "default" | "bordered" | "floating" | "flush";

export interface SidebarItem<T = string> {
  /** Unique item identifier. */
  id: T;
  /** Display label or title. */
  label: ReactNode;
  /** Leading icon element. */
  icon?: ReactNode;
  /** Optional trailing badge element or count. */
  badge?: ReactNode;
  /** Role string list for optional visibility filtering. */
  roles?: string[];
  /** Disables click interaction. */
  disabled?: boolean;
}

export interface SidebarSizeValue {
  expandedWidth: ResponsiveValue<string>;
  collapsedWidth: ResponsiveValue<string>;
  headerHeight: ResponsiveValue<string>;
  itemHeight: ResponsiveValue<string>;
  paddingInline: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface SidebarSizeScale {
  default: SidebarSizeKey;
  values: Record<SidebarSizeKey, SidebarSizeValue>;
}

export interface SidebarConfig {
  size?: SidebarSizeScale;
  variant?: SidebarVariant;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  itemClassName?: string;
}
