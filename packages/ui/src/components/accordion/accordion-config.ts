import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";

export type AccordionVariant = "bordered" | "separated" | "ghost" | "flush";
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
  radius?: Radius;
  allowMultiple?: boolean;
}

export const defaultAccordionConfig: AccordionConfig = {
  size: "md",
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
