import type { Spacing } from "@ashee/config";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerConfig {
  defaultMaxWidth?: ContainerMaxWidth;
  maxWidth?: Record<ContainerMaxWidth, string>;
  padding?: keyof Spacing;
  center?: boolean;
  className?: string;
}
