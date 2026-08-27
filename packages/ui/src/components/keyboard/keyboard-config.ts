import type { ReactNode } from "react";
import type { Radius } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

export type StandardLayoutName = "default" | "shift" | "symbols" | "numeric";
export type LayoutName = StandardLayoutName | (string & {});

export type KeyboardLayouts = Record<string, string[]>;
export type KeyDisplayMap = Record<string, ReactNode>;

export interface KeyboardConfig {
  layouts?: KeyboardLayouts;
  display?: KeyDisplayMap;
  defaultLayout?: LayoutName;
  heightClass?: string;
  autoShiftBack?: boolean;
  variant?: Variant;
  color?: Color;
  radius?: Radius;
}
