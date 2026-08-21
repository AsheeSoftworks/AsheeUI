import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Radius } from "../../theme/token/radius/radius-config";

export type AccordionVariant = "bordered" | "separated" | "flush" | "ghost";
export type AccordionSizeKey = "sm" | "md" | "lg";

export interface AccordionItem {
  id?: string;
  title: ReactNode;
  content: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AccordionConfig {
  variant?: AccordionVariant;
  size?: AccordionSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  allowMultiple?: boolean;
  className?: string;
}

export const defaultAccordionConfig: AccordionConfig = {
  size: "md",
  animation: "none",
  allowMultiple: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    accordion: AccordionConfig;
  }
}

registerComponentDefaults("accordion", defaultAccordionConfig);

export const FALLBACK_ACCORDION_CONFIG = {
  size: "md",
  variant: "separated",
  radius: "md",
  allowMultiple: false,
} as const;
