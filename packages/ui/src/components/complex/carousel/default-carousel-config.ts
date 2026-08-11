import type { CarouselConfig, CarouselSizeScale } from "./carousel-config";

export const defaultCarouselSizeScale: CarouselSizeScale = {
  default: "md",
  values: {
    sm: {
      height: { base: "240px", md: "320px" },
      paddingX: { base: "1rem" },
      paddingY: { base: "1rem" },
    },
    md: {
      height: { base: "320px", md: "420px" },
      paddingX: { base: "1.5rem" },
      paddingY: { base: "1.5rem" },
    },
    lg: {
      height: { base: "400px", md: "520px" },
      paddingX: { base: "2rem" },
      paddingY: { base: "2rem" },
    },
  },
};

export const defaultCarouselConfig: CarouselConfig = {
  variant: "default",
  size: defaultCarouselSizeScale,
  radius: "lg",
  animation: "slide",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
};
