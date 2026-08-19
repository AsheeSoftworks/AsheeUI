import { cn } from "@asheeui/utils";

export type Variant = "solid" | "ghost" | "bordered" | "faded" | "underlined";
export type Color =
  | "none"
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success";

const SOLID_CLASS: Record<Color, string> = {
  none: "bg-background text-foreground",
  default: "bg-secondary text-foreground",
  primary: "bg-primary text-secondary",
  secondary: "bg-secondary text-foreground",
  danger: "bg-danger text-secondary",
  warning: "bg-warning text-secondary",
  success: "bg-success text-secondary",
};

const GHOST_CLASS: Record<Color, string> = {
  none: "bg-transparent text-foreground hover:bg-foreground/10",
  default: "bg-transparent text-foreground hover:bg-foreground/10",
  primary: "bg-transparent text-primary hover:bg-primary/10",
  secondary: "bg-transparent text-foreground hover:bg-secondary/10",
  danger: "bg-transparent text-danger hover:bg-danger/10",
  warning: "bg-transparent text-warning hover:bg-warning/10",
  success: "bg-transparent text-success hover:bg-success/10",
};

const BORDERED_CLASS: Record<Color, string> = {
  none: cn(GHOST_CLASS.primary, "border-2 border-background"),
  default: cn(GHOST_CLASS.primary, "border-2 border-secondary"),
  primary: cn(GHOST_CLASS.primary, "border-2 border-primary"),
  secondary: cn(GHOST_CLASS.secondary, "border-2 border-border"),
  danger: cn(GHOST_CLASS.danger, "border-2 border-danger"),
  warning: cn(GHOST_CLASS.warning, "border-2 border-warning"),
  success: cn(GHOST_CLASS.success, "border-2 border-success"),
};

const FADED_CLASS: Record<Color, string> = {
  none: "bg-muted/40 text-foreground border-2 border-transparent",
  default: "bg-muted/40 text-foreground border-2 border-border",
  primary: "bg-primary/10 text-primary border-2 border-primary/20",
  secondary: "bg-secondary/15 text-foreground border-2 border-secondary/30",
  danger: "bg-danger/10 text-danger border-2 border-danger/20",
  warning: "bg-warning/10 text-warning border-2 border-warning/20",
  success: "bg-success/10 text-success border-2 border-success/20",
};

const BASE_UNDERLINED =
  "border-b-2 border-t-0 border-x-0 rounded-none bg-transparent px-0 shadow-none";

const UNDERLINED_CLASS: Record<Color, string> = {
  none: cn(BASE_UNDERLINED, "border-background text-foreground"),
  default: cn(BASE_UNDERLINED, "border-border text-foreground"),
  primary: cn(BASE_UNDERLINED, "border-primary text-primary"),
  secondary: cn(BASE_UNDERLINED, "border-secondary text-secondary"),
  danger: cn(BASE_UNDERLINED, "border-danger text-danger"),
  warning: cn(BASE_UNDERLINED, "border-warning text-warning"),
  success: cn(BASE_UNDERLINED, "border-success text-success"),
};

const VARIANT_CLASS: Record<Variant, Record<Color, string>> = {
  solid: SOLID_CLASS,
  ghost: GHOST_CLASS,
  bordered: BORDERED_CLASS,
  faded: FADED_CLASS,
  underlined: UNDERLINED_CLASS,
};

export function resolveVariantClass(variant: Variant, color: Color): string {
  return VARIANT_CLASS[variant]?.[color] ?? VARIANT_CLASS.bordered.default;
}
