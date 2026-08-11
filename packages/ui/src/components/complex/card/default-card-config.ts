import type { CardConfig, CardSizeScale } from "./card-config";

export const defaultCardSizeScale: CardSizeScale = {
  default: "md",
  values: {
    sm: {
      paddingX: { base: "1rem" },
      paddingY: { base: "1rem" },
      gap: { base: "0.75rem" },
    },
    md: {
      paddingX: { base: "1.5rem" },
      paddingY: { base: "1.5rem" },
      gap: { base: "1rem" },
    },
    lg: {
      paddingX: { base: "2rem" },
      paddingY: { base: "2rem" },
      gap: { base: "1.25rem" },
    },
  },
};

export const defaultCardConfig: CardConfig = {
  variant: "bordered",
  size: defaultCardSizeScale,
  radius: "xl",
  shadow: "none",
  animation: "scale",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  isClickable: false,
};
