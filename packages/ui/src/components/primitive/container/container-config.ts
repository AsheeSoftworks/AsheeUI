import type { Spacing } from "../../../theme/token/spacing/spacing-config";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "full";

export interface ScrollbarOverride {
  thumb?: string;
  track?: string;
  width?: string;
  radius?: string;
}

export interface ContainerConfig {
  defaultMaxWidth?: ContainerMaxWidth;
  maxWidth?: Record<ContainerMaxWidth, string>;
  padding?: keyof Spacing;
  margin?: keyof Spacing;
  center?: boolean;
  className?: string;
  scrollable?: boolean;
  scrollbar?: ScrollbarOverride;
}
