import type { Color } from "../../../shared/variant";
import type {
  FontWeight,
  LineHeight,
} from "../../../theme/typography/typography-config";
import type { LinkSizeKey, LinkUnderline, LinkVariant } from "./link-config";

export const LINK_SIZE_CLASS: Record<LinkSizeKey, string> = {
  sm: "text-xs gap-1.5",
  md: "text-sm gap-2",
  lg: "text-base gap-2.5",
};

export const LINK_ICON_SIZE_CLASS: Record<LinkSizeKey, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

export const LINK_COLOR_CLASS: Record<Color | string, string> = {
  none: "text-foreground hover:text-foreground/80",
  default: "text-foreground hover:text-foreground/80",
  primary: "text-primary hover:text-primary/80",
  secondary: "text-secondary hover:text-secondary/80",
  success: "text-success hover:text-success/80",
  warning: "text-warning hover:text-warning/80",
  danger: "text-danger hover:text-danger/80",
};

export const LINK_VARIANT_CLASS: Record<LinkVariant, string> = {
  default: "",
  muted: "text-muted-foreground hover:text-foreground",
  subtle: "opacity-80 hover:opacity-100",
};

export const LINK_UNDERLINE_CLASS: Record<LinkUnderline, string> = {
  always: "underline underline-offset-4 decoration-current",
  hover: "no-underline hover:underline underline-offset-4 decoration-current",
  never: "no-underline",
};

export const LINK_WEIGHT_CLASS: Record<keyof FontWeight | string, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

export const LINK_LINE_HEIGHT_CLASS: Record<keyof LineHeight | string, string> =
  {
    none: "leading-none",
    tight: "leading-tight",
    snug: "leading-snug",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-loose",
  };
