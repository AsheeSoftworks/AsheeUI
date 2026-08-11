import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";

export type AccordionVariant = "bordered" | "separated" | "flush" | "ghost";
export type AccordionSizeKey = "sm" | "md" | "lg";

export interface AccordionSizeValue {
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface AccordionSizeScale {
  default: AccordionSizeKey;
  values: Record<AccordionSizeKey, AccordionSizeValue>;
}

export interface AccordionItem {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionConfig {
  variant?: AccordionVariant;
  size?: AccordionSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp;
  allowMultiple?: boolean;
  className?: string;
}
