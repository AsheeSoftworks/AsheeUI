import type { AccordionConfig, AccordionSizeScale } from "./accordion-config";

export const defaultAccordionSizeScale: AccordionSizeScale = {
  default: "md",
  values: {
    sm: {
      paddingX: { base: "0.875rem" },
      paddingY: { base: "0.625rem" },
      fontSize: { base: "0.875rem" },
    },
    md: {
      paddingX: { base: "1.25rem" },
      paddingY: { base: "0.875rem" },
      fontSize: { base: "1rem" },
    },
    lg: {
      paddingX: { base: "1.5rem" },
      paddingY: { base: "1rem" },
      fontSize: { base: "1.125rem" },
    },
  },
};

export const defaultAccordionConfig: AccordionConfig = {
  variant: "separated",
  size: defaultAccordionSizeScale,
  animation: "none",
  allowMultiple: false,
};
