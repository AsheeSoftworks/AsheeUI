import type { Spacing } from "@ashee/theme";

export interface GridConfig {
  columns?: number;
  gap?: keyof Spacing;
  className?: string;
}
