import { cn } from "@ashee/utils";

export type Variant = "solid" | "ghost" | "bordered";
export type Color = "primary" | "secondary" | "danger" | "warning" | "success";

const SOLID_CLASS: Record<Color, string> = {
  primary: "bg-primary text-secondary",
  secondary: "bg-secondary text-foreground",
  danger: "bg-danger text-secondary",
  warning: "bg-warning text-secondary",
  success: "bg-success text-secondary",
};

const GHOST_CLASS: Record<Color, string> = {
  primary: "bg-transparent text-primary hover:bg-primary/10",
  secondary: "bg-transparent text-foreground hover:bg-secondary/10",
  danger: "bg-transparent text-danger hover:bg-danger/10",
  warning: "bg-transparent text-warning hover:bg-warning/10",
  success: "bg-transparent text-success hover:bg-success/10",
};

const BORDERED_CLASS: Record<Color, string> = {
  primary: cn(GHOST_CLASS.primary, "border border-primary"),
  secondary: cn(GHOST_CLASS.secondary, "border border-border"),
  danger: cn(GHOST_CLASS.danger, "border border-danger"),
  warning: cn(GHOST_CLASS.warning, "border border-warning"),
  success: cn(GHOST_CLASS.success, "border border-success"),
};

const VARIANT_CLASS: Record<Variant, Record<Color, string>> = {
  solid: SOLID_CLASS,
  ghost: GHOST_CLASS,
  bordered: BORDERED_CLASS,
};

export function resolveVariantClass(variant: Variant, color: Color): string {
  return VARIANT_CLASS[variant][color];
}
