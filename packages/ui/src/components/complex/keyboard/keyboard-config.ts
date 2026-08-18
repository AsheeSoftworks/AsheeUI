import type { ReactNode } from "react";
import type { Color, Variant } from "../../../shared/variant";
import type { Radius } from "../../../theme/token/radius/radius-config";

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
  radius?: keyof Radius;
}
