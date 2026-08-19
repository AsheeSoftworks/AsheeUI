import type { Shadow } from "../../../theme/shadow/shadow-config";
import type { CardSizeKey, CardVariant } from "./card-config";

export const CARD_PADDING_CLASS: Record<CardSizeKey, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const CARD_GAP_CLASS: Record<CardSizeKey, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-5",
};

export const CARD_HEADER_GAP_CLASS: Record<CardSizeKey, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

export const CARD_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const CARD_SHADOW_CLASS: Record<keyof Shadow | string, string> = {
  none: "shadow-none",
  sm: "shadow-xs",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export const CARD_VARIANT_CLASS: Record<CardVariant, string> = {
  elevated: "bg-card text-card-foreground shadow-md border border-border/40",
  bordered: "bg-card text-card-foreground border border-border shadow-xs",
  flat: "bg-muted/50 text-foreground border-none",
  ghost: "bg-transparent text-foreground border-none shadow-none",
};
