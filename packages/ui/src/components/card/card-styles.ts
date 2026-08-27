import type { Size } from "../../shared/size";
import type { CardVariant } from "./card-config";

export const CARD_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

export const CARD_GAP_CLASS: Record<Size, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-5",
  xl: "gap-6",
};

export const CARD_HEADER_GAP_CLASS: Record<Size, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-2.5",
};

export const CARD_VARIANT_CLASS: Record<CardVariant, string> = {
  elevated: "bg-card text-card-foreground shadow-md border border-border/40",
  bordered: "bg-card text-card-foreground border border-border shadow-xs",
  flat: "bg-muted/50 text-foreground border-none",
  ghost: "bg-transparent text-foreground border-none shadow-none",
};
