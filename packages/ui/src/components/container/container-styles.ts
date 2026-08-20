import type { ContainerMaxWidth } from "./container-config";

export const CONTAINER_MAX_WIDTH_CLASS: Record<ContainerMaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  full: "max-w-full",
};

export const CONTAINER_PADDING_CLASS: Record<string, string> = {
  none: "px-0",
  xs: "px-2",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
  xl: "px-12",
  "2xl": "px-16",
};

export const CONTAINER_MARGIN_CLASS: Record<string, string> = {
  none: "my-0",
  xs: "my-2",
  sm: "my-4",
  md: "my-6",
  lg: "my-8",
  xl: "my-12",
  "2xl": "my-16",
};
